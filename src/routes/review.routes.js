const express = require("express");

const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const reviewController = require("../controllers/reviewController");


const router = express.Router();
router.get("/", reviewController.getAllReviews);

router.post(
  "/",
  authenticate,
  requireRole("USER"),
  reviewController.createReview
);

router.get(
  "/my",
  authenticate,
  requireRole("USER"),
  reviewController.getMyReviews
);

router.get(
  "/listing/:listingId",
  reviewController.getListingReviews
);

module.exports = router;