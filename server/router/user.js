const express = require('express')
const userService = require('../service/userService')
const path = require('path')


const router = express.Router()

// 登录
router.post('/login', async (req, res) => {
  let data = await userService.login(req.body)
  if (Object.keys(data).length === 0) {
    res.send({
      meta: {
        status: 400,
        msg: '登陆失败，账号或密码错误'
      }
    })
  } else {
    res.json({
      data,
      meta: {
        status: 200,
        msg: '登录成功'
      }
    })
  }
})

// 检测账号是否存在
router.post('/register/username', async (req, res) => {
  const { username } = req.body
  const data = await userService.isUsername(username)
  if (data) {
    // 用户名未被注册过，可以使用
    res.json({
      meta: {
        status: 200,
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
      }
    })
  }
})

// 注册
router.put('/register', async (req, res) => {
  let data = await userService.register(req.body)
  if (data.affectedRows === 1) {
    // 注册成功
    res.json({
      meta: {
        status: 200,
        msg: '注册成功'
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '注册失败'
      }
    })
  }
})

// 获取图片
router.get('/image', (req, res) => {
  const { uid, url } = req.query
  res.sendFile(path.join(__dirname, '/../images/' + uid + '/' + url))
})

// 修改密码
router.put('/user/:uid', async (req, res) => {
  const { uid } = req.params
  // 获取旧密码，新密码
  const { oldPwd, newPwd } = req.body
  await userService.updatePwd(uid, oldPwd, newPwd).then(data => {
    if (data) {
      res.json({
        meta: {
          status: 200,
          msg: '修改密码成功'
        }
      })
    } else {
      res.json({
        meta: {
          status: 400,
          msg: '修改密码失败'
        }
      })
    }
  }).catch(err => {
    res.json({
      meta: {
        status: 401,
        msg: err.message
      }
    })
  })
})

module.exports = router