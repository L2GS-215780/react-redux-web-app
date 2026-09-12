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
UserAccount.login = function (user_name, result) {
    dbConn.query("SELECT * FROM users_accounts WHERE user_name = ? LIMIT 1", [user_name], function (err, rows) {
        if (err) {
            result(err, null);
        } else if (rows.length === 0) {
            result(null, null);
        } else {
            result(null, rows[0]);
        }
    });
};

UserAccount.logout = function (accessToken, refreshToken, result) {

};

UserAccount.retrieveAll = function (result) {
    dbConn.query("SELECT * FROM users_accounts", function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

UserAccount.findById = function (id, result) {
    dbConn.query("SELECT * FROM users_accounts WHERE id = ? LIMIT 1", [id], function (err, rows) {
        if (err) {
            result(err, null);
        } else if (rows.length === 0) {
            result(null, null);
        } else {
            result(null, rows[0]);
        }
    });
};

UserAccount.findBySearchAndFilter = function (filters, result) {
    let sql = "SELECT * FROM users_accounts WHERE 1=1";
    const params = [];

    if (filters.user_role) {
        sql += " AND user_role = ?";
        params.push(filters.user_role);
    }

    if (filters.is_active !== undefined) {
        sql += " AND is_active = ?";
        params.push(filters.is_active);
    }

    if (filters.created_at) {
        sql += " AND DATE(created_at) = ?";
        params.push(filters.created_at);
    }

    dbConn.query(sql, params, function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

/* */

//UPDATE USER ACCOUNTS MODELS

/* */

//DELETE USER ACCOUNTS MODELS
UserAccount.activateUserAccount = function (id, result) {
    dbConn.query("UPDATE users_accounts SET is_active = ?, updated_at = ? WHERE id = ? LIMIT 1", [1, new Date(), id], function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

UserAccount.deactivateUserAccount = function (id, result) {
    dbConn.query("UPDATE users_accounts SET is_active = ?, updated_at = ? WHERE id = ?  LIMIT 1", [0, new Date(), id], function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

UserAccount.delete = function (id, result) {
    dbConn.query("DELETE FROM users_accounts WHERE id = ?  LIMIT 1", [id], function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

UserAccount.activateUserAccounts = function (ids, result) {
    
};

UserAccount.deactivateUserAccounts = function (ids, result) {
    dbConn.query(`UPDATE users_accounts SET is_active = ?, updated_at = ? WHERE id IN (${ids.map(() => '?').join(',')})`, [0, new Date(), ...ids], function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

UserAccount.deletes = function (ids, result) {

};

/* */

module.exports = UserAccount;