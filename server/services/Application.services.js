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
    async getAllApplications(filters = {}) {
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

            const applications = await query.exec();
            return await this.populateApplications(applications);
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
            { path: 'student', select: 'name email studentId' },
            { path: 'processedBy', select: 'name email role' }
        ]);
    }

    // Populate nhiều applications
    async populateApplications(applications) {
        return await Application.populate(applications, [
            { path: 'student', select: 'name email studentId' },
            { path: 'processedBy', select: 'name email role' }
        ]);
    }
}

module.exports = new ApplicationService();

