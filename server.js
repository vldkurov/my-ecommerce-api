require('dotenv').config()

const express = require('express');
const app = express();
const logger = require('morgan');
const {sequelize} = require("./models");
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! Welcome to My E-commerce API');
});

// Synchronize models with the database
sequelize.sync({force: false}).then(() => {
    console.log('Database & tables created!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
    console.error('Unable to sync database:', err);
});
