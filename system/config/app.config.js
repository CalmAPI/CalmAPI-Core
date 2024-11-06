/**
 * Default application configuration
 * Can be overridden by user in src/config/app.config.js
 */
module.exports = {
    prefix: '/api/v1',
    cors: {
        enabled: true,
        options: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }
    },
    bodyParser: {
        json: {
            limit: '10mb'
        },
        urlencoded: {
            extended: true,
            limit: '10mb'
        }
    },
    security: {
        helmet: true,
        rateLimit: {
            enabled: true,
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        }
    }
};