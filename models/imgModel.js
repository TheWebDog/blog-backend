const mongooseConnected = require('../db')

const img = mongooseConnected.Schema({
  img: { data: Buffer, contentType: String }
})

const imgModel = mongooseConnected.model('imgData', img)

module.exports = imgModel

