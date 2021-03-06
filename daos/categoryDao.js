const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const dbUtils = require('../helpers/dbUtils');

const createCategoryTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS category (
        name VARCHAR(50) PRIMARY KEY,
        type VARCHAR(50) NOT NULL
    )`;

    try {
        return await dbUtils.executeSqlCreateTable(sql);        
    } catch (error) {
        throw error;
    }
}

const populateCategoryTable = async () => {
    const sql = `INSERT INTO budget.category(name, type)
        VALUES  ('Income', 'income'),
                ('Housing', 'need'),
                ('Transportation', 'need'),
                ('Lifestyle', 'need'),
                ('Personal', 'want'),
                ('Savings', 'savings'),
                ('Giving', 'giving'),
                ('Insurance', 'need')
    `;

    const connection = await mysql.createConnection(dbConfig);
    let results = null;

    try {
        [results, fields] = await connection.query(sql);
    } catch (error) {
        throw error;
    } finally {
        return results;
    }
}

const addNewCategory = async (category) => {
    const {name, type} = category;
    const insertSql = 'INSERT INTO category (name, type) VALUES (?, ?)';

    try {
        const result = await dbUtils.executeQuery(insertSql, [name, type]);
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

const getAllCategories = async () => {
    const querySql = 'SELECT * FROM category';

    try {
        return await dbUtils.executeQuery(querySql, []);
    } catch (error) {
        throw error;
    }
}

const getCategoryBy = async (queryObj) => {
    let querySql = 'SELECT * from category';
    let queryParams = dbUtils.getParams(queryObj);

    if (queryParams.length > 0) {
        querySql += dbUtils.buildWhereStatement(queryObj, 'AND');            
    
        try {
            return dbUtils.executeQuery(querySql, queryParams);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. All parameters were empty.');
    }
}

const deleteCategory = async (name) => {
    let querySql = 'DELETE from category where ';

    if (name) {
        querySql += `name = ?`;            
    
        try {
            return dbUtils.executeQuery(querySql, [name]);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. Name cannot be empty.');
    }
};

const editCategory = async (category) => {
    let updateSql = 'UPDATE category';
    let queryParams = [];

    let setStatement = ' set ';

    for (let key in category) {
        if (category[key]) {
            setStatement += `${key.replace('_', '')}=?,`;
            queryParams.push(category[key]);
        }
    }

    setStatement = setStatement.slice(0, setStatement.length - 1); // removes last comma
    updateSql += setStatement + ' where name=?';
    queryParams.push(category['name']);
    
    try {
        return dbUtils.executeQuery(updateSql, queryParams);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createCategoryTable,
    populateCategoryTable,
    addNewCategory,
    getAllCategories,
    getCategoryBy,
    deleteCategory,
    editCategory
}