const Mscamp = require('../models/Mscamp.js')
const errorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('../middlemare/async.js')
// const 
exports.getMscamps = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advanceResults)
})
exports.createMscamp = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id
    // 如果用户角色是admin，可创建多个机构信息，否则只能创建一个机构
    const publishedMscamp = await Mscamp.findOne({user: req.user.id})
    if(publishedMscamp && req.user.role !== "admin") {
      return next(new errorResponse("该机构已存在不要重复创建", 400))
    }
    const mscamp = await Mscamp.create(req.body)
    res.status(200).json({
      success: true, 
      data: mscamp
    })
})
exports.getMscamp = asyncHandler(async (req, res, next) => {
    const mscamp = await Mscamp.findById(req.params.id)
    if(!mscamp){
      return next(new errorResponse(`Resource not found width id if ${req.params.id}`, 400))
    } 
    res.status(200).json({
      success: true, 
      data: mscamp
    })
})
exports.updateMscamp = asyncHandler(async (req, res, next) => {
  let mscamp = await Mscamp.findById(req.params.id);

  //没有找到
  if(!mscamp) {
    return next(new errorResponse(`resource not ound with id of ${req.params.id}`))
  }
  //  确定id和登陆id是一致的
  if(mscamp.user.toString() !== req.user.id &&  req.user.role !== 'admin') {
    return next(new errorResponse(`该用户 ${req.params.id}无权限更新此数据`, 401))
  }

  mscamp = await Mscamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if(!mscamp){
    return next(new errorResponse(`Resource not found width id if ${req.params.id}`, 400))
  }
  res.status(200).json({
    success: true, 
    data: mscamp
  })
})
exports.deleteMscamp = asyncHandler(async(req, res, next) => {
    const mscamp = await Mscamp.findById(req.params.id)
    if(!mscamp){
      return next(new errorResponse(`Resource not found width id if ${req.params.id}`, 400))
    }
      //  确定id和登陆id是一致的
    if(mscamp.user.toString() !== req.user.id &&  req.user.role !== 'admin') {
      return next(new errorResponse(`该用户 ${req.params.id}无权限删除此数据`, 401))
    }
    mscamp.remove()
    res.status(200).json({
      success: true, 
      data: {}
    })
})