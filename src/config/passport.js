const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const {jwtSecret} = require('../utils/tokenUtils');
const {UserModel} = require("../models");

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

