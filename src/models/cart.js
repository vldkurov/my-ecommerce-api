const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const Cart = sequelize.define('Cart', {
    cartId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // name of the Users table
            key: 'userId', // key in the Users table that userId references
        },
        onDelete: 'CASCADE'
    }
}, {
    timestamps: true,
    tableName: 'carts',
    indexes: [
        {
            name: 'idx_carts_userId', // Naming the index
            fields: ['userId'], // Specifying the field for the index
        },
        // Add more indexes as needed
    ],
});

module.exports = Cart;
