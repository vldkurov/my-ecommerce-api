const passport = require('passport');


const authenticateLocal = passport.authenticate('local', {session: false});

const isAuthenticated = passport.authenticate('jwt', {session: false});

const authenticateGoogle = passport.authenticate('google', {scope: ['profile', 'email']})

const authenticateGoogleCallback = passport.authenticate('google', {failureRedirect: '/login', session: false})

module.exports = {
    authenticateLocal, isAuthenticated, authenticateGoogle, authenticateGoogleCallback
};

