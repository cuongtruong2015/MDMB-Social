const accountRouter = require('./router.account');
const authRouter = require('./router.auth');
const chatRouter = require('./router.chat');

function route(app) {
    app.use('/account', accountRouter);
    app.use('/auth', authRouter);
    app.use('/chat', chatRouter);
}

module.exports = route;