const express = require('express');
const server = express();
const transactionDao = require('./daos/transactionDao');
const Transaction = require('./models/transaction');

server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/', (req, res) => {
    res.send('Backend root');
});

server.post('/newTransaction', async (req, res) => {
    const {type, who, category, title, date, value, notes} = req.body;

    try {
        const newTransaction = new Transaction(null, type, who, category, title, date, value, notes);
        const id = await transactionDao.addNewTransaction(newTransaction);
        res.send({id: id});
    } catch (e) {
        res.send(e.message);
    }    
});

server.get('/getAllTransactions', async (req, res) => {
    try {
        const allTransactions = await transactionDao.getAllTransactions();
        res.send(allTransactions);
    } catch (e) {
        res.send(e.message);
    }
});

server.get('/getTransactionsBy', async (req, res) => {
    try {
        const {id, type, who, category, title, dateMin, dateMax, valueMin, valueMax} = req.query;
        const queryObj = {
            id: id,
            type: type,
            who: who,
            category: category,
            title, title,
            dateMin: dateMin,
            dateMax: dateMax,
            valueMin: valueMin,
            valueMax: valueMax
        }
        // TODO: Validate fields
        
        const transaction = await transactionDao.getTransactionBy(queryObj);

        res.send(transaction);
    } catch (e) {
        res.send(e.message);
    }
});

// server.get('/getTransactionsByDateRange', async (req, res))

server.put('/editTransaction', async (req, res) => {
    const {id, type, who, category, title, date, value, notes} = req.body;

    if (id) {
        try {
            const newTransaction = new Transaction(id, type, who, category, title, date, value, notes);
            await transactionDao.editTransaction(newTransaction);
            res.send(`Transaction ${id} was updated successfully`);
        } catch (e) {
            res.send(e.message);
        }
    } else {
        res.send('Id cannot be empty');
    }
});

server.delete('/deleteTransaction', async (req, res) => {
    try {
        const id = req.query.id;
        const result = await transactionDao.deleteTransaction(id);
        res.send(`Transaction ${id} was deleted successfully`);
    } catch (e) {
        res.send(e.message);
    }
});

server.listen(4242, () => {
    console.log('Server running...')
});
