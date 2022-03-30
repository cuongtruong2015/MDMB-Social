const { Server } = require('socket.io');
const authMiddleware = require('../middlewares/auth.middleware');
const socketUser = require('../models/socket.user');
const socketChatController = require('./socket.chat.controller');
const socketStatusController = require('./socket.status.controller');
const acccountDao = require('../models/data-access/accountDAO');

async function checkAuthen(io, socket) {
    let token = socket.handshake.auth.token;
    const { statusVerify, res } = await authMiddleware.verifyTokenOnly(token);
    if (statusVerify) {
        let accountId = socket.handshake.query.accountId;
        socket.accountId = accountId;
        console.log("socketio authenticated");
        socket.emit('authenticated');
        await socketUser.addUser({ accountId, socketId: socket.id });
        // console.log(socketUser.getUserBySocketId(socket.id));


        // acccountDao.getListFriend(accountId, (result) => {
        //     result.forEach(async friend => {
        //         let users = await socketUser.getUserByAccountId(friend.AccountId);
        //         if (users) {
        //             users.socketId.forEach(socketId => {
        //                 io.to(socketId).emit('user-online', accountId);
        //                 console.log(`emit user ${accountId} online to ${friend.AccountId}`);
        //             });
        //         }
        //     });
        // });
        // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        let user = await socketUser.getUserByAccountId(accountId);
        if (user.socketId.length == 1) {
            // console.log('USER ONLINE : ' + user.socketId.length);
            // console.log(user.socketId);
            let listFriend = await acccountDao.getListFriendAsync(accountId);
            // console.log('###########################3');
            // console.log(listFriend);
            if (listFriend) {
                listFriend.forEach(async friend => {
                    let users = await socketUser.getUserByAccountId(friend.AccountId);
                    if (users) {
                        users.socketId.forEach(socketId => {
                            io.to(socketId).emit('user-online', Number(accountId));
                            console.log(`emit user ${accountId} online to ${friend.AccountId}`);
                        });
                    }
                });
            }
        }

        console.log(socketUser.getUsers());
        return true;
    } else {
        console.log("socketio not authenticated");
        socket.emit('close-reason', res);
        socket.disconnect();
        console.log("disconnecting...");
        return false;
    }
}

function socket(server) {
    const io = new Server(server);
    console.log("socketio created");

    io.on('connection', async (socket) => {
        let check = await checkAuthen(io, socket);
        socket.auth = check;
        if (check) {
            console.log("socketio connected with socket id: " + socket.id + " and accountId: " + socket.accountId);

            socket.on('disconnect', async () => {
                console.log('-----disconnect-----');
                console.log(`socket ${socket.id} disconnected`);
                if (socket.auth) {
                    let user = await socketUser.getUserBySocketId(socket.id);
                    if (user.socketId.length == 1) {
                        let listFriend = await acccountDao.getListFriendAsync(socket.accountId);
                        // console.log('list friend :')
                        // console.log(listFriend);
                        listFriend.forEach(async friend => {
                            let user = await socketUser.getUserByAccountId(friend.AccountId);
                            // console.log(socketIds);
                            if (user) {
                                user.socketId.forEach(socketId => {
                                    io.to(socketId).emit('user-offline', Number(socket.accountId));
                                    console.log(`emit user ${socket.accountId} offline to ${friend.AccountId}`);
                                });
                            }
                        });
                        acccountDao.updateLastOnline(socket.accountId);
                    }
                    socketUser.removeUser(socket.id);
                }
            });

            socketChatController(io, socket);
            socketStatusController(io, socket);

            // socket.on('chat message', (msg) => {
            //     io.emit('chat message', msg);
            //     console.log("socketio chat message");
            // });
        }
    });
}

module.exports = socket;