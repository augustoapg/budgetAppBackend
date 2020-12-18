const dao = require('../daos/transactionDao');
const subcategoryDao = require('../daos/subCategoryDao');
const categoryDao = require('../daos/categoryDao');
const tagDao = require('../daos/tagDao');
const { handleError, ErrorHandler } = require('../helpers/error');
const Transaction = require('../models/transaction');
const { validate } = require('../helpers/dataValidator');

const newTransaction = async (req, res, next) => {
    try {
        let tags = null;
        let exptMessage = '';

        if ("tags" in req.body) {
            tags = req.body.tags;
            delete req.body.tags; // delete tags from the request body for remaining the transaction object
        }
        if (validate(Transaction.dataDef, req.body)) {
            const id = await dao.addNewTransaction(req.body);
    
            if (tags != null) {
                for (const tagId of tags) {
                    if (typeof(tagId) === "number") {
                        try {
                            // checks if tag exists. If it does, add transactionTag. If not, write exception message
                            let tag = await tagDao.getTagBy({id: tagId});
                            
                            if (!tag[0]) {
                                exptMessage += ` Tag with id ${tagId} does not exist.`
                            } else {
                                await dao.addNewTransactionTag(tagId, id);
                            }

                        } catch (error) {
                            next(new ErrorHandler(500, error.message));
                        }
                    }
                };
            }
            res.send({
                id: id,
                message: `Transaction added with id ${id}. ${exptMessage}`
            });
        }
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }    
}

const getAll = async (req, res, next) => {
    try {
        const allTransactions = await dao.getAllTransactions();
        const transactionsJSON = await createJSON(allTransactions);
        res.send(transactionsJSON);
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
        
        const transactions = await dao.getTransactionBy(queryObj);
        const transactionsJSON = await createJSON(transactions);

        res.send(transactionsJSON);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const editTransaction = async (req, res, next) => {
    const fieldsToBeEdited = req.body;

    if (fieldsToBeEdited.id) {
        try {
            if (validate(Transaction.dataDef, fieldsToBeEdited)) {
                await dao.editTransaction(fieldsToBeEdited);

                if (fieldsToBeEdited.tagId != null && typeof(fieldsToBeEdited.tagId === "number")) {
                    await dao.editTransactionTag(id, fieldsToBeEdited.tagId);
                }
                res.send({
                    message: `Transaction ${fieldsToBeEdited.id} was updated successfully` 
                });
            }
            
        } catch (e) {
            next(new ErrorHandler(500, e.message));
        }
    } else {
        next(new ErrorHandler(500, 'Transaction id cannot be empty'));
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

// creates JSON to be sent back, including sub-objects (subcategory and category)
const createJSON = async (transactions) => {
    for (let i = 0; i < transactions.length; i++) {
        let trans = transactions[i];
        trans.subcategory = await subcategoryDao.getSubCategoryBy({id: trans.subcategory});
        trans.subcategory[0].category = await categoryDao.getCategoryBy({name: trans.subcategory[0].category});

        let transTags = await dao.getTransactionTagBy({transactionId: trans.id});

        if (transTags.length > 0) {
            let tags = []
            for (let j = 0; j < transTags.length; j++) {
                console.log(transTags[j])
                let tag = await tagDao.getTagBy({id: transTags[j].tagId});
                tags.push(tag[0]);
            }
            trans.tag = tags;
        }
    }
    return transactions;
}

module.exports = {
    getAll,
    getBy,
    newTransaction,
    editTransaction,
    deleteTransaction
}