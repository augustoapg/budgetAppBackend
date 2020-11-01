const dao = require('../daos/transactionDao');
const subcategoryDao = require('../daos/subCategoryDao');
const categoryDao = require('../daos/categoryDao');
const { handleError, ErrorHandler } = require('../helpers/error');
const Transaction = require('../models/transaction')

const newTransaction = async (req, res, next) => {
    const {type, who, subcategory, title, date, value, notes, tagId} = req.body;

    try {
        const newTransaction = new Transaction(null, type, who, subcategory, title, date, value, notes);
        const id = await dao.addNewTransaction(newTransaction);

        if (tagId != null && typeof(tagId) === "number") {
            await dao.addNewTransactionTag(tagId, id);
        }
        res.send({
            id: id,
            message: `Transaction added with id ${id}`
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }    
}

const getAll = async (req, res, next) => {
    try {
        const allTransactions = await dao.getAllTransactions();

        for (i = 0; i < allTransactions.length; i++) {
            let trans = allTransactions[i];
            trans.subcategory = await subcategoryDao.getSubCategoryBy({id: trans.subcategory});
            trans.subcategory[0].category = await categoryDao.getCategoryBy({id: trans.subcategory[0].category});
        }
        res.send(allTransactions);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const getBy = async (req, res, next) => {
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
        
        const transaction = await dao.getTransactionBy(queryObj);

        res.send(transaction);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const editTransaction = async (req, res, next) => {
    const {id, type, who, subcategory, title, date, value, notes, tagId} = req.body;

    if (id) {
        try {
            const newTransaction = new Transaction(id, type, who, subcategory, title, date, value, notes);
            await dao.editTransaction(newTransaction);

            if (tagId != null && typeof(tagId === "number")) {
                await dao.editTransactionTag(id, tagId);
            }
            res.send({
                message: `Transaction ${id} was updated successfully` 
            });
        } catch (e) {
            next(new ErrorHandler(500, e.message));
        }
    } else {
        next(new ErrorHandler(500, 'Id cannot be empty'));
    }
}

const deleteTransaction = async (req, res, next) => {
    try {
        const id = req.query.id;
        const result = await dao.deleteTransaction(id);
        res.send({
            message: `Transaction ${id} was deleted successfully` 
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

module.exports = {
    getAll,
    getBy,
    newTransaction,
    editTransaction,
    deleteTransaction
}