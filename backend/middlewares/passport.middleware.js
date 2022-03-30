
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_CLIENTSECRET,
    callbackURL: '/account/login-by-facebook',
    profileFields: ['id', 'displayName', 'email', 'gender', 'picture','name']
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }

));
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (done, id) {

    return done(null, id)
});
module.exports=passport