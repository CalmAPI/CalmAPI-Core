const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const RouteManager = require('./RouteManager');
const responseFormatter = require('../utils/responseFormatter');
const defaultAppConfig = require('../config/app.config');
const defaultDbConfig = require('../config/database.config');
const ModuleLoader = require('./ModuleLoader');

/**
 * Manages application initialization and configuration
 * @class AppManager
 */
class AppManager {
    constructor() {
        this.app = express();
        this.config = {};
        this.dbConfig = {};
    }

    /**
     * Load configuration from user's src directory if exists, else use defaults
     * @private
     */
    loadConfigurations() {
        // Try to load user's app config
        try {
            const userAppConfig = require(path.join(process.cwd(), 'src/config/app.config.js'));
            this.config = { ...defaultAppConfig, ...userAppConfig };
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            this.config = defaultAppConfig;
        }

        // Try to load user's database config
        try {
            const userDbConfig = require(path.join(process.cwd(), 'src/config/database.config.js'));
            this.dbConfig = { ...defaultDbConfig, ...userDbConfig };
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            this.dbConfig = defaultDbConfig;
        }
    }

    /**
     * Initialize middleware
     * @private
     */
    initializeMiddleware() {
        // Basic middleware
        this.app.use(express.json(this.config.bodyParser.json));
        this.app.use(express.urlencoded(this.config.bodyParser.urlencoded));
        this.app.use(responseFormatter);

        // CORS
        if (this.config.cors.enabled) {
            this.app.use(cors(this.config.cors.options));
        }

        // Security
        if (this.config.security.helmet) {
            this.app.use(helmet());
        }

        if (this.config.security.rateLimit.enabled) {
            const limiter = rateLimit(this.config.security.rateLimit);
            this.app.use(limiter);
        }

        // Load custom middleware from src/middleware if exists
        this.loadCustomMiddleware();
    }

    /**
     * Load custom middleware from user's src directory
     * @private
     */
    loadCustomMiddleware() {
        const middlewarePath = path.join(process.cwd(), 'src/middleware');
        if (fs.existsSync(middlewarePath)) {
            fs.readdirSync(middlewarePath).forEach(file => {
                if (file.endsWith('.js')) {
                    const middleware = require(path.join(middlewarePath, file));
                    if (typeof middleware === 'function') {
                        this.app.use(middleware);
                    }
                }
            });
        }
    }

    /**
     * Initialize database connection
     * @private
     */
    async initializeDatabase() {
        try {
            await mongoose.connect(this.dbConfig.url, this.dbConfig.options);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }

    /**
     * Initialize routes
     * @private
     */
    initializeRoutes() {
        // Set base prefix if configured
        if (this.config.prefix) {
            RouteManager.setBasePrefix(this.config.prefix);
        }

        // Load all module routes
        ModuleLoader.loadModules();

        // Apply routes to app
        RouteManager.applyRoutes(this.app);

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                status: 'error',
                message: 'Route not found'
            });
        });

        // Error handler
        // eslint-disable-next-line no-unused-vars
        this.app.use((err, req, res, next) => {
            const statusCode = err.statusCode || 500;
            res.status(statusCode).json({
                status: 'error',
                message: err.message,
                ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
            });
        });
    }

    /**
     * Initialize the application
     * @returns {Express.Application} Express application instance
     */
    async initialize() {
        this.loadConfigurations();
        this.initializeMiddleware();
        await this.initializeDatabase();
        this.initializeRoutes();
        return this.app;
    }
}

module.exports = new AppManager();