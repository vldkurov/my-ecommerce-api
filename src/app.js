require('dotenv').config({path: '../.env'});
const config = require('./config/config').development; // Or dynamically determine the environment

const express = require('express');
const cors = require('cors');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const app = express();
const logger = require('morgan');
const {sequelize} = require("./models");
const PORT = config.port || 3000;

// Express session
app.use(
    session({
        secret: config.secret,
        saveUninitialized: true,
        resave: false,
    })
);

app.use(flash());
// Set global variables (optional)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/static', express.static('public'));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());

// Import routes
const userRoutes = require('./api/routes/userRoutes');
const productRoutes = require('./api/routes/productRoutes');
const accountRoutes = require('./api/routes/accountRoutes')
const cartRoutes = require('./api/routes/cartRoutes')
const orderRoutes = require('./api/routes/orderRoutes')
const {isAuthenticated} = require("./api/middlewares");

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/carts', cartRoutes)
app.use('/api/orders', orderRoutes)

app.get('/', (req, res) => {
    res.send('Hello World! Welcome to The E-commerce API');
});

app.get('/protected', isAuthenticated, (req, res) => {
    res.json({message: 'This is a protected route'});
});

app.get('/error', () => {
    throw new Error('This is a test error.');
});


app.use((err, req, res) => {
    console.error(err.stack); // Always log the error stack

    const statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: err.message,
            stack: err.stack,
        });
    } else {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: 'Internal Server Error',
        });
    }
});


// Synchronize models with the database
sequelize.sync({force: false}).then(() => {
    console.log('Database & tables created!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
    console.error('Unable to sync database:', err);
});
