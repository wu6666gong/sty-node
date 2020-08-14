const express = require('express');
const router =express.Router();
const {getMscamps, createMscamp, getMscamp, updateMscamp, deleteMscamp}  = require('../controllers/mscamps')
// 路由鉴权&&角色权限控制
const {protect,authorize} = require('../middlemare/auth')
const courseRouter = require('./courses')
const Mscamp = require('../models/Mscamp.js')
const advanceResult = require('../middlemare/advanceResult')
router.use('/:mscampId/courses', courseRouter)
router.route('/').get(advanceResult(Mscamp, 'courses'), getMscamps).post(protect,authorize('admin', 'user'),createMscamp)
router.route('/:id').put(protect,authorize('admin', 'user'),updateMscamp).delete(protect,authorize('admin', 'user'), deleteMscamp).get(getMscamp)
module.exports = router