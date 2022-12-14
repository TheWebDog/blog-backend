const mongooseConnected = require('../db')

const User = mongooseConnected.Schema({
  name:String,  
  password:String,
  date:String,
  power: Number,

  sex: String,  // 性别
  WeChat: String, // 微信
  signature: String,  // 个性签名

  myCollection:Array, // 我的收藏
  portrait:String,  // 头像图片二进制编码
  myReply: Array,  // 我的回复
  alreadyReadReplyNum: Number,  // 已读回复数量
})

const UserModel = mongooseConnected.model('userData', User);

module.exports = UserModel