const connection = require('./connection');
const messageToUser = require('../messageToUser');

function getOldMessage(fromAccount, toAccount, Callback) {
    // var con = connection.createConnection();
    // con.connect(async function (err) {
    connection.pool.getConnection(function (err, con) {
        if (err) throw err;
        // console.log("Connected!");
        // await connection.setTimeZone(con);
        var sql = `SELECT * 
        FROM MessageToUser 
        Where (FromAccount=? and ToAccount=?) or (FromAccount=? and ToAccount=?)
        ORDER BY SentDate DESC
        LIMIT 20`;
        con.query(sql, [fromAccount, toAccount, toAccount, fromAccount],
            function (err, result) {
                // connection.closeConnection(con);
                con.release();
                if (err) throw err;
                if (result.length > 0) {
                    var listMessage = [];
                    result.forEach(item => {
                        listMessage.push(new messageToUser.MessageToUser(item.MessageId, item.FromAccount, item.SentDate, item.Content, item.Type, item.ToAccount, item.SeenDate));
                    });
                    return Callback(listMessage);
                } else return Callback(false);
            });
    });
}

function getOlderMessage(fromAccount, toAccount, messageId, Callback) {
    // var con = connection.createConnection();
    // con.connect(function (err) {
    connection.pool.getConnection(function (err, con) {
        if (err) throw err;
        // console.log("Connected!");
        var sql = `SELECT *
        FROM MessageToUser
        Where ((FromAccount=? and ToAccount=?) or (FromAccount=? and ToAccount=?))
        and (MessageId < ?)
        ORDER BY SentDate DESC
        LIMIT 20`;
        con.query(sql, [fromAccount, toAccount, toAccount, fromAccount, messageId],
            function (err, result) {
                // connection.closeConnection(con);
                con.release();
                if (err) throw err;
                if (result.length > 0) {
                    var listMessage = [];
                    result.forEach(item => {
                        listMessage.push(new messageToUser.MessageToUser(item.MessageId, item.FromAccount, item.SentDate, item.Content, item.Type, item.ToAccount, item.SeenDate));
                    });
                    return Callback(listMessage);
                } else return Callback(false);
            });
    });
}

function addMessage(fromAccount, toAccount, content, type, Callback) {
    // var con = connection.createConnection();
    // con.connect(async function (err) {
    connection.pool.getConnection(function (err, con) {
        if (err) throw err;
        // await connection.setTimeZone(con);
        var sql = `insert into MDMB.MessageToUser(FromAccount, ToAccount, Content, Type) values(?,?,?,?);`;
        con.query(sql, [fromAccount, toAccount, content, type],
            function (err, result) {
                // connection.closeConnection(con);
                con.release();
                if (err) {
                    console.log(err);
                    return Callback(false);
                }
                else return Callback(true, result.insertId);
            });
    });
}

async function seenMessage(messageId) {
    // var con = connection.createConnection();
    return new Promise((resolve, reject) => {
        // con.connect(async function (err) {
        connection.pool.getConnection(function (err, con) {
            if (err) throw err;
            // await connection.setTimeZone(con);
            var sql = `UPDATE MDMB.MessageToUser SET SeenDate = NOW() WHERE MessageId = ?`;
            con.query(sql, [messageId],
                function (err, result) {
                    // connection.closeConnection(con);
                    con.release();
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else resolve(true);
                });
        });
    });
}

function getMessageById(messageId) {
    // var con = connection.createConnection();
    return new Promise((resolve, reject) => {
        connection.pool.getConnection(function (err, con) {
            if (err) throw err;
            let sql = `SELECT * FROM MDMB.MessageToUser WHERE MessageId = ?`;
            con.query(sql, [messageId],
                function (err, result) {
                    connection.closeConnection(con);
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        if (result.length > 0) {
                            resolve(new messageToUser.MessageToUser(result[0].MessageId, result[0].FromAccount, result[0].SentDate, result[0].Content, result[0].Type, result[0].ToAccount, result[0].SeenDate));
                        }
                        else resolve(false);
                    }
                });
        });

    });
}

module.exports = {
    getOldMessage,
    getOlderMessage,
    addMessage,
    seenMessage,
    getMessageById
}