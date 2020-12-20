const dao = require('../daos/budgetDao');
const subcategoryDao = require('../daos/subCategoryDao');
const categoryDao = require('../daos/categoryDao');
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
        const budgetsJson = await createJSON(allBudgets);
        res.send(budgetsJson);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const getBy = async (req, res, next) => {
    try {
        const {subcategory, month, year, value} = req.query;
        const queryObj = {
            subcategory: subcategory,
            month: month,
            year: year,
            value: value
        }
        
        const budget = await dao.getBudgetBy(queryObj);
        const budgetJson = await createJSON(budget);
        res.send(budgetJson);
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

// creates JSON to be sent back, including sub-objects (subcategory and category)
const createJSON = async (budgets) => {
    for (let i = 0; i < budgets.length; i++) {
        let bgt = budgets[i];
        bgt.subcategory = await subcategoryDao.getSubCategoryBy({id: bgt.subcategory});
        bgt.subcategory[0].category = await categoryDao.getCategoryBy({name: bgt.subcategory[0].category});
    }
    return budgets;
}

module.exports = {
    getAll,
    getBy,
    newBudget,
    editBudget,
    deleteBudget
}