const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'taskuser',
    password: process.env.DB_PASSWORD || 'taskpass',
    database: process.env.DB_NAME || 'taskdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

if (process.env.DB_SSL === 'true') {
    dbConfig.ssl = {
        rejectUnauthorized: false
    };
}

const pool = mysql.createPool(dbConfig);

// Promise wrapper for async/await
const promisePool = pool.promise();

module.exports = promisePool;