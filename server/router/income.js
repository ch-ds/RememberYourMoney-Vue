const express = require('express')
const incomeService = require('../service/incomeService')
var path = require('path');
var mkdirp = require('mkdirp');
// 使用该插件接收formdata
var multiparty = require("multiparty");
const fs = require('fs');

const router = express.Router()

// 添加收入
router.post('/income/:uid', (req, res) => {
  const { uid } = req.params
  let dir = path.join(__dirname + '/../images/' + uid)
  // 创建目录
  mkdirp(dir, (err) => {
    if (err) {
      console.log('创建目录失败:' + err)
    }
  })
  const form = new multiparty.Form({ uploadDir: dir })
  form.parse(req, async (err, fields, files) => {
    // fields是数据
    // files是文件
    const where = fields
    where.uid = uid
    if (Object.keys(files).length === 0) {
      console.log('空对象')
    } else {
      console.log('有文件')
      where.path = []
      files.income_images.forEach(item => {
        const arr = item.path.split('\\')
        where.path.push(arr[arr.length - 1])
      })
    }
    // 接收插入数据后的返回值
    if (err) {
      console.log('上传失败:' + err)
    } else {
      let data = await incomeService.insert(where)
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

// 查看收入类型
router.get('/income/type', async (req, res) => {
  const data = await incomeService.selectAllIncomeType()
  if (data.length !== 0) {
    res.json({
      data,
      meta: {
        status: 200,
        msg: '获取收入类型数据成功'
      }
    })
  } else {
    res.json({
      meta: {
        status: 400,
        msg: '获取收入类型数据失败'
      }
    })
  }
})

// 查询收入账单
router.get('/income/:uid', async (req, res) => {
  const { uid } = req.params
  const { timeStart, timeEnd, incomeType_id, lowPrice, highPrice, page } = req.query
  const where = {
    uid,
    timeStart,
    timeEnd,
    incomeType_id,
    lowPrice,
    highPrice
  }
  console.log(where)
  const data = await incomeService.selectAllIncome(where, JSON.parse(page))
  if (data && Object.keys(data).length !== 0) {
    res.json({
      meta: {
        status: 200,
        msg: '查询收入数据成功'
      },
      data
    })
  } else {
    res.json({
      meta: {
        status: 400,
        msg: '查询收入数据失败'
      }
    })
  }
})

// 修改收入账单
router.put('/income/:uid/:id', async (req, res) => {
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
    // 找到并删除图片
    if (fields.deleteImageList) {
      console.log(fields.deleteImageList)
      fields.deleteImageList.forEach(item => {
        fs.unlink(dir + '/' + item, err => {
          if (err) throw err
          console.log('删除成功')
        })
      })
    }
    const where = fields
    where.income_id = id
    if (Object.keys(files).length === 0) {
      console.log('空对象')
    } else {
      console.log('有文件')
      where.path = []
      files.uploadImageList.forEach(item => {
        const arr = item.path.split('\\')
        where.path.push(arr[arr.length - 1])
      })
    }
    // 接收插入数据后的返回值
    if (err) {
      console.log('上传失败:' + err)
    } else {
      let data = await incomeService.updateById(where)
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

// 删除收入账单
router.delete('/income/:id', async (req, res) => {
  const { id } = req.params
  const data = await incomeService.deleteById(id)
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

// 查看每日总收入账单
router.get('/income/day/sumMoney/:uid', async (req, res) => {
  // 获取id
  const { uid } = req.params
  const { timeType, timeValue } = req.query
  // 获取时间,毫秒值
  const data = await incomeService.getSumMoneyByDay(uid, timeType, timeValue)
  if (data.length > 0) {
    res.json({
      meta: {
        status: 200,
        msg: '查找成功'
      },
      data
    })
  } else {
    res.json({
      meta: {
        status: 400,
        msg: '没有数据'
      },
    })
  }
})

// 查看收入类型的总金额
router.get('/income/type/sumMoney/:uid', async (req, res) => {
  // 获取id
  const { uid } = req.params
  const { timeType, timeValue } = req.query
  // 获取时间,毫秒值
  const data = await incomeService.getSumMoneyByTime(uid, timeType, timeValue)
  if (data.length > 0) {
    res.json({
      meta: {
        status: 200,
        msg: '查找成功'
      },
      data
    })
  } else {
    res.json({
      meta: {
        status: 400,
        msg: '没有数据'
      },
    })
  }
})


module.exports = router