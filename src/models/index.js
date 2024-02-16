const sequelize = require('../config/sequelize');
const UserModel = require('./user');
const ProductModel = require('./product');
const CartModel = require('./cart');
const CartItemModel = require('./cartItem');
const OrderModel = require('./order');
const OrderDetailModel = require('./orderDetail');
const CategoryModel = require('./category')

// User and Order associations
UserModel.hasMany(OrderModel, {foreignKey: 'userId'});
OrderModel.belongsTo(UserModel, {foreignKey: 'userId'});

// Cart and User (assuming one-to-one for simplicity)
UserModel.hasOne(CartModel, {foreignKey: 'userId'});
CartModel.belongsTo(UserModel, {foreignKey: 'userId'});

// Cart and CartItem associations
CartModel.hasMany(CartItemModel, {foreignKey: 'cartId'});
CartItemModel.belongsTo(CartModel, {foreignKey: 'cartId'});

// Order and OrderDetail associations
OrderModel.hasMany(OrderDetailModel, {foreignKey: 'orderId'});
OrderDetailModel.belongsTo(OrderModel, {foreignKey: 'orderId'});

// Product and CartItem (many-to-many through CartItem)
ProductModel.belongsToMany(CartModel, {through: CartItemModel, foreignKey: 'productId'});
CartModel.belongsToMany(ProductModel, {through: CartItemModel, foreignKey: 'cartId'});

// Product and OrderDetail (many-to-many through OrderDetail)
ProductModel.belongsToMany(OrderModel, {through: OrderDetailModel, foreignKey: 'productId'});
OrderModel.belongsToMany(ProductModel, {through: OrderDetailModel, foreignKey: 'orderId'});

// Product and Category
ProductModel.belongsTo(CategoryModel, {foreignKey: 'categoryId', as: 'category'});
CategoryModel.hasMany(ProductModel, {foreignKey: 'categoryId', as: 'products'});


module.exports = {
    sequelize,
    UserModel,
    ProductModel,
    CartModel,
    CartItemModel,
    OrderModel,
    OrderDetailModel,
    CategoryModel
};
