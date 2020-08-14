const express = require('express');
const router =express.Router();
const { register, login, getMe } = require('../controllers/users')
const {protect} = require('../middlemare/auth')
router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
module.exports = router