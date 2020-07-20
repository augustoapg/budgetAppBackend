const mysql = require('mysql');
const { promisify } = require('util');

const connection = mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    password    : 'password',
    database    : 'budget'
});

const getNewId = () => {
    const sqlQuery = 'SELECT MAX(id) FROM transactions';

    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            connection.end();
            throw error;
        }

        return results+1;
    });
}

module.exports = {
    addNewTransaction: async (transaction) => {
        let {id, type, who, category, title, date, value, notes} = transaction;

        // get next Id
        // TODO: modularize this (handle async)
        const getIdQuery = 'SELECT MAX(id) as maximum FROM transactions';

        connection.query(getIdQuery, (error, results, fields) => {
            if (error) {
                connection.end();
                throw error;
            }

            id = results[0].maximum+1

            const insertSql = 'INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const preparedInsert = mysql.format(insertSql, [id, type, who, category, title, date, value, notes]);

            connection.query(preparedInsert, (error, results, fields) => {
                if (error) {
                    connection.end();
                    throw error;
                }
                    
                console.log('added successfully');
                connection.end();
            });
        });

        
    }
}

