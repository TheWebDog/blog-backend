const mongooseConnected = require('../db')

const Page = mongooseConnected.Schema({
  title: String, // 标题
  pinyinAndTitle:String, // 用于搜索
  coverRequirePath:String, // 封面图片网络路径
  category: String, // 分类
  synopsis: String, // 简介
  date: String, // 日期
  md: String, // md原文
  html: String, // 转化后的html
  mdPic: Array, // 有关图片文件路径
})

const PageModel = mongooseConnected.model('pageData', Page)

module.exports = PageModel
