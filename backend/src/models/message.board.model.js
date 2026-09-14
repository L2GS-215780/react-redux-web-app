'use strict'

const dbConn = require('../../config/db.config');

const MessageBoard = function (messageBoard) {
    this.user_id_fk = messageBoard.user_id_fk;
    this.title = messageBoard.title;
    this.description = messageBoard.description;
    this.is_deleted = messageBoard.is_deleted ? messageBoard.is_deleted : 0;
    this.created_at = new Date();
    this.updated_at = null;
};

//CREATE MESSAGE BOARD MODELS
MessageBoard.create = function (newMessageBoard, result) {
    dbConn.query("INSERT INTO message_board set ?", newMessageBoard, function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res.insertId);
        }
    });
};
/* */

//READ MESSAGE BOARD MODELS
MessageBoard.retrieveAll = function (result) {
    dbConn.query(`
        SELECT 
            mb.*, 
            u.first_name, 
            u.last_name, 
            u.user_name 
        FROM message_board AS mb
        LEFT JOIN users_accounts AS u
        ON mb.user_id_fk = u.id
    `, function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

MessageBoard.findById = function (id, result) {
    dbConn.query(`
        SELECT 
            mb.*,
            u.first_name, 
            u.last_name, 
            u.user_name 
        FROM message_board AS mb
        LEFT JOIN users_accounts AS u
        ON mb.user_id_fk = u.id
        WHERE mb.id = ? 
        LIMIT 1
        `, [id], function (err, rows) {
        if (err) {
            result(err, null);
        } else if (rows.length === 0) {
            result(null, null);
        } else {
            result(null, rows[0]);
        }
    });
};

MessageBoard.findBySearchAndFilter = function (filters, result) {
    let sql = `
        SELECT 
            mb.*,
            u.first_name, 
            u.last_name, 
            u.user_name 
        FROM message_board AS mb
        LEFT JOIN users_accounts AS u
        ON mb.user_id_fk = u.id
        WHERE 1=1
    `;
    const params = [];

    if (filters.is_deleted !== undefined) {
        sql += " AND is_deleted = ?";
        params.push(filters.is_deleted);
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

//UPDATE MESSAGE BOARD MODELS
MessageBoard.update = function (id, messageBoard, result) {
    let sql = "UPDATE message_board SET updated_at = ?";
    let params = [new Date()];

    if (messageBoard.title) {
        sql += ", title = ?";
        params.push(messageBoard.title);
    }

    if (messageBoard.description) {
        sql += ", description = ?";
        params.push(messageBoard.description);
    }

    sql += " WHERE id = ?";
    params.push(id);

    dbConn.query(sql, params, function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

/* */

//DELETE MESSAGE BOARD MODELS
MessageBoard.archive = function (id, result) {
    dbConn.query("UPDATE message_board SET is_deleted = ?, updated_at = ? WHERE id = ?  LIMIT 1", [1, new Date(), id], function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

MessageBoard.unarchive = function (id, result) {
    dbConn.query("UPDATE message_board SET is_deleted = ?, updated_at = ? WHERE id = ?  LIMIT 1", [0, new Date(), id], function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

MessageBoard.delete = function (id, result) {
    dbConn.query("DELETE FROM message_board WHERE id = ?  LIMIT 1", [id], function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

MessageBoard.archives = function (ids, result) {
    dbConn.query(`UPDATE message_board SET is_deleted = ?, updated_at = ? WHERE id IN (${ids.map(() => '?').join(',')})`, [1, new Date(), ...ids], function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

MessageBoard.unarchives = function (ids, result) {
    dbConn.query(`UPDATE message_board SET is_deleted = ?, updated_at = ? WHERE id IN (${ids.map(() => '?').join(',')})`, [0, new Date(), ...ids], function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

MessageBoard.deletes = function (ids, result) {
    dbConn.query(`DELETE FROM message_board WHERE id IN (${ids.map(() => '?').join(',')})`, ids, function (err, res) {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
/* */

module.exports = MessageBoard;