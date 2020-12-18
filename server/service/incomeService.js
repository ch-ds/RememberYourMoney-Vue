const incomeDao = require('../dao/incomeDao')
const incomeTypeDao = require('../dao/incomeTypeDao')

class incomeService {
  constructor() { }
  // 收入记账
  async insert (where) {
    const uid = parseInt(where.uid)
    const incomeType_id = parseInt(where.incomeType_id[0])
    const income_date = new Date(parseInt(where.income_date[0]))
    const income_money = parseFloat(where.income_money[0])
    const income_msg = where.income_msg[0]
    let income_images = ''
    if (where.path !== undefined) {
      income_images = where.path.join(',')
    }
    let data = await incomeDao.insert({ uid, incomeType_id, income_date, income_money, income_msg, income_images })
    return data
  }

  // 查看所有收入类型
  async selectAllIncomeType () {
    let data = await incomeTypeDao.findAll()
    // 找出最大的leave
    const maxLeave = Math.max.apply(Math, data.map(item => item.incomeType_leave))
    this.recursionFunc(data, maxLeave)
    return data
  }

  // 定义一个递归方法
  recursionFunc (data, leave) {
    // 做循环查找
    for (let i = 0; i < data.length; i++) {
      if (data[i].incomeType_leave === leave) {
        // 说明是子类,找到他的父类，并将该对象添加到父类的children属性中
        const parent = data.find(item => item.incomeType_id === data[i].incomeType_pid)
        // 判断父类是否有children属性，如果没有则创建
        if (parent.children === undefined) {
          parent.children = []
        }
        parent.children.push(data[i])
        // 删除该子类
        data.splice(i, 1)
        i--
      }

      if (leave > 2) {
        this.recursionFunc(data, leave - 1)
      }
    }
  }

  // 获取所有的收入(key是日期类型，value是日期值,where是条件)
  async selectAllIncome (where, page) {
    // 获取分页对象
    const limit = new Object()
    limit.start = (page.currentPage - 1) * page.pageSize
    limit.pageSize = page.pageSize
    const data = {}
    const goods = await incomeDao.findByFilterTime(where, limit)
    const total = await incomeDao.findByFilterTime(where, {}, 'count(*) total')
    const sumMoney = await incomeDao.findByFilterTime(where, {}, 'sum(income_money) sumMoney')
    data.goods = goods
    data.total = total[0].total
    // 得到的数据将 incomeType_id 转换成 对应的 incomeType_name
    for (let key of goods) {
      // 再进行该操作的同时，将 income_images 字符串转为数组
      if (key.income_images.trim().length !== 0) {
        key.income_images = key.income_images.split(',')
      } else {
        key.income_images = []
      }
      let incomeType_id = key.incomeType_id
      const res = await incomeTypeDao.findByFilter({ incomeType_id })
      let { incomeType_pid } = res[0]
      const { incomeType_name } = res[0]
      key.incomeType_name = incomeType_name
      // 循环
      while (incomeType_pid !== null) {
        let subRes = await incomeTypeDao.findByFilter({ incomeType_id: incomeType_pid })
        incomeType_pid = subRes[0].incomeType_pid
        key.incomeType_name = subRes[0].incomeType_name + ' / ' + incomeType_name
      }
    }
    return { goods, total: total[0].total, sumMoney: sumMoney[0].sumMoney }
  }

  // 获取时间范围(key是money或者year,value是毫秒值)
  getDateRange (key, value) {
    value = Number(value)
    const time = new Date(value)
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const obj = new Object()
    if (key === 'year') {
      // 按年算
      obj.start = `${year}-1-1`
      obj.end = `${year}-12-31 23:59:59`
    } else if (key === 'month') {
      const day = new Date(year, month, 0).getDate()
      obj.start = `${year}-${month}-1`
      obj.end = `${year}-${month}-${day} 23:59:59`
    } else if (key === 'date') {
      const day = time.getDate()
      obj.start = `${year}-${month}-${day} 00:00:00`
      obj.end = `${year}-${month}-${day} 23:59:59`
    } else {
      return null
    }
    return obj
  }

  // 根据 id 删除数据
  async deleteById (id) {
    const data = await incomeDao.delete({ income_id: id })
    return data
  }

  // 根据 id 进行修改
  async updateById (where) {
    const income_id = parseInt(where.income_id)
    const incomeType_id = parseInt(where.incomeType_id[0])
    const income_date = new Date(parseInt(where.income_date[0]))
    const income_money = parseFloat(where.income_money[0])
    const income_msg = where.income_msg[0]
    where.path = where.path === undefined ? [] : where.path
    let income_images = ''
    if (where.oldImageList && where.oldImageList.length !== 0) {
      income_images = [...where.oldImageList, ...where.path].join(',')
    } else {
      income_images = where.path.join(',')
    }
    let data = await incomeDao.update({ incomeType_id, income_date, income_money, income_msg, income_images }, { income_id })
    return data
  }

  // 根据 用户id  时间，获取对应的类型和总金额
  async getSumMoneyByTime (uid, timeType, timeValue) {
    const { start: timeStart, end: timeEnd } = this.getDateRange(timeType, timeValue)
    let data = await incomeDao.findSumMoneyByFilterTime(uid, timeStart, timeEnd)
    for (let item of data) {
      if (item.incomeType_leave !== 1) {
        item.incomeType_name = await this.getNameByIncomeTypeID(item.incomeType_pid)
      }
    }
    const map = new Map()
    data.forEach(item => {
      const key = item.incomeType_name
      const value = item.sumMoney
      if (map.has(key)) {
        map.set(key, map.get(key) + value)
      } else {
        map.set(key, value)
      }
    })
    data = []
    for (let item of map.entries()) {
      data.push({
        'incomeType_name': item[0],
        'sumMoney': item[1]
      })
    }
    return data
  }

  // 递归根据 incomeType_pid 获取 incomeType_name
  async getNameByIncomeTypeID (incomeType_pid) {
    const data = await incomeTypeDao.findByFilter({ incomeType_id: incomeType_pid })
    if (data[0].incomeType_leave === 1) {
      return data[0].incomeType_name
    }
    return this.getNameByIncomeTypeID(data[0].incomeType_pid)
  }

  // 根据 用户 id 时间类型 时间值，获取对应月的每日金额
  async getSumMoneyByDay (uid, timeType, timeValue) {
    const { start: timeStart, end: timeEnd } = this.getDateRange(timeType, timeValue)
    const data = await incomeDao.findSumMoneyByFilterDay(uid, timeStart, timeEnd)
    return data
  }

}

module.exports = new incomeService()