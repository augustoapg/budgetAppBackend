const dbUtils = require('../helpers/dbUtils');

const createBudgetTable = async () => {
    const sql = `CREATE TABLE IF NOT EXISTS budget (
        subcategory INT NOT NULL,
        month VARCHAR2(20) NOT NULL,
        PRIMARY KEY (subcategory, month),
        FOREIGN KEY (subcategory) REFERENCES budget.subcategory(id)
    )`;

    try {
        return await dbUtils.executeSqlCreateTable(sql);        
    } catch (error) {
        throw error;
    }
}

const addNewBudget = async (subcategory, month) => {
    const insertSql = 'INSERT INTO budget (subcategory, month) VALUES (?, ?)';

    try {
        const result = await dbUtils.executeQuery(insertSql, [subcategory, month]);
        return result.insertId; // TODO: validate this for a composite key object
    } catch (error) {
        throw error;
    }
}

const getAllBudgets = async () => {
    const querySql = 'SELECT * FROM budget';

    try {
        return await dbUtils.executeQuery(querySql, []);
    } catch (error) {
        throw error;
    }
}

const getBudgetBy = async (queryObj) => {  
    let querySql = 'SELECT * from budget';
    let queryParams = dbUtils.getParams(queryObj);

    if (queryParams.length > 0) {
        querySql += dbUtils.buildWhereStatement(queryObj, 'AND');            
    
        try {
            return dbUtils.executeQuery(querySql, queryParams);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. All parameters were empty.');
    }
}

const deleteBudget = async (subcategory, month) => {
    let querySql = 'DELETE from budget where ';

    if (subcategory && month) {
        querySql += `subcategory = ? AND month`;            
    
        try {
            return await dbUtils.executeQuery(querySql, [subcategory, month]);
        } catch (error) {
            throw error;
        }
        
    } else {
        throw new Error('Invalid. Neither subcategory nor month can be empty.');
    }
};

const editBudget = async (budget) => {
    let updateSql = 'UPDATE budget';
    let queryParams = [];

    let setStatement = ' set ';

    for (let key in budget) {
        // TODO: REPLACE THIS BY A BETTER VALIDATION
        if (typeof(budget[key]) !== 'string' || (typeof(budget[key]) === 'string' && budget[key].trim() !== "")) {
            setStatement += `${key.replace('_', '')}=?,`;
            queryParams.push(budget[key]);
        } else {
            throw new Error(`Invalid. Field ${key} cannot be empty`);
        }
    }

    setStatement = setStatement.slice(0, setStatement.length - 1); // removes last comma
    updateSql += setStatement + ' where subcategory=? and month=?';
    
    try {
        queryParams.push(budget.subcategory, budget.month);
        return dbUtils.executeQuery(updateSql, queryParams);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createBudgetTable,
    addNewBudget,
    getAllBudgets,
    getBudgetBy,
    editBudget,
    deleteBudget
}