const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const messageController = require('../controllers/messageController');
const api = express.Router();

api.get('/get-lasted-playlist', messageController.getLastedPlaylist);
module.exports = api;
