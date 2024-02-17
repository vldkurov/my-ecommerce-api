const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const OrderDetail = sequelize.define('OrderDetail', {
    orderDetailId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('price');
            return `£${rawValue}`;
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    timestamps: true,
    tableName: 'order_details',
});

module.exports = OrderDetail;
