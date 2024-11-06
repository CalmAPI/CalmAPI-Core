const mongoose = require('mongoose');

/**
 * Base model class providing common schema methods
 * @class CalmModel
 */
class CalmModel {
    /**
     * Initialize the model with schema
     * @param {string} modelName - Name of the model
     * @param {Object} schema - Mongoose schema definition
     * @param {Object} options - Additional options for schema
     */
    constructor(modelName, schema, options = {}) {
        const defaultOptions = {
            timestamps: true,
            toJSON: {
                virtuals: true,
                transform: function(doc, ret) {
                    // Only remove the version key
                    delete ret.__v;
                    return ret;
                }
            },
            toObject: {
                virtuals: true,
                transform: function(doc, ret) {
                    // Only remove the version key
                    delete ret.__v;
                    return ret;
                }
            }
        };

        const mergedOptions = { ...defaultOptions, ...options };
        const mongooseSchema = new mongoose.Schema(schema, mergedOptions);
        
        return mongoose.model(modelName, mongooseSchema);
    }
}

module.exports = {CalmModel};