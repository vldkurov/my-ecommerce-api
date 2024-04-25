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
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const {sequelize, UserModel} = require("./models");
const {localStrategy} = require("./api/controllers/userController");

const PORT = config.port || 3000;

// const {mergeYAMLFiles} = require('./utils/mergeYAMLFiles')

// mergeYAMLFiles()

app.use(
    session({
        secret: 'yourSecretKey',
        domain: 'https://the-e-commerce-api.onrender.com',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24, // Example: 24 hours
            httpOnly: true,
            SameSite: process.env.NODE_ENV === "production" ? 'None' : 'Lax' // 'None' requires secure to be true
        }
    })
);


const whitelist = ['https://thunderous-moxie-f4ffbe.netlify.app', 'https://main--thunderous-moxie-f4ffbe.netlify.app', 'https://my-ecommerce-client.vercel.app'];


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
    credentials: true, // Разрешить отправку куки с запросами
    Headers: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Access-Control-Allow-Origin',
        'Content-Type',
        'Authorization',
        'Cookie'
    ],
    exposedHeaders: ['Set-Cookie']
};


app.use(flash());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// app.use('/static', express.static('public'));
app.use(express.static('public'));


app.use(passport.initialize());
// Add the middleware to implement a session with passport below:
app.use(passport.session());
// Complete the serializeUser function below:
passport.serializeUser((user, done) => {
    done(null, user.userId);
});
// Complete the deserializeUser function below:
passport.deserializeUser((userId, done) => {
    UserModel.findByPk(userId).then(user => {
        done(null, user);
    }).catch(err => {
        done(err);
    });
});

// Add your passport local strategy below:
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, localStrategy
));

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
        clientID: config.google_oauth_client_id,
        clientSecret: config.google_oauth_client_secret,
        callbackURL: `${config.domain_url}/api/users/auth/google/callback`

    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;

            // Check if user already exists in your database
            let user = await UserModel.findOne({
                where: {email: email}
            });

            if (user) {
                return done(null, user);  // User found, return that user
            } else {
                // If not, create user in your database
                const bcrypt = require('bcryptjs');
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(config.google_dummy_password, saltRounds);
                user = await UserModel.create({
                    googleId: profile.id,
                    email: email,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    password: hashedPassword // This should be handled securely
                    // You may not have passwords or other fields, handle according to your schema
                });
                return done(null, user);  // User created, return new user
            }
        } catch (error) {
            console.error('Error connecting with Google strategy', error);
            done(error, null);
        }
    }
));


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
const {handlePaymentSuccess, handlePaymentCancellation} = require("./api/controllers");


const swaggerDocument = YAML.load(path.join(__dirname, '..', 'docs', 'api-docs.yaml'));

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/carts', cartRoutes)
app.use('/api/orders', orderRoutes)

app.get('/success', isAuthenticated, handlePaymentSuccess);
app.get('/cancel', isAuthenticated, handlePaymentCancellation);

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
