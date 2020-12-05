const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const dbUtils = require('../helpers/dbUtils');

const createTagTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS tag (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(70) NOT NULL,
        color VARCHAR(70) NOT NULL
    )`;

    const connection = await mysql.createConnection(dbConfig);
    let results = null;

    try {
        [results, fields] = await connection.query(sql);
        await createTransactionTagTable();
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

const createTransactionTagTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS transaction_tag (
        tagId INT,
        transactionId INT,
        PRIMARY KEY (tagId, transactionId),
        CONSTRAINT fk_tag FOREIGN KEY (tagId) REFERENCES budget.tag(id),
        CONSTRAINT fk_transactionId FOREIGN KEY (transactionId) REFERENCES budget.transactions(id)
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

        console.log('Junction table transaction_tag was now created');
        return true;
    }
}

const addNewTag = async (name, color) => {
    const insertSql = 'INSERT INTO tag (name, color) VALUES (?, ?)';

    try {
        const result = await dbUtils.executeQuery(insertSql, [name, color]);
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

const getAllTags = async () => {
    const querySql = 'SELECT * FROM tag';

    try {
        return await dbUtils.executeQuery(querySql, []);
    } catch (error) {
        throw error;
    }
}

const getTagById = async (id) => {
    const querySql = 'SELECT * from tag where id=?';

    try {
        return dbUtils.executeQuery(querySql, [id]);
    } catch (error) {
        throw error;
    }
}

const getTagBy = async (queryObj) => {  
    let querySql = 'SELECT * from tag';
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

const deleteTag = async (id) => {
    let queryJuncSql = 'DELETE FROM transaction_tag where ';
    let querySql = 'DELETE from tag where ';

    if (id) {
        queryJuncSql += 'tagId = ?';
        querySql += `id = ?`;            
    
        try {
            await dbUtils.executeQuery(queryJuncSql, [id]);
            return dbUtils.executeQuery(querySql, [id]);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. Id cannot be empty.');
    }
};

const editTag = async (tag) => {
    let updateSql = 'UPDATE tag';
    let queryParams = [];

    let setStatement = ' set ';

    for (let key in tag) {
        // TODO: REPLACE THIS BY A BETTER VALIDATION
        if (typeof(tag[key]) !== 'string' || (typeof(tag[key]) === 'string' && tag[key].trim() !== "")) {
            setStatement += `${key.replace('_', '')}=?,`;
            queryParams.push(tag[key]);
        } else {
            throw new Error(`Invalid. Field ${key} cannot be empty`);
        }
    }

    setStatement = setStatement.slice(0, setStatement.length - 1); // removes last comma
    updateSql += setStatement + ' where id=?';
    
    try {
        queryParams.push(tag.id);
        return dbUtils.executeQuery(updateSql, queryParams);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createTagTable,
    addNewTag,
    getAllTags,
    getTagById,
    getTagBy,
    deleteTag,
    editTag
}
