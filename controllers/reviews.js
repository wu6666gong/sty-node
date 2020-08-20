const Review = require('../models/Review.js')
const Mscamps = require('../models/Mscamp.js')
const errorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('../middlemare/async.js');
const ErrorResponse = require('../utils/errorResponse.js');
/** 
 * @desc 获取所有评论信息
 * @route GET /api/v1/reviews
 * @route GET /api/v1/mscamps/:mscampId/reviews
 * @access 公开得
 */ 
exports.getReviews = asyncHandler(async(req, res, next) => {
    if(req.params.mscampId){
     const reviews = await Review.find({
        mscamp: req.params.mscampId
      })
      res.status(200).json({
        success: true, 
        count: reviews.length,
        data: reviews
      })
    } else {
      res.status(200).json({
        success: true, 
        data: res.advanceResults
      })
    }
})
/** 
 * @desc 根据ID获取某个评论
 * @route GET /api/v1/reviews/:id
 * @access 公开得
 */ 
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'mscamp',
    select:"name description"
  });
  if(!review) {
    return next(new errorResponse(`review not found width id if ${req.params.id}`, 400))
  }
  res.status(200).json({
    success: true, 
    data: course
  })
})
/** 
 * @desc 根据ID跟新评论
 * @route PUT /api/v1/reviews/:id
 * @access private
 */ 
exports.updateReview = asyncHandler(async(req, res, next) => {
    let review = await Review.findById(req.params.id);
    if(!review) {
      return next(new errorResponse(`Resource not found width id if ${req.params.id}`, 404))
    }
    //  确定id和登陆id是一致的
    if(review.user.toString() !== req.user.id &&  req.user.role !== 'admin') {
      return next(new errorResponse(`该用户 ${req.user.id}无权限更新此评论数据`, 401))
    }
  
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      success: true, 
      data: review
    })
  })
  /** 
 * @desc 根据id删除评论
 * @route delete /api/v1/reviews/:id
 * @access private
 */ 
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if(!review) {
      return next(new errorResponse(`Resource not found width id if ${req.params.id}`, 404))
    }
  
    //  确定id和登陆id是一致的
     if(review.user.toString() !== req.user.id &&  req.user.role !== 'admin') {
      return next(new errorResponse(`该用户 ${req.user.id}无权限删除此评论数据`, 401))
    }
    await review.remove()
    res.status(200).json({
      success: true, 
      data: {}
    })
  })
  /** 
 * @desc 添加评论数据
 * @route POST /api/v1/mscamps/:mscampId/reviews
 * @access private
 */ 
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.mscamp = req.params.mscampId
    req.body.user = req.user.id
    const  mscamp = await Mscamps.findById(req.params.mscampId)
    if(!mscamp) {
      return next(new errorResponse(`Resource not found width id if ${req.params.mscampId}`, 404))
    }
    //  确定id和登陆id是一致的
    if(mscamp.user.toString() !== req.user.id &&  req.user.role !== 'admin') {
        return next(new errorResponse(`该用户 ${req.user.id}无权限创建此数据`, 401))
    }
    const review = await Review.create(req.body)
    res.status(200).json({
      success: true, 
      data: review
    })
  })
