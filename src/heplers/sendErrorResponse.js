function sendErrorResponse(res, statusCode, message) {
    console.error('Error:', message);
    res.status(statusCode).send(message);
}

module.exports = sendErrorResponse