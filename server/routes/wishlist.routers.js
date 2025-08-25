const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/WishlistController");
const { checkAuth } = require("../middleware/authorization");

const controller = new WishlistController();

// Public stats/listing for admins or system (can protect later)
router.get("/", controller.listWishlists);

// Get a student's wishlist
router.get("/:studentId", controller.getMyWishlist);

// Upsert wishlist for a student
router.post("/", controller.upsertWishlist);

// Add multiple subjects to wishlist
router.post("/:studentId/subjects", controller.addSubjects);

// Remove single subject from wishlist
router.delete("/:studentId/subjects/:subjectId", controller.removeSubject);

// Delete wishlist of a student
router.delete("/:studentId", controller.deleteWishlist);

module.exports = router;


