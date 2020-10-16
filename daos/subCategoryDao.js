const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const dbUtils = require('../helpers/dbUtils');

const createSubCategoryTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS subcategory (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        categoryId INT NOT NULL,
        CONSTRAINT fk_category FOREIGN KEY (categoryId) REFERENCES budget.category(id)
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

const addNewSubCategory = async (subcategory) => {
    let {name, categoryId} = subcategory;
    const insertSql = 'INSERT INTO subcategory (name, categoryId) VALUES (?, ?)';

    try {
        result = await dbUtils.executeQuery(insertSql, [name, categoryId]);
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

const getAllSubCategories = async () => {
    const connection = await mysql.createConnection(dbConfig);
    const querySql = 'SELECT * FROM subcategory';

    try {
        [results, fields] = await connection.query(querySql);
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
        return results;
    }
}

const getSubCategoryBy = async (queryObj) => {  
    let querySql = 'SELECT * from subcategory';
    let queryParams = dbUtils.getParams(queryObj);

    if (queryParams.length > 0) {
        querySql += dbUtils.buildWhereStatement(queryObj, 'AND');            
    
        try {
            return await dbUtils.executeQuery(querySql, queryParams);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. All parameters were empty.');
    }
}

const deleteSubCategory = async (id) => {
    let querySql = 'DELETE from subcategory where ';

    if (id) {
        querySql += `id = ?`;            
    
        try {
            return await dbUtils.executeQuery(querySql, [id]);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. Id cannot be empty.');
    }
}

const editSubCategory = async (subcategory) => {
    let updateSql = 'UPDATE subcategory';
    let queryParams = [];

    let setStatement = ' set ';

    for (let key in subcategory) {
        if (subcategory[key]) {
            setStatement += `${key.replace('_', '')}=?,`;
            queryParams.push(subcategory[key]);
        }
    }

    setStatement = setStatement.slice(0, setStatement.length - 1); // removes last comma
    updateSql += setStatement + ' where id=?';
    queryParams.push(subcategory['id']);
    
    try {
        return await dbUtils.executeQuery(updateSql, queryParams);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createSubCategoryTable,
    addNewSubCategory,
    getAllSubCategories,
    getSubCategoryBy,
    deleteSubCategory,
    editSubCategory
}