const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize'); // Adjust the path as necessary

const Product = sequelize.define('Product', {
    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('price');
            return `£${rawValue}`;
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'categoryId',
        }
    }
}, {
    timestamps: true,
    tableName: 'products',
});

module.exports = Product;
