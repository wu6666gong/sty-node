const Courses = require('../models/Course.js')
const Mscamps = require('../models/Mscamp.js')
const errorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('../middlemare/async.js');
const ErrorResponse = require('../utils/errorResponse.js');
/** 
 * @desc 获取所有课程数据
 * @route GET /api/v1/courses
 * @route GET /api/v1/mscamps/:mscampId/courses
 * @access 公开得
 */ 
exports.getCourses = asyncHandler(async(req, res, next) => {
    if(req.params.mscampId){
     const course = await Courses.find({
        mscamp: req.params.mscampId
      })
      res.status(200).json({
        success: true, 
        count: course.length,
        data: course
      })
    } else {
      res.status(200).json({
        success: true, 
        data: res.advanceResults
      })
    }
})
/** 
 * @desc 根据ID获取某个课程数据
 * @route GET /api/v1/courses/:id
 * @access 公开得
 */ 
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course =await  Courses.findById(req.params.id).populate({
    path: 'mscamp',
    select:"name description"
  });
  if(!course) {
    return next(new errorResponse(`Resource not found width id if ${req.params.id}`, 400))
  }
  res.status(200).json({
    success: true, 
    data: course
  })
})
/** 
 * @desc 添加课程数据
 * @route POST /api/v1/mscamps/:mscampId/courses
 * @access private
 */ 
exports.addCourse = asyncHandler(async (req, res, next) => {
  const  mscamp = await Mscamps.findById(req.params.mscampId)
  if(!mscamp) {
    return next(new errorResponse(`Resource not found width id if ${req.params.mscampId}`, 404))
  }
  const course = await Courses.create(req.body)
  res.status(200).json({
    success: true, 
    data: course
  })
})
/** 
 * @desc 根据ID跟新课程数据
 * @route PUT /api/v1/courses/:id
 * @access private
 */ 
exports.updateCourse = asyncHandler(async(req, res, next) => {
  let  course = await Courses.findById(req.params.id);
  if(!course) {
    return next(new errorResponse(`Resource not found width id if ${req.params.id}`, 404))
  }
  course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true, 
    data: course
  })
})
/** 
 * @desc 根据id删除课程
 * @route delete /api/v1/courses/:id
 * @access private
 */ 
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id);
  if(!course) {
    return next(new errorResponse(`Resource not found width id if ${req.params.id}`, 404))
  }
  await course.remove()
  res.status(200).json({
    success: true, 
    data: {}
  })
})