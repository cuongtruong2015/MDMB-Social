const socketUser = require('../models/socket.user');

function status(io, socket) {
    socket.on('get online', async (listAccountId, response) => {
        console.log("get online: " + listAccountId);
        let listOnline = [];
        // console.log(socketUser.getUsers());
        await listAccountId.forEach(async accountId => {
            // console.log("accountId: " + accountId);
            let user = await socketUser.getUserByAccountId(accountId);
            // console.log(user);
            if (user) {
                listOnline.push(accountId);
            }
        });
        // console.log(`list online:`);
        // console.log(listOnline);
        response(listOnline);
    });

    socket.on('check online', async (accountId, response) => {
        // console.log("check online: " + accountId);
        let user = await socketUser.getUserByAccountId(accountId);
        if (user) {
            response(true);
        } else {
            response(false);
        }
    });

    socket.on('ping', (response) => {
        response('pong');
        // console.log(socket.accountId + 'is ping');
    });
}

module.exports = status;