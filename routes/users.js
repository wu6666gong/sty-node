const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users')
const { protect, authorize } = require('../middlemare/auth')
const advanceResult = require('../middlemare/advanceResult')
const User = require("../models/User")
router.use(protect)
router.use(authorize('admin'))
 router.route("/").get(advanceResult(User),getUsers).post(createUser)
 router.route("/:id").get(getUser).put(updateUser).delete(deleteUser)
module.exports = router