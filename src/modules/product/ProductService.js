const {CalmService} = require('../../../system/core/CalmService');
const ProductModel = require('./ProductModel');
const ProductDTO = require('./ProductDTO');

class ProductService extends CalmService {
    constructor() {
        super(ProductModel, ProductDTO);
    }
}

module.exports = new ProductService();