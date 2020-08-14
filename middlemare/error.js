const errorResponse = require('../utils/errorResponse.js')
const errorHandle = (err,req,res, next) => {
  console.log(err);
  if(err.name === 'CastError') {
    const message = `Resource not found width id if ${err.value}`
    err = new errorResponse(message, 404)
  }
  if(err.code === 11000) {
    const message = `输入重复得字段值`
    err = new errorResponse(message, 400)
  }
  if(err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(item => item.message)
    err = new errorResponse(message, 400)
  }
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  })
}
module.exports = errorHandle