const express = require('express')
const router = express.Router()
const fsPromises = require('fs').promises
const async = require('async')
const PageModel = require('../models/page')
const SavePageModel = require('../models/savePage')
const UserCommentModel = require('../models/comment')
const pinyinPro = require('pinyin-pro').pinyin
const path = require('path')

const multiparty = require('multiparty') // 处理fromdata图片的中间件

// 接口--------------------------------------------------------------------------------

// 图片
// md文章图片获取
// 格式要求：res.send(`http://localhost:4000/page/getPic?picUrl=${XXX}`)
router.get('/getPic', function (req, res) {
  var { picUrl } = req.query
  // console.log(picUrl)
  res.sendFile(path.resolve(`./${picUrl}`))
})

// md文章图片删除
// 格式要求：res.send(`http://localhost:4000/page/removePic?picUrl=${XXX}`)
router.get('/removePic', function (req, res) {
  var { picUrl } = req.query
  fsPromises.unlink(`./${picUrl}`)
  res.send('removed')
})

// md文章图片增添
router.post('/submitMavonPic', function (req, res) {
  // 对图片的处理
  var form_pic = new multiparty.Form({ uploadDir: './public/images' })
  form_pic.parse(req, async (err, fields, files) => {
    if (err) {
      console.log('submitMavonPic时err了')
      res.send('submitMavonPic时err了')
    } else {
      var pic_path = files.mavon_editor_pic[0].path
      var requirePath = `http://localhost:4000/page/getPic?picUrl=${pic_path}`
      res.send({ requirePath, pic_path })
    }
  })
})

// 接收文章
router.post('/submitPage', function (req, res) {
  ;(async () => {
    // new一个Form类 并写入存放路径uploadDir
    var form_pic = new multiparty.Form({ uploadDir: './public/images' })
    // 对数据进行处理
    form_pic.parse(req, async (err, fields, files) => {
      if (err) {
        // 数据处理错误
        console.log('submitPage时err了')
        res.send('submitPage时err了')
      } else {
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
          var pic_path = files.pic[0].path
          mdPic[0].length == 0 ? (mdPic = []) : mdPic
          mdPic.push(pic_path)
          var coverRequirePath = `http://localhost:4000/page/getPic?picUrl=${pic_path}`
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
              // console.log(err, '-----------err')
              res.send('失败')
            } else {
              // console.log(result, '-----------res')
              res.send('成功')
            }
          })
        } else {
          // 重名 删除本次存放的图片 并返回结果提示
          var pic_path = files.pic[0].path
          fsPromises.unlink(pic_path)
          res.send('文章标题重复，请修改')
        }
      }
    })
  })().catch((e) => console.error(e, 'err'))
})

// 保存草稿
router.post('/savePage', function (req, res) {
  ;(async () => {
    var form_pic = new multiparty.Form({ uploadDir: './public/images' })
    form_pic.parse(req, async (err, fields, files) => {
      if (err) {
        console.log('savePage时err了')
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
        var coverRequirePath = pic_path
          ? `http://localhost:4000/page/getPic?picUrl=${pic_path}`
          : null

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
      var mdPicArr = findresault[0].mdPic
      for (var i = 0; i < mdPicArr.length; i++) {
        var readPicFile = await fsPromises.readdir('./public/images')
        var picNameSplit = mdPicArr[i].split('\\')
        var picName = picNameSplit[picNameSplit.length - 1]
        if (mdPicArr[i].length != 0 && readPicFile.includes(picName)) {
          await fsPromises.unlink(mdPicArr[i])
        }
      }
      await PageModel.deleteOne({ _id: id })
      res.send('删除成功')
    }
  })().catch((e) => console.error(e, 'err'))
})

// 接收留言
router.post('/submitComment', function (req, res) {
  var { userComment, articleId, userName, userId ,articleTitle} = req.body
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
  var { userComment,id } = req.body
  ;(async () => {
    var findresault = await UserCommentModel.find({ _id: id })
    if (findresault.length == 0) {
      res.send('该评论不存在')
    } else {
      var arr=[]
      var { childrenComment } = findresault[0]
      childrenComment.forEach((item) => {
        if (item.userComment!=userComment) {
          arr.push(item)
        }
      });
      await UserCommentModel.updateOne(
        { _id: id },
        { childrenComment: arr }
      )
      res.send('删除成功')
    }
  })().catch((e) => console.error(e, 'err'))
})
module.exports = router