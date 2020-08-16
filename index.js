const express = require('express');
const server = express();
const transactionDao = require('./daos/transactionDao');
const categoryDao = require('./daos/categoryDao')
const Transaction = require('./models/transaction');
const { handleError, ErrorHandler } = require('./helpers/error');

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/', (req, res, next) => {
    res.send('Backend root');
});

server.post('/newTransaction', async (req, res, next) => {
    const {type, who, subcategory, title, date, value, notes} = req.body;

    try {
        const newTransaction = new Transaction(null, type, who, subcategory, title, date, value, notes);
        const id = await transactionDao.addNewTransaction(newTransaction);
        res.send({
            id: id,
            message: `Transaction added with id ${id}`
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }    
});

server.get('/getAllTransactions', async (req, res, next) => {
    try {
        const allTransactions = await transactionDao.getAllTransactions();
        res.send(allTransactions);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
});

server.get('/getTransactionsBy', async (req, res, next) => {
    try {
        const {id, type, who, subcategory, title, dateMin, dateMax, valueMin, valueMax} = req.query;
        const queryObj = {
            id: id,
            type: type,
            who: who,
            subcategory: subcategory,
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
        next(new ErrorHandler(500, e.message));
    }
});

server.put('/editTransaction', async (req, res, next) => {
    const {id, type, who, subcategory, title, date, value, notes} = req.body;

    if (id) {
        try {
            const newTransaction = new Transaction(id, type, who, subcategory, title, date, value, notes);
            await transactionDao.editTransaction(newTransaction);
            res.send({
                message: `Transaction ${id} was updated successfully` 
            });
        } catch (e) {
            next(new ErrorHandler(500, e.message));
        }
    } else {
        next(new ErrorHandler(500, 'Id cannot be empty'));
    }
});

server.delete('/deleteTransaction', async (req, res, next) => {
    try {
        const id = req.query.id;
        const result = await transactionDao.deleteTransaction(id);
        res.send({
            message: `Transaction ${id} was deleted successfully` 
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
});

server.use((err, req, res, next) => {
    handleError(err, res);
});

server.listen(4242, () => {
    console.log('Server running...')
});

createAndPopulateTables();

async function createAndPopulateTables(next) {
    try {
        const categoryTableCreation = await categoryDao.createCategoryTable();
        const subCategoryTableCreation = await categoryDao.createSubCategoryTable();
        const transactionTableCreation = await transactionDao.createTransactionTable();
        console.log(categoryTableCreation);
        console.log(subCategoryTableCreation);
        console.log(transactionTableCreation);

        const categoryTablePopulation = await categoryDao.populateCategoryTable();
        // const subcategoryTablePopulation = await categoryDao.populateSubcategoryTable();
        console.log(categoryTablePopulation);
        // console.log(subcategoryTablePopulation);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}
