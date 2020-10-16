const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const dbUtils = require('../helpers/dbUtils');

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

        if (results && results.warningStatus !== 0) {
            return false;
        }

        return true;
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
    let {name, type} = category;
    const connection = await mysql.createConnection(dbConfig);

    const insertSql = 'INSERT INTO category (name, type) VALUES (?, ?)';
    const preparedInsert = mysql.format(insertSql, [name, type]);

    try {
        [results, fields] = await connection.query(preparedInsert);
        return results.insertId;
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
    }
}

const getAllCategories = async () => {
    const connection = await mysql.createConnection(dbConfig);
    const querySql = 'SELECT * FROM category';

    try {
        [results, fields] = await connection.query(querySql);
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
        return results;
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

const deleteCategory = async (id) => {
    let querySql = 'DELETE from category where ';

    if (id) {
        querySql += `id = ?`;            
    
        try {
            return dbUtils.executeQuery(querySql, [id]);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. Id cannot be empty.');
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
    updateSql += setStatement + ' where id=?';
    queryParams.push(category['id']);
    
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