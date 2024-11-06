/**
 * Default database configuration
 * Can be overridden by user in src/config/database.config.js
 */
module.exports = {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/calm-api',
    options: {
        
    }
};