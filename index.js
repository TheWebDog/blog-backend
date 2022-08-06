const express = require('express');
const server = express();



// 需要将express应用由默认的http更换为https
const session = require("express-session");
const bodyParser=require('body-parser');

var http=require('http');
var https=require('https');

var privateKey  = fs.readFileSync('key.key', 'utf8');
var certificate = fs.readFileSync('pem.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
 
var httpServer = http.createServer(server);
var httpsServer = https.createServer(credentials, server);

//可以分别设置http、https的访问端口号
var PORT = 3060;
var SSLPORT = 3090;
 
//创建http服务器
httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
 
//创建https服务器
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});
 
//可以根据请求判断是http还是https
server.get('/', function (req, res) {
    if(req.protocol === 'https') {
        res.status(200).send('This is https visit!');
    }
    else {
        res.status(200).send('This is http visit!');
    }
});

//使用body-parser中间件
server.use(bodyParser.urlencoded({
    extended:false
}))

//托管静态目录
server.use(express.static("public"))

// //解决跨域问题
// server.use(cors({
//     origin:["http://127.0.0.1:8081","http://localhost:8081","http://127.0.0.1:8080","http://localhost:8080"],
//     credentials:true
// }))

// session功能
server.use(session({
    secret:"128字符串",
    resave:true,
    saveUninitialized:true
}))










// 解析post请求发来的数据
server.use(express.urlencoded({extended:false}))
server.use(express.json())

server.get('/', (req, res) => {
  res.send('链接成功')
})

// // 分路由
server.use('/page', require('./routers/pageRouter'))
server.use('/user', require('./routers/userRouter'))

// server.listen(6060)














// const VercelRequest = require('@vercel/node').VercelRequest;
// const VercelResponse = require('@vercel/node').VercelResponse;

// module.exports = async (req: VercelRequest, res: VercelResponse) => {
//     const data = {
//         msg: "hello world!"
//     };
//     res.status(200).json(data);
// }

// 网易云项目抄来的
// server.set('trust proxy', true)
// server.use((req, res, next) => {
//   if (req.path !== '/' && !req.path.includes('.')) {
//     res.set({
//       'Access-Control-Allow-Credentials': true,
//       'Access-Control-Allow-Origin': req.headers.origin || '*',
//       'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
//       'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
//       'Content-Type': 'serverlication/json; charset=utf-8',
//     })
//   }
//   req.method === 'OPTIONS' ? res.status(204).end() : next()
// })