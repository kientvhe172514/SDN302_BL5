const WishlistService = require("../services/WishlistService");

class WishlistController {
    constructor() {
        this.wishlistService = new WishlistService();
    }

    upsertWishlist = async (req, res, next) => {
        try {
            const { student, subjects, semester } = req.body;
            console.log('Controller - Upsert wishlist request:', { student, subjects, semester });
            console.log('Controller - Authenticated user:', req.user);
            
            const wishlist = await this.wishlistService.upsertWishlist({ student, subjects, semester });
            console.log('Controller - Wishlist upserted:', wishlist);
            
            res.status(200).json({ success: true, message: "Wishlist saved", data: wishlist });
        } catch (error) {
            console.error('Controller - Upsert error:', error);
            next(error);
        }
    };

    getMyWishlist = async (req, res, next) => {
        try {
            const { studentId } = req.params;
            console.log('Controller - Getting wishlist for student:', studentId);
            console.log('Controller - Authenticated user:', req.user);
            
            const wishlist = await this.wishlistService.getWishlistByStudent(studentId);
            console.log('Controller - Wishlist found:', wishlist ? 'Yes' : 'No');
            
            // Handle case where no wishlist exists - return empty wishlist structure
            if (!wishlist) {
                const emptyWishlist = {
                    _id: null,
                    student: { _id: studentId, email: "", fullName: "" },
                    subjects: [],
                    semester: "",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                res.status(200).json({ success: true, message: "No wishlist found", data: emptyWishlist });
                return;
            }
            
            res.status(200).json({ success: true, message: "Wishlist retrieved", data: wishlist });
        } catch (error) {
            console.error('Controller error:', error);
            next(error);
        }
    };

    listWishlists = async (req, res, next) => {
        try {
            const result = await this.wishlistService.listWishlists(req.query);
            res.status(200).json({ success: true, message: "Wishlists retrieved", data: result });
        } catch (error) {
            next(error);
        }
    };

    addSubjects = async (req, res, next) => {
        try {
            const { studentId } = req.params;
            const { subjectIds } = req.body;
            console.log('Controller - Add subjects request:', { studentId, subjectIds });
            console.log('Controller - Authenticated user:', req.user);
            
            const wishlist = await this.wishlistService.addSubjects(studentId, subjectIds);
            console.log('Controller - Subjects added to wishlist:', wishlist);
            
            res.status(200).json({ success: true, message: "Subjects added", data: wishlist });
        } catch (error) {
            console.error('Controller - Add subjects error:', error);
            next(error);
        }
    };

    removeSubject = async (req, res, next) => {
        try {
            const { studentId, subjectId } = req.params;
            const wishlist = await this.wishlistService.removeSubject(studentId, subjectId);
            res.status(200).json({ success: true, message: "Subject removed", data: wishlist });
        } catch (error) {
            next(error);
        }
    };

    deleteWishlist = async (req, res, next) => {
        try {
            const { studentId } = req.params;
            const result = await this.wishlistService.deleteWishlist(studentId);
            res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = WishlistController;


