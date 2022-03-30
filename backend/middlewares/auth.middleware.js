// require('dotenv').config();
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).send({ error: 'No token provided' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        // console.log(decoded);
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ error: 'Token expired' });
            } else {
                return res.status(401).send({ error: 'Invalid token' });
            }
        }

        req.userId = decoded.id;
        next();
    });
}

async function verifyTokenOnly(accessToken) {
    let result = {statusVerify: false, res: ''};
    console.log('verifyToken...');
    const res = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    result.res = 'Token expired';
                } else {
                    result.res = 'Invalid token';
                }
                return result;
            }
            result.statusVerify = true;
            result.res = decoded;
            return result;
        });
    return res;
}

function verifyRefreshToken(req, res, next) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(401).send({ error: 'No token provided' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ error: 'Refresh token expired' });
            } else {
                return res.status(401).send({ error: 'Invalid token' });
            }
        }
        req.userId = decoded.id;
        next();
    });
}
//decode jwt
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


module.exports = {
    verifyToken,
    verifyRefreshToken,
    parseJwt,
    verifyTokenOnly
};