const Account = require("../models/account");
const AccountDAO = require("../models/data-access/accountDAO");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const moment = require("moment");
const auth = require("../middlewares/auth.middleware");
const nodemailer = require("nodemailer");
const cryptoMiddlware = require("../middlewares/crypto.middleware");

function login(req, res) {
  var Username = req.body.Username;
  var Password = req.body.Password;
  AccountDAO.getAccount(Username, (Account) => {
    if (Account == false) res.status(200).send({ result: "login failure" });
    else {
      let acccount = Account;
      bcrypt.compare(Password, acccount.Password, function (err, result) {
        if (result == true) {
          sendToken(req, res, Account);
        } else res.status(200).send({ result: "login failure" });
      });
    }
  });
}
function loginByGoogle(req, res) {
  let token = req.body.token;
  if (token) {
    const client = new OAuth2Client(process.env.CLIENT_ID);

    async function verify() {
      const ticket = await client.verifyIdToken(
        {
          idToken: token,
          audience: process.env.clientID,
        },
        (err, ticket) => {
          if (err) {
            return res.status(200).send({ result: "Invalid token" });
          } else {
            const payload = ticket.getPayload();
            const Email = payload["email"];
            AccountDAO.getAccountByEmail(Email, (Account) => {
              if (Account == false) {
                res.status(200).send({ result: "login failure" });
              } else {
                sendToken(req, res, Account);
              }
            });
          }
        }
      );
    }
    verify().catch(console.error);
  } else {
    res.status(200).send({ result: "No token provided" });
  }
}
function loginByFaceBook(req, res) {
  let user = req.user;
  if (user) {
    let Email = user.emails[0].value;
    AccountDAO.getAccountByEmail(Email, (Account) => {
      if (Account == false) {
        res.status(200).send({ result: "login failure" });
      } else {
        sendToken(req, res, Account);
      }
    });
  } else {
    res.status(200).send({ result: "No token provided" });
  }
}
//send Token
function sendToken(req, res, Account) {
  let accessToken = jwt.sign({ id: Account.AccountId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  let refreshToken = jwt.sign({ id: Account.AccountId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  res.status(200).send({
    accessToken: accessToken,
    refreshToken: refreshToken,
    accountId: Account.AccountId,
  });
}
//register
function register(req, res) {
  let Name = req.body.Name;
  let Email = req.body.Email;
  let Phone = req.body.Phone;
  let Password = req.body.Password;

  //regex
  let regName = /^((?![0-9\~\!\@\#\$\%\^\&\*\(\)\_\+\=\-\[\]\{\}\;\:\"\\\/\<\>\?]).){2,45}/;
  let regEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,45}))$/;
  let regPhone = /(84|0[3|5|7|8|9])+([0-9]{8})$/;
  let regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,60}$/;

  if (
    !Name ||
    !Email ||
    !Phone ||
    !Password ||
    Name.trim() == null ||
    Email.trim() == null ||
    Password.trim() == null ||
    Phone.trim() == null
  ) {
    return res.status(201).send({
      result: "incorrect format for: empty value",
      description: `Not allow empty value for${!Name || Name.trim() == null ? " Name" : ""}${!Email || Email.trim() == null ? " Email" : ""
        }${!Password || Password.trim() == null ? " Password" : ""}${!Phone || Phone.trim() == null ? " Phone" : ""
        }`,
    });
  }

  if (!regName.test(Name)) {
    return res.status(201).send({
      result: "incorrect format for: Name",
      description:
        2 <= Name.length && Name.length <= 45
          ? "Valid name not contain special character such as @-!#..."
          : "Name length not valid: at least 2 char",
    });
  }
  if (!regEmail.test(Email) || Email.length > 45) {
    return res.status(201).send({
      result: "incorrect format for: Email",
      description:
        Email.length <= 45 ? "Valid Email look like this: 123@gmail.com" : "Email length < 45",
    });
  }
  if (!regPhone.test(Phone)) {
    return res.status(201).send({
      result: "incorrect format for: Phone",
      description: `${10 == Phone.length || 11 == Phone.length
        ? "Valid Phone look like this: 098333**** or 848333****"
        : "Phone length 10-11 char"
        }`,
    });
  }
  if (!regPass.test(Password)) {
    res.status(201).send({
      result: "incorrect format for: Password",
      description: `${6 <= Password.length && Password.length <= 45
        ? "Valid Password must contains a Uppercase, a lowercase, and a number"
        : "Password length 6-45 char"
        }`,
    });
    return;
  }
  AccountDAO.getAccountId(Email, Phone, (result) => {
    if (result) res.status(201).send({ result: "account existed", description: "account existed" });
    else {
      if (Email) Email = Email.toLowerCase();
      if (Name)
        Name = Name.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase()); //Capital first letter

      // bcrypt.hash(Password, 10).then((hash) => {
      // AccountDAO.createAccount(hash, Phone.trim(), Email.trim(), Name.trim(), (rs) => {
      //   if (rs) res.status(200).send({ result: 'register successful', description: 'register successful' });
      //   else res.status(401).send({ result: 'register failed', description: "must be some error..." })
      // })
      let token = jwt.sign({ Password, Phone, Email, Name }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      sendVerifyEmail(req, res, Email, token);
      // })
    }
  });
}

function update(req, res) {
  let Name = req.body.Name;
  let Email = req.body.Email;
  let Phone = req.body.Phone;
  let Password = req.body.Password;
  let Avatar = req.body.Avatar;
  let Birthday = req.body.Birthday;
  let Gender = req.body.Gender;

  //regex
  let regName = /^((?![0-9\~\!\@\#\$\%\^\&\*\(\)\_\+\=\-\[\]\{\}\;\:\"\\\/\<\>\?]).){2,45}/;
  let regEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,45}))$/;
  let regPhone = /(84|0[3|5|7|8|9])+([0-9]{8})$/;
  let regPass = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,60})$/;
  let regLink = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  let regBirthday = /^(?:19|20)\d\d([\/.-])(?:0[1-9]|1[012])\1(?:0[1-9]|[12]\d|3[01])$/;
  let regGender = /^\d$/;

  if (!Email && !Phone) {
    return res.status(201).send({
      result: "incorrect fields",
      description: "Must recieved a Phone or Email",
    });
  }

  if (!regName.test(Name)) {
    return res.status(201).send({
      result: "incorrect format for: Name",
      description:
        2 <= Name.length && Name.length <= 45
          ? "Valid name not contain special character such as @-!#..."
          : "Name length not valid: at least 2 char",
    });
  }
  if (Email)
    if (!regEmail.test(Email) || Email.length > 45) {
      return res.status(201).send({
        result: "incorrect format for: Email",
        description:
          Email.length <= 45 ? "Valid Email look like this: 123@gmail.com" : "Email length < 45",
      });
    }
  if (Phone)
    if (!regPhone.test(Phone)) {
      return res.status(201).send({
        result: "incorrect format for: Phone",
        description: `${10 == Phone.length ? "Valid Phone look like this: 098333****" : "Phone length 10 char"
          }`,
      });
    }
  if (Password)
    if (!regPass.test(Password)) {
      return res.status(201).send({
        result: "incorrect format for: Password",
        description: `${6 <= Password.length && Password.length <= 45
          ? "Valid Password must contains a Uppercase, a lowercase, and a number"
          : "Password length 6-45 char"
          }`,
      });
    }
  if (Avatar)
    if (!regLink.test(Avatar) || Avatar.length > 200) {
      return res.status(201).send({
        result: "incorrect format for: Avatar",
        description: `${Avatar.length <= 200
          ? "invalid Url: incorrect format for url"
          : "length of link is too long"
          }`,
      });
    }
  if (Birthday)
    if (!regBirthday.test(Birthday)) {
      return res.status(201).send({
        result: "incorrect format for: Birthday",
        description: `${10 == Birthday.length
          ? "Birthday look like this: (yyyy/mm/dd)"
          : "Birthday length 10 char (yyyy/mm/dd)"
          }`,
      });
    }
  if (Birthday)
    if (!moment(Birthday, "YYYY.MM.DD").isValid()) {
      return res.status(201).send({
        result: "incorrect format for: Birthday",
        description: "Date not exist",
      });
    }
  if (Gender)
    if (!regGender.test(Gender)) {
      return res.status(201).send({
        result: "incorrect format for: Gender",
        description: "Gender must be one digit",
      });
    }
  AccountDAO.getAccountId(Email ? Email.trim() : null, Phone ? Phone.trim() : null, (AccountId) => {
    if (!AccountId)
      res
        .status(201)
        .send({ result: "user not found", description: "Could not find a user by Phone/Email" });
    else {
      if (Email) Email = Email.toLowerCase();
      if (Name)
        Name = Name.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase()); //Capital first letter

      if (Password)
        bcrypt.hash(Password, 10, function (err, hash) {
          AccountDAO.updateAccount(
            AccountId,
            Password ? hash : null,
            Phone ? Phone.trim() : null,
            Email ? Email.trim() : null,
            Name ? Name.trim() : null,
            Avatar ? Avatar.trim() : null,
            Birthday ? Birthday.trim() : null,
            Gender ? Gender : null,
            (result) => {
              if (result)
                res.status(200).send({ result: "update successful", description: "successful" });
              else
                res
                  .status(201)
                  .send({ result: "update failure", description: "There must be a error..." });
            }
          );
        });
      else {
        AccountDAO.updateAccount(
          AccountId,
          Password ? Password : null,
          Phone ? Phone.trim() : null,
          Email ? Email.trim() : null,
          Name ? Name.trim() : null,
          Avatar ? Avatar.trim() : null,
          Birthday ? Birthday.trim() : null,
          Gender ? Gender : null,
          (result) => {
            if (result) res.status(200).send({ result: "update successful" });
            else
              res
                .status(201)
                .send({ result: "update failure", description: "There must be a error..." });
          }
        );
      }
    }
  });
}
function sendVerifyEmail(req, res, Email, token) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mdmbsocial@gmail.com",
      pass: "mdmb1234",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let link = `${process.env.MDMB_SOCIAL_PROTOCAL}${process.env.MDMB_SOCIAL_DOMAIN}:${process.env.PORT}/account/verify?token=${token}`;
  let mailOptions = {
    from: "mdmbsocial@gmail.com",
    to: `${Email}`,
    subject: "VERIFY ACCOUNT FOR MDMB SOCIAL",
    html: `
    <!doctype html><html ⚡4email data-css-strict><head><meta charset="utf-8"><style amp4email-boilerplate>body{visibility:hidden}</style><script async src="https://cdn.ampproject.org/v0.js"></script><style amp-custom>.es-desk-hidden { display:none; float:left; overflow:hidden; width:0; max-height:0; line-height:0;}body { width:100%; font-family:arial, "helvetica neue", helvetica, sans-serif;}table { border-collapse:collapse; border-spacing:0px;}table td, body, .es-wrapper { padding:0; Margin:0;}.es-content, .es-header, .es-footer { table-layout:fixed; width:100%;}p, hr { Margin:0;}h1, h2, h3, h4, h5 { Margin:0; line-height:120%; font-family:arial, "helvetica neue", helvetica, sans-serif;}.es-left { float:left;}.es-right { float:right;}.es-p5 { padding:5px;}.es-p5t { padding-top:5px;}.es-p5b { padding-bottom:5px;}.es-p5l { padding-left:5px;}.es-p5r { padding-right:5px;}.es-p10 { padding:10px;}.es-p10t { padding-top:10px;}.es-p10b { padding-bottom:10px;}.es-p10l { padding-left:10px;}.es-p10r { padding-right:10px;}.es-p15 { padding:15px;}.es-p15t { padding-top:15px;}.es-p15b { padding-bottom:15px;}.es-p15l { padding-left:15px;}.es-p15r { padding-right:15px;}.es-p20 { padding:20px;}.es-p20t { padding-top:20px;}.es-p20b { padding-bottom:20px;}.es-p20l { padding-left:20px;}.es-p20r { padding-right:20px;}.es-p25 { padding:25px;}.es-p25t { padding-top:25px;}.es-p25b { padding-bottom:25px;}.es-p25l { padding-left:25px;}.es-p25r { padding-right:25px;}.es-p30 { padding:30px;}.es-p30t { padding-top:30px;}.es-p30b { padding-bottom:30px;}.es-p30l { padding-left:30px;}.es-p30r { padding-right:30px;}.es-p35 { padding:35px;}.es-p35t { padding-top:35px;}.es-p35b { padding-bottom:35px;}.es-p35l { padding-left:35px;}.es-p35r { padding-right:35px;}.es-p40 { padding:40px;}.es-p40t { padding-top:40px;}.es-p40b { padding-bottom:40px;}.es-p40l { padding-left:40px;}.es-p40r { padding-right:40px;}.es-menu td { border:0;}s { text-decoration:line-through;}p, ul li, ol li { font-family:arial, "helvetica neue", helvetica, sans-serif; line-height:150%;}ul li, ol li { Margin-bottom:15px; margin-left:0;}a { text-decoration:underline;}.es-menu td a { text-decoration:none; display:block; font-family:arial, "helvetica neue", helvetica, sans-serif;}.es-menu amp-img, .es-button amp-img { vertical-align:middle;}.es-wrapper { width:100%; height:100%; background-color:#FAFAFA;}.es-wrapper-color { background-color:#FAFAFA;}.es-header { background-color:transparent;}.es-header-body { background-color:transparent;}.es-header-body p, .es-header-body ul li, .es-header-body ol li { color:#333333; font-size:14px;}.es-header-body a { color:#666666; font-size:14px;}.es-content-body { background-color:#FFFFFF;}.es-content-body p, .es-content-body ul li, .es-content-body ol li { color:#333333; font-size:14px;}.es-content-body a { color:#5C68E2; font-size:14px;}.es-footer { background-color:transparent;}.es-footer-body { background-color:#FFFFFF;}.es-footer-body p, .es-footer-body ul li, .es-footer-body ol li { color:#333333; font-size:12px;}.es-footer-body a { color:#333333; font-size:12px;}.es-infoblock, .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li { line-height:120%; font-size:12px; color:#CCCCCC;}.es-infoblock a { font-size:12px; color:#CCCCCC;}h1 { font-size:46px; font-style:normal; font-weight:bold; color:#333333;}h2 { font-size:26px; font-style:normal; font-weight:bold; color:#333333;}h3 { font-size:20px; font-style:normal; font-weight:bold; color:#333333;}.es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:46px;}.es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px;}.es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px;}a.es-button, button.es-button { border-style:solid; border-color:#5C68E2; border-width:10px 30px 10px 30px; display:inline-block; background:#5C68E2; border-radius:0px; font-size:20px; font-family:arial, "helvetica neue", helvetica, sans-serif; font-weight:normal; font-style:normal; line-height:120%; color:#FFFFFF; text-decoration:none; width:auto; text-align:center;}.es-button-border { border-style:solid solid solid solid; border-color:#2CB543 #2CB543 #2CB543 #2CB543; background:#5C68E2; border-width:0px 0px 0px 0px; display:inline-block; border-radius:0px; width:auto;}body { font-family:arial, "helvetica neue", helvetica, sans-serif;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150% } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:36px; text-align:left } h2 { font-size:26px; text-align:left } h3 { font-size:20px; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px; text-align:left } .es-menu td a { font-size:12px } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px } *[class="gmail-fix"] { display:none } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left } .es-m-txt-r amp-img { float:right } .es-m-txt-c amp-img { margin:0 auto } .es-m-txt-l amp-img { float:left } .es-button-border { display:inline-block } a.es-button, button.es-button { font-size:20px; display:inline-block } .es-adaptive table, .es-left, .es-right { width:100% } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%; max-width:600px } .es-adapt-td { display:block; width:100% } .adapt-img { width:100%; height:auto } td.es-m-p0 { padding:0 } td.es-m-p0r { padding-right:0 } td.es-m-p0l { padding-left:0 } td.es-m-p0t { padding-top:0 } td.es-m-p0b { padding-bottom:0 } td.es-m-p20b { padding-bottom:20px } .es-mobile-hidden, .es-hidden { display:none } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto; overflow:visible; float:none; max-height:inherit; line-height:inherit } tr.es-desk-hidden { display:table-row } table.es-desk-hidden { display:table } td.es-desk-menu-hidden { display:table-cell } .es-menu td { width:1% } table.es-table-not-adapt, .esd-block-html table { width:auto } table.es-social { display:inline-block } table.es-social td { display:inline-block } td.es-m-p5 { padding:5px } td.es-m-p5t { padding-top:5px } td.es-m-p5b { padding-bottom:5px } td.es-m-p5r { padding-right:5px } td.es-m-p5l { padding-left:5px } td.es-m-p10 { padding:10px } td.es-m-p10t { padding-top:10px } td.es-m-p10b { padding-bottom:10px } td.es-m-p10r { padding-right:10px } td.es-m-p10l { padding-left:10px } td.es-m-p15 { padding:15px } td.es-m-p15t { padding-top:15px } td.es-m-p15b { padding-bottom:15px } td.es-m-p15r { padding-right:15px } td.es-m-p15l { padding-left:15px } td.es-m-p20 { padding:20px } td.es-m-p20t { padding-top:20px } td.es-m-p20r { padding-right:20px } td.es-m-p20l { padding-left:20px } td.es-m-p25 { padding:25px } td.es-m-p25t { padding-top:25px } td.es-m-p25b { padding-bottom:25px } td.es-m-p25r { padding-right:25px } td.es-m-p25l { padding-left:25px } td.es-m-p30 { padding:30px } td.es-m-p30t { padding-top:30px } td.es-m-p30b { padding-bottom:30px } td.es-m-p30r { padding-right:30px } td.es-m-p30l { padding-left:30px } td.es-m-p35 { padding:35px } td.es-m-p35t { padding-top:35px } td.es-m-p35b { padding-bottom:35px } td.es-m-p35r { padding-right:35px } td.es-m-p35l { padding-left:35px } td.es-m-p40 { padding:40px } td.es-m-p40t { padding-top:40px } td.es-m-p40b { padding-bottom:40px } td.es-m-p40r { padding-right:40px } td.es-m-p40l { padding-left:40px } }</style></head>
<body><div class="es-wrapper-color"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#fafafa"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"><tr><td valign="top"><table cellpadding="0" cellspacing="0" class="es-content" align="center"><tr><td class="es-info-area" align="center"><table class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: transparent" bgcolor="rgba(0, 0, 0, 0)"><tr><td class="es-p20" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tr><td width="560" align="center" valign="top"><table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="display: none"></td></tr></table></td></tr></table></td></tr></table></td>
</tr></table><table cellpadding="0" cellspacing="0" class="es-header" align="center"><tr><td align="center"><table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" width="600"><tr><td class="es-p10t es-p10b es-p20r es-p20l" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tr><td width="560" class="es-m-p0r" valign="top" align="center"><table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="display: none"></td></tr></table></td></tr></table></td></tr></table></td>
</tr></table><table cellpadding="0" cellspacing="0" class="es-content" align="center"><tr><td align="center"><table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600"><tr><td class="es-p30t es-p30b es-p20r es-p20l" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tr><td width="560" align="center" valign="top"><table cellpadding="0" cellspacing="0" width="100%" role="presentation"><tr><td align="center" class="es-p10b es-m-txt-c"><h1 style="font-size: 46px;line-height: 46px">Confirm Your Email</h1></td></tr><tr><td align="center" class="es-p5t es-p5b es-p40r es-p40l es-m-p0r es-m-p0l"><p>You’ve received this message because your email address has been registered with our site. Please click the button below to verify your email address and confirm that you are the owner of this account.</p></td>
</tr><tr><td align="center" class="es-p10t es-p5b"><p>If you did not register with us, please disregard this email.</p></td></tr><tr><td align="center" class="es-p10t es-p10b"><span class="es-button-border" style="border-radius: 6px"><a href="${link}" class="es-button" target="_blank" style="border-left-width: 30px;border-right-width: 30px;border-radius: 6px">CONFIRM YOUR EMAIL</a></span></td></tr><tr><td align="center" class="es-p5t es-p5b es-p40r es-p40l es-m-p0r es-m-p0l"><p>Once confirmed, this email will be uniquely associated with your account.<br>Please don't confirm if you're not register this email</p></td></tr></table></td></tr></table></td></tr></table></td>
</tr></table><table cellpadding="0" cellspacing="0" class="es-footer" align="center"><tr><td align="center"><table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" width="640" style="background-color: transparent"><tr><td class="es-p20t es-p20b es-p20r es-p20l" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tr><td width="600" align="left"><table cellpadding="0" cellspacing="0" width="100%" role="presentation"><tr><td align="center" class="es-p35b"><p>MDMB Social &nbsp;© 2022 , Inc. All Rights Reserved.</p><p>4562 Hue, VN</p></td>
</tr><tr><td><table cellpadding="0" cellspacing="0" width="100%" class="es-menu" role="presentation"><tr class="links"><td align="center" valign="top" width="33.33%" class="es-p10t es-p10b es-p5r es-p5l" style="padding-top: 5px;padding-bottom: 5px"><a target="_blank" href="https://" style="color: #999999">Visit Us </a></td><td align="center" valign="top" width="33.33%" class="es-p10t es-p10b es-p5r es-p5l" style="padding-top: 5px;padding-bottom: 5px;border-left: 1px solid #cccccc"><a target="_blank" href="https://" style="color: #999999">Privacy Policy</a></td><td align="center" valign="top" width="33.33%" class="es-p10t es-p10b es-p5r es-p5l" style="padding-top: 5px;padding-bottom: 5px;border-left: 1px solid #cccccc"><a target="_blank" href="https://" style="color: #999999">Terms of Use</a></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td>
</tr></table><table cellpadding="0" cellspacing="0" class="es-content" align="center"><tr><td class="es-info-area" align="center"><table class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: transparent" bgcolor="rgba(0, 0, 0, 0)"><tr><td class="es-p20" align="left"><table cellpadding="0" cellspacing="0" width="100%"><tr><td width="560" align="center" valign="top"><table cellpadding="0" cellspacing="0" width="100%" role="presentation"><tr><td align="center" class="es-infoblock"><p><a target="_blank"></a>No longer want to receive these emails?&nbsp;<a href target="_blank">Unsubscribe</a>.<a target="_blank"></a></p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>
    `,
  };
  transporter.sendMail(mailOptions, (err, succ) => {
    if (err) return res.status(201).send({ result: "Cant send email" });
    else res.status(200).send({ result: "email sent successful" });
  });
}

function verifyEmail(req, res) {
  var token = req.query.token;
  //checktoken
  if (!token) return res.status(401).send({ error: "No token provided" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // console.log(decoded);
    if (err) return res.status(401).send({ error: "Invalid token" });
    var dateNow = new Date();
    if (decoded.exp < dateNow.getTime() / 1000)
      return res.status(401).send({ error: "Token expired" });

    var payload = auth.parseJwt(token);
    var Password = payload.Password;
    var Email = payload.Email;
    var Phone = payload.Phone;
    var Name = payload.Name;

    AccountDAO.getAccountId(Email, Phone, (Account) => {
      if (Account) return res.status(401).send({ error: "Account created" });
      else {
        bcrypt.hash(Password, 10).then((hash) => {
          AccountDAO.createAccount(hash, Phone, Email, Name, (rs) => {
            if (rs)
              return res.redirect(`${process.env.MDMB_SOCIAL_URL}?alert=Register%20successful`);
            else return res.redirect(`${process.env.MDMB_SOCIAL_URL}?alert=Register%failed`);
          });
        });
      }
    });
  });
}
function registerByGoogle(req, res) {
  let Name = req.body.Name;
  let Email = req.body.Email;
  let Phone = req.body.Phone;
  //regex
  let regName = /^((?![0-9\~\!\@\#\$\%\^\&\*\(\)\_\+\=\-\[\]\{\}\;\:\"\\\/\<\>\?]).){2,45}/;
  let regEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,45}))$/;
  let regPhone = /(84|0[3|5|7|8|9])+([0-9]{8})$/;

  if (
    !Name ||
    !Email ||
    !Phone ||
    Name.trim() == null ||
    Email.trim() == null ||
    Phone.trim() == null
  ) {
    return res.status(201).send({
      result: "incorrect format for: empty value",
      description: `Not allow empty value for${!Name || Name.trim() == null ? " Name" : ""}${!Email || Email.trim() == null ? " Email" : ""
        }${!Phone || Phone.trim() == null ? " Phone" : ""}`,
    });
  }

  if (!regName.test(Name)) {
    return res.status(201).send({
      result: "incorrect format for: Name",
      description:
        2 <= Name.length && Name.length <= 45
          ? "Valid name not contain special character such as @-!#..."
          : "Name length not valid: at least 2 char",
    });
  }
  if (!regEmail.test(Email) || Email.length > 45) {
    return res.status(201).send({
      result: "incorrect format for: Email",
      description:
        Email.length <= 45 ? "Valid Email look like this: 123@gmail.com" : "Email length < 45",
    });
  }
  if (!regPhone.test(Phone)) {
    return res.status(201).send({
      result: "incorrect format for: Phone",
      description: `${10 == Phone.length || 11 == Phone.length
        ? "Valid Phone look like this: 098333**** or 848333****"
        : "Phone length 10-11 char"
        }`,
    });
  }
  AccountDAO.getAccountId(Email, Phone, (result) => {
    if (result) res.status(201).send({ result: "account existed", description: "account existed" });
    else {
      if (Email) Email = Email.toLowerCase();
      if (Name)
        Name = Name.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase()); //Capital first letter
      AccountDAO.createAccount(null, Phone, Email, Name, (rs) => {
        if (rs) return res.send({ result: "register successful" });
        else return res.send({ result: "register failed, sql error..." });
      });
    }
  });
}

async function getListFriend(req, res) {
  var accountId = req.query.accountId;
  let listFriend = await AccountDAO.getListFriend(accountId);
  if (listFriend) res.status(200).send({ result: listFriend });
  else res.status(201).send({ result: "get list friend failed" });
  // , (result) => {
  //   if (result) res.status(200).send({ result: result });
  //   else res.status(401).send({ result: "failure" });
  // });
}

async function getListFriendWithLastMessage(req, res) {
  var accountId = req.query.accountId;
  let listFriend = await AccountDAO.getListFriendWithLastMessage(accountId);
  await listFriend[0].forEach(async (friend) => {
    if (friend.LastMessage != null) {
      try {
        friend.LastMessage = await cryptoMiddlware.decrypt(friend.LastMessage);
      } catch (error) {
      }
    }
  });
  if (listFriend) res.status(200).send({ result: listFriend[0] });
  else res.status(201).send({ result: "get list friend failed" });
}

async function getListFriendWithLastMessageCountUnseen(req, res) {
  var accountId = req.query.accountId;
  let listFriend = await AccountDAO.getListFriendWithLastMessageCountUnseen(accountId);
  await listFriend[0].forEach(async (friend) => {
    try {
      if (friend.LastMessage != null) {
        friend.LastMessage = await cryptoMiddlware.decrypt(friend.LastMessage);
      }
    } catch (error) {
    }
  });
  if (listFriend) res.status(200).send({ result: listFriend[0] });
  else res.status(201).send({ result: "get list friend failed" });
}

async function getAccountInfor(req, res) {
  var accountId = req.query.accountId;
  let AccountInfor = await AccountDAO.getAccountInfor(accountId);
  if (AccountInfor[0]) res.status(200).send({ result: AccountInfor[0] });
  else res.status(201).send({ result: "get Account infor failed" });
}

async function getAccountListSearching(req, res) {
  var SearchKey = req.query.SearchKey || '';
  var AccountId = req.query.AccountId;
  if (!AccountId) return res.status(200).send({ result: "Missing AccountId" });
  let listAccount = await AccountDAO.getAccountListSearching(SearchKey.toLowerCase(), AccountId);
  if (listAccount[0]) res.status(200).send({ result: listAccount });
  else res.status(201).send({ result: [] });
}

function AddFriend(req, res) {
  var RelatingAccountId = req.query.RelatingAccountId;
  var RelatedAccountId = req.query.RelatedAccountId;
  var Type = req.query.Type;

  if (!RelatingAccountId || !RelatedAccountId || !Type) return res.status(200).send({ result: "Missing Infor" });

  if (Type=='delete') AccountDAO.deleteRelationship(RelatingAccountId, RelatedAccountId, (result)=>{
    return res.status(201).send({ result: result });
  })
  else
  AccountDAO.setRelationship(RelatingAccountId, RelatedAccountId, Type, (result) => {
    return res.status(201).send({ result: result });
  })
}

async function getListHaveRelationship(req, res) {
  var AccountId = req.query.AccountId;
  let listFriend = await AccountDAO.getListHaveRelationship(AccountId);
  if (listFriend) res.status(200).send({ result: listFriend });
  else res.status(201).send({ result: "get list relationship failed" });
}
async function getListFriendRecommended(req, res){
  var AccountId = req.query.AccountId;

  if(!AccountId) return res.status(201).send({result:[]});

  let listFriendRecommended= await AccountDAO.getListFriendRecommended(AccountId);
  if (listFriendRecommended[0]) res.status(200).send({ result: listFriendRecommended[0] });
  else res.status(201).send({ result: "get list relationship failed" });
}
module.exports = {
  login,
  loginByGoogle,
  loginByFaceBook,
  register,
  update,
  verifyEmail,
  getListFriend,
  getListFriendWithLastMessage,
  getListFriendWithLastMessageCountUnseen,
  registerByGoogle,
  getAccountInfor,
  getAccountListSearching,
  AddFriend,
  getListHaveRelationship,
  getListFriendRecommended
};
