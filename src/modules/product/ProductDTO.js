const {CalmDTO} = require('../../../system/core/CalmDTO');

class ProductDTO extends CalmDTO {
    static get allowedFields() {
        return ['_id', 'name', 'price', 'description', 'category', 'createdAt', 'updatedAt'];
    }
}

module.exports = ProductDTO;