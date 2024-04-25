function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(401).json({message: 'Not authenticated. Please log in.'});
}


module.exports = {isAuthenticated};
