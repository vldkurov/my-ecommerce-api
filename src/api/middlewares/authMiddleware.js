// function authMiddleware(req, res, next) {
//     if (req.authMiddleware()) {
//         return next();
//     }
//
//     res.status(401).json({message: 'Not authenticated. Please log in.'});
// }
//
//
// module.exports = {authMiddleware};

const passport = require('passport');


const authenticateLocal = passport.authenticate('local', {session: false});

const isAuthenticated = passport.authenticate('jwt', {session: false});

module.exports = {
    authenticateLocal, isAuthenticated
};

