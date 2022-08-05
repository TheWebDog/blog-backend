const express = require('express');
const app = express();


// const VercelRequest = require('@vercel/node').VercelRequest;
// const VercelResponse = require('@vercel/node').VercelResponse;

// module.exports = async (req: VercelRequest, res: VercelResponse) => {
//     const data = {
//         msg: "hello world!"
//     };
//     res.status(200).json(data);
// }


// 解决跨域问题
// const cors = require('cors')
// app.use(cors())

// 网易云项目抄来的
app.set('trust proxy', true)
app.use((req, res, next) => {
  if (req.path !== '/' && !req.path.includes('.')) {
    res.set({
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
      'Content-Type': 'application/json; charset=utf-8',
    })
  }
  req.method === 'OPTIONS' ? res.status(204).end() : next()
})


// 解析post请求发来的数据
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('链接成功')
})

// // 分路由
// app.use('/page', require('./routers/pageRouter'))
// app.use('/user', require('./routers/userRouter'))

app.listen(6060)