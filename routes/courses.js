const express = require("express");
const router = express.Router({ mergeParams: true });
const {protect, authorize} = require('../middlemare/auth')
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const Courses = require("../models/Course.js");
const advanceResult = require("../middlemare/advanceResult");
router
  .route("/")
  .get(
    advanceResult(Courses, {
      path: "mscamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorize('admin', 'user'), addCourse);
router.route("/:id").get(getCourse).put(protect,authorize('admin', 'user'),updateCourse).delete(protect,authorize('admin', 'user'),deleteCourse);
module.exports = router;
