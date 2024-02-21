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
            rejectUnauthorized: true // Внимание: для лучшей безопасности следует использовать CA сертификат
        }
    };
}

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    sequelizeOptions
);

// Тестирование соединения
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection().then(() => console.log('Database test connection pass.'));

module.exports = sequelize;
