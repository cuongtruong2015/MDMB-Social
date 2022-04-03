const { getLinkPreview } = require('link-preview-js');
const messageToUserDAO = require('../models/data-access/messageToUserDAO');
const cryptoMiddlware = require('../middlewares/crypto.middleware');

function getOldMessage(req, res) {
    // console.log("get old message");

    let accountId = req.query.accountId;
    let friendId = req.query.friendId;

    messageToUserDAO.getOldMessage(accountId, friendId, async (listMessage) => {
        if (listMessage) {
            await listMessage.forEach(async message => {
                try {
                    message.Content = await cryptoMiddlware.decrypt(message.Content);
                } catch (error) {
                    // console.log(error);
                }
            });
            res.status(200).json(listMessage);
        } else {
            res.status(200).json({
                message: "No message found"
            });
        }
    });
}

function getOlderMessage(req, res) {
    // console.log("get older message");

    let accountId = req.query.accountId;
    let friendId = req.query.friendId;
    let messageId = req.query.messageId;

    messageToUserDAO.getOlderMessage(accountId, friendId, messageId, async (listMessage) => {
        if (listMessage) {
            await listMessage.forEach(async message => {
                try {
                    // console.log('message: ' + message.Content);
                    message.Content = await cryptoMiddlware.decrypt(message.Content);
                    // console.log('decrypted msg: ' + message.Content);
                } catch (err) {
                    // console.log(err);
                }
            });
            res.status(200).json(listMessage);
        } else {
            res.status(200).json({
                message: "No message found"
            });
        }
    });
}
// function getChatList(req, res) {
//     let AccountId = req.query.AccountId;
//     chatDao.getAccountReceived(AccountId, (AccountReceived) => {
//         if (!AccountReceived) return res.status(401).send({ result: "No messenger found" })
//         var List = []
//         for (let i = 0; i < AccountReceived.length; i++) {
//             chatDao.getChatList(AccountId, AccountReceived[i], (ChatList) => {
//                 List.push(ChatList);
//                 if (AccountReceived.length == List.length) {
//                     List.sort((a, b) =>{
//                         return Date.parse(b.SentDate) - Date.parse(a.SentDate);
//                     })
//                     return res.status(200).send(List)
//                 }
//             })
//         }
//     })
// }

function getContentLinkPreview(req, res) {
    let url = req.query.url;
    // console.log(url);

    getLinkPreview(url)
        .then(data => {
            res.status(200).json({
                title: data.title,
                description: data.description,
                image: data.images[0]
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(200).json({ error: err });
        });
}

module.exports = {
    getOldMessage,
    getOlderMessage,
    getContentLinkPreview,
    // getChatList
};