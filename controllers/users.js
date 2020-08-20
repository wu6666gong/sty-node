const crypto = require('crypto');
const User = require('../models/User.js')
const errorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('../middlemare/async.js')
const sendeEmail = require("../utils/sendEmail");
const { CLIENT_RENEG_LIMIT } = require('tls');
/** 
 * @desc 获取所有用户
 * @route GET /api/v1/auth/users
 * @access private/Admin
 */ 
exports.getUsers = asyncHandler(async(req, res, next) => {
  res.status(200).send(res.advanceResults)
})
/** 
 * @desc 获取单个用户
 * @route GET /api/v1/auth/users/:id
 * @access private/Admin
 */ 
exports.getUser = asyncHandler(async(req, res, next) => {
  const user = await User.findById(req.params.id)  
  res.status(200).send({success: true, data: user})
})
/** 
 * @desc 创建用户
 * @route POST /api/v1/auth/users
 * @access private/Admin
 */ 
exports.createUser = asyncHandler(async(req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({success:true, data: user})
})
/** 
 * @desc 更新用户
 * @route PUT /api/v1/auth/user/:id
 * @access private/Admin
 */ 
exports.updateUser= asyncHandler(async(req, res, next) => {
   console.log(req.params.id, req.body)
   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
       new: true,
       runValidators: true
   })
   res.status(200).json({success:true, data: user})
})
/** 
 * @desc 删除用户
 * @route DELETE /api/v1/auth/user/:id
 * @access private/Admin
 */ 
exports.deleteUser = asyncHandler(async(req, res, next) => {
    await  User.findByIdAndDelete(req.params.id)
    res.status(200).json({success:true, data: {}})
})
