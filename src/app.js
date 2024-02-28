require('dotenv').config({path: '../.env'});
const config = require('./config/config');

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const flash = require('connect-flash');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const {sequelize} = require("./models");
require('./config/passport')(passport);

const PORT = config.port || 3000;

const {mergeYAMLFiles} = require('./utils/mergeYAMLFiles')

mergeYAMLFiles()

app.use(flash());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// app.use('/static', express.static('public'));
app.use(express.static('public'));


// Passport middleware
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


// Synchronize models with the database
sequelize.sync({force: false}).then(() => {
    console.log('Database & tables created!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
    console.error('Unable to sync database:', err);
});
