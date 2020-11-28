const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const dbUtils = require('../helpers/dbUtils');

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
        [results, fields] = await connection.execute(sql);
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

    const insertSql = 'INSERT INTO transactions (title, type, who, date, value, notes, subcategory) VALUES (?, ?, ?, ?, ?, ?, ?)';

    try {
        const result = await dbUtils.executeQuery(insertSql, [title, type, who, date, value, notes, subcategory]);
        return result.insertId;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const addNewTransactionTag = async (tagId, transactionId) => {
    const insertJunctionSql = 'INSERT INTO transaction_tag VALUES (?, ?)';

    try {
        const result = await dbUtils.executeQuery(insertJunctionSql, [tagId, transactionId]);
        return result;
    } catch (error) {
        if (error.errno === 1452) {
            error.message = "Tag was not found with this id. Please create tag first.";
        }
        throw error;
    }
}

const getAllTransactions = async () => {
    const querySql = 'SELECT * FROM transactions';

    try {
        return await dbUtils.executeQuery(querySql, []);
    } catch (error) {
        throw error;
    }
}

const getTransactionBy = async (queryObj) => {  
    let querySql = 'SELECT * from transactions';
    let queryParams = dbUtils.getParams(queryObj);

    if (queryParams.length > 0) {
        querySql += dbUtils.buildWhereStatement(queryObj, 'AND');            
    
        try {
            return dbUtils.executeQuery(querySql, queryParams);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. All transaction parameters were empty.');
    }
}

const getTransactionTagBy = async (queryObj) => {  
    let querySql = 'SELECT * from transaction_tag';
    let queryParams = dbUtils.getParams(queryObj);

    if (queryParams.length > 0) {
        querySql += dbUtils.buildWhereStatement(queryObj, 'AND');            
    
        try {
            return dbUtils.executeQuery(querySql, queryParams);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. All transactionTag parameters were empty.');
    }
}

const deleteTransaction = async (id) => {
    let querySql = 'DELETE from transactions where ';

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
        return dbUtils.executeQuery(updateSql, queryParams);
    } catch (error) {
        throw error;
    }
};

const editTransactionTag = async (id, tagId) => {
    let updateSql = 'UPDATE transaction_tag set tagId=? where transactionId=?';
    let queryParams = [id, tagId];
    
    try {
        return dbUtils.executeQuery(updateSql, queryParams);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createTransactionTable,
    addNewTransaction,
    addNewTransactionTag,
    getAllTransactions,
    getTransactionBy,
    getTransactionTagBy,
    deleteTransaction,
    editTransaction,
    editTransactionTag
}
