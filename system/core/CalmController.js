/**
 * Base controller class providing CRUD endpoints
 * @class CalmController
 */
class CalmController {
    /**
     * @param {CalmService} service - Service instance
     */
    constructor(service) {
        this.service = service;
        this.getAll = this.getAll.bind(this);
    }

    /**
     * Get all records
     * @param {Express.Request} req - Express request object
     * @param {Express.Response} res - Express response object
     * @param {Express.NextFunction} next - Express next function
     */
    getAll = async (req, res, next) => {
        try {
            const { page, limit, ...query } = req.query;
            const result = await this.service.getAll(query, { page, limit });
            res.success(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get single record by ID
     * @param {Express.Request} req - Express request object
     * @param {Express.Response} res - Express response object
     * @param {Express.NextFunction} next - Express next function
     */
    getById = async (req, res, next) => {
        try {
            const result = await this.service.getById(req.params.id);
            res.success(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create new record
     * @param {Express.Request} req - Express request object
     * @param {Express.Response} res - Express response object
     * @param {Express.NextFunction} next - Express next function
     */
    create = async (req, res, next) => {
        try {
            const result = await this.service.create(req.body);
            res.success(result, 201);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update record
     * @param {Express.Request} req - Express request object
     * @param {Express.Response} res - Express response object
     * @param {Express.NextFunction} next - Express next function
     */
    update = async (req, res, next) => {
        try {
            const result = await this.service.update(req.params.id, req.body);
            res.success(result);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete record
     * @param {Express.Request} req - Express request object
     * @param {Express.Response} res - Express response object
     * @param {Express.NextFunction} next - Express next function
     */
    delete = async (req, res, next) => {
        try {
            await this.service.delete(req.params.id);
            res.success({ deleted: true });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = {CalmController};