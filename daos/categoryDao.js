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

        if (results && results.warningStatus !== 0) {
            return false;
        }

        return true;
    }
}

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

// TODO
const populateSubCategoryTable = async () => {
    const sql = `INSERT INTO budget.subcategory(name, categoryId)
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

    const insertSql = 'INSERT INTO category VALUES (?, ?)';
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

const getCategoryById = async (id) => {
    const querySql = 'SELECT * from category where id=?';

    try {
        return executeQuery(querySql, [id]);
    } catch (error) {
        throw error;
    }
}

const getCategoryBy = async (queryObj) => {  
    let querySql = 'SELECT * from category';
    let queryParams = getParams(queryObj);

    if (queryParams.length > 0) {
        querySql += buildWhereStatement(queryObj, 'AND');            
    
        try {
            return executeQuery(querySql, queryParams);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. All parameters were empty.');
    }
}

const getParams = (queryObj) => {
    let queryParams = [];
    for (let key in queryObj) {
        if(queryObj[key]) {
            queryParams.push(queryObj[key]);
        }
    }
    return queryParams;
}

const buildWhereStatement = (queryObj, condition = 'AND') => {
    let whereStatement = ' where ';
    let operator = '=';

    for (let key in queryObj) {
        if (queryObj[key]) {
            if (key === 'dateMin' || key === 'valueMin') {
                operator = '>=';
                key = key.slice(0, key.length - 3); // removes Min to match column name
            } else if (key === 'dateMax' || key === 'valueMax') {
                operator = '<=';
                key = key.slice(0, key.length - 3); // removes Max to match column name
            }

            whereStatement += `${key}${operator}? ${condition} `;
            operator = '='; // reset
        }
    }

    whereStatement = whereStatement.slice(0, whereStatement.length - 4); // removes last AND
    return whereStatement;
}

const executeQuery = async (querySql, queryParams) => {
    const connection = await mysql.createConnection(dbConfig);
    const prepSql = mysql.format(querySql, queryParams);

    try {
        [result, fields] = await connection.query(prepSql);

        if (result && result.length > 0 || result.affectedRows > 0) {
            return result;
        } else {
            throw new Error(`No Category with those params was found`);
        }
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
    }
}

const deleteCategory = async (id) => {
    let querySql = 'DELETE from category where ';

    if (id) {
        querySql += `id = ?`;            
    
        try {
            return executeQuery(querySql, [id]);
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
        return executeQuery(updateSql, queryParams);
    } catch (error) {
        throw error;
    }
};

const addNewSubCategory = async (subcategory) => {
    let {name, categoryId} = subcategory;
    const connection = await mysql.createConnection(dbConfig);

    const insertSql = 'INSERT INTO subcategory VALUES (?, ?)';
    const preparedInsert = mysql.format(insertSql, [name, categoryId]);

    try {
        [results, fields] = await connection.query(preparedInsert);
        return results.insertId;
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
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
    let queryParams = getParams(queryObj);

    if (queryParams.length > 0) {
        querySql += buildWhereStatement(queryObj, 'AND');            
    
        try {
            return executeQuery(querySql, queryParams);
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
            return executeQuery(querySql, [id]);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. Id cannot be empty.');
    }
};

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
        return executeQuery(updateSql, queryParams);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createCategoryTable,
    createSubCategoryTable,
    populateCategoryTable,
    populateSubCategoryTable,
    addNewCategory,
    getAllCategories,
    getCategoryById,
    getCategoryBy,
    deleteCategory,
    editCategory,
    addNewSubCategory,
    getAllSubCategories,
    getSubCategoryBy,
    deleteSubCategory,
    editSubCategory
}