const {Sequelize} = require('sequelize');
const config = require('./config').development; // Or dynamically determine the environment

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password, {
        host: config.host,
        dialect: config.dialect,
        logging: false,
        // Additional Sequelize configuration
    });

module.exports = sequelize;

