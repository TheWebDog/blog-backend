const mongooseConnected = require('../db')

const PageList = mongooseConnected.Schema({
  pageId: String,
  category: String,
  coverRequirePath: String,
  date: String,
  pinyinAndTitle: String,
  synopsis: String,
  title: String,
})

const PageListModel = mongooseConnected.model('PageList', PageList)

module.exports = PageListModel