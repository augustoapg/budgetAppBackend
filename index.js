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

server.post('/newTransaction', (req, res) => {
    const {type, who, category, title, date, value, notes} = req.body;

    try {
        const newTransaction = new Transaction(null, type, who, category, title, date, value, notes);
        transactionDao.addNewTransaction(newTransaction);
        console.log('Object created');
        res.send('Success!');
    } catch (e) {
        console.log(e)
        res.send(e);
    }
    console.log(req.body);
    
});

server.listen(4242, () => {
    console.log('Server running...')
});
