const crypto = require('crypto');
const { getUser } = require('../models/users');

// Obiect pentru stocarea sesiunilor în memorie
const sessions = {};

function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

function setSession(res, userId, token) {
    const sessionId = generateSessionId();
    sessions[sessionId] = { userId: userId };
    res.setHeader('Set-Cookie', [`sessionId=${sessionId}; HttpOnly; Path=/;`, `token=${token}; HttpOnly; Path=/;`]);
}

function getSession(req) {
    const cookies = parseCookies(req);
    const sessionId = cookies.sessionId;
    if (sessionId && sessions[sessionId]) {
        return sessions[sessionId];
    }
    return null;
}

function parseCookies(req) {
    const list = {};
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    }
    return list;
}

function getUserById(userId) {
    return getUser(userId);
}

module.exports = {
    generateSessionId,
    setSession,
    getSession,
    parseCookies,
    getUserById
};