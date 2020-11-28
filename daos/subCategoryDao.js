const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const dbUtils = require('../helpers/dbUtils');

const createSubCategoryTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS subcategory (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        category INT NOT NULL,
        CONSTRAINT fk_category FOREIGN KEY (category) REFERENCES budget.category(id)
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
    let {name, category} = subcategory;
    const insertSql = 'INSERT INTO subcategory (name, category) VALUES (?, ?)';

    try {
        const result = await dbUtils.executeQuery(insertSql, [name, category]);
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

const getAllSubCategories = async () => {
    const querySql = 'SELECT * FROM subcategory';

    try {
        return await dbUtils.executeQuery(querySql, []);
    } catch (error) {
        throw error;
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
            if (error.code && error.code === 'ER_ROW_IS_REFERENCED_2') {
                error.message = 'Cannot delete this subcategory because there is a transaction that uses it. Please edit or delete that transaction first.'
            }
            console.log(error)
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
        if (subcategory[key] != null) {
            // TODO: REPLACE THIS BY A BETTER VALIDATION
            if (typeof(subcategory[key]) !== 'string' || (typeof(subcategory[key]) === 'string' && subcategory[key].trim() !== "")) {
                setStatement += `${key.replace('_', '')}=?,`;
                queryParams.push(subcategory[key]);
            } else {
                throw new Error(`Invalid. Field ${key} cannot be empty`);
            }
        }
    }

    setStatement = setStatement.slice(0, setStatement.length - 1); // removes last comma
    updateSql += setStatement + ' where id=?';
    
    try {
        queryParams.push(subcategory.id);
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