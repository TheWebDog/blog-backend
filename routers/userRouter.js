const express = require('express')
const router = express.Router()
const fsPromises = require('fs').promises
const async = require('async')
const UserModel = require('../models/user')
const UserCommentModel = require('../models/comment')
// const imgModel = require('../models/imgModel')
const { generatorToken, verifyToken } = require('../tools/jwt')

// const bcrypt = require('bcrypt') 用于给用户加密 密码变为哈希值

var bcrypt = require('bcryptjs') //引入bcryptjs库
var salt = bcrypt.genSaltSync(12) //定义密码加密的计算强度,默认10
var hashKeySalt = '541231c3e1ad2was##@&U45f4w3eqa65s5a' // 给hash密码加的盐
// var hash = bcrypt.hashSync(passWord, salt);    //把自己的密码(this.registerForm.passWord)带进去,变量hash就是加密后的密码

// cookie有效时长
var effectiveDuration = 1000000

// 核对token
router.post('/check', verifyToken, (req, res) => {
  // console.log(req.body.tokenData.user.power)
  var user = req.body.tokenData.user
  res.send({ user })
})

// token提取数据
router.post('/getTokenInformation', verifyToken, (req, res) => {
  // console.log(req.body.tokenData.user.power)
  ;(async () => {
    var _id = req.body.tokenData.user._id
    var user = await UserModel.findById(_id)
    res.send({ user })
  })().catch((e) => console.error(e, 'err'))
})

// 更新Token
router.post('/updateToken', verifyToken, (req, res) => {
  ;(async () => {
    var _id = req.body.tokenData.user._id
    var theuser = await UserModel.findById(_id)
    if (user) {
      var name = theuser.name
      var _id = theuser._id
      var power = theuser.power
      var user = { name, power, _id }
      var tokenData = { user }
      var token = generatorToken(tokenData, effectiveDuration)
      res.send({ token })
    } else {
      res.send('用户不存在')
    }
  })().catch((e) => console.error(e, 'err'))
})

// 录入用户函数
var informationEntry = async function (name, password) {
  var now = new Date()
  var day = now.getDate()
  var month = now.getMonth() + 1
  var year = now.getFullYear()
  var date = `${year}-${month}-${day}`
  const theUser = new UserModel({
    name,
    password,
    date,
    // 权限大小
    power: 1,

    sex: '', // 性别
    WeChat: '', // 微信
    signature: '', // 个性签名

    myCollection: [], // 我的收藏
    portrait: null, // 头像图片二进制
    myReply: [], // 我的回复
    alreadyReadReplyNum: 0, // 已读回复数量
  })
  theUser.save(() => {
    console.log('注册完成')
  })
}

// 接口--------------------------------------------------------------------------------

// 注册用户
router.post('/register', function (req, res) {
  // 检查数据大小
  var { name, password } = req.body
  // console.log(name, password)
  if (name.length <= 10 && password.length <= 20) {
    // 数据大小通过
    ;(async () => {
      var findUser = await UserModel.find({ name: name })
      if (findUser == 0 && name != '此用户已被删除') {
        var hash = bcrypt.hashSync(password + hashKeySalt, salt)
        // console.log(hash)
        await informationEntry(name, hash)
        res.send('注册成功')
      } else {
        res.send('用户已存在')
        return
      }
    })().catch((e) => console.error(e, 'err'))
  } else {
    // 数据大小不合格
    res.send('可能名字、密码过长')
  }
})

// 登录
router.post('/login', function (req, res) {
  ;(async () => {
    // 读取user数据库
    var { name, password } = req.body
    var resault = await UserModel.find({ name: name })
    if (resault.length != 0) {
      var theuser = resault[0]
      var hash = bcrypt.hashSync(password + hashKeySalt, salt)
      if ((theuser.password = hash)) {
        // delete theuser.password
        var name = theuser.name
        var _id = theuser._id
        // var password = theuser.password
        // var date = theuser.date
        var power = theuser.power
        // var sex = theuser.sex
        // var WeChat = theuser.WeChat
        // var user={name,password,date,power,sex,WeChat}
        var user = { name, power, _id }
        var tokenData = { user }
        var token = generatorToken(tokenData, effectiveDuration)
        // res.cookie('token', token, { maxAge: effectiveDuration })  // 因为一些问题 cookie无法设置在浏览器
        res.send({ token })
        // res.send({ user })
      } else {
        res.send('密码错误')
      }
    } else {
      res.send('该用户不存在')
    }
  })().catch((e) => console.error(e, 'err'))
})

// 获取用户名单
router.get('/getUserList', function (req, res) {
  // var { name, password } = req.body
  ;(async () => {
    // 读取user数据库
    var resault = await UserModel.find({})
    res.send(resault)
  })().catch((e) => console.error(e, 'err'))
})

// 删除用户
router.post('/removeUser', function (req, res) {
  console.log(req.body)
  var { id } = req.body
  UserModel.deleteOne({ _id: id })
    .then(() => {
      res.send('删除成功')
    })
    .catch((e) => {
      res.send(e, 'err')
    })
})

// 更改用户权限
router.post('/changeUserPower', function (req, res) {
  var { id, value } = req.body
  UserModel.updateOne({ _id: id }, { power: value })
    .then(() => {
      res.send('更改成功')
    })
    .catch((e) => {
      res.send(e, 'err')
    })
})

// 个人信息
router.post('/myComments', verifyToken, (req, res) => {
  var userId = req.body.tokenData.user._id
  ;(async () => {
    var findresault = await UserCommentModel.find({ userId: userId })
    res.send(findresault)
  })().catch((e) => console.error(e, 'err'))
})
router.post('/updateMyInformation', verifyToken, (req, res) => {
  ;(async () => {
    var userId = req.body.tokenData.user._id
    var { WeChat, name, portrait, sex, signature } = req.body.user
    var resalt = await UserModel.updateOne(
      { _id: userId },
      {
        WeChat: WeChat,
        name: name,
        portrait: portrait,
        sex: sex,
        signature: signature,
      }
    )

    var theuser = req.body.tokenData.user
    // var theuser = await UserModel.findById(userId)
    if (theuser) {
      // var name = theuser.name
      var _id = userId
      var power = theuser.power
      var user = { name, power, _id }
      var tokenData = { user }
      var token = generatorToken(tokenData, effectiveDuration)
      res.send({ token })
    } else {
      res.send('用户不存在')
    }

  })().catch((e) => console.error(e, 'err'))
})

module.exports = router
