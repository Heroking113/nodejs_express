//实现五个接口
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')

const express = require('express')
const router = express.Router()
const loginCheck = require('../middleware/loginCheck')
const { SuccessModel, ErrorModel } = require('../model/resModel')

//获取博客列表
router.get('/list', (req, res, next) => {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    if (req.query.isAdmin) {
        if (req.session.username == null) {
            res.json(
                new ErrorModel('未登录')
            )
            return
        }
        author = req.session.username
    }

    const result = getList(author, keyword)
    return result.then(listData => {
        res.json(
            new SuccessModel(listData)
        )
    })
})

//获取博客详情
router.get('/detail', (req, res, next) => {
    const result = getDetail(req.query.id)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
})

//新建博客
router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username
    const result = newBlog(req.session, req.body)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )

    })
})

//更新博客
router.post('/update', loginCheck, (req, res, next) => {
    const result = updateBlog(req.body)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel()
            )
        } else {
            res.json(
                new ErrorModel('更新博客失败！')
            )
        }
    })
})

//删除博客
router.post('/delete', loginCheck, (req, res, next) => {
    const author = req.session.username
    const thisId = req.body.id
    const result = delBlog(thisId, author)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel()
            )
        } else {
            res.json(
                new ErrorModel('删除博客失败！')
            )
        }
    })
})

module.exports = router;