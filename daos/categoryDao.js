const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

const createCategoryTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS category (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
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

        if (results.warningStatus !== 0) {
            return 'Table Category was already created';
        }

        return 'Table category has been created';
    }
}

const createSubCategoryTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS subcategory (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        categoryId VARCHAR(50) NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES category(id)
    )`;

    const connection = await mysql.createConnection(dbConfig);
    let results = null;

    try {
        [results, fields] = await connection.query(sql);
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
        if (results.warningStatus !== 0) {
            return 'Table Subcategory was already created';
        }

        return 'Table Subcategory has been created';
    }
}

const populateCategoryTable = async () => {
    const sql = `INSERT INTO category
        VALUES  ('Income', 'income'),
                ('Housing', 'need'),
                ('Transportation', 'need'),
                ('Lifestyle', 'need'),
                ('Personal', 'want'),
                ('Savings', 'savings'),
                ('Giving', 'giving'),
                ('Insurance', 'need')
    )`;

    const connection = await mysql.createConnection(dbConfig);
    let results = null;

    try {
        [results, fields] = await connection.query(sql);
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
        if (results.warningStatus !== 0) {
            return 'Table Subcategory was already created';
        }

        return 'Table Subcategory has been created';
    }
}

module.exports = {
    createCategoryTable,
    createSubCategoryTable,
    populateCategoryTable
    // populateSubcategoryTable
}