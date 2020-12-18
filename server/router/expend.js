const express = require('express')
const expendService = require('../service/expendService')
const path = require('path')
const mkdirp = require('mkdirp')
// 使用插件接收 formdata 数据
const multiparty = require('multiparty')
const fs = require('fs');
const { Console } = require('console')

const router = express.Router()

// 添加支出
router.post('/expend/:uid', (req, res) => {
  // 先获取 uid
  const { uid } = req.params
  // 设置图片路径
  const dir = path.join(__dirname, '/../images/' + uid)
  // 创建目录
  mkdirp(dir, (err) => {
    if (err) {
      console.log('创建目录失败，原因：' + err)
    }
  })
  // 上传文件操作
  const form = new multiparty.Form({ uploadDir: dir })
  form.parse(req, async (err, fields, files) => {
    // fields是数据
    // files是文件
    const where = fields
    where.uid = uid
    // 判断文件是否为空
    if (Object.keys(files).length === 0) {
      console.log('没有上传文件')
    } else {
      console.log('有上传文件')
      // 保存文件的名字到 where.path ，方便存储到数据库
      where.path = []
      files.expend_images.forEach(item => {
        // 获取文件名
        console.log(item)
        const arr = item.path.split('\\')
        where.path.push(arr[arr.length - 1])
      })
    }
    // 上传操作是否成功
    if (err) {
      console.log('上传失败，原因:' + err)
    } else {
      // 发起数据库请求
      const data = await expendService.insertExpend(where)
      console.log(data)
      if (data.affectedRows === 1) {
        // 注册成功
        res.json({
          meta: {
            status: 200,
            msg: '添加成功'
          }
        })
      } else {
        res.send({
          meta: {
            status: 400,
            msg: '添加失败'
          }
        })
      }
    }
  })
})

// 查看支出类型
router.get('/expend/type', async (req, res) => {
  const data = await expendService.selectAllExpendType()
  if (data.length !== 0) {
    res.json({
      data,
      meta: {
        status: 200,
        msg: '获取支出类型数据成功'
      }
    })
  } else {
    res.json({
      meta: {
        status: 400,
        msg: '获取支出类型数据失败'
      }
    })
  }
})

// 获取支出账单
router.get('/expend/:uid', async (req, res) => {
  const { uid } = req.params
  const { timeStart, timeEnd, expendType_id, lowPrice, highPrice, page } = req.query
  console.log(timeStart, timeEnd, expendType_id, lowPrice, highPrice, page)
  const where = {
    uid,
    timeStart,
    timeEnd,
    expendType_id,
    lowPrice,
    highPrice
  }
  const data = await expendService.getAllExpend(where, JSON.parse(page))
  if (Object.keys(data).length > 0) {
    res.json({
      data,
      meta: {
        status: 200,
        msg: '获取支出数据成功'
      }
    })
  } else {
    res.json({
      meta: {
        status: 400,
        msg: '获取支出数据失败'
      }
    })
  }
})

// 根据 支出id 修改支出数据
router.put('/expend/:uid/:id', async (req, res) => {
  const { uid, id } = req.params
  let dir = path.join(__dirname + '/../images/' + uid)
  // 不存在目录则创建
  mkdirp(dir, (err) => {
    if (err) {
      console.log('创建目录失败:' + err)
    }
  })
  const form = new multiparty.Form({ uploadDir: dir })
  form.parse(req, async (err, fields, files) => {
    console.log(fields)
    // // 找到并删除图片
    if (fields.deleteFileList) {
      console.log(fields.deleteFileList)
      fields.deleteFileList.forEach(item => {
        fs.unlink(dir + '/' + item, err => {
          if (err) throw err
          console.log('删除成功')
        })
      })
    }
    const where = fields
    where.expend_id = id
    if (Object.keys(files).length === 0) {
      console.log('空对象')
    } else {
      console.log('有文件')
      where.path = []
      files.newFileList.forEach(item => {
        const arr = item.path.split('\\')
        where.path.push(arr[arr.length - 1])
      })
    }
    // 接收插入数据后的返回值
    if (err) {
      console.log('上传失败:' + err)
    } else {
      let data = await expendService.updateById(where)
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

// 根据 支出id 删除支出数据
router.delete('/expend/:id', async (req, res) => {
  const { id } = req.params
  const data = await expendService.deleteExpendById(id)
  if (data.affectedRows === 1) {
    res.json({
      meta: {
        status: 200,
        msg: '删除成功'
      }
    })
  } else {
    res.json({
      meta: {
        status: 400,
        msg: '删除失败'
      }
    })
  }
})

// 查看每日总支出账单
router.get('/expend/day/sumMoney/:uid', async (req, res) => {
  const { uid } = req.params
  const { timeType, timeValue } = req.query
  const data = await expendService.getSumMoneyByDay(uid, timeType, timeValue)
  if (data.length > 0) {
    res.json({
      data,
      meta: {
        status: 200,
        msg: '获取每日支出总金额成功'
      }
    })
  } else {
    res.json({
      meta: {
        status: 400,
        msg: '获取每日支出总金额失败'
      }
    })
  }
})


// 查看支出类型的总金额
router.get('/expend/type/sumMoney/:uid', async (req, res) => {
  const { uid } = req.params
  const { timeType, timeValue } = req.query
  const data = await expendService.getSumMoneyByExpendType(uid, timeType, timeValue)
  if (data.length > 0) {
    res.json({
      meta: {
        status: 200,
        msg: '获取成功'
      },
      data
    })
  } else {
    res.json({
      meta: {
        status: 400,
        msg: '暂无数据'
      }
    })
  }
})

module.exports = router