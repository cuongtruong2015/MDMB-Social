const jwt = require("jsonwebtoken");
var request = require("request");

function refreshToken(req, res, next) {
  const refreshToken = req.body.refreshToken;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    res.status(200).send({
      accessToken: jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      }),
    });
  });
}

function captcha(req, res) {
  // let captcha = req.body.captcha;
  let captcha = req.query.captcha;
  // let captcha = req.body['g-recaptcha-response'];
  // console.log(req.query);
  if (!captcha) {
    return res.status(401).send({ error: "No captcha provided" });
  }

  let url = "https://www.google.com/recaptcha/api/siteverify";
  url += "?secret=" + process.env.GOOGLE_CAPTCHA_SECRET_KEY;
  url += "&response=" + captcha;
  url += "&remoteip=" + req.connection.remoteAddress;

  request.get(url, (err, response, body) => {
    // console.log(body);
    if (err) {
      return res.status(401).send({ result: "fail", error: "Invalid captcha" });
    }

    let result = JSON.parse(body);
    // console.log(result);
    if (!result.success) {
      return res.status(401).send({ result: "fail", error: result["error-codes"][0] });
    }
    res.status(200).send({
      result: "success",
    });
  });
}

module.exports = {
  refreshToken,
  captcha,
};
