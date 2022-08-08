const express = require('express')
const router = express.Router()
const fs = require('fs')
const fsPromises = require('fs').promises
const async = require('async')
const PageModel = require('../models/page')
const SavePageModel = require('../models/savePage')
const UserCommentModel = require('../models/comment')
const imgModel = require('../models/imgModel')
const pinyinPro = require('pinyin-pro').pinyin
const path = require('path')

const multiparty = require('multiparty') // 处理fromdata图片的中间件

// 接口--------------------------------------------------------------------------------

// 测试接口
router.get('/test', (req, res) => {
  res.send('page/test链接成功')
})

// 图片
// 获取图片base64数据
// 格式：/page/getPic/homePage2.gif
router.get('/getPic/:pic', function (req, res) {
  // var getPic =req.params.pic
  // res.sendFile(path.resolve(`./public/${getPic}`), function (err) {
  //   if (err) {
  //     var theErr = 'err'+err
  //     console.log(err)
  //     res.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' })
  //     res.write(theErr)
  //     res.end()
  //   }
  // })

  var picId = req.params.pic

  imgModel.findById(picId, function (err, doc) {
    if (err) {
      console.log(err)
    } else {
      // console.log(doc.img.data.toString('base64'))
      // res.contentType(doc.img.contentType);
      res.send('data:image/png;base64,' + doc.img.data.toString('base64'))
    }
  })
})

// md文章图片删除
router.get('/removePic/:pic', function (req, res) {
  var picId = req.params.pic
  imgModel.findById(picId, function (err, doc) {
    if (err) {
      console.log(err)
      res.send({ err: err })
    } else {
      imgModel.deleteOne(picId, function (error, resault) {
        if (err) {
          console.log(error)
          res.send({ error: error })
        } else {
          res.send('removed')
        }
      })
    }
  })
})

// md文章图片增添
router.post('/submitMavonPic', function (req, res) {
  // 对图片的处理
  // var form_pic = new multiparty.Form({ uploadDir: './public/images' }) 修改了
  // var form_pic = new multiparty.Form({ uploadDir: path.resolve('./public/images') })
  var form_pic = new multiparty.Form()
  form_pic.parse(req, async (err, fields, files) => {
    if (err) {
      console.log('submitMavonPic时err了', err)
      res.send('submitMavonPic时err了')
    } else {
      var pic_path = files.mavon_editor_pic[0].path

      // var requirePath = `/page/getPic/${pic_path}`
      // res.send({ requirePath, pic_path })

      var img = new imgModel()
      img.img.data = fs.readFileSync(pic_path)
      img.img.contentType = 'image/png'
      img.save(function (error, a) {
        if (error) {
          console.log(error)
        } else {
          var requirePath = `/page/getPic/${a._id}`
          res.send(requirePath)
        }
      })
    }
  })
})

// 接收文章
router.post('/submitPage', function (req, res) {
  ;(async () => {
    // console.log(req)
    // new一个Form类 并写入存放路径uploadDir
    // var form_pic = new multiparty.Form({ uploadDir: path.resolve('./public/images') })

    var form_pic = new multiparty.Form()
    // 对数据进行处理
    var picId
    var requirePath
    form_pic.parse(req, async (err, fields, files) => {
      if (err) {
        // 数据处理错误
        console.log('submitPage时err了', err)
        res.send('submitPage时err了')
      } else {
        // 处理封面图片
        var pic_path = files.pic[0].path
        // console.log(pic_path, 'pic_path')
        var img = new imgModel()
        img.img.data = fs.readFileSync(pic_path)
        img.img.contentType = 'image/png'
        img.save(async (error, a) => {
          if (error) {
            console.log(error)
          } else {
            picId = a._id
            // console.log(a)
            requirePath = `/page/getPic/${a._id}`

            // 数据取出
            var { title, category, synopsis, md, html, mdPic } = fields
            // 我去太奶奶的 竟然都是数组 就那么一项 给我整数组嘎哈 靠靠靠靠靠 mlgbz的
            var title = title[0]
            // 判断重名文章
            var resault = await PageModel.find({ title: title })
            if (resault.length == 0) {
              // 不重名 规划数据并存入mongoose
              var category = category[0]
              var synopsis = synopsis[0]
              var md = md[0]
              var html = html[0]
              mdPic[0].length == 0 ? (mdPic = []) : mdPic
              mdPic.push(picId)
              var coverRequirePath = requirePath
              var now = new Date()
              var day = now.getDate()
              var month = now.getMonth() + 1
              var year = now.getFullYear()
              var pinyinAndTitle =
                pinyinPro(title, { toneType: 'none' })
                  .split(' ')
                  .join('')
                  .toLowerCase() + title
              const thepage = new PageModel({
                title,
                pinyinAndTitle,
                coverRequirePath,
                category,
                synopsis,
                date: `${year}-${month}-${day}`, // 日期
                md,
                html,
                mdPic,
              })
              thepage.save(function (err, result) {
                // 文章存入mongoose
                if (err) {
                  console.log(err, '-----------err')
                  res.send('失败')
                } else {
                  // console.log(result, '-----------res')
                  res.send('成功')
                }
              })
            } else {
              // 重名 删除本次存放的图片 并返回结果提示
              imgModel.findById(picId, function (err, doc) {
                if (err) {
                  console.log(err)
                  res.send({ err: err })
                } else {
                  imgModel.deleteOne(picId, function (error, resault) {
                    if (err) {
                      console.log(error)
                      res.send({ error: error })
                    } else {
                      res.send('文章标题重复，请修改')
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  })().catch((e) => console.error(e, 'err'))
})

// 保存草稿 待完善
router.post('/savePage', function (req, res) {
  ;(async () => {
    // var form_pic = new multiparty.Form({ uploadDir: path.resolve('./public/images') })
    var form_pic = new multiparty.Form()
    form_pic.parse(req, async (err, fields, files) => {
      if (err) {
        console.log('savePage时err了', err)
        res.send('savePage时err了')
      } else {
        var { title, category, synopsis, md, mdPic } = fields
        var title = title[0] ? title[0] : null
        var category = category[0] ? category[0] : null
        var synopsis = synopsis[0] ? synopsis[0] : null
        var md = md[0] ? md[0] : null

        var pic_path = files.pic ? files.pic[0].path : null
        mdPic == [''] ? (mdPic = []) : mdPic
        pic_path ? mdPic.push(pic_path) : (mdPic = null)
        var coverRequirePath = pic_path ? `/page/getPic/${pic_path}` : null

        const savePage = new SavePageModel({
          title,
          coverRequirePath,
          category,
          synopsis,
          md,
          mdPic,
        })
        savePage.save(function (err, result) {
          //执行
          if (err) {
            console.log(err, '-----------err')
            res.send('失败')
          } else {
            console.log(result, '-----------res')
            res.send('成功')
          }
        })
      }
    })
  })().catch((e) => console.error(e, 'err'))
})

// 获取分类列表
router.get('/getClassify', function (req, res) {
  ;(async () => {
    PageModel.find({})
      .then((resault) => {
        var arr = []
        var classifyList = []
        var set = new Set()
        for (var i = 0; i < resault.length; i++) {
          var categoryValue = resault[i].category
          set.add(categoryValue)
        }
        classifyList = [...set]
        // console.log(classifyList)
        res.send(classifyList)
      })
      .catch((err) => {
        console.log(err, '---err')
        res.send('查询失败')
      })
  })().catch((e) => console.error(e, 'err'))
})

// 搜索文章列表
router.post('/search', function (req, res) {
  var { value } = req.body
  var wd = value.split("'").join('').split(' ').join('').toLowerCase()
  var reg = new RegExp(`${wd}`) // 转换成正则表达
  ;(async () => {
    // 获取文章列表
    if (value) {
      var resault = await PageModel.find({ pinyinAndTitle: reg })
    } else {
      var resault = await PageModel.find({})
    }
    res.send(resault)
  })().catch((e) => console.error(e, 'err'))
})

// 分类文章列表
router.post('/getList', function (req, res) {
  var { value } = req.body
  ;(async () => {
    // 获取文章列表
    if (value) {
      var resault = await PageModel.find({ category: value })
    } else {
      var resault = await PageModel.find({})
    }
    res.send(resault)
  })()
})

// 获取文章
router.post('/getArticlePage', function (req, res) {
  var { id } = req.body
  ;(async () => {
    var findresault = await PageModel.find({ _id: id })

    if (findresault.length == 0) {
      res.send('文章丢失')
    } else {
      res.send(findresault[0])
    }
  })().catch((e) => console.error(e, 'err'))
})

// 删除文章
router.post('/removeArticle', function (req, res) {
  var { id } = req.body
  ;(async () => {
    var findresault = await PageModel.find({ _id: id })
    if (findresault.length == 0) {
      res.send('文章不存在')
    } else {
      // 删除与文章关联的图片
      var mdPicID = findresault[0].mdPic
      for (var i = 0; i < mdPicID.length; i++) {
        imgModel.findById(mdPicID, function (err, doc) {
          if (err) {
            console.log(err)
            // res.send({'err':err})
          } else {
            imgModel.deleteOne(mdPicID, function (error, resault) {
              if (err) {
                console.log(error)
                // res.send({'error':error})
              } else {
                console.log('removed')
              }
            })
          }
        })
      }

      // 删除与文章关联的评论
      var articleId = id
      var Commentfindresault = await UserCommentModel.find({ articleId: articleId })
      if (Commentfindresault.length == 0) {
        res.send('该评论不存在')
      } else {
        Commentfindresault.forEach((item) => {
          item.remove()
        })
        await UserCommentModel.delete({ articleId: articleId })
        // res.send('删除成功')
      }

      // 删除文章
      await findresault.remove()
      res.send('删除成功')
    }
  })().catch((e) => console.error(e, 'err'))
})

// 接收留言
router.post('/submitComment', function (req, res) {
  console.log('提交评论')
  var { userComment, articleId, userName, userId, articleTitle } = req.body
  var now = new Date()
  var day = now.getDate()
  var month = now.getMonth() + 1
  var year = now.getFullYear()
  var date = `${year}-${month}-${day}`
  const theComment = new UserCommentModel({
    userComment,
    articleId,
    articleTitle,
    userName,
    userId,
    date,
    childrenComment: [],
  })
  theComment.save(function (err, result) {
    // 评论存入mongoose
    if (err) {
      // console.log(err, '-----------err')
      res.send('失败')
    } else {
      // console.log(result, '-----------res')
      res.send('成功')
    }
  })
})

// 获取留言
router.post('/getArticleComment', function (req, res) {
  var { articleId } = req.body
  // console.log(req.body)
  ;(async () => {
    if (articleId) {
      var findresault = await UserCommentModel.find({ articleId: articleId })
      res.send(findresault)
    } else {
      var findresault = await UserCommentModel.find({})
      // console.log(findresault,'findresault')
      res.send(findresault)
    }
  })().catch((e) => console.error(e, 'err'))
})

// 接收留言的留言
router.post('/submitCommentComment', function (req, res) {
  var { commentId, userComment, userName, userId } = req.body
  var now = new Date()
  var day = now.getDate()
  var month = now.getMonth() + 1
  var year = now.getFullYear()
  var date = `${year}-${month}-${day}`
  var obj = {
    userComment,
    userName,
    userId,
    date,
  }
  ;(async () => {
    var findresault = await UserCommentModel.find({ _id: commentId })
    var { childrenComment } = findresault[0]
    childrenComment.push(obj)
    await UserCommentModel.updateOne(
      { _id: commentId },
      { childrenComment: childrenComment }
    )
    res.send('评论成功')
  })().catch((e) => console.error(e, 'err'))
})

// 删除评论
router.post('/removeComment', function (req, res) {
  var { id } = req.body
  ;(async () => {
    var findresault = await UserCommentModel.find({ _id: id })
    if (findresault.length == 0) {
      res.send('该评论不存在')
    } else {
      await UserCommentModel.deleteOne({ _id: id })
      res.send('删除成功')
    }
  })().catch((e) => console.error(e, 'err'))
})

// 删除子评论
router.post('/removeChildren', function (req, res) {
  var { userComment, id } = req.body
  ;(async () => {
    var findresault = await UserCommentModel.find({ _id: id })
    if (findresault.length == 0) {
      res.send('该评论不存在')
    } else {
      var arr = []
      var { childrenComment } = findresault[0]
      childrenComment.forEach((item) => {
        if (item.userComment != userComment) {
          arr.push(item)
        }
      })
      await UserCommentModel.updateOne({ _id: id }, { childrenComment: arr })
      res.send('删除成功')
    }
  })().catch((e) => console.error(e, 'err'))
})
module.exports = router
