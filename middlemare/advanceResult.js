const advanceResult = (modle, populate) => async (req, res, next) => {
  const reqQuery = {...req.query}
    const removeFileds = ['select', 'sort', 'page', 'limit']
    removeFileds.forEach(params => delete reqQuery[params])

    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)



    let query = modle.find(JSON.parse(queryStr))
    if(req.query.select) {
      query = query.select(req.query.select.split(',').join(' '))
    }
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort("createdAt")
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2
    const startIndex = (page - 1) * limit
    const endIndex = page*limit
    const total = await modle.countDocuments();
    query.skip(startIndex).limit(limit)

    if(populate) {
      query = query.populate(populate)
    }
    const result = await query
    const pagination = {}
    console.log(startIndex)
    if(startIndex > 0) {
      pagination.prev = {
        page: page - 1, 
        limit
      }
    }
    if(endIndex < total) {
      pagination.next = {
        page: page + 1, 
        limit
      }
    }
    res.advanceResults = {
      success: true, 
      count: result.length,
      pagination,
      data: result
    }
    next()
}
module.exports = advanceResult