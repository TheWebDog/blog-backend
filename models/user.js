const mongooseConnected = require('../db')

const User = mongooseConnected.Schema({
  name:String,
  password:String,
  date:String,
  power: Number,
})

const UserModel = mongooseConnected.model('userData', User);

module.exports = UserModel