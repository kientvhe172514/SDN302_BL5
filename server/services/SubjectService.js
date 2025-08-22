const Subject = require("../model/Subject");
const ApiError = require("../errors/api-error");

class SubjectService {
    // Create new subject
    async createSubject(subjectData) {
        try {
            const existingSubject = await Subject.findOne({
                subjectCode: subjectData.subjectCode
            });

            if (existingSubject) {
                throw new ApiError(400, "Subject code already exists");
            }

            const subject = new Subject(subjectData);
            const savedSubject = await subject.save();
            return savedSubject;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error creating subject");
        }
    }

    // Get all subjects with pagination and filtering
    async getAllSubjects(query = {}) {
        try {
            const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = query;

            const filter = {};
            if (search) {
                filter.$or = [
                    { subjectCode: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

            const subjects = await Subject.find(filter)
                .sort(sortOptions)
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            const total = await Subject.countDocuments(filter);

            return {
                subjects,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            };
        } catch (error) {
            throw new ApiError(500, "Error fetching subjects");
        }
    }

    // Get subject by ID
    async getSubjectById(id) {
        try {
            const subject = await Subject.findById(id);
            if (!subject) {
                throw new ApiError(404, "Subject not found");
            }
            return subject;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error fetching subject");
        }
    }

    // Get subject by subject code
    async getSubjectByCode(subjectCode) {
        try {
            const subject = await Subject.findOne({ subjectCode });
            if (!subject) {
                throw new ApiError(404, "Subject not found");
            }
            return subject;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error fetching subject");
        }
    }

    // Update subject
    async updateSubject(id, updateData) {
        try {
            // Check if subject exists
            const existingSubject = await Subject.findById(id);
            if (!existingSubject) {
                throw new ApiError(404, "Subject not found");
            }

            // If subjectCode is being updated, check for uniqueness
            if (updateData.subjectCode && updateData.subjectCode !== existingSubject.subjectCode) {
                const duplicateSubject = await Subject.findOne({
                    subjectCode: updateData.subjectCode,
                    _id: { $ne: id }
                });

                if (duplicateSubject) {
                    throw new ApiError(400, "Subject code already exists");
                }
            }

            const updatedSubject = await Subject.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            return updatedSubject;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error updating subject");
        }
    }

    // Delete subject
    async deleteSubject(id) {
        try {
            const subject = await Subject.findByIdAndDelete(id);
            if (!subject) {
                throw new ApiError(404, "Subject not found");
            }
            return { message: "Subject deleted successfully" };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Error deleting subject");
        }
    }



    // Get subjects by credits range
    async getSubjectsByCredits(minCredits, maxCredits) {
        try {
            const filter = {};
            if (minCredits !== undefined && maxCredits !== undefined) {
                filter.credits = { $gte: minCredits, $lte: maxCredits };
            } else if (minCredits !== undefined) {
                filter.credits = { $gte: minCredits };
            } else if (maxCredits !== undefined) {
                filter.credits = { $lte: maxCredits };
            }

            const subjects = await Subject.find(filter).sort({ name: 1 });
            return subjects;
        } catch (error) {
            throw new ApiError(500, "Error fetching subjects by credits");
        }
    }
}

module.exports = SubjectService;
