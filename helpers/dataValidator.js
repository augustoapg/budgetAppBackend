// 
/**
 * can pass only a few fields. It will validate each according to dataDef passed. If not valid
 * it will throw an error with message according to what is not valid
 * @param {json} dataDef            json object stating the possible parameters, together with type and if that can be empty
 * @param {json} transactionFields  the parameter and value to be validated
 */
const validate = (dataDef, transactionFields) => {
    for (const key in transactionFields) {
        let value = transactionFields[key];
        if (dataDef[key].type === "string") {
            if (!dataDef[key].canBeEmpty && isStringEmpty(value)) {
                throw new Error(`Field ${key} cannot be empty.`);
            }
        } else if (dataDef[key].type === "number") {
            // TODO: Add check for negative
            if (typeof value !== "number") {
                throw new Error(`Field ${key} has to be a number.`);
            }
            if (!dataDef[key].canBeEmpty && !value) {
                throw new Error(`Field ${key} cannot be empty.`);
            }
        } else if (dataDef[key].type === "date") {
            try {
                const dateVal = new Date(value);
                if (!dateVal || !(dateVal instanceof Date)) {
                    throw new Error(`Field ${key} has to be a valid date.`);
                }
            } catch (error) {
                throw new Error(`Field ${key} has to be a valid date.`);
            }
        } else {
            if (!dataDef[key].canBeEmpty && !value) {
                throw new Error(`Field ${key} cannot be empty`);
            }
        }
    }
    return true;
}

const isStringEmpty = (value) => {
    return !value || value.trim() == ""
}

module.exports = {
    validate
}