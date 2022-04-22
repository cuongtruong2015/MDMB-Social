const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const messageController = require('../controllers/messageController');
const api = express.Router();

api.get('/old-message', authMiddleware.verifyToken, messageController.getOldMessage);
api.get('/older-message', authMiddleware.verifyToken, messageController.getOlderMessage);
api.get('/link-preview', authMiddleware.verifyToken, messageController.getContentLinkPreview);
// api.get('/chat-list',authMiddleware.verifyToken, messageController.getChatList)
api.get('/image-and-video', authMiddleware.verifyToken, messageController.getImageAndVideo);
api.get('/files', authMiddleware.verifyToken, messageController.getFiles);
api.get('/links', authMiddleware.verifyToken, messageController.getLinks);
api.get('/more-image-and-video', authMiddleware.verifyToken, messageController.getMoreImageAndVideo);
api.get('/more-files', authMiddleware.verifyToken, messageController.getMoreFiles);
api.get('/more-links', authMiddleware.verifyToken, messageController.getMoreLinks);
api.get('/search-message', authMiddleware.verifyToken, messageController.searchMessage);
module.exports = api;