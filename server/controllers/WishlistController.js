const WishlistService = require("../services/WishlistService");

class WishlistController {
    constructor() {
        this.wishlistService = new WishlistService();
    }

    upsertWishlist = async (req, res, next) => {
        try {
            const { student, subjects, semester } = req.body;
            const wishlist = await this.wishlistService.upsertWishlist({ student, subjects, semester });
            res.status(200).json({ status: "success", message: "Wishlist saved", data: wishlist });
        } catch (error) {
            next(error);
        }
    };

    getMyWishlist = async (req, res, next) => {
        try {
            const { studentId } = req.params;
            const wishlist = await this.wishlistService.getWishlistByStudent(studentId);
            res.status(200).json({ status: "success", message: "Wishlist retrieved", data: wishlist });
        } catch (error) {
            next(error);
        }
    };

    listWishlists = async (req, res, next) => {
        try {
            const result = await this.wishlistService.listWishlists(req.query);
            res.status(200).json({ status: "success", message: "Wishlists retrieved", data: result });
        } catch (error) {
            next(error);
        }
    };

    addSubjects = async (req, res, next) => {
        try {
            const { studentId } = req.params;
            const { subjectIds } = req.body;
            const wishlist = await this.wishlistService.addSubjects(studentId, subjectIds);
            res.status(200).json({ status: "success", message: "Subjects added", data: wishlist });
        } catch (error) {
            next(error);
        }
    };

    removeSubject = async (req, res, next) => {
        try {
            const { studentId, subjectId } = req.params;
            const wishlist = await this.wishlistService.removeSubject(studentId, subjectId);
            res.status(200).json({ status: "success", message: "Subject removed", data: wishlist });
        } catch (error) {
            next(error);
        }
    };

    deleteWishlist = async (req, res, next) => {
        try {
            const { studentId } = req.params;
            const result = await this.wishlistService.deleteWishlist(studentId);
            res.status(200).json({ status: "success", message: result.message });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = WishlistController;


