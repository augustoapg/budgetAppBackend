const transactionDao = require('../daos/transactionDao');
const categoryDao = require('../daos/categoryDao');
const subcategoryDao = require('../daos/subcategoryDao');
const tagDao = require('../daos/tagDao');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

const getParams = (queryObj) => {
    let queryParams = [];
    for (let key in queryObj) {
        if(queryObj[key]) {
            queryParams.push(queryObj[key]);
        }
    }
    return queryParams;
}

const buildWhereStatement = (queryObj, condition = 'AND') => {
    let whereStatement = ' where ';
    let operator = '=';

    for (let key in queryObj) {
        if (queryObj[key]) {
            if (key === 'dateMin' || key === 'valueMin') {
                operator = '>=';
                key = key.slice(0, key.length - 3); // removes Min to match column name
            } else if (key === 'dateMax' || key === 'valueMax') {
                operator = '<=';
                key = key.slice(0, key.length - 3); // removes Max to match column name
            }

            whereStatement += `${key}${operator}? ${condition} `;
            operator = '='; // reset
        }
    }

    whereStatement = whereStatement.slice(0, whereStatement.length - 4); // removes last AND
    return whereStatement;
}

const executeQuery = async (querySql, queryParams) => {
    const connection = await mysql.createConnection(dbConfig);
    const prepSql = mysql.format(querySql, queryParams);

    try {
        [result, fields] = await connection.query(prepSql);

        if (result && result.length > 0 || result.affectedRows > 0) {
            return result;
        } else {
            throw new Error(`No object with those params was found`);
        }
    } catch (error) {
        throw error;
    } finally {
        await connection.end();
    }
}

async function createAndPopulateTables() {
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
    getParams,
    buildWhereStatement,
    executeQuery,
    createAndPopulateTables
}