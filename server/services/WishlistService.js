const WishlistCourse = require("../model/WishlistCourse");
const ApiError = require("../errors/api-error");

class WishlistService {
    // Create or update wishlist for a student (upsert)
    async upsertWishlist({ student, subjects = [], semester }) {
        try {
            console.log('Service - Upsert wishlist:', { student, subjects, semester });
            
            if (!student || !semester) {
                throw new ApiError(400, "student and semester are required");
            }

            // Check if subjects exist in database
            if (subjects.length > 0) {
                const Subject = require("../model/Subject");
                const existingSubjects = await Subject.find({ subjectCode: { $in: subjects } });
                console.log('Service - Found existing subjects:', existingSubjects);
                
                if (existingSubjects.length !== subjects.length) {
                    const foundCodes = existingSubjects.map(s => s.subjectCode);
                    const notFound = subjects.filter(code => !foundCodes.includes(code));
                    console.log('Service - Subjects not found:', notFound);
                    throw new ApiError(400, `Subjects not found: ${notFound.join(', ')}`);
                }
                
                // Use ObjectIds instead of subject codes
                const subjectIds = existingSubjects.map(s => s._id);
                console.log('Service - Using subject IDs:', subjectIds);
                
                const updated = await WishlistCourse.findOneAndUpdate(
                    { student },
                    { $set: { semester }, $addToSet: { subjects: { $each: subjectIds } } },
                    { upsert: true, new: true }
                ).populate("student", "email fullName").populate("subjects");
                
                console.log('Service - Wishlist updated:', updated);
                return updated;
            } else {
                const updated = await WishlistCourse.findOneAndUpdate(
                    { student },
                    { $set: { semester } },
                    { upsert: true, new: true }
                ).populate("student", "email fullName").populate("subjects");
                
                return updated;
            }
        } catch (error) {
            console.error('Service - Upsert error:', error);
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Error upserting wishlist");
        }
    }

    async getWishlistByStudent(studentId) {
        try {
            console.log('Service - Looking for wishlist for student:', studentId);
            const wishlist = await WishlistCourse.findOne({ student: studentId })
                .populate("student", "email fullName")
                .populate("subjects", "subjectCode name credits description");
            
            console.log('Service - Raw wishlist found:', wishlist);
            console.log('Service - Subjects in wishlist:', wishlist?.subjects);
            
            // Return null if no wishlist exists instead of throwing error
            if (!wishlist) {
                console.log('Service - No wishlist found for student:', studentId);
                return null;
            }
            return wishlist;
        } catch (error) {
            console.error('Service - Error fetching wishlist:', error);
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Error fetching wishlist");
        }
    }

    async listWishlists(query = {}) {
        try {
            const { page = 1, limit = 10 } = query;
            const wishlists = await WishlistCourse.find()
                .populate("student", "email fullName")
                .populate("subjects")
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 });

            const total = await WishlistCourse.countDocuments();
            return { wishlists, total, totalPages: Math.ceil(total / limit), currentPage: page };
        } catch (error) {
            throw new ApiError(500, "Error listing wishlists");
        }
    }

    async addSubjects(studentId, subjectIds = []) {
        try {
            console.log('Service - Add subjects:', { studentId, subjectIds });
            
            // Check if subjects exist in database
            if (subjectIds.length > 0) {
                const Subject = require("../model/Subject");
                const existingSubjects = await Subject.find({ subjectCode: { $in: subjectIds } });
                console.log('Service - Found existing subjects for add:', existingSubjects);
                
                if (existingSubjects.length !== subjectIds.length) {
                    const foundCodes = existingSubjects.map(s => s.subjectCode);
                    const notFound = subjectIds.filter(code => !foundCodes.includes(code));
                    console.log('Service - Subjects not found for add:', notFound);
                    throw new ApiError(400, `Subjects not found: ${notFound.join(', ')}`);
                }
                
                // Use ObjectIds instead of subject codes
                const objectIds = existingSubjects.map(s => s._id);
                console.log('Service - Using subject IDs for add:', objectIds);
                
                const wishlist = await WishlistCourse.findOneAndUpdate(
                    { student: studentId },
                    { $addToSet: { subjects: { $each: objectIds } } },
                    { new: true }
                ).populate("student", "email fullName").populate("subjects");
                
                if (!wishlist) throw new ApiError(404, "Wishlist not found");
                console.log('Service - Subjects added to wishlist:', wishlist);
                return wishlist;
            } else {
                throw new ApiError(400, "No subjects provided");
            }
        } catch (error) {
            console.error('Service - Add subjects error:', error);
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Error adding subjects to wishlist");
        }
    }

    async removeSubject(studentId, subjectId) {
        try {
            const wishlist = await WishlistCourse.findOneAndUpdate(
                { student: studentId },
                { $pull: { subjects: subjectId } },
                { new: true }
            ).populate("student", "email fullName").populate("subjects");
            if (!wishlist) throw new ApiError(404, "Wishlist not found");
            return wishlist;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Error removing subject from wishlist");
        }
    }

    async deleteWishlist(studentId) {
        try {
            const deleted = await WishlistCourse.findOneAndDelete({ student: studentId });
            if (!deleted) throw new ApiError(404, "Wishlist not found");
            return { message: "Wishlist deleted successfully" };
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Error deleting wishlist");
        }
    }
}

module.exports = WishlistService;


