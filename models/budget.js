class Budget {
    static dataDef = {
        subcategory: {
            type: "number",
            canBeEmpty: false
        },
        month: {
            type: "string",
            canBeEmpty: false
        },
        value: {
            type: "double",
            canBeEmpty: false
        }
    }

    constructor (subcategory, month, value) {
        this.subcategory = subcategory;
        this.month = month;
        this.value = value;
    }
}