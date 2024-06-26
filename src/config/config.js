require('dotenv').config()

const environments = {
    development: {
        port: process.env.PORT,
        domain_url: process.env.DOMAIN_URL,
        client_url: process.env.CLIENT_URL,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        secret: process.env.SECRET,
        jwt_secret: process.env.JWT_SECRET,
        refresh_secret: process.env.REFRESH_SECRET,
        google_oauth_client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        google_oauth_client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        google_dummy_password: process.env.GOOGLE_DUMMY_PASSWORD,
        stripe_secret: process.env.STRIPE_SECRET_KEY,
    },
    production: {
        port: process.env.PROD_PORT,
        domain_url: process.env.PROD_DOMAIN_URL,
        client_url: process.env.PROD_CLIENT_URL,
        username: process.env.PROD_DB_USERNAME,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_DATABASE,
        host: process.env.PROD_DB_HOST,
        dialect: process.env.PROD_DB_DIALECT,
        secret: process.env.PROD_SECRET,
        jwt_secret: process.env.PROD_JWT_SECRET,
        refresh_secret: process.env.PROD_REFRESH_SECRET,
        google_oauth_client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        google_oauth_client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        google_dummy_password: process.env.GOOGLE_DUMMY_PASSWORD,
        stripe_secret: process.env.STRIPE_SECRET_KEY,
    },
    // other environments...
};

const env = process.env.NODE_ENV || 'development';

module.exports = environments[env];
