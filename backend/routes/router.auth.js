const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const express = require('express');
const api = express.Router();

api.post('/refresh-token', authMiddleware.verifyRefreshToken, authController.refreshToken);
api.get('/captcha', authController.captcha);
api.get('/check-token', authMiddleware.verifyToken,
    (req, res) => {
        res.send({
            result: 'success'
        });
    }
);

module.exports = api;