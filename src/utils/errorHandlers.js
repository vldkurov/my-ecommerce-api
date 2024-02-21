const handleServerError = (error, res) => {
    console.error(error);
    res.status(500).send('Server error');
};

const handleAuthenticationError = (res, message) => {
    res.status(401).json({message});
};

module.exports = {handleServerError, handleAuthenticationError};
