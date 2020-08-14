const User = require('../models/User.js')
const errorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('../middlemare/async.js')
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
  const isMatch = user.matchPassword(password);
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
 * @desc 获取当前用户登陆信息
 * @route GET /api/v1/auth/me
 * @access 公共的
 */ 
exports.getMe = asyncHandler(async(req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({success:true, data: user})
})