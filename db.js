// var MongoClient = require('mongodb').MongoClient;
// var uri = "mongodb://TheWebDog:123456987@ac-qk0tbq4-shard-00-00.pjziwos.mongodb.net:27017,ac-qk0tbq4-shard-00-01.pjziwos.mongodb.net:27017,ac-qk0tbq4-shard-00-02.pjziwos.mongodb.net:27017/?ssl=true&replicaSet=atlas-5a6pyu-shard-0&authSource=admin&retryWrites=true&w=majority";
// MongoClient.connect(uri, function (err, client) {
//   console.log(1)
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });




// const mongoose = require('mongoose')
 
// const connection = 'mongodb://TheWebDog:123456987@ac-qk0tbq4-shard-00-00.pjziwos.mongodb.net:27017,ac-qk0tbq4-shard-00-01.pjziwos.mongodb.net:27017,ac-qk0tbq4-shard-00-02.pjziwos.mongodb.net:27017/?ssl=true&replicaSet=atlas-5a6pyu-shard-0&authSource=admin&retryWrites=true&w=majority/myblog'
// mongoose.connect(connection, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useFindAndModify: true
// }, () => console.log('mongoose连接成功了！'))
// mongoose.connection.on('error', console.error)


const DBurl = "mongodb+srv://TheWebDog:123456987@blog.pjziwos.mongodb.net/myblog?retryWrites=true&w=majority"
// 当连接失败时候 或者不是公网DNS时候使用旧版
const oldDBurl = 'mongodb://TheWebDog:123456987@ac-qk0tbq4-shard-00-00.pjziwos.mongodb.net:27017,ac-qk0tbq4-shard-00-01.pjziwos.mongodb.net:27017,ac-qk0tbq4-shard-00-02.pjziwos.mongodb.net:27017/myblog?ssl=true&replicaSet=atlas-5a6pyu-shard-0&authSource=admin&retryWrites=true&w=majority'

// 傻蛋李斌菘滴数据库 // 连不上
const LBdb = 'mongodb://lbs:2019lbs2100@43.142.123.118:27017/LYtestblog'


// 与数据库链接
const mongoose = require('mongoose');
mongoose.connect(oldDBurl,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false
});

// 用流 的一个方式监听；
mongoose.connection.on('error', function(error) {
  console.log('数据库连接失败：' + error);
});
mongoose.connection.once('open', function() {
  console.log('数据库连接成功');
});

module.exports = mongoose;