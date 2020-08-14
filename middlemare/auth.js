const User = require('../models/User.js')
const jwt = require('jsonwebtoken')
const errorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('../middlemare/async.js')
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log(req.headers)
  if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } 
  // else if(req.cookie.token) {
  //   token = req.cookie.token
  // }
  if(!token){
    return next(new errorResponse('无权限访问该路由', 401));
  }
  try{
    // 校验token
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
  }catch(err){
    return next(new errorResponse('无权限访问该路由', 401));
  }
});

exports.authorize = (...roles) => {
 return (req,res,next) => {
   if(!roles.includes(req.user.role)) {
     return next(new errorResponse('该用户无权限访问此路由', 403))
   }
   next();
 }
}