const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();

const cros = require('cors')
app.use(cros())


// 解析post请求发来的数据
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  // res.cookie('name','fuck')  // 无法设置
  res.send('链接成功')
})

// // 分路由
app.use('/page', require('./routers/pageRouter'))
app.use('/user', require('./routers/userRouter'))

app.listen(6060)










// const bodyParser=require('body-parser');

// var http=require('http');
// var https=require('https');

// //根据项目的路径导入生成的证书文件下面的key和pem是下载证书得到的
// var privateKey  = fs.readFileSync('key.key', 'utf8');
// var certificate = fs.readFileSync('pem.pem', 'utf8');
// var credentials = {key: privateKey, cert: certificate};
 
// var httpapp = http.createapp(app);
// var httpsapp = https.createapp(credentials, app);

// //可以分别设置http、https的访问端口号
// var PORT = 3060;
// var SSLPORT = 3090;
 
// //创建http服务器
// httpapp.listen(PORT, function() {
//     console.log('HTTP app is running on: http://localhost:%s', PORT);
// });
 
// //创建https服务器
// httpsapp.listen(SSLPORT, function() {
//     console.log('HTTPS app is running on: https://localhost:%s', SSLPORT);
// });
 
// //可以根据请求判断是http还是https
// app.get('/', function (req, res) {
//     if(req.protocol === 'https') {
//         res.status(200).send('This is https visit!');
//     }
//     else {
//         res.status(200).send('This is http visit!');
//     }
// });

// //使用body-parser中间件
// app.use(bodyParser.urlencoded({
//     extended:false
// }))

// //托管静态目录
// app.use(express.static("public"))










// const VercelRequest = require('@vercel/node').VercelRequest;
// const VercelResponse = require('@vercel/node').VercelResponse;

// module.exports = async (req: VercelRequest, res: VercelResponse) => {
//     const data = {
//         msg: "hello world!"
//     };
//     res.status(200).json(data);
// }

// 网易云项目抄来的
// app.set('trust proxy', true)
// app.use((req, res, next) => {
//   if (req.path !== '/' && !req.path.includes('.')) {
//     res.set({
//       'Access-Control-Allow-Credentials': true,
//       'Access-Control-Allow-Origin': req.headers.origin || '*',
//       'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
//       'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
//       'Content-Type': 'application/json; charset=utf-8',
//     })
//   }
//   req.method === 'OPTIONS' ? res.status(204).end() : next()
// })