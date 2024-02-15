const {DataTypes} = require('sequelize');
const sequelize = require('../database/database');

const Order = sequelize.define('Order', {
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // totalPrice: {
    //     type: DataTypes.DECIMAL(10, 2),
    //     allowNull: false
    // },
    // currency: {
    //     type: DataTypes.STRING(3), // For ISO currency codes like 'GBP', 'USD', etc.
    //     allowNull: false
    // },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // Example statuses: pending, completed, cancelled
    }
}, {
    timestamps: true,
    tableName: 'orders',
});

module.exports = Order;
