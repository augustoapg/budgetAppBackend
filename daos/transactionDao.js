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
    const connection = await mysql.createConnection(dbConfig);
    const querySql = 'SELECT * from transactions where id=?';
    const prepSql = mysql.format(querySql, [id]);

    try {
        [result, fields] = await connection.query(prepSql);

        if (result.length > 0) {
            return result;
        } else {
            throw new Error(`Transaction with id ${id} not found`);
        }
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
    }
}

module.exports = {
    addNewTransaction: addNewTransaction,
    getAllTransactions: getAllTransactions,
    getTransactionById: getTransactionById
}

