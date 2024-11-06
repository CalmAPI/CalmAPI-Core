const { NotFoundError } = require('../utils/errors');

/**
 * Base service class providing CRUD operations
 * @class CalmService
 */
class CalmService {
    /**
     * @param {mongoose.Model} model - Mongoose model
     * @param {typeof CalmDTO} dto - DTO class
     */
    constructor(model, dto) {
        this.model = model;
        this.dto = dto;
    }

    /**
     * Create new record
     * @param {Object} data - Input data
     * @returns {Promise<Object>} Created record
     */
    async create(data) {
        const transformedData = this.dto.toCreate(data);
        const result = await this.model.create(transformedData);
        return this.dto.toResponse(result);
    }

    /**
     * Get all records
     * @param {Object} query - Query parameters
     * @param {Object} options - Additional options (pagination, sorting, etc.)
     * @returns {Promise<Array>} Array of records
     */
    async getAll(query = {}, options = {}) {
        const { 
            page = 1, 
            limit = 10, 
            sort = { createdAt: -1 } 
        } = options;

        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.model.find(query).sort(sort).skip(skip).limit(limit),
            this.model.countDocuments(query)
        ]);

        return {
            data: this.dto.toResponseList(data),
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Get single record by ID
     * @param {string} id - Record ID
     * @returns {Promise<Object>} Found record
     */
    async getById(id) {
        const result = await this.model.findById(id);
        if (!result) {
            throw new NotFoundError('Record not found');
        }
        return this.dto.toResponse(result);
    }

    /**
     * Update record by ID
     * @param {string} id - Record ID
     * @param {Object} data - Update data
     * @returns {Promise<Object>} Updated record
     */
    async update(id, data) {
        const transformedData = this.dto.toUpdate(data);
        const result = await this.model.findByIdAndUpdate(
            id,
            transformedData,
            { new: true }
        );
        if (!result) {
            throw new NotFoundError('Record not found');
        }
        return this.dto.toResponse(result);
    }

    /**
     * Delete record by ID
     * @param {string} id - Record ID
     * @returns {Promise<boolean>} Deletion success
     */
    async delete(id) {
        const result = await this.model.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundError('Record not found');
        }
        return true;
    }
}

module.exports = {CalmService};