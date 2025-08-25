const WishlistCourse = require("../model/WishlistCourse");
const ApiError = require("../errors/api-error");

class WishlistService {
    // Create or update wishlist for a student (upsert)
    async upsertWishlist({ student, subjects = [], semester }) {
        try {
            if (!student || !semester) {
                throw new ApiError(400, "student and semester are required");
            }

            const updated = await WishlistCourse.findOneAndUpdate(
                { student },
                { $set: { semester }, $addToSet: { subjects: { $each: subjects } } },
                { upsert: true, new: true }
            ).populate("student", "email fullName").populate("subjects");

            return updated;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Error upserting wishlist");
        }
    }

    async getWishlistByStudent(studentId) {
        try {
            const wishlist = await WishlistCourse.findOne({ student: studentId })
                .populate("student", "email fullName")
                .populate("subjects");
            if (!wishlist) throw new ApiError(404, "Wishlist not found");
            return wishlist;
        } catch (error) {
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
            const wishlist = await WishlistCourse.findOneAndUpdate(
                { student: studentId },
                { $addToSet: { subjects: { $each: subjectIds } } },
                { new: true }
            ).populate("student", "email fullName").populate("subjects");
            if (!wishlist) throw new ApiError(404, "Wishlist not found");
            return wishlist;
        } catch (error) {
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


