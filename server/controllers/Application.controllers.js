const ApplicationService = require('../services/Application.services');
const { ApiError } = require('../errors/api-error');
const { 
    APPLICATION_TYPES, 
    APPLICATION_TYPE_LABELS, 
    APPLICATION_CATEGORIES,
    getApplicationTypeLabel,
    getAllApplicationTypes,
    getApplicationTypesByCategory,
    getApplicationTypeCategory
} = require('../utils/application-types');

class ApplicationController {
    // Tạo đơn mới
    async createApplication(req, res, next) {
        try {
            const applicationData = {
                ...req.body,
                student: req.user.id // Lấy từ token authentication
            };

            const application = await ApplicationService.createApplication(applicationData);
            
            res.status(201).json({
                success: true,
                message: 'Application created successfully',
                data: application
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    // Lấy tất cả đơn (Admin/Teacher)
    async getAllApplications(req, res, next) {
        try {
            const filters = {
                status: req.query.status,
                applicationType: req.query.applicationType,
                student: req.query.student,
                processedBy: req.query.processedBy
            };

            // Loại bỏ các filter undefined
            Object.keys(filters).forEach(key => 
                filters[key] === undefined && delete filters[key]
            );

            const applications = await ApplicationService.getAllApplications(filters);
            
            res.status(200).json({
                success: true,
                message: 'Applications retrieved successfully',
                data: applications
            });
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }

    // Lấy đơn theo ID
    async getApplicationById(req, res, next) {
        try {
            const { id } = req.params;
            const application = await ApplicationService.getApplicationById(id);
            
            res.status(200).json({
                success: true,
                message: 'Application retrieved successfully',
                data: application
            });
        } catch (error) {
            next(new ApiError(404, error.message));
        }
    }

    // Lấy đơn của sinh viên hiện tại
    async getMyApplications(req, res, next) {
        try {
            const studentId = req.user.id;
            const applications = await ApplicationService.getApplicationsByStudent(studentId);
            
            res.status(200).json({
                success: true,
                message: 'Your applications retrieved successfully',
                data: applications
            });
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }

    // Lấy đơn theo student ID (Admin/Teacher)
    async getApplicationsByStudent(req, res, next) {
        try {
            const { studentId } = req.params;
            const applications = await ApplicationService.getApplicationsByStudent(studentId);
            
            res.status(200).json({
                success: true,
                message: 'Student applications retrieved successfully',
                data: applications
            });
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }

    // Cập nhật đơn
    async updateApplication(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const application = await ApplicationService.updateApplication(id, updateData);
            
            res.status(200).json({
                success: true,
                message: 'Application updated successfully',
                data: application
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    // Xử lý đơn (approve/reject) - Admin/Teacher
    async processApplication(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const processedBy = req.user.id;

            if (!['approved', 'rejected'].includes(status)) {
                throw new Error('Status must be either "approved" or "rejected"');
            }

            const application = await ApplicationService.processApplication(id, status, processedBy);
            
            res.status(200).json({
                success: true,
                message: `Application ${status} successfully`,
                data: application
            });
        } catch (error) {
            next(new ApiError(400, error.message));
        }
    }

    // Xóa đơn
    async deleteApplication(req, res, next) {
        try {
            const { id } = req.params;
            await ApplicationService.deleteApplication(id);
            
            res.status(200).json({
                success: true,
                message: 'Application deleted successfully'
            });
        } catch (error) {
            next(new ApiError(404, error.message));
        }
    }

    // Lấy thống kê đơn
    async getApplicationStats(req, res, next) {
        try {
            const stats = await ApplicationService.getApplicationStats();
            
            res.status(200).json({
                success: true,
                message: 'Application statistics retrieved successfully',
                data: stats
            });
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }

    // Lấy thống kê theo loại đơn
    async getApplicationTypeStats(req, res, next) {
        try {
            const stats = await ApplicationService.getApplicationTypeStats();
            
            res.status(200).json({
                success: true,
                message: 'Application type statistics retrieved successfully',
                data: stats
            });
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }

    // Lấy danh sách tất cả các loại đơn
    async getApplicationTypes(req, res, next) {
        try {
            const applicationTypes = getAllApplicationTypes().map(type => ({
                value: type,
                label: getApplicationTypeLabel(type)
            }));
            
            res.status(200).json({
                success: true,
                message: 'Application types retrieved successfully',
                data: applicationTypes
            });
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }

    // Lấy danh sách các loại đơn theo category
    async getApplicationTypesByCategory(req, res, next) {
        try {
            const { category } = req.params;
            const types = getApplicationTypesByCategory(category.toUpperCase());
            
            const applicationTypes = types.map(type => ({
                value: type,
                label: getApplicationTypeLabel(type)
            }));
            
            res.status(200).json({
                success: true,
                message: `Application types for category ${category} retrieved successfully`,
                data: applicationTypes
            });
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }

    // Lấy tất cả categories và loại đơn
    async getApplicationCategories(req, res, next) {
        try {
            const categories = Object.keys(APPLICATION_CATEGORIES).map(category => ({
                category: category,
                label: this.getCategoryLabel(category),
                types: APPLICATION_CATEGORIES[category].map(type => ({
                    value: type,
                    label: getApplicationTypeLabel(type)
                }))
            }));
            
            res.status(200).json({
                success: true,
                message: 'Application categories retrieved successfully',
                data: categories
            });
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }

    // Helper method để lấy label cho category
    getCategoryLabel(category) {
        const categoryLabels = {
            'ACADEMIC': 'Học tập',
            'TRANSFER': 'Chuyển đổi',
            'ENROLLMENT': 'Nhập học',
            'FINANCIAL': 'Tài chính',
            'GRADUATION': 'Tốt nghiệp',
            'EXAMINATION': 'Thi cử',
            'OTHER': 'Khác'
        };
        return categoryLabels[category] || category;
    }
}

module.exports = new ApplicationController();

