const {CalmController} = require('../../../system/core/CalmController');
const ProductService = require('./ProductService');

class ProductController extends CalmController {
    constructor() {
        super(ProductService);
    }
}

module.exports = new ProductController();