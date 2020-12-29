const express = require('express')
const userInfoService = require('../service/userInfoService')

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const multiparty = require('multiparty')

const router = express.Router()

// 获取用户信息
router.get('/userInfo/:uid', async (req, res) => {
  const { uid } = req.params
  const data = await userInfoService.selectUserInfo(uid)
  if (data.length > 0) {
    res.json({
      data,
      meta: {
        status: 200,
        msg: '获取用户信息成功'
      }
    })
  } else {
    res.json({
      meta: {
        status: 400,
        msg: '获取用户信息失败'
      }
    })
  }
})

// 修改用户信息
router.put('/userInfo/:infoId', async (req, res) => {
  const { infoId } = req.params
  const { username, sex, phone, email, remark } = req.body
  const updateObj = {
    username,
    sex,
    phone,
    email,
    remark
  }
  const data = await userInfoService.updateUserInfo(infoId, updateObj)
  if (data && data.affectedRows > 0) {
    res.json({
      meta: {
        status: 200,
        msg: '修改用户信息成功'
      }
    })
  } else {
    res.json({
      meta: {
        status: 400,
        msg: '修改用户信息失败'
      }
    })
  }
})

// 修改用户头像
router.put('/userInfo/image/:uid', async (req, res) => {
  const { uid } = req.params
  // 设置路径为当前用户的目录
  const dir = path.join(__dirname, '/../images/' + uid)
  // 如果目录不存在则创建目录
  mkdirp(dir, (err) => {
    if (err) {
      console.log('创建目录失败')
    }
  })
  // 创建表单接收
  const form = new multiparty.Form({ uploadDir: dir })
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log('上传失败:' + err)
    } else {
      let data = await userInfoService.updateImage(uid, dir, files)
      if (data.affectedRows === 1) {
        // 注册成功
        res.json({
          meta: {
            status: 200,
            msg: '修改成功'
          }
        })
      } else {
        res.send({
          meta: {
            status: 400,
            msg: '修改失败'
          }
        })
      }
    }
  })
})

module.exports = router