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
const bcrypt = require('bcryptjs');
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
    credentials: true, // Разрешить отправку куки с запросами
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

const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({
//         clientID: config.google_oauth_client_id,
//         clientSecret: config.google_oauth_client_secret,
//         callbackURL: `${config.domain_url}/api/users/auth/google/callback`
//
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         try {
//             const email = profile.emails[0].value;
//
//             // Check if user already exists in your database
//             let user = await UserModel.findOne({
//                 where: {email: email}
//             });
//
//             if (user) {
//                 return done(null, user);  // User found, return that user
//             } else {
//                 // If not, create user in your database
//                 const bcrypt = require('bcryptjs');
//                 const saltRounds = 10;
//                 const hashedPassword = await bcrypt.hash(config.google_dummy_password, saltRounds);
//                 user = await UserModel.create({
//                     googleId: profile.id,
//                     email: email,
//                     firstName: profile.name.givenName,
//                     lastName: profile.name.familyName,
//                     password: hashedPassword // This should be handled securely
//                     // You may not have passwords or other fields, handle according to your schema
//                 });
//                 return done(null, user);  // User created, return new user
//             }
//         } catch (error) {
//             console.error('Error connecting with Google strategy', error);
//             done(error, null);
//         }
//     }
// ));

// passport.use(new GoogleStrategy({
//         clientID: config.google_oauth_client_id,
//         clientSecret: config.google_oauth_client_secret,
//         callbackURL: `${config.domain_url}/api/users/auth/google/callback`
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         try {
//             // let user = await User.findOne({googleId: profile.id});
//             const email = profile.emails[0].value; // Email from Google profile
//             let user = await UserModel.findOne({where: {email: email}});
//             if (!user) {
//                 const saltRounds = 10;
//                 const hashedPassword = await bcrypt.hash(config.google_dummy_password, saltRounds);
//                 user = await UserModel.create({
//                     userId: profile.id,
//                     email: profile.emails[0].value,
//                     firstName: profile.name.givenName,
//                     lastName: profile.name.familyName,
//                     password: hashedPassword,
//                     // Add any other user details you need in your database
//                 });
//             }
//
//             // Generate JWT tokens here
//             // const userPayload = {id: user.id, email: user.email};
//             // const newAccessToken = jwt.sign(userPayload, process.env.JWT_SECRET, {expiresIn: '1h'});
//             // const newRefreshToken = jwt.sign(userPayload, process.env.JWT_REFRESH_SECRET, {expiresIn: '24h'});
//
//             const accessToken = generateAccessToken(user);
//             const refreshToken = generateRefreshToken(user);
//
//             // return done(null, {user, accessToken: newAccessToken, refreshToken: newRefreshToken});
//             return done(null, {user, accessToken, refreshToken});
//         } catch (error) {
//             return done(error, null);
//         }
//     }
// ));

passport.use(new GoogleStrategy({
        clientID: config.google_oauth_client_id,
        clientSecret: config.google_oauth_client_secret,
        callbackURL: `${config.domain_url}/api/users/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {

        // console.log('GoogleStrategy profile', profile)
        try {
            const email = profile.emails[0].value;
            let user = await UserModel.findOne({where: {email: email}});

            // console.log('GoogleStrategy email', email)
            // console.log('GoogleStrategy user', user)

            if (!user) {
                const hashedPassword = await bcrypt.hash(config.google_dummy_password, 10);
                user = await UserModel.create({
                    email: email,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    password: hashedPassword,
                });
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            return done(null, {user, accessToken, refreshToken});
        } catch (error) {
            console.error("Error in Google Authentication", error);
            return done(error, null);
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
const {handlePaymentSuccess, handlePaymentCancellation} = require("./api/controllers");
const {isAuthenticated} = require("./api/middlewares");
const {UserModel} = require("./models");
const {generateAccessToken, generateRefreshToken} = require("./utils");


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
