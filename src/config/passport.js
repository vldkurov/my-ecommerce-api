const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const {UserModel} = require('../models'); // Adjust the path according to your project structure

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
            // Match user
            try {
                const user = await UserModel.findOne({where: {email}});
                if (!user) {
                    return done(null, false, {message: 'That email is not registered'});
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Password incorrect'});
                    }
                });
            } catch (err) {
                console.error(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findByPk(id);
            done(null, user);
        } catch (err) {
            console.error(err);
        }
    });
};
