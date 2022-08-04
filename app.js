const express = require('express');
const cors = require('cors')
const app = express();

// 解决跨域问题
app.use(cors())

// 解析post请求发来的数据
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// 分路由
app.use('/page', require('./routers/pageRouter'))
app.use('/user', require('./routers/userRouter'))

app.listen(4000)