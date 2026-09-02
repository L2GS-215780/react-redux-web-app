'use strict'

const dbConn = require('../../config/db.config');

const UserAccount = function (userAccount) {
    this.first_name = userAccount.first_name;
    this.last_name = userAccount.last_name;
    this.user_name = userAccount.user_name;
    this.password = userAccount.password;
    this.user_role = userAccount.user_role;
    this.is_active = userAccount.is_active ? userAccount.is_active : 1;
    this.created_at = new Date();
    this.updated_at = null;
};

//CREATE USER ACCOUNTS MODELS
UserAccount.create = function (newUser, result) {
    dbConn.query("INSERT INTO users_accounts set ?", newUser, function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res.insertId);
        }
    });
};

/* */

//READ USER ACCOUNTS MODELS
UserAccount.findByUsername = function (user_name, result) {
    dbConn.query("SELECT id FROM users_accounts WHERE user_name = ? LIMIT 1", [user_name], function (err, rows) {
        if (err) {
            result(err, null);
        } else {
            result(null, rows.length > 0 ? rows[0] : null);
        }
    });
};

UserAccount.login = function (user_name, password, result) {

};

UserAccount.logout = function (accessToken, refreshToken, result) {

};

/* */

//UPDATE USER ACCOUNTS MODELS

/* */

//DELETE USER ACCOUNTS MODELS

/* */

module.exports = UserAccount;