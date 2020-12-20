const expendDao = require('../dao/expendDao')
const expendTypeDao = require('../dao/expendTypeDao')

class expendService {
  // 查看全部支出类型
  async selectAllExpendType () {
    let data = await expendTypeDao.findAll()
    // 找到 data 数组中 对象属性 leave 的最大值
    let maxLeave = Math.max.apply(Math, data.map(item => item.expendType_leave))
    this.recursionFunc(data, maxLeave)
    return data
  }
  // 递归方法
  recursionFunc (data, leave) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].expendType_leave === leave) {
        // 说明是子类，则找到他的父类，并添加到父类的children属性
        let parent = data.find(item => item.expendType_id === data[i].expendType_pid)
        // 判断父类是否有children属性，如果没有则创建
        if (parent.children === undefined) {
          parent.children = []
        }
        parent.children.push(data[i])
        // 添加完后将该子类从 data 中删除，并且i回退
        data.splice(i, 1)
        i--
      }
    }
    if (leave > 2) {
      this.recursionFunc(data, leave - 1)
    }
  }
  // 支出登记
  async insertExpend (where) {
    // 处理上传的数据
    const uid = parseInt(where.uid)
    const expendType_id = parseInt(where.expendType_id[0])
    const expend_date = new Date(parseInt(where.expend_date[0]))
    const expend_money = parseFloat(where.expend_money[0])
    const expend_msg = where.expend_msg[0]
    let expend_images = ''
    if (where.path !== undefined) {
      expend_images = where.path.join(',')
    }
    const data = await expendDao.insert({ uid, expendType_id, expend_date, expend_money, expend_msg, expend_images })
    return data
  }

  // 根据 时间类型(年月) 和 毫秒值 返回时间范围
  getTimeRange (key, value) {
    value = Number(value)
    const time = new Date(value)
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const obj = new Object()
    if (key === 'month') {
      obj.timeStart = `${year}-${month}-1`
      const day = new Date(year, month, 0).getDate()
      obj.timeEnd = `${year}-${month}-${day} 23:59:59`
    } else if (key === 'year') {
      obj.timeStart = `${year}-1-1`
      obj.timeEnd = `${year}-12-31 23:59:59`
    } else if (key === 'date') {
      const day = time.getDate()
      obj.timeStart = `${year}-${month}-${day} 00:00:00`
      obj.timeEnd = `${year}-${month}-${day} 23:59:59`
    } else {
      return null
    }
    return obj
  }

  // 查看本月的支出类型和总金额
  async getSumMoneyByExpendType (uid, timeType, timeValue) {
    const { timeStart, timeEnd } = this.getTimeRange(timeType, timeValue)
    let data = await expendDao.findSumMoneyByMonthTime(uid, timeStart, timeEnd)
    for (const item of data) {
      if (item.expendType_leave !== 1) {
        item.expendType_name = await this.getNameByExpendTypeId(item.expendType_pid)
      }
    }
    const map = new Map()
    data.forEach(item => {
      const key = item.expendType_name
      const value = item.sumMoney
      if (map.has(key)) {
        map.set(key, value + map.get(key))
      } else {
        map.set(key, value)
      }
    })
    data = []
    for (let item of map.entries()) {
      data.push({ 'expendType_name': item[0], 'sumMoney': item[1] })
    }
    return data
  }

  // 递归 根据 expendType_id 查找 expendType_name
  async getNameByExpendTypeId (expendType_pid) {
    const data = await expendTypeDao.findByFilter({ expendType_id: expendType_pid })
    if (data[0].expendType_leave === 1) {
      return data[0].expendType_name
    }
    return this.getNameByExpendTypeId(data[0].expendType_pid)
  }

  // 查看本月的每日支出总金额
  async getSumMoneyByDay (uid, timeType, timeValue) {
    const { timeStart, timeEnd } = this.getTimeRange(timeType, timeValue)
    const data = await expendDao.findSumMoneyByDayTime(uid, timeStart, timeEnd)
    return data
  }

  // 根据 用户id 时间类型 时间值 分页对象 获取 所有支出数据
  async getAllExpend (where, page) {
    // 获取分页对象
    const limit = new Object()
    limit.start = (page.currentPage - 1) * page.pageSize
    limit.pageSize = page.pageSize
    const goods = await expendDao.findAllExpend(where, limit)
    // 获取total值
    const total = await expendDao.findAllExpend(where, {}, 'count(*) total')
    const sumMoney = await expendDao.findAllExpend(where, {}, 'sum(expend_money) sumMoney')
    for (const item of goods) {
      if (item.expend_images) {
        item.expend_images = item.expend_images.split(',')
        item.expend_images.map(item => item.split(''))
      } else {
        item.expend_images = []
      }
      const res = await expendTypeDao.findByFilter({ expendType_id: item.expendType_id })
      let { expendType_name } = res[0]
      item.expendType_name = expendType_name
      let { expendType_pid } = res[0]
      while (expendType_pid !== null) {
        let subRes = await expendTypeDao.findByFilter({ expendType_id: expendType_pid })
        expendType_pid = subRes[0].expendType_pid
        item.expendType_name = subRes[0].expendType_name + '/' + expendType_name
      }
    }
    return { goods, total: total[0].total, sumMoney: sumMoney[0].sumMoney }
  }

  // 根据 id 进行修改
  async updateById (where) {
    const expend_id = parseInt(where.expend_id)
    const expendType_id = parseInt(where.expendType_id[0])
    const expend_date = new Date(parseInt(where.expend_date[0]))
    const expend_money = parseFloat(where.expend_money[0])
    const expend_msg = where.expend_msg[0]
    where.path = where.path === undefined ? [] : where.path
    let expend_images = ''
    if (where.oldFileList && where.oldFileList.length !== 0) {
      expend_images = [...where.oldFileList, ...where.path].join(',')
    } else {
      expend_images = where.path.join(',')
    }
    let data = await expendDao.update({ expendType_id, expend_date, expend_money, expend_msg, expend_images }, { expend_id })
    return data
  }

  // 根据 支出id 删除支出数据
  async deleteExpendById (id) {
    const data = await expendDao.delete({ expend_id: id })
    return data
  }

  // 添加收入类型
  async insertExpendType ({ expendType_name, expendType_leave, expendType_pid }) {
    if (expendType_pid === 'null') {
      expendType_pid = null
    }
    const data = await expendTypeDao.insert({ expendType_name, expendType_leave, expendType_pid })
    return data.affectedRows === 1 ? 'true' : false
  }

  // 修改支出类型
  async updateExpendType ({ expendType_name, expendType_id }) {
    const data = await expendTypeDao.update({ expendType_name }, { expendType_id })
    return data.affectedRows === 1 ? 'true' : false
  }

  // 删除支出类型
  async deleteExpendType (expendType_id) {
    const data = await expendTypeDao.deleteExpendType(expendType_id)
    return data.affectedRows > 0 ? 'true' : false
  }
}

module.exports = new expendService()