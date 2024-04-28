require('dotenv').config({path: '../.env'});
const config = require('./config/config');

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const flash = require('connect-flash');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const sequelize = require('./config/sequelize');
const helmet = require('helmet');
require('./config/passport');


const PORT = config.port || 3000;

// const {mergeYAMLFiles} = require('./utils/mergeYAMLFiles')

// mergeYAMLFiles()

const whitelist = ['https://thunderous-moxie-f4ffbe.netlify.app', 'https://main--thunderous-moxie-f4ffbe.netlify.app', 'https://my-ecommerce-client.vercel.app', 'http://localhost:3000'];


// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        console.log("Origin of request " + origin);
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("Origin permissible");
            callback(null, true);
        } else {
            console.log("Origin blocked by CORS");
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: [
        'Access-Control-Allow-Origin',
        'Content-Type',
        'Authorization',
    ],
};


app.use(flash());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],  // Allows inline scripts
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        }
    }
}));

// app.use('/static', express.static('public'));
app.use(express.static('public'));

app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());

// Import routes
const userRoutes = require('./api/routes/userRoutes');
const productRoutes = require('./api/routes/productRoutes');
const accountRoutes = require('./api/routes/accountRoutes')
const cartRoutes = require('./api/routes/cartRoutes')
const orderRoutes = require('./api/routes/orderRoutes')
const {handlePaymentSuccess, handlePaymentCancellation} = require("./api/controllers");
const {isAuthenticated} = require("./api/middlewares");

const swaggerDocument = YAML.load(path.join(__dirname, '..', 'docs', 'api-docs.yaml'));

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/carts', cartRoutes)
app.use('/api/orders', orderRoutes)

// app.get('/success', isAuthenticated, handlePaymentSuccess);
app.get('/success', handlePaymentSuccess);
app.get('/cancel', handlePaymentCancellation);

app.get('/', (req, res) => {
    res.send('Hello World! Welcome to The E-commerce API');
});

app.get('/protected', isAuthenticated, (req, res) => {
    res.json({message: 'This is a protected route'});
});

app.get('/error', () => {
    throw new Error('This is a test error.');
});

app.get("/health", (req, res) => {
    res.sendStatus(200)
});

const ERROR_MESSAGE = 'Something broke!';
const NOT_FOUND_MESSAGE = 'Not Found';

const INTERNAL_SERVER_ERROR_STATUS = 500;
const NOT_FOUND_STATUS = 404;

const handleErrors = (err, req, res) => {
    console.error(err.stack);
    res.status(INTERNAL_SERVER_ERROR_STATUS).send(ERROR_MESSAGE);
};

const handleNotFound = (req, res) => {
    res.status(NOT_FOUND_STATUS).send(NOT_FOUND_MESSAGE);
};

app.use(handleErrors);
app.use(handleNotFound);

sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
