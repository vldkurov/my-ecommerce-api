const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

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
    indexes: [
        {
            name: 'idx_cart_items_cartId', // Naming the index
            fields: ['cartId'], // Specifying the field for the index
        },
        {
            name: 'idx_cart_items_productId', // Naming the index
            fields: ['productId'], // Specifying the field for the index
        },
        // Add more indexes as needed
    ],
});

module.exports = CartItem;
