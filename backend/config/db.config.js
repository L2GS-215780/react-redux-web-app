'use strict'

const mysql = require("mysql");

const dbConn = mysql.createPool({
    host: process.env.DB_HOST_LOCALHOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    dateStrings: true,
});

dbConn.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Database Connected');
    connection.release();
});

module.exports = dbConn;