const baseDao = require('./baseDao')
const dbConfig = require('../untils/dbConfig')

class incomeDao extends baseDao {
  constructor() {
    super('income')
  }
  /**  根据时间获取所有收入，并按照时间降序
  * @param {Object} where 查询条件
  * @param {Object} limit 分页功能
  * @param {String} result sql语句返回的字段，默认*
  */
  findByFilterTime ({ uid, timeStart, timeEnd, incomeType_id, lowPrice = 0, highPrice }, limit, result = '*') {
    let _SQL = ''
    const sqlArr = [uid]
    if (timeStart && timeEnd) {
      _SQL += ' AND income_date BETWEEN ? AND ?'
      sqlArr.push(timeStart, timeEnd)
    }
    if (incomeType_id) {
      _SQL += ' AND incomeType_id = ?'
      sqlArr.push(incomeType_id)
    }
    _SQL += ' AND income_money >= ?'
    sqlArr.push(lowPrice)
    if (highPrice) {
      _SQL += ' AND income_money <= ?'
      sqlArr.push(highPrice)
    }
    if (Object.keys(limit).length > 0) {
      _SQL += ' order by income_date asc limit ?,?'
      sqlArr.push(limit.start, limit.pageSize)
    }
    const sql = `select ${result} from income where uid = ?${_SQL}`
    return dbConfig.sqlConnect(sql, sqlArr)
  }

  /** 根据 用户id 时间 获取对应类型的对应金额
   * @param {Number} uid 用户名
   * @param {String} timeStart 
   * @param {String} timeEnd 
   */
  findSumMoneyByFilterTime (uid, timeStart, timeEnd) {
    const sql =
      'SELECT it.incomeType_name "incomeType_name",sum(i.income_money) "sumMoney",it.incomeType_leave,it.incomeType_pid from income i ' +
      'left join income_type it on it.incomeType_id = i.incomeType_id ' +
      'where i.income_date BETWEEN ? AND ? AND i.uid = ?  group by i.incomeType_id'
    const sqlArr = [timeStart, timeEnd, uid]
    return dbConfig.sqlConnect(sql, sqlArr)
  }

  /** 根据 用户id 起始时间 获取 每日时间与总金额
   * 
   * @param {Number} uid 
   * @param {String} timeStart 
   * @param {String} timeEnd 
   */
  findSumMoneyByFilterDay (uid, timeStart, timeEnd) {
    const sql =
      'select date_format(income.income_date,"%m月%d日") "timeDay",sum(income.income_money) "sumMoney" from income ' +
      'where income.income_date BETWEEN ? and ? AND income.uid = ? ' +
      'group by DATE(income.income_date)'
    const sqlArr = [timeStart, timeEnd, uid]
    return dbConfig.sqlConnect(sql, sqlArr)
  }

  /** 根据 筛选条件 获取收入数据
   * 
   * @param {*} uid 用户id
   * @param {*} timeStart 开始时间
   * @param {*} timeEnd  结束事件
   * @param {*} incomeType_id 收入类型id
   * @param {*} lowPrice 最低价
   * @param {*} highPrice 最高价
   */
  getIncomeBySearch (uid, timeStart, timeEnd, incomeType_id, lowPrice = 0, highPrice) {
    let _SET = ''
    const sqlArr = [uid]
    const sql = `select * from income where uid = ? `
    if (timeStart && timeEnd) {
      _SET += 'AND income_date BETWEEN ? AND ?'
      sqlArr.push(timeStart, timeEnd)
    }
    if (incomeType_id) {
      _SET += 'AND incomeType_id = ?'
      sqlArr.push(incomeType_id)
    }
    _SET += 'AND income_money >= ?'
    sqlArr.push(lowPrice)
    if (highPrice) {
      _SET += 'AND income_money <= ?'
      sqlArr.push(highPrice)
    }
    return dbConfig.sqlConnect(sql, sqlArr)
  }
}

module.exports = new incomeDao()