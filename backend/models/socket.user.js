const users = [];

const getUserByAccountId = (accountId) => {
    return Promise.resolve(users.find(user => user.accountId == accountId));
};

const getUserBySocketId = (socketId) => {
    return users.find(user => user.socketId.includes(socketId));
};

const addUser = async ({ accountId, socketId }) => {
    var user = await getUserByAccountId(accountId);
    if (!user) {
        user = { accountId, socketId: [socketId] };
        users.push(user);
    } else {
        user.socketId.push(socketId);
    }
}

const removeUser = (socketId) => {
    const index = users.findIndex(user => user.socketId.includes(socketId));
    if (index !== -1) {
        const socketIndex = users[index].socketId.indexOf(socketId);
        users[index].socketId.splice(socketIndex, 1);
        if (users[index].socketId.length == 0) {
            users.splice(index, 1);
        }
    }
}

const getUsers = () => {
    return users;
}

module.exports = {
    getUserByAccountId,
    getUserBySocketId,
    addUser,
    removeUser,
    getUsers
}