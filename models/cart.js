const {DataTypes} = require('sequelize');
const sequelize = require('../database/database');

const Cart = sequelize.define('Cart', {
    cartId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'carts',
});

module.exports = Cart;
