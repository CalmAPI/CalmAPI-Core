const {CalmModel} = require('../../../system/core/CalmModel');

const productSchema = {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: String
};

module.exports = new CalmModel('Product', productSchema);