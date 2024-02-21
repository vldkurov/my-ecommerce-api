// Helper function to find a category by name


const {CategoryModel} = require("../models");

async function findCategoryByName(name) {
    return CategoryModel.findOne({where: {name: name}});
}

module.exports = findCategoryByName