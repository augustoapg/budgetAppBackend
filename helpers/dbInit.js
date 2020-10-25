/*
    This function was in dbUtils.js, but since it needed to call dao methods, I think it makes more sense to separate it.
    This is because DAO also requires dbUtils. So dbUtils would require a module that requires dbUtils.
*/

const createAndPopulateTables = async () => {
    const transactionDao = require('../daos/transactionDao');
    const categoryDao = require('../daos/categoryDao');
    const subcategoryDao = require('../daos/subcategoryDao');
    const tagDao = require('../daos/tagDao');
    
    try {
        const isCategoryTableNew = await categoryDao.createCategoryTable();
        console.log(isCategoryTableNew ? 'Table Category was created' : 'Table Category was already created');
        const isSubcategoryTableNew = await subcategoryDao.createSubCategoryTable();
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

module.exports = {
    createAndPopulateTables
}