const sequelize = require('./sequelize');
require('../models/index');

sequelize.sync({force: true})
    .then(() => {
        console.log('Database tables created successfully.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Failed to create database tables:', error);
        process.exit(1);
    });
