const jwt = require('jsonwebtoken')

// 密钥
const key = 'dshfgajheklheeqf3213$1313v35a'

// 生成token的函数
function generatorToken(e ,time) {
  const token = jwt.sign(e, key , { expiresIn:time })
  return token
}

// 解析并验证token函数
function verifyToken(req, res, next) {
  var { token } = req.body
  // console.log(token)
  jwt.verify(token, key, (err, result) => {
    if (err) {
      res.send("未登录")
    } else {
      req.body.tokenData = result
      next()
    }
  })
}

module.exports = {
  generatorToken,
  verifyToken
}
