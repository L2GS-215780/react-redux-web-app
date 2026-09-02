'use strict'

/**
 * Middleware to check if user has one of the allowed roles
 * @param {Array<string>} allowedRoles - Array of role names that can access the route
 */
function roleMiddleware(allowedRoles) {
    return function (req, res, next) {
        if (!req.user || !req.user.user_role) {
            return res.status(401).json({
                error: true,
                message: "Not authenticated"
            });
        }

        const userRole = req.user.user_role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: true,
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
            });
        }

        next();
    };
}

module.exports = { roleMiddleware };