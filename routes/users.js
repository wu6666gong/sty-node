const express = require('express');
const router = express.Router();
const { register, login, getMe, updateDetails, updatePassword, forgotPassword } = require('../controllers/auth')
const {protect} = require('../middlemare/auth')
router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
module.exports = router