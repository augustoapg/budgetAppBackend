class SubCategory {
    static dataDef = {
        id: {
            type: "number",
            canBeEmpty: false
        },
        name: {
            type: "string",
            canBeEmpty: false
        },
        category: {
            type: "string",
            canBeEmpty: false
        }
    };

    constructor(id, name, category) {
        this.id = id;
        this.name = name;
        this.category = category;
    }
}

module.exports = SubCategory