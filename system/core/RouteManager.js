/**
 * Manages all route collections in the application
 * @class RouteManager
 */
class RouteManager {
    constructor() {
        this.routes = new Map();
        this.basePrefix = '';
    }

    /**
     * Set base prefix for all routes
     * @param {string} prefix - Base prefix
     */
    setBasePrefix(prefix) {
        this.basePrefix = prefix;
        // Update prefix for all existing routes
        for (const route of this.routes.values()) {
            route.options.prefix = this.basePrefix;
        }
    }

    /**
     * Get current base prefix
     * @returns {string} Current base prefix
     */
    getBasePrefix() {
        return this.basePrefix;
    }

    /**
     * Register a new route collection
     * @param {string} name - Route collection name
     * @param {CalmRoute} routeInstance - CalmRoute instance
     */
    register(name, routeInstance) {
        // Apply current base prefix to new route
        if (this.basePrefix) {
            routeInstance.options.prefix = this.basePrefix;
        }
        this.routes.set(name, routeInstance);
    }

    /**
     * Apply all routes to express app
     * @param {Express.Application} app - Express app instance
     */
    applyRoutes(app) {
         
        // eslint-disable-next-line no-unused-vars
        for (const [name, route] of this.routes) {
            app.use(this.getBasePrefix(), route.getRouter());
        }
    }

    /**
     * Get all registered routes
     * @returns {Map} Map of registered routes
     */
    getRoutes() {
        return this.routes;
    }

    /**
     * Clear all registered routes
     */
    clearRoutes() {
        this.routes.clear();
    }
}

module.exports = new RouteManager();