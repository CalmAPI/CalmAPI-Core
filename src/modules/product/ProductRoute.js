const {CalmRoute} = require('../../../system/core/CalmRoute');
const ProductController = require('./ProductController');
const RouteManager = require('../../../system/core/RouteManager');
// const { authenticate, authorize } = require('../../middleware/auth');

// Create route instance with options
const productRoutes = new CalmRoute('product', ProductController);

// // Add custom routes if needed
// productRoutes.addRoute(
//     'GET',
//     'search',
//     [authenticate],
//     ProductController.search
// );

// productRoutes.addRoute(
//     'POST',
//     'bulk',
//     [authenticate, authorize('admin')],
//     ProductController.bulkCreate
// );

// Register routes
RouteManager.register('product', productRoutes);