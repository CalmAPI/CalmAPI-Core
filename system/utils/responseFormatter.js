/**
 * Response formatter middleware
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 * @param {Function} next - Next middleware function
 */
const responseFormatter = (req, res, next) => {
    res.success = (data, statusCode = 200) => {
        res.status(statusCode).json({
            status: 'success',
            data
        });
    };

    res.error = (error) => {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            status: 'error',
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    };

    next();
};

module.exports = responseFormatter;