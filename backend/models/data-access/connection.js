const mysql = require('mysql');
const config = require('../../config/db.config');

function createConnection(){
    return mysql.createConnection({
        host: config.HOST,
        user: config.USER,
        password: config.PASSWORD,
        database: config.DATABASE,
        timezone: 'utc'
    });
}

const pool = mysql.createPool({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
    timezone: 'utc',
    connectionLimit: 50
});

async function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    }).catch(err => {
        console.log(err);
    });
}

// async function setTimeZone(connection){
//     let sql = 'SET time_zone = "+07:00"';
//     await connection.query(sql, function(err, result){
//         if(err) throw err;
//     });
// }

function closeConnection(connection){
    connection.end(function(err){
        if(err) throw err;
        // console.log('Close connection');
    });
}

module.exports = {
    createConnection,
    closeConnection,
    pool,
    getConnection
    // setTimeZone
}
