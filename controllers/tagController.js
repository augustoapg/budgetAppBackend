const Tag = require('../models/tag')
const dao = require('../daos/tagDao');
const { ErrorHandler } = require('../helpers/error');

const newTag = async (req, res, next) => {
    const {name} = req.body;
    
    try {
        // TODO: RETHINK THIS
        const tag = new Tag(null, name);
        const id = await dao.addNewTag(tag.name);
        res.send({
            id: id,
            message: `Tag added with id ${id}`
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const getAll = async (req, res, next) => {
    try {
        const allTags = await dao.getAllTags();
        res.send(allTags);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const getBy = async (req, res, next) => {
    const {id, name} = req.query;
    const queryObject = {
        id: id,
        name: name
    };

    try {
        const tags = await dao.getTagBy(queryObject);
        res.send(tags);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const editTag = async (req, res, next) => {
    const {id, name} = req.body;

    try {
        if (id != null && (name != null && typeof(name) === 'string' && name.trim() != '')) {
            await dao.editTag(id, {name: name});
            res.send({
                message: `Tag ${id} was updated successfully` 
            });
        }
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const deleteTag = async (req, res, next) => {
    try {
        const id = req.query.id;
        await dao.deleteTag(id);
        res.send({
            message: `Tag ${id} was deleted successfully`
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

module.exports = {
    newTag,
    getAll,
    getBy,
    editTag,
    deleteTag
}