class Budget {
    static dataDef = {
        subcategory: {
            type: "number",
            canBeEmpty: false
        },
        month: {
            type: "int",
            canBeEmpty: false
        },
        year: {
            type: "int",
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