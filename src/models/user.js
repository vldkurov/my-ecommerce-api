const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');

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
        unique: true,
        validate: {
            isEmail: true,
        }
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
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    },
    timestamps: true, // if you are managing timestamps manually
    tableName: 'users',
});

User.prototype.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = User;
