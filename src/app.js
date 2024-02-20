require('dotenv').config({path: '../.env'});
const config = require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('connect-flash');

const passport = require('passport');
require('./config/passport')(passport);
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const app = express();
const logger = require('morgan');
const {sequelize} = require("./models");
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

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/carts', cartRoutes)
app.use('/api/orders', orderRoutes)

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use((req, res) => {
    // your logic here
    res.status(404).send('Not Found');
});


// Synchronize models with the database
sequelize.sync({force: false}).then(() => {
    console.log('Database & tables created!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
    console.error('Unable to sync database:', err);
});
