class Budget {
    static dataDef = {
        subcategory: {
            type: "number",
            canBeEmpty: false
        },
        month: {
            type: "number",
            canBeEmpty: false
        },
        year: {
            type: "number",
            canBeEmpty: false
        },
        value: {
            type: "double",
            canBeEmpty: false
        }
    }

    constructor (subcategory, month, year, value) {
        this.subcategory = subcategory;
        this.month = month;
        this.year = year;
        this.value = value;
    }
}

module.exports = Budget;