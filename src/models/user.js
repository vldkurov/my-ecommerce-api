const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize'); // Adjust the path as necessary

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        validate: {
            isIn: {
                args: [['admin', 'editor', 'user']],
                msg: "Must be a valid role"
            }
        }
    }
}, {
    // Sequelize options
    timestamps: true, // if you are managing timestamps manually
    tableName: 'users',
});

module.exports = User;
