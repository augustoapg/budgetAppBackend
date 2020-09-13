const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

const createTagTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS tag (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(70) NOT NULL
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

const addNewTag = async (name, transactionId) => {
    const connection = await mysql.createConnection(dbConfig);
    const insertSql = 'INSERT INTO tag VALUES (?)';
    const preparedInsert = mysql.format(insertSql, [name]);

    try {
        [results, fields] = await connection.query(preparedInsert);
        [resultsJunct] = await addNewTransactionTag(results.insertId, transactionId, connection);
        
        return results.insertId;
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
    }
}

const addNewTransactionTag = async (tagId, transactionId, connection) => {
    const insertJunctionSql = 'INSERT INTO transaction_tag VALUES (?, ?)'

    const preparedInsert = mysql.format(insertJunctionSql, [tagId, transactionId]);

    try {
        [results, fields] = await connection.query(preparedInsert);
        
        return results;
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
        return executeQuery(querySql, [id]);
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
            throw new Error(`No Tag with those params was found`);
        }
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
    }
}

const deleteTag = async (id) => {
    let queryJuncSql = 'DELETE FROM transaction_tag where ';
    let querySql = 'DELETE from tag where ';

    if (id) {
        queryJuncSql += 'tagId = ?';
        querySql += `id = ?`;            
    
        try {
            await executeQuery(queryJuncSql, [id]);
            return executeQuery(querySql, [id]);
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
        if (tag[key]) {
            setStatement += `${key.replace('_', '')}=?,`;
            queryParams.push(tag[key]);
        }
    }

    setStatement = setStatement.slice(0, setStatement.length - 1); // removes last comma
    updateSql += setStatement + ' where id=?';
    queryParams.push(tag['id']);
    
    try {
        return executeQuery(updateSql, queryParams);
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
