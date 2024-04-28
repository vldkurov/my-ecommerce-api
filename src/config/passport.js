const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const {jwtSecret} = require('../utils/tokenUtils');
const {UserModel} = require("../models");
const config = require("./config");
const bcrypt = require("bcryptjs");
const {generateAccessToken, generateRefreshToken} = require("../utils");

console.log("Configuring passport...");


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserModel.findOne({where: {email}});
        if (!user || !(await user.validatePassword(password))) {
            return done(null, false, {message: 'Invalid credentials'});
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}, async (jwt_payload, done) => {
    try {
        const user = await UserModel.findByPk(jwt_payload.sub, {attributes: ['userId', 'email', 'firstName', 'lastName']});
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error);
    }
}));


passport.use(new GoogleStrategy({
        clientID: config.google_oauth_client_id,
        clientSecret: config.google_oauth_client_secret,
        callbackURL: `${config.domain_url}/api/users/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {

        try {
            const email = profile.emails[0].value;
            let user = await UserModel.findOne({where: {email: email}});


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

