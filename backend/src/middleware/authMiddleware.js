'use strict'

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({
            error: true,
            message: "No access token, unauthorized"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            error: true,
            message: "Invalid or expired access token"
        });
    }
}

module.exports = { authMiddleware }