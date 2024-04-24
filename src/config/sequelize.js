const {Sequelize} = require('sequelize');
const config = require('./config');

const useSSL = process.env.NODE_ENV === 'production';


const sequelizeOptions = {
    host: config.host,
    dialect: config.dialect,
    logging: false,
};


if (useSSL) {
    sequelizeOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    };
}

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    sequelizeOptions
);

module.exports = sequelize;
