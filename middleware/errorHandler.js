const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    let message;

    switch (statusCode) {
        case 400:
            message = 'Bad Request';
            break;
        case 401:
            message = 'Unauthorized';
            break;
        case 404:
            message = 'Not Found';
            break;
        case 409:
            message = 'Conflict';
            break;

        case 403:
            message ="unauthorized"
            break; 
               
        default:
            message = err.message || 'Internal Server Error';
            break;
    }

    // Log the error
    logger.error(message);

    // Send the appropriate JSON response with status, title, and message
    res.status(statusCode).json({ title: message, message });
};

module.exports = errorHandler;
