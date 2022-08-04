const mongooseConnected = require('../db')

const comment = mongooseConnected.Schema({
  userComment: String,
  articleId: String,
  articleTitle:String,
  userName: String,
  userId: String,
  date: String,
  childrenComment: Array,
})

const UserCommentModel = mongooseConnected.model('commentData', comment)

module.exports = UserCommentModel
