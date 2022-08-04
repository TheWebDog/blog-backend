const express = require('express')
const router = express.Router()
const fsPromises = require('fs').promises
const async = require('async')
const UserModel = require('../models/user')

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
  console.log(name, password)
  if (name.length <= 10 && password.length <= 20) {
    // 数据大小通过
    ;(async () => {
      var findUser = await UserModel.find({ name: name })
      if (findUser == 0) {
        await informationEntry(name, password)
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
  var { name, password } = req.body
  ;(async () => {
    // 读取user数据库
    var resault = await UserModel.find({ name: name })
    if (resault.length != 0) {
      var user = resault[0]
      if ((user.password = password)) {
        // var power=user.power
        res.send({ user })
      } else {
        res.send('密码错误')
      }
    } else {
      res.send('该用户不存在')
    }
  })().catch((e) => console.error(e, 'err'))
})

// 获取用户名单
router.post('/getUserList', function (req, res) {
  // var { name, password } = req.body
  ;(async () => {
    // 读取user数据库
    var resault = await UserModel.find({})
    res.send(resault)
  })().catch((e) => console.error(e, 'err'))
})

// 删除用户名
router.post('/removeUser', function (req, res) {
  console.log(req.body)
  UserModel.deleteOne({ _id: id })
    .then(() => {
      res.send('删除成功')
    })
    .catch((e) => {
      res.send(e, 'err')
    })
})

// 更改用户名
router.post('/changeUser', function (req, res) {
  var { id ,value} = req.body
  UserModel.updateOne(
    { _id: id },
    { power: value }
    ).then(() => {
      res.send('更改成功')
    })
    .catch((e) => {
      res.send(e, 'err')
    })
})

module.exports = router
