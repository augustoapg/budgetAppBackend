class Budget {
    static dataDef = {
        subcategory: {
            type: "number",
            canBeEmpty: false
        },
        month: {
            type: "string",
            canBeEmpty: false
        }
    }

    constructor (subcategory, month) {
        this.subcategory = subcategory;
        this.month = month;
    }
}