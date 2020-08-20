const express = require('express');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const mscamps = require('./routes/mscamps.js')
const courses = require('./routes/courses.js')
const auth = require('./routes/auth.js')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const mongoDB = require('./config/db.js')
const errorHandler = require('./middlemare/error.js')
// const logger = require('./middlemare/logger')
const morgan = require('morgan')
const colors = require('colors')
dotenv.config({
  path: './config/config.env'
})

mongoDB()

const app = express()

app.use(cookieParser())

app.use(express.json())

app.use(morgan('dev'))


app.get('/', (req, res) => {
  res.json({'aa': 123})
})

app.use('/api/vi/mscamps', mscamps)
app.use('/api/vi/courses', courses)
app.use('/api/vi/auth', auth)
app.use('/api/vi/users', users)
app.use('/api/vi/reviews', reviews)
app.use(errorHandler)

const PORT = process.env.PORT || 3000










const server = app.listen(PORT, console.log(`${process.env.NODE_ENV}- ${process.env.PORT}`.red))
process.on("unhandledRejection", (err, promise) => {
  console.log(`ERROR： ${err.message}`.red.bold);
  server.close(() => {
    process.exit(1);
  })
})