const accountRouter = require('./router.account');
const authRouter = require('./router.auth');
const chatRouter = require('./router.chat');
const musicRouter = require('./router.music');

function route(app) {
    app.use('/account', accountRouter);
    app.use('/auth', authRouter);
    app.use('/chat', chatRouter);
    app.use('/music', musicRouter);
}

module.exports = route;