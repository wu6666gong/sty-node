const crypto = require('crypto');
const User = require('../models/User.js')
const errorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('../middlemare/async.js')
const sendeEmail = require("../utils/sendEmail")
/** 
 * @desc 注册
 * @route PUT /api/v1/auth/register
 * @access 公共的
 */ 
exports.register = asyncHandler(async(req, res, next) => {
  const {name, email, password, role} = req.body
  const user = await User.create({name, email, password, role})
  sendTokenResponese(user, 200, res)
})
/** 
 * @desc 登陆
 * @route PUT /api/v1/login
 * @access 公共的
 */ 
exports.login = asyncHandler(async(req, res, next) => {
  const {email, password} = req.body
  if(!email || !password){
    return next(new errorResponse('请填写邮箱和密码', 400))
  }
  const user = await User.findOne({email}).select("+password")
  if(!user){
    return next(new errorResponse('参数有误', 401))
  }
  const isMatch = await user.matchPassword(password);
  if(!isMatch) {
    return next(new errorResponse('密码错误', 401))
  }
  sendTokenResponese(user, 200, res)
})

// 生成token并存储cookie
const sendTokenResponese = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE* 24*60*60*1000),
    httpOnly: true
  }
  if(process.env.NODE_ENV === 'production') {
     options.secure=true
  }
  res.status(statusCode).cookie("token",token,options).json({success: true, token})
}
/** 
 * @desc 更新个人信息
 * @route PUT /api/v1/auth/updatedetails
 * @access Private
 */ 
exports.updateDetails = asyncHandler(async(req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  }
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true, 
    runValidators: true
  });
  res.status(200).json({success:true, data: user})
})
/** 
 * @desc 更新密码
 * @route PUT /api/v1/auth/updatepassword
 * @access Private
 */ 
exports.updatePassword= asyncHandler(async(req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // 判断旧密码和数据库密码是否一致
  if(!(await user.matchPassword(req.body.currentPassword))){
    return next(new errorResponse('密码错误', 401))
  }
  // 跟新密码
  user.password = req.body.newPassword
  await user.save();
  sendTokenResponese(user, 200, res)
})
/** 
 * @desc 获取当前用户登陆信息
 * @route GET /api/v1/auth/me
 * @access 公共的
 */ 
exports.getMe = asyncHandler(async(req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({success:true, data: user})
})
/** 
 * @desc 忘记密码
 * @route POST /api/v1/auth/forgotpassword
 * @access 公共的
 */ 
exports.forgotPassword = asyncHandler(async(req, res, next) => {
  const user = await User.findOne({email: req.body.email});
  if(!user) {
    return next(new errorResponse('未找到该用户', 404))
  }
  // {{URL}}/api/v1/auth/resetpassword/
  const resetToken =  user.getResetPasswordToken();
  const resetUrl = `${req.protocol}://${req.get("host")}/v1/auth/resetpassword/${resetToken}`
  try{
    await sendeEmail({
      email: req.body.email,
      subject: '重置密码',
      message: resetUrl
    }) 
  }catch(error){
  console.log(error, 'error')
   user.resetPasswordToken=""
   user.resetPasswordExpire=""
   await user.save({
    validateBeforeSave: false
  })
   return next(new errorResponse('发送邮箱错误', 500))
  }
  
  await user.save({
    validateBeforeSave: false
  })
  res.status(200).json({success:true, data: user})
})
/** 
 * @desc 重置密码
 * @route PUT /api/v1/auth/resetpassword/:resettoken
 * @access 公共的
 */ 
exports.resetPwd = asyncHandler(async(req, res, next) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resettoken).digest("hex")
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now()
    }
  })
  if(!user){
    return next(new errorResponse('token不合法', 400))
  }
  user.password = req.body.password
  user.resetPasswordExpire = undefined
  user.resetPasswordExpire = undefined
  await user.save({
    validateBeforeSave: false
  })
  sendTokenResponese(user, 200, res)
})