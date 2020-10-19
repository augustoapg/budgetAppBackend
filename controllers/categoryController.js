const dao = require('../daos/categoryDao');
const { handleError, ErrorHandler } = require('../helpers/error');
const Category = require('../models/category');

const newCategory = async (req, res, next) => {
    const {name, type} = req.body;

    try {
        const newCategory = new Category(null, name, type);
        const id = await dao.addNewCategory(newCategory);
        res.send({
            id: id,
            message: `Category added with id ${id}`
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }    
}

const getAll = async (req, res, next) => {
    try {
        const allCategories = await dao.getAllCategories();
        res.send(allCategories);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const getBy = async (req, res, next) => {
    try {
        const {id, name, type} = req.query;
        const queryObj = {
            id: id,
            type: type,
            name: name
        }
        
        const category = await dao.getCategoryBy(queryObj);

        res.send(category);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const editCategory = async (req, res, next) => {
    const {id, name, type} = req.body;

    if (id) {
        try {
            const newCategory = new Category(id, name, type);
            await dao.editCategory(newCategory);
            res.send({
                message: `Category ${id} was updated successfully` 
            });
        } catch (e) {
            next(new ErrorHandler(500, e.message));
        }
    } else {
        next(new ErrorHandler(500, 'Id cannot be empty'));
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const id = req.query.id;
        const result = await dao.deleteCategory(id);
        res.send({
            message: `Category ${id} was deleted successfully` 
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

module.exports = {
    getAll,
    getBy,
    newCategory,
    editCategory,
    deleteCategory
}