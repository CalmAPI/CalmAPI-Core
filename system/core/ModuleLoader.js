// system/core/ModuleLoader.js
const fs = require('fs');
const path = require('path');

/**
 * Handles automatic module discovery and loading
 * @class ModuleLoader
 */
class ModuleLoader {
    constructor() {
        this.modulesPath = path.join(process.cwd(), 'src', 'modules');
    }

    /**
     * Load all modules from the modules directory
     */
    loadModules() {
        
        if (!fs.existsSync(this.modulesPath)) {
            console.log('No modules directory found at:', this.modulesPath);
            return;
        }

        // Get all module directories
        const modules = fs.readdirSync(this.modulesPath);

        modules.forEach(moduleName => {
            const modulePath = path.join(this.modulesPath, moduleName);
            
            // Check if it's a directory
            if (fs.statSync(modulePath).isDirectory()) {
                this.loadModuleRoutes(modulePath, moduleName);
            }
        });
    }

    /**
     * Load routes for a specific module
     * @param {string} modulePath - Path to module directory
     * @param {string} moduleName - Name of the module
     */
    loadModuleRoutes(modulePath, moduleName) {
        // First, try to find any file ending with Route.js
        const files = fs.readdirSync(modulePath);
        const routeFile = files.find(file => file.endsWith('Route.js'));
        
        if (routeFile) {
            try {
                require(path.join(modulePath, routeFile));
                console.log(`Loaded routes from ${routeFile} for module: ${moduleName}`);
            } catch (error) {
                console.error(`Error loading routes from ${routeFile} for module ${moduleName}:`, error);
            }
            return;
        }

        // Fallback to older naming conventions if no *Route.js file found
        const fallbackFiles = [
            path.join(modulePath, `${moduleName}.routes.js`),
            path.join(modulePath, 'routes.js')
        ];

        for (const file of fallbackFiles) {
            if (fs.existsSync(file)) {
                try {
                    require(file);
                    console.log(`Loaded routes from ${path.basename(file)} for module: ${moduleName}`);
                    return;
                } catch (error) {
                    console.error(`Error loading routes from ${path.basename(file)} for module ${moduleName}:`, error);
                }
            }
        }

        console.log(`No route file found for module: ${moduleName}`);
    }
}

module.exports = new ModuleLoader();