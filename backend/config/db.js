const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Chetan@230706',
    database: process.env.DB_NAME || 'gym_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection((err, conn) => {
    if(err) console.error("Database Connection Failed: ", err.message);
    else {
        console.log("Connected to MySQL Database");
        conn.release();
    }
});

module.exports = pool.promise();
