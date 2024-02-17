require('dotenv').config({path: '../../.env'});

module.exports = {
    development: {
        port: process.env.PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        secret: process.env.SECRET,
        jwt_secret: process.env.JWT_SECRET,
    },
    production: {
        // Similar structure, but values might come from different environment variables or secrets management
    },
    // other environments...
};
