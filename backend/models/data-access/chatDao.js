const connection = require('./connection');

function getAccountReceived(AccountId, Callback) {
    // var con = connection.createConnection();
    // con.connect(function (err) {
        connection.pool.getConnection(function (err, con) {
        if (err) throw err;
        // console.log("Connected!");
        var sql = `SELECT ToAccount from MDMB.MessageToUser  where FromAccount =? group by ToAccount`;
        con.query(sql, [AccountId],
            function (err, result) {
                // connection.closeConnection(con);
                con.release();
                if (err) throw err;
                var AccountReceivedList = []
                for (let i = 0; i < result.length; i++) {
                    AccountReceivedList.push(result[i].ToAccount);
                }
                if (AccountReceivedList.length == 0) return Callback(false)
                else return Callback(AccountReceivedList);
            });
    });
}
function getChatList(FromAccount, ToAccount, Callback) {
    // var con = connection.createConnection();
    // con.connect(function (err) {
        connection.pool.getConnection(function (err, con) {
        if (err) throw err;
        // console.log("Connected!");
        var sql = `SELECT * from MDMB.MessageToUser as msg join MDMB.Account as acc on msg.ToAccount = acc.AccountId  where FromAccount =? and ToAccount =? order by SentDate desc limit 1`;
        con.query(sql, [FromAccount, ToAccount],
            function (err, result) {
                // connection.closeConnection(con);
                con.release();
                if (err) throw err;
                if (result.length == 0) return Callback(false)
                else return Callback({
                    FromAccount,
                    ToAccount,
                    Content: result[0].Content,
                    SentDate:result[0].SentDate,
                    SeenDate:result[0].SeenDate,
                    Type:result[0].Type,
                    MessageId:result[0].MessageId,
                    Avatar:result[0].Avatar
                })
            });
    });
}


module.exports = {
    getAccountReceived,
    getChatList
}