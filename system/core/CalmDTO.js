class CalmDTO {
    /**
     * Fields to be picked from input/output
     * @returns {Array} Array of allowed field names
     */
    static get allowedFields() {
        return ['_id']; // Include _id by default instead of id
    }

    /**
     * Transform data for create operation
     * @param {Object} data - Input data
     * @returns {Object} Transformed data
     */
    static toCreate(data) {
        return this._pick(data, this.allowedFields);
    }

    /**
     * Transform data for update operation
     * @param {Object} data - Input data
     * @returns {Object} Transformed data
     */
    static toUpdate(data) {
        // Prevent _id from being updated
        // eslint-disable-next-line no-unused-vars
        const { _id, ...rest } = data;
        return this._pick(rest, this.allowedFields.filter(field => field !== '_id'));
    }

    /**
     * Transform database object to response
     * @param {Object} data - Database object
     * @returns {Object} Transformed response
     */
    static toResponse(data) {
        if (!data) return null;
        const obj = data.toObject ? data.toObject() : data;
        return this._pick(obj, this.allowedFields);
    }

    /**
     * Transform multiple records
     * @param {Array} data - Array of database objects
     * @returns {Array} Transformed responses
     */
    static toResponseList(data) {
        if (!Array.isArray(data)) return [];
        return data.map(item => this.toResponse(item));
    }

    /**
     * Pick only allowed fields from object
     * @private
     * @param {Object} data - Input object
     * @param {Array} fields - Allowed fields
     * @returns {Object} Filtered object
     */
    static _pick(data, fields) {
        if (!data) return {};
        return fields.reduce((obj, field) => {
            if (data[field] !== undefined) {
                obj[field] = data[field];
            }
            return obj;
        }, {});
    }
}

module.exports = {CalmDTO};