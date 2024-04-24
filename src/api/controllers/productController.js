const {CategoryModel, ProductModel} = require("../../models");
const {findCategoryByName, sendSuccessResponse, sendErrorResponse} = require("../../heplers");


const getAllCategory = async (req, res) => {
    try {
        const categories = await CategoryModel.findAll({attributes: ['categoryId', 'name', 'description']});
        sendSuccessResponse(res, 200, categories);
    } catch (error) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
};

const getProductByCategory = async (req, res) => {
    const {category} = req.query;
    try {
        const queryOptions = {
            attributes: ['productId', 'name', 'description', 'price', 'stock'],
            include: [{
                model: CategoryModel,
                as: 'category',
                attributes: ['categoryId', 'name', 'description']
            }]
        };
        if (category) queryOptions.where = {categoryId: category};

        const products = await ProductModel.findAll(queryOptions);
        sendSuccessResponse(res, 200, products);
    } catch (error) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
};

const getProductByID = async (req, res) => {
    const {productId} = req.params;
    try {
        const product = await ProductModel.findByPk(productId, {
            attributes: ['productId', 'name', 'description', 'price', 'stock'],
            include: [{model: CategoryModel, as: 'category', attributes: ['categoryId', 'name', 'description']}]
        });

        product ? sendSuccessResponse(res, 200, product) : sendErrorResponse(res, 404, 'Product not found');
    } catch (error) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
};

const createProduct = async (req, res) => {
    const {name, description, price, stock, categoryName} = req.body;
    try {
        const category = await findCategoryByName(categoryName);
        if (!category) return sendErrorResponse(res, 404, 'Category not found');

        const newProduct = await ProductModel.create({
            name,
            description,
            price,
            stock,
            categoryId: category.categoryId
        });
        sendSuccessResponse(res, 201, newProduct);
    } catch (error) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
};

const updateProductByID = async (req, res) => {
    const {productId} = req.params;
    try {
        const [updated] = await ProductModel.update(req.body, {where: {productId}});
        updated > 0 ? sendSuccessResponse(res, 200, {message: 'Product updated successfully'}) : sendErrorResponse(res, 404, 'Product not found');
    } catch (error) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
};

const deleteProductByID = async (req, res) => {
    const {productId} = req.params;
    try {
        const deleted = await ProductModel.destroy({where: {productId}});
        deleted ? res.status(204).send() : sendErrorResponse(res, 404, 'Product not found');
    } catch (error) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
};

module.exports = {
    getProductByCategory,
    getProductByID,
    createProduct,
    updateProductByID,
    deleteProductByID,
    getAllCategory
};
