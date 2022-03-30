const connection = require('./connection');
const Account = require('../account')

function getAccount(Username, Callback) {
  // var con = connection.createConnection();
  // con.connect(function (err) {
  connection.pool.getConnection(function (err, con) {
    if (err) throw err;
    // console.log("Connected!");
    var sql = `SELECT * FROM Account Where (Email=? or Phone =?)`;
    con.query(sql, [Username, Username],
      function (err, result) {
        // connection.closeConnection(con);
        con.release();
        if (err) throw err;
        if (result.length > 0) {
          var acc = new Account.Account(result[0].AccountId, result[0].Password, result[0].Phone, result[0].Email, result[0].Name, result[0].Avatar, result[0].Birthday, result[0].Gender, result[0].CreatedDate);
          return Callback(acc);
        } else return Callback(false);
      });
  });
}
function getAccountByEmail(Email, Callback) {

  // var con = connection.createConnection();
  // con.connect(function (err) {
  connection.pool.getConnection(function(err, con) {
    if (err) throw err;
    // console.log("Connected!");
    var sql = `SELECT * FROM Account Where (Email=?)`;
    con.query(sql, [Email],
      function (err, result) {
        // connection.closeConnection(con);
        con.release();
        if (err) throw err;
        if (result.length > 0) {
          var acc = new Account.Account(result[0].AccountId, result[0].Password, result[0].Phone, result[0].Email, result[0].Name, result[0].Avatar, result[0].Birthday, result[0].Gender, result[0].CreatedDate);
          return Callback(acc);
        } else return Callback(false);
      });
  });
}

function createAccount(Password, Phone, Email, Name, Callback) {
  var con = connection.createConnection();
  // con.connect(async function (err) {
  connection.pool.getConnection(async function (err, con) {
    if (err) throw err;
    // await connection.setTimeZone(con);
    var sql = `insert into MDMB.Account(Password, Phone, Email, Name) values(?,?,?,?);`;
    con.query(sql, [Password, Phone, Email, Name],
      function (err, result) {
        // connection.closeConnection(con);
        con.release();
        if (err) return Callback(false);
        else return Callback(true);
      });
  });
}
function updateAccount(AccountId, Password, Phone, Email, Name, Avatar, Birthday, Gender, Callback) {
  // var con = connection.createConnection();
  // con.connect(function (err) {
  connection.pool.getConnection(function (err, con) {
    if (err) throw err;
    let str = ""
    let Args = [Name, Phone, Gender, Birthday, Avatar, Email, Password];
    let Args2 = [];
    item = Args.pop();
    if (Password) { str += Args.length != 0 ? 'Password = ? ,' : 'Password = ? '; Args2.push(item) } item = Args.pop();
    if (Email) { str += Args.length != 0 ? 'Email = ? ,' : 'Email = ? '; Args2.push(item) } item = Args.pop();
    if (Avatar) { str += Args.length != 0 ? 'Avatar = ? ,' : 'Avatar = ? '; Args2.push(item) } item = Args.pop();
    if (Birthday) { str += Args.length != 0 ? 'Birthday = ? ,' : 'Birthday = ? '; Args2.push(item) } item = Args.pop();
    if (Gender) { str += Args.length != 0 ? 'Gender = ? ,' : 'Gender = ? '; Args2.push(item) } item = Args.pop();
    if (Phone) { str += Args.length != 0 ? 'Phone = ? ,' : 'Phone = ? '; Args2.push(item) } item = Args.pop();
    if (Name) { str += Args.length != 0 ? 'Name = ? ,' : 'Name = ? '; Args2.push(item) }

    Args2.push(AccountId);
    var sql = `UPDATE MDMB.Account SET ${str} where AccountId=?`;
    con.query(sql, Args2,
      function (err, result) {
        // connection.closeConnection(con);
        con.release();
        if (err) return Callback(false);
        else return Callback(true);

      });
  });
}
function getAccountId(Email, Phone, Callback) {
  // var con = connection.createConnection();
  // con.connect(function (err) {
  connection.pool.getConnection(function (err, con) {
    if (err) throw err;
    var sql = `SELECT * FROM MDMB.Account where Phone =? or Email=?;`;
    con.query(sql, [Phone, Email],
      function (err, result) {
        // connection.closeConnection(con);
        con.release();
        if (err) throw err;
        if (result.length > 0) {
          return Callback(result[0].AccountId);
        } else return Callback(false);
      });
  });
}

function getListFriend(AccountId, Callback) {
  // console.log('====================================');
  // var con = connection.createConnection();
  connection.pool.getConnection(function (err, con) {
    if (err) throw err;
    var sql = `select * 
    from MDMB.Account
    where AccountId in (
      SELECT RelatingAccountId
      FROM MDMB.AccountRelationship
      WHERE (RelatingAccountId < ?) AND (RelatedAccountId = ?) AND (Type = 'friend')
      UNION
      SELECT RelatedAccountId
      FROM MDMB.AccountRelationship
      WHERE (RelatedAccountId > ?) AND (RelatingAccountId = ?) AND (Type = 'friend')
    )`;
    con.query(sql, [AccountId, AccountId, AccountId, AccountId],
      function (err, result) {
        // connection.closeConnection(con);
        con.release();
        if (err) throw err;
        let accounts = [];
        // console.log(result);
        // console.log('accounr ' + accounts);
        for (let i = 0; i < result.length; i++) {
          let account = new Account.Account(result[i].AccountId, null,
            result[i].Phone, result[i].Email, result[i].Name, result[i].Avatar, result[i].Birthday, result[i].Gender, result[i].CreatedDate);
          accounts.push(account);
        }
        // console.log('accounr ' + accounts);
        return Callback(accounts);
      });
  });
}

function getListFriend(AccountId) {
  let sql = `select * 
  from MDMB.Account
  where AccountId in (
    SELECT RelatingAccountId
    FROM MDMB.AccountRelationship
    WHERE (RelatingAccountId < ?) AND (RelatedAccountId = ?) AND (Type = 'friend')
    UNION
    SELECT RelatedAccountId
    FROM MDMB.AccountRelationship
    WHERE (RelatedAccountId > ?) AND (RelatingAccountId = ?) AND (Type = 'friend')
  )`;
  return new Promise((resolve, reject) => {
    // var con = connection.createConnection();
    // con.connect(function (err) {
    connection.pool.getConnection(function (err, con) {
      if (err) throw err;
      con.query(sql, [AccountId, AccountId, AccountId, AccountId],
        function (err, result) {
          // connection.closeConnection(con);
          con.release();
          if (err) return reject(err);
          let accounts = [];
          // console.log(result);
          // console.log('accounr ' + accounts);
          for (let i = 0; i < result.length; i++) {
            let account = new Account.Account(result[i].AccountId, null,
              result[i].Phone, result[i].Email, result[i].Name, result[i].Avatar, result[i].Birthday,
              result[i].Gender, result[i].CreatedDate, result[i].LastOnline);
            accounts.push(account);
          }
          resolve(accounts);
        });
    });
  });
}

function getListFriendAsync(AccountId) {
  let sql = `select * 
  from MDMB.Account
  where AccountId in (
    SELECT RelatingAccountId
    FROM MDMB.AccountRelationship
    WHERE (RelatingAccountId < ?) AND (RelatedAccountId = ?) AND (Type = 'friend')
    UNION
    SELECT RelatedAccountId
    FROM MDMB.AccountRelationship
    WHERE (RelatedAccountId > ?) AND (RelatingAccountId = ?) AND (Type = 'friend')
  )`;
  return new Promise((resolve, reject) => {
    // var con = connection.createConnection();
    // con.connect(function (err) {
    connection.pool.getConnection(function (err, con) {
      if (err) throw err;
      con.query(sql, [AccountId, AccountId, AccountId, AccountId],
        function (err, result) {
          // connection.closeConnection(con);
          con.release();
          if (err) return reject(err);
          let accounts = [];
          // console.log(result);
          // console.log('accounr ' + accounts);
          for (let i = 0; i < result.length; i++) {
            let account = new Account.Account(result[i].AccountId, null,
              result[i].Phone, result[i].Email, result[i].Name, result[i].Avatar, result[i].Birthday,
              result[i].Gender, result[i].CreatedDate, result[i].LastOnline);
            accounts.push(account);
          }
          resolve(accounts);
        });
    });
  });
}

function getListFriendWithLastMessage(AccountId) {
  let sql = `CALL MDMB.proc_get_list_friend_with_last_message(?);`
  return new Promise((resolve, reject) => {
    // var con = connection.createConnection();
    // con.connect(function (err) {
    connection.pool.getConnection(function (err, con) {
      if (err) throw err;
      con.query(sql, [AccountId],
        function (err, result) {
          // connection.closeConnection(con);
          con.release();
          if (err) return reject(err);
          resolve(result);
        });
    });
  });
}

async function getListFriendWithLastMessageCountUnseen(AccountId) {
  let sql = `CALL MDMB.proc_get_list_friend_with_last_message_count_unseen(?);`
  return new Promise((resolve, reject) => {
    // var con = connection.createConnection();
    
    connection.pool.getConnection(function (err, con) {
      if (err) throw err;
      con.query(sql, [AccountId],
        function (err, result) {
          // connection.closeConnection(con);
          con.release();
          if (err) return reject(err);
          resolve(result);
        });
    });
  });
}

function updateLastOnline(AccountId) {
  let res;
  // var con = connection.createConnection();
  return new Promise((resolve, reject) => {
    // con.connect(async function (err) {
    connection.pool.getConnection(async function (err, con) {
      if (err) throw err;
      // await connection.setTimeZone(con);
      var sql = `UPDATE MDMB.Account SET LastOnline = NOW() where AccountId=?;`;
      con.query(sql, [AccountId],
        function (err, result) {
          // connection.closeConnection(con);
          con.release();
          if (err) reject(err);
          res = result;
          resolve(res);
        });
    });
  });
}

function getAccountInfor(AccountId) {
  // var con = connection.createConnection();
  return new Promise((resolve, reject) => {
    // con.connect(async function (err) {
    connection.pool.getConnection(async function (err, con) {
      if (err) throw err;
      var sql = `select AccountId, Phone, Email, Name, Avatar, Birthday, Gender, CreatedDate,LastOnline from MDMB.Account where AccountId=?;`;
      con.query(sql, [AccountId],
        function (err, result) {
          // connection.closeConnection(con);
          con.release();
          if (err) reject(err);
          res = result;
          resolve(res);
        });
    });
  });
}

function getAccountListSearching(SearchKey, AccountId) {
  // var con = connection.createConnection();
  return new Promise((resolve, reject) => {
    let Key = `%${SearchKey}%`;
    // con.connect(async function (err) {
    connection.pool.getConnection(async function (err, con) {
      if (err) throw err;
      var sql = `SELECT AccountId,Name, Avatar, Birthday, LastOnline, Gender FROM MDMB.Account Where (lower(Name) like ? or lower(Phone) like ? or lower(Email) like ?) 
      and AccountId not in(
        SELECT RelatingAccountId
        FROM MDMB.AccountRelationship
        WHERE (RelatingAccountId < ?) AND (RelatedAccountId = ?) AND (Type = 'friend')
        UNION
        SELECT RelatedAccountId
        FROM MDMB.AccountRelationship
        WHERE (RelatedAccountId > ?) AND (RelatingAccountId = ?) AND (Type = 'friend')
      )
      limit 10
      `;
      con.query(sql, [Key, Key, Key, AccountId, AccountId, AccountId, AccountId],
        function (err, result) {
          // connection.closeConnection(con);
          con.release();
          if (err) reject(err);
          res = result;
          resolve(res);
        });
    });
  });
}
function setRelationship(RelatingAccountId, RelatedAccountId, Type, Callback) {
  // var con = connection.createConnection();
  // con.connect(async function (err) {
  connection.pool.getConnection(async function (err, con) {
    if (err) throw err;
    var sql = `CALL MDMB.AddFriend(?, ?, ?);`;
    con.query(sql, [RelatingAccountId, RelatedAccountId, Type],
      function (err, result) {
        // connection.closeConnection(con);
        con.release();
        if (err) return Callback(false);
        else return Callback(true);
      });
  });
}
function deleteRelationship(RelatingAccountId, RelatedAccountId, Callback) {
  // var con = connection.createConnection();
  // con.connect(async function (err) {
  connection.pool.getConnection(async function (err, con) {
    if (err) throw err;
    var sql = `Delete FROM MDMB.AccountRelationship
      Where (RelatingAccountId = ? and RelatedAccountId=?)
      or  (RelatedAccountId= ? and  RelatingAccountId=?);`;
    con.query(sql, [RelatingAccountId, RelatedAccountId, RelatingAccountId, RelatedAccountId],
      function (err, result) {
        // connection.closeConnection(con);
        con.release();
        if (err) return Callback(false);
        else return Callback(true);
      });
  });
}
function getListHaveRelationship(AccountId) {
  let sql = `select RelatingAccountId,RelatedAccountId,Type,LastOnline,CreatedDate,Gender,Birthday,Avatar,Name,Email,Phone from MDMB.Account as acc join MDMB.AccountRelationship as accrel on (acc.AccountID = accrel.RelatingAccountId or acc.AccountID=accrel.RelatedAccountId)
  where (accrel.RelatingAccountId<? and accrel.RelatedAccountId = ? and AccountId !=?)
   or (accrel.RelatedAccountId>? and accrel.RelatingAccountId = ? and AccountId !=?);`;
  return new Promise((resolve, reject) => {
    // var con = connection.createConnection();
    // con.connect(function (err) {
    connection.pool.getConnection(function (err, con) {
      if (err) throw err;
      con.query(sql, [AccountId, AccountId, AccountId, AccountId, AccountId, AccountId],
        function (err, result) {
          // connection.closeConnection(con);
          con.release();
          if (err) return reject(err);
          let accounts = [];
          for (let i = 0; i < result.length; i++) {
            accounts.push(result[i]);
          }
          resolve(accounts);
        });
    });
  });
}

function getListFriendRecommended(AccountId) {
  let sql = `CALL MDMB.proc_get_list_friend_recommended(?);`
  return new Promise((resolve, reject) => {
    var con = connection.createConnection();
    con.connect(function (err) {
      if (err) throw err;
      con.query(sql, [AccountId],
        function (err, result) {
          connection.closeConnection(con);
          if (err) return reject({result:'error'});
          resolve(result);
        });
    });
  });
}
module.exports = {
  getAccount,
  getAccountByEmail,
  createAccount,
  getAccountId,
  updateAccount,
  getListFriend,
  getListFriendAsync,
  getListFriendWithLastMessage,
  getListFriendWithLastMessageCountUnseen,
  updateLastOnline,
  getAccountInfor,
  getAccountListSearching,
  setRelationship,
  getListHaveRelationship,
  deleteRelationship,
  getListFriendRecommended
}