const express = require('express');
const pluralize = require('../utils/pluralize');

/**
 * Base route class providing automatic REST route generation
 * @class CalmRoute
 */
class CalmRoute {
    /**
     * @param {string} moduleName - Name of the module (e.g., 'product')
     * @param {CalmController} controller - Controller instance
     * @param {Object} options - Route options
     */
    constructor(moduleName, controller, options = {}) {
        this.router = express.Router();
        this.moduleName = moduleName.toLowerCase();
        this.controller = controller;
        this.options = {
            prefix: '',
            pluralize: true,
            routes: {
                getAll: true,
                getById: true,
                create: true,
                update: true,
                delete: true
            },
            middleware: {
                all: [],
                getAll: [],
                getById: [],
                create: [],
                update: [],
                delete: []
            },
            ...options
        };

        this.initializeRoutes();
    }

    /**
     * Update route prefix
     * @param {string} prefix - New prefix
     */
    updatePrefix(prefix) {
        this.options.prefix = prefix;
        // Re-initialize routes with new prefix
        this.router = express.Router();
        this.initializeRoutes();
    }

    /**
     * Get base path for routes
     * @returns {string} Base path
     */
    getBasePath() {
        const resourceName = this.options.pluralize ? 
            pluralize(this.moduleName) : 
            this.moduleName;
            
        return `${this.options.prefix}/${resourceName}`;
    }

    /**
     * Initialize default REST routes
     * @private
     */
    initializeRoutes() {
        const basePath = this.getBasePath();
        const { routes, middleware } = this.options;

        // Apply global middleware
        if (middleware.all.length > 0) {
            this.router.use(middleware.all);
        }

        // GET all records
        if (routes.getAll) {
            this.router.get(
                basePath,
                [...middleware.getAll],
                this.wrapResponse(this.controller.getAll)
            );
        }

        // GET single record by ID
        if (routes.getById) {
            this.router.get(
                `${basePath}/:id`,
                [...middleware.getById],
                this.wrapResponse(this.controller.getById)
            );
        }

        // POST create new record
        if (routes.create) {
            this.router.post(
                basePath,
                [...middleware.create],
                this.wrapResponse(this.controller.create)
            );
        }

        // PUT update record
        if (routes.update) {
            this.router.put(
                `${basePath}/:id`,
                [...middleware.update],
                this.wrapResponse(this.controller.update)
            );
        }

        // DELETE record
        if (routes.delete) {
            this.router.delete(
                `${basePath}/:id`,
                [...middleware.delete],
                this.wrapResponse(this.controller.delete)
            );
        }
    }

    /**
     * Add custom route
     * @param {string} method - HTTP method
     * @param {string} path - Route path
     * @param {Array} middleware - Middleware array
     * @param {Function} handler - Route handler
     * @returns {CalmRoute} Route instance
     */
    addRoute(method, path, middleware = [], handler) {
        const fullPath = path.startsWith('/') 
            ? `${this.options.prefix}${path}`
            : `${this.getBasePath()}/${path}`;

        this.router[method.toLowerCase()](
            fullPath,
            middleware,
            this.wrapResponse(handler)
        );

        return this;
    }

    /**
     * Wrap controller methods to handle async errors
     * @private
     * @param {Function} fn - Controller method
     * @returns {Function} Wrapped method
     */
    wrapResponse(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }

    /**
     * Get router instance
     * @returns {express.Router} Router instance
     */
    getRouter() {
        return this.router;
    }
}


module.exports = {CalmRoute};