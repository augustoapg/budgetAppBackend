const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

const createCategoryTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS category (
        id INT PRIMARY KEY,
        name VARCHAR(200) NOT NULL UNIQUE,
        type VARCHAR(50) NOT NULL
    )`;

    const connection = await mysql.createConnection(dbConfig);
    let results = null;

    try {
        [results, fields] = await connection.query(sql);
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
        return results;
    }
}

module.exports = {
    createCategoryTable
}