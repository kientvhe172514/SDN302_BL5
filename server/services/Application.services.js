const Application = require('../model/Application');
const User = require('../model/User');

class ApplicationService {
    // Tạo đơn mới
    async createApplication(applicationData) {
        try {
            const application = new Application(applicationData);
            const savedApplication = await application.save();
            return await this.populateApplication(savedApplication);
        } catch (error) {
            throw error;
        }
    }

    // Lấy tất cả đơn
    async getAllApplications(filters = {}, pagination = {}) {
        try {
            let query = Application.find();
            
            // Áp dụng filters
            if (filters.status) {
                query = query.where('status', filters.status);
            }
            if (filters.applicationType) {
                query = query.where('applicationType', filters.applicationType);
            }
            if (filters.student) {
                query = query.where('student', filters.student);
            }
            if (filters.processedBy) {
                query = query.where('processedBy', filters.processedBy);
            }
            
            // Search filter - cần populate trước khi search
            if (filters.search) {
                // Trim whitespace and escape special regex characters
                const trimmedSearch = filters.search.trim();
                if (trimmedSearch) {
                    const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    
                    // Tìm applications có student match với search term
                    const matchingStudents = await User.find({
                        $or: [
                            { fullName: { $regex: escapedSearch, $options: 'i' } },
                            { email: { $regex: escapedSearch, $options: 'i' } },
                            { studentId: { $regex: escapedSearch, $options: 'i' } }
                        ]
                    }).select('_id');
                    
                    const studentIds = matchingStudents.map(student => student._id);
                    
                    if (studentIds.length > 0) {
                        query = query.where('student').in(studentIds);
                    } else {
                        // Nếu không tìm thấy student nào, return empty result
                        query = query.where('_id').in([]);
                    }
                }
            }

            // Count total for pagination - cần count với cùng điều kiện search
            let countQuery = Application.find();
            
            // Apply same filters for counting
            if (filters.status) {
                countQuery = countQuery.where('status', filters.status);
            }
            if (filters.applicationType) {
                countQuery = countQuery.where('applicationType', filters.applicationType);
            }
            if (filters.student) {
                countQuery = countQuery.where('student', filters.student);
            }
            if (filters.processedBy) {
                countQuery = countQuery.where('processedBy', filters.processedBy);
            }
            
            // Apply search filter for counting
            if (filters.search) {
                const trimmedSearch = filters.search.trim();
                if (trimmedSearch) {
                    const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const matchingStudents = await User.find({
                        $or: [
                            { fullName: { $regex: escapedSearch, $options: 'i' } },
                            { email: { $regex: escapedSearch, $options: 'i' } },
                            { studentId: { $regex: escapedSearch, $options: 'i' } }
                        ]
                    }).select('_id');
                    
                    const studentIds = matchingStudents.map(student => student._id);
                    
                    if (studentIds.length > 0) {
                        countQuery = countQuery.where('student').in(studentIds);
                    } else {
                        countQuery = countQuery.where('_id').in([]);
                    }
                }
            }
            
            const total = await countQuery.countDocuments();

            // Apply pagination
            if (pagination.skip !== undefined) {
                query = query.skip(pagination.skip);
            }
            if (pagination.limit) {
                query = query.limit(pagination.limit);
            }

            // Sort by creation date (newest first)
            query = query.sort({ createdAt: -1 });

            const applications = await query.exec();
            const populatedApplications = await this.populateApplications(applications);

            return {
                applications: populatedApplications,
                total: total
            };
        } catch (error) {
            throw error;
        }
    }

    // Lấy đơn theo ID
    async getApplicationById(id) {
        try {
            const application = await Application.findById(id);
            if (!application) {
                throw new Error('Application not found');
            }
            return await this.populateApplication(application);
        } catch (error) {
            throw error;
        }
    }

    // Lấy đơn theo student ID
    async getApplicationsByStudent(studentId) {
        try {
            const applications = await Application.find({ student: studentId });
            return await this.populateApplications(applications);
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật đơn
    async updateApplication(id, updateData) {
        try {
            const application = await Application.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            if (!application) {
                throw new Error('Application not found');
            }
            return await this.populateApplication(application);
        } catch (error) {
            throw error;
        }
    }

    // Xử lý đơn (approve/reject)
    async processApplication(id, status, processedBy) {
        try {
            const application = await Application.findByIdAndUpdate(
                id,
                {
                    status: status,
                    processedBy: processedBy,
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            );
            if (!application) {
                throw new Error('Application not found');
            }
            return await this.populateApplication(application);
        } catch (error) {
            throw error;
        }
    }

    // Xóa đơn
    async deleteApplication(id) {
        try {
            const application = await Application.findByIdAndDelete(id);
            if (!application) {
                throw new Error('Application not found');
            }
            return application;
        } catch (error) {
            throw error;
        }
    }

    // Lấy thống kê đơn
    async getApplicationStats() {
        try {
            const stats = await Application.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);
            return stats;
        } catch (error) {
            throw error;
        }
    }

    // Lấy thống kê theo loại đơn
    async getApplicationTypeStats() {
        try {
            const stats = await Application.aggregate([
                {
                    $group: {
                        _id: '$applicationType',
                        count: { $sum: 1 }
                    }
                }
            ]);
            return stats;
        } catch (error) {
            throw error;
        }
    }

    // Populate application với thông tin user
    async populateApplication(application) {
        return await application.populate([
            { path: 'student', select: 'fullName email studentId' },
            { path: 'processedBy', select: 'fullName email role' }
        ]);
    }

    // Populate nhiều applications
    async populateApplications(applications) {
        return await Application.populate(applications, [
            { path: 'student', select: 'fullName email studentId' },
            { path: 'processedBy', select: 'fullName email role' }
        ]);
    }
}

module.exports = new ApplicationService();

