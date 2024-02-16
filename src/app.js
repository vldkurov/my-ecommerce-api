require('dotenv').config({path: '../.env'});
const config = require('./config/config').development; // Or dynamically determine the environment

const express = require('express');
const session = require('express-session');
const passport = require('passport');
// Passport Config
require('./config/passport')(passport);
const app = express();
const logger = require('morgan');
const {sequelize} = require("./models");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Express session
app.use(
    session({
        secret: config.secret, // Use an environment variable for the secret in production
        resave: true,
        saveUninitialized: true,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());

// Import routes
const userRoutes = require('./api/routes/userRoutes');

// Use routes
app.use('/api/users', userRoutes);


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
