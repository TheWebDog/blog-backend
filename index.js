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

// 解析post请求发来的数据
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('链接成功')
})

// 分路由
app.use('/page', require('./routers/pageRouter'))
app.use('/user', require('./routers/userRouter'))

app.listen(6060)