const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const {UserModel} = require('../models');
const config = require('./config')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt_secret,
};

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (jwt_payload, done) => {
            try {
                const user = await UserModel.findByPk(jwt_payload.userId);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (error) {
                console.error(error);
                return done(error, false);
            }
        })
    );
};
