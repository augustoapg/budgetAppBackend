const dao = require('../daos/budgetDao');
const { handleError, ErrorHandler } = require('../helpers/error');
const Budget = require('../models/budget');
const { validate } = require('../helpers/dataValidator');

const newBudget = async (req, res, next) => {
    try {
        if (validate(Budget.dataDef, req.body)) {
            const id = await dao.addNewBudget(req.body); // TODO: Validate this for a composite key object
            res.send({
                id: id,
                message: `Budget added with id ${id}`
            });
        }
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }    
}

const getAll = async (req, res, next) => {
    try {
        const allBudgets = await dao.getAllBudgets();
        res.send(allBudgets);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const getBy = async (req, res, next) => {
    try {
        const {subcategory, month,value} = req.query;
        const queryObj = {
            subcategory: subcategory,
            month: month,
            year: year,
            value: value
        }
        
        const budget = await dao.getBudgetBy(queryObj);

        res.send(budget);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const editBudget = async (req, res, next) => {
    try {
        if (validate(Budget.dataDef, req.body)) {
            await dao.editBudget(req.body);
            res.send({
                message: `Budget ${req.body.subcategory} - ${req.body.month}/${req.body.year} was updated successfully` 
            });
        }
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const deleteBudget = async (req, res, next) => {
    try {
        await dao.deleteBudget(req.body.subcategory, req.body.month);
        res.send({
            message: `Budget ${req.body.subcategory} - ${req.body.month}/${req.body.year} was deleted successfully` 
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

module.exports = {
    getAll,
    getBy,
    newBudget,
    editBudget,
    deleteBudget
}