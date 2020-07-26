const mysql = require('mysql2/promise');
const { promisify } = require('util');

const dbConfig = {
    host        : 'localhost',
    user        : 'root',
    password    : 'password',
    database    : 'budget'
}

const getNewId = async () => {
    const sqlQuery = 'SELECT MAX(id) as maximum FROM transactions';
    const connection = await mysql.createConnection(dbConfig);
    let results = null;

    try {
        [results, fields] = await connection.query(sqlQuery);
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
        return results[0].maximum+1;
    }
}

const addNewTransaction = async (transaction) => {
    let {id, type, who, category, title, date, value, notes} = transaction;
    const connection = await mysql.createConnection(dbConfig);

    id = await getNewId();

    const insertSql = 'INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const preparedInsert = mysql.format(insertSql, [id, type, who, category, title, date, value, notes]);

    try {
        await connection.query(preparedInsert);
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
        return id;
    }
}

const getAllTransactions = async () => {
    const connection = await mysql.createConnection(dbConfig);
    const querySql = 'SELECT * FROM transactions';

    try {
        [results, fields] = await connection.query(querySql);
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
        return results;
    }
}

const getTransactionById = async (id) => {
    const querySql = 'SELECT * from transactions where id=?';

    try {
        return executeQuery(querySql, [id]);
    } catch (error) {
        throw error;
    }
}

const getTransactionBy = async (queryObj) => {  
    let querySql = 'SELECT * from transactions';
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
        queryParams.push(queryObj[key]);
    }
    return queryParams;
}

const buildWhereStatement = (queryObj, condition = 'AND') => {
    let whereStatement = ' where ';

    for (let key in queryObj) {
        if (queryObj[key]) {
            whereStatement += `${key}=? ${condition} `;
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

        if (result.length > 0 || result.affectedRows > 0) {
            return result;
        } else {
            throw new Error(`No Transaction with those params was found`);
        }
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
    }
}

const deleteTransaction = async (id) => {
    let querySql = 'DELETE from transactions where ';

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

module.exports = {
    addNewTransaction: addNewTransaction,
    getAllTransactions: getAllTransactions,
    getTransactionById: getTransactionById,
    getTransactionBy: getTransactionBy,
    deleteTransaction: deleteTransaction
}

