const crypto = require('crypto');
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '请添加名字']
  },
  email: {
    type: String,
    unique: true,
    required: [true, '请填写邮箱'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "请填写正确的邮箱地址"
    ]
  },
  role: {
    type: String,
    enum: ["admin", "user", "visitor"],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, '请填写密码'],
    maxlength:6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now()
  }
})
UserSchema.pre('save', async function(next){
  if(!this.isModified("password")) {
     return next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next()
})
UserSchema.methods.getSignedJwtToken = function(){
  return jwt.sign({ id: this._id, name: this.name }, process.env.JWT_SECRET, { 
   expiresIn: process.env.JWT_EXPIRE
  });
}
UserSchema.methods.matchPassword = async function(enterdPassword){
  console.log(this);
  return await bcrypt.compare(enterdPassword, this.password); 
}
UserSchema.methods.getResetPasswordToken = function(){
  const resetToken = crypto.randomBytes(20).toString("hex")
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  console.log(this.resetPasswordToken,  this.resetPasswordExpire);
  return resetToken;
}

module.exports = mongoose.model('User', UserSchema)