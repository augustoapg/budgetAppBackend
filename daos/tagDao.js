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
    const connection = await mysql.createConnection(dbConfig);
    const insertSql = 'INSERT INTO tag (name, color) VALUES (?, ?)';
    const preparedInsert = mysql.format(insertSql, [name, color]);

    try {
        [results, fields] = await connection.query(preparedInsert);        
        return results.insertId;
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
    }
}

const getAllTags = async () => {
    const connection = await mysql.createConnection(dbConfig);
    const querySql = 'SELECT * FROM tag';

    try {
        [results, fields] = await connection.query(querySql);
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
        return results;
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
    let queryParams = getParams(queryObj);

    if (queryParams.length > 0) {
        querySql += buildWhereStatement(queryObj, 'AND');            
    
        try {
            return dbUtils.executeQuery(querySql, queryParams);
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

const editTag = async (id, tag) => {
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
    queryParams.push(id);
    
    try {
        console.log(updateSql)
        console.log(queryParams)
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
