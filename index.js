const express = require('express');
const server = express();
const transactionDao = require('./daos/transactionDao');
const categoryDao = require('./daos/categoryDao')
const tagDao = require('./daos/tagDao')
const Transaction = require('./models/transaction');
const { handleError, ErrorHandler } = require('./helpers/error');

const transactionController = require('./controllers/transactionController');

const routes = require('./routes/index.route');
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(routes);

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});


server.get('/', (req, res, next) => {
    res.send('Backend root');
});

server.use((err, req, res, next) => {
    handleError(err, res);
});

server.listen(4242, () => {
    console.log('Server running...')
});

createAndPopulateTables();

async function createAndPopulateTables() {
    try {
        const isCategoryTableNew = await categoryDao.createCategoryTable();
        console.log(isCategoryTableNew ? 'Table Category was created' : 'Table Category was already created');
        const isSubcategoryTableNew = await categoryDao.createSubCategoryTable();
        console.log(isSubcategoryTableNew ? 'Table Subcategory was created' : 'Table Subcategory was already created');
        const isTransactionTableNew = await transactionDao.createTransactionTable();
        console.log(isTransactionTableNew ? 'Table Transaction was created' : 'Table Transaction was already created');
        const isTagTableNew = await tagDao.createTagTable();
        console.log(isTagTableNew ? 'Table Tag was created' : 'Table Tag was already created');

        if (isCategoryTableNew) {
            const categoryTablePopulation = await categoryDao.populateCategoryTable();
            console.log(`Table category has been populated with: ${categoryTablePopulation.info}`);
        }
    } catch (e) {
        console.log(e.message);
    }
}
