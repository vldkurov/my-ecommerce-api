const {sequelize} = require("../models");

// Database connection test
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection().then(() => console.log('Database test connection pass.'));