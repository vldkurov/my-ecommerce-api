const {DataTypes} = require('sequelize');
const sequelize = require('../database/database');

const CartItem = sequelize.define('CartItem', {
    cartItemId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    timestamps: true,
    tableName: 'cart_items',
});

module.exports = CartItem;
