const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

const createTransactionTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(70) NOT NULL,
        type VARCHAR(45) NOT NULL,
        who VARCHAR(45) NOT NULL,
        date DATE NOT NULL,
        value DECIMAL(6,2) NOT NULL,
        notes VARCHAR(250) NOT NULL,
        subcategory INT NOT NULL,
        FOREIGN KEY (subcategory) REFERENCES budget.subcategory(id)
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

const addNewTransaction = async (transaction) => {
    let {type, who, subcategory, title, date, value, notes} = transaction;
    const connection = await mysql.createConnection(dbConfig);

    const insertSql = 'INSERT INTO transactions (title, type, who, date, value, notes, subcategory) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const preparedInsert = mysql.format(insertSql, [title, type, who, date, value, notes, subcategory]);

    try {
        [results, fields] = await connection.query(preparedInsert);
        return results.insertId;
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
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

const editTransaction = async (transaction) => {
    let updateSql = 'UPDATE transactions';
    let queryParams = [];

    let setStatement = ' set ';

    for (let key in transaction) {
        if (transaction[key]) {
            setStatement += `${key.replace('_', '')}=?,`;
            queryParams.push(transaction[key]);
        }
    }

    setStatement = setStatement.slice(0, setStatement.length - 1); // removes last comma
    updateSql += setStatement + ' where id=?';
    queryParams.push(transaction['id']);
    
    try {
        return executeQuery(updateSql, queryParams);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createTransactionTable,
    addNewTransaction,
    getAllTransactions,
    getTransactionById,
    getTransactionBy,
    deleteTransaction,
    editTransaction
}
