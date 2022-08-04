const mongooseConnected = require('../db')

const Page = mongooseConnected.Schema({
  title: String, // 标题
  coverRequirePath:String, // 封面图片网络路径
  category: String, // 分类
  synopsis: String, // 简介
  md: String, // md原文
  mdPic: Array, // 有关图片文件路径
})

const SavePageModel = mongooseConnected.model('savePageData', Page)

module.exports = SavePageModel