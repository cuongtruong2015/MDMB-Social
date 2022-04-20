const express = require('express');
const accountController = require('../controllers/accountController');
// const passport = require('../middlewares/passport.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const api = express.Router();

api.post("/login", accountController.login);
api.post("/login-by-google", accountController.loginByGoogle);
// api.get('/login-by-facebook', passport.authenticate('facebook', { scope: 'email' }), accountController.loginByFaceBook);
api.post("/register", accountController.register);
api.post("/register-by-google", accountController.registerByGoogle);
api.post("/update", authMiddleware.verifyToken, accountController.update);
api.get("/verify", accountController.verifyEmail)
api.get("/list-friend", authMiddleware.verifyToken, accountController.getListFriend);
api.get("/list-friend-with-last-message", authMiddleware.verifyToken, accountController.getListFriendWithLastMessage);
api.get("/list-friend-with-last-message-count-unseen", authMiddleware.verifyToken, accountController.getListFriendWithLastMessageCountUnseen);
api.get("/account-information", authMiddleware.verifyToken, accountController.getAccountInfor);
api.get("/account-list-searching", authMiddleware.verifyToken, accountController.getAccountListSearching);
api.get("/insert-relationship", authMiddleware.verifyToken, accountController.AddFriend);
api.get("/list-have-relationship", authMiddleware.verifyToken, accountController.getListHaveRelationship);
api.get("/list-friend-recommended", authMiddleware.verifyToken, accountController.getListFriendRecommended);
api.get("/update-friend-relationship", authMiddleware.verifyToken, accountController.updateAccountRelationship);
api.get("/check-account-existed", accountController.checkAccountExisted);
api.get("/send-email-forgot-password", accountController.sendEmailForgotPassword);
api.get("/check-token", accountController.checkTempToken);
api.get("/change-password", accountController.changePassword);
module.exports = api;