const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

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
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('price');
            return `£${rawValue}`;
        }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // Example statuses: pending, completed, cancelled
    }
}, {
    timestamps: true,
    tableName: 'orders',
});

module.exports = Order;
