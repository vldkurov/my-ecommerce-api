const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize'); // Adjust the path as necessary


const Category = sequelize.define('Category', {
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: DataTypes.STRING
}, {
    timestamps: true,
    tableName: 'categories',
});

module.exports = Category