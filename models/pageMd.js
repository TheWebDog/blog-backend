const mongooseConnected = require('../db')

const PageMd = mongooseConnected.Schema({
  md: String,  // md原文
  pageId : String // 文章id
})

const PageMdModel = mongooseConnected.model('PageMd', PageMd)

module.exports = PageMdModel