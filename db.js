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


// 与数据库链接
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017/myblog`);

module.exports = mongoose;