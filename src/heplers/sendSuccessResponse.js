function sendSuccessResponse(res, statusCode, data) {
    res.status(statusCode).json(data);
}

module.exports = sendSuccessResponse