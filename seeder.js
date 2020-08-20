const mongoose = require("mongoose");
const fs = require('fs')
const colors = require('colors')
const dotenv = require('dotenv')
dotenv.config({
  path: './config/config.env'
})
const Mscamp = require('./models/Mscamp.js')
const Course = require('./models/Course.js')
const User = require('./models/User.js')
const Review = require("./models/Review.js")
  mongoose.connect(
    process.env.NEW_MONGO_URL,
      { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
  );

const mscamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/mscamps.json`, 'utf-8')) 
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'))
const importData = async () => {
  try {
    await Mscamp.create(mscamps)
    await Course.create(courses)
    await User.create(users)
    await Review.create(reviews)
    console.log('数据存储成功'.green.bold)
    process.exit()
  }catch(err){
    console.log(err)
  }
}
const deleteData = async () => {
  try{
    await Mscamp.deleteMany()
    await Course.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()
    console.log('数据清除成功'.green.bold)
    process.exit()
  }catch(err) {
    console.log(err)
  }
}
if(process.argv[2] === '-i') {
  importData()
} else if(process.argv[2] === '-d') {
  deleteData()
}
