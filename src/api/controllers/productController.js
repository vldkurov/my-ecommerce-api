const {CategoryModel, ProductModel} = require("../../models");
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
            attributes: ['productId', 'name', 'description', 'price', 'stock'],
            include: [{
                model: CategoryModel,
                as: 'category',
                attributes: ['categoryId', 'name', 'description']
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

const createProduct = async (req, res) => {
    const {name, description, price, stock, categoryName} = req.body;
    try {

        const category = await CategoryModel.findOne({where: {name: categoryName}});
        if (!category) {
            return res.status(404).send('Category not found');
        }

        const newProduct = await ProductModel.create({
            name,
            description,
            price,
            stock,
            categoryId: category.categoryId
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating new product:', error);
        res.status(500).send('Internal Server Error');
    }
}

const updateProductByID = async (req, res) => {
    const {productId} = req.params;
    try {
        const updated = await ProductModel.update(req.body, {
            where: {productId}
        });
        if (updated[0] > 0) { // Sequelize возвращает массив, где первый элемент - количество обновленных строк
            res.status(200).json({message: 'Product updated successfully'});
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Internal Server Error');
    }
}

const deleteProductByID = async (req, res) => {
    const {productId} = req.params;
    try {
        const deleted = await ProductModel.destroy({
            where: {productId}
        });
        if (deleted) {
            res.status(204).send('Product deleted successfully');
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {getProductByCategory, getProductByID, createProduct, updateProductByID, deleteProductByID}