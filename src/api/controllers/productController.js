const {CategoryModel, ProductModel} = require("../../models");
const getProductByCategory = async (req, res) => {
    const {category} = req.query;
    try {
        const queryOptions = {
            include: [{
                model: CategoryModel,
                as: 'category',
                attributes: ['name', 'description']
            }]
        };
        if (category) {
            queryOptions.where = {categoryId: category};
        }
        const products = await ProductModel.findAll(queryOptions);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
}

const getProductByID = async (req, res) => {
    const {productId} = req.params;
    try {
        const product = await ProductModel.findByPk(productId, {
            include: [{
                model: CategoryModel,
                as: 'category',
                attributes: ['name', 'description']
            }]
        });
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {getProductByCategory, getProductByID}