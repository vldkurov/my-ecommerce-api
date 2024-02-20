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
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Note: Setting this to false is not recommended for production as it allows for MITM attacks.
                // For better security, use the CA certificate provided by your database host or a trusted CA.
            }
        },
    });

// Test the connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection().then(() => console.log('Test connection pass.'));

module.exports = sequelize;

