const express = require("express");
const router = express.Router({ mergeParams: true });
const {protect, authorize} = require('../middlemare/auth')
const {
    getReviews,
    getReview,
    updateReview,
    deleteReview,
    addReview
} = require("../controllers/reviews");
const Review = require("../models/Review.js");
const advanceResult = require("../middlemare/advanceResult");
router
  .route("/")
  .get(
    advanceResult(Review, {
      path: "mscamp",
      select: "name description",
    }),
    getReviews
  ).post(protect, authorize('admin', 'user'), addReview)
  router.route("/:id").get(getReview).put(protect, authorize('admin', 'user'), updateReview).delete(protect, authorize('admin', 'user'), deleteReview)
module.exports = router;
