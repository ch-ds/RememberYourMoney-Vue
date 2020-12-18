const baseDao = require('./baseDao')
const dbConfig = require('../untils/dbConfig')

class expendDao extends baseDao {
  constructor() {
    super('expend')
  }
  /** 根据 用户id 时间获取当月对应的支付类型和总金额
   * @param {Number,String} uid 用户id
   * @param {String} timeStart 开始时间
   * @param {String} timeEnd 结束时间
   */
  findSumMoneyByMonthTime (uid, timeStart, timeEnd) {
    const sql =
      'SELECT et.expendType_name "expendType_name",SUM(e.expend_money) "sumMoney",e.expendType_id,et.expendType_leave,et.expendType_pid FROM expend e ' +
      'LEFT JOIN expend_type et ON e.expendType_id = et.expendType_id ' +
      'WHERE e.expend_date BETWEEN ? AND ? AND  e.uid = ? ' +
      'GROUP BY e.expendType_id'
    const sqlArr = [timeStart, timeEnd, uid]
    return dbConfig.sqlConnect(sql, sqlArr)
  }

  /** 根据 用户id 时间获取当前月，每天的支出总金额
   * @param {Number,String} uid 用户id
   * @param {String} timeStart 开始时间
   * @param {String} endStart 结束时间
   */
  findSumMoneyByDayTime (uid, timeStart, timeEnd) {
    const sql =
      'SELECT date_format(expend_date,"%m月%d日") "timeDay", sum(expend_money) "sumMoney" FROM expend ' +
      'WHERE expend_date BETWEEN ? AND ? AND uid = ? ' +
      'GROUP BY DATE(expend_date)'
    const sqlArr = [timeStart, timeEnd, uid]
    return dbConfig.sqlConnect(sql, sqlArr)
  }

  /** 根据 用户id 时间获取 分页对象获取
   * @param {Number,String} uid 用户id
   * @param {Object} time 开始时间(timeStart,timeEnd)
   * @param {Object} limit 分页数据(limitStart,limitEnd)
   */
  findAllExpend ({ uid, timeStart, timeEnd, expendType_id, lowPrice = 0, highPrice }, limit, result = '*') {
    let _SQL = ''
    const sqlArr = [uid]
    if (timeStart && timeEnd) {
      _SQL += ' AND expend_date BETWEEN ? AND ?'
      sqlArr.push(timeStart, timeEnd)
    }
    if (expendType_id) {
      _SQL += ' AND expendType_id = ?'
      sqlArr.push(expendType_id)
    }
    _SQL += ' AND expend_money >= ?'
    sqlArr.push(lowPrice)
    if (highPrice) {
      _SQL += ' AND expend_money <= ?'
      sqlArr.push(highPrice)
    }
    if (Object.keys(limit).length > 0) {
      _SQL += ' order by expend_date asc limit ?,?'
      sqlArr.push(limit.start, limit.pageSize)
    }
    const sql = `select ${result} from expend where uid = ?${_SQL}`
    return dbConfig.sqlConnect(sql, sqlArr)
  }

  /** 根据 用户id 时间 支出数据总数
   * @param {Number,String} uid 用户id
   * @param {Object} time 开始时间(timeStart,timeEnd)
   */
  findAllTotal (uid, { timeStart, timeEnd }) {
    const sql =
      'SELECT count(*) "total" FROM expend ' +
      'WHERE uid = ? AND expend_date BETWEEN ? AND ?'
    const sqlArr = [uid, timeStart, timeEnd]
    return dbConfig.sqlConnect(sql, sqlArr)
  }

  /** 根据 用户id 起始时间 获取 每日时间与总金额
   * 
   * @param {Number} uid 
   * @param {String} timeStart 
   * @param {String} timeEnd 
   */
  findSumMoney (uid, timeStart, timeEnd) {
    const sql =
      'select sum(expend_money) "sumMoney" from expend ' +
      'where expend_date BETWEEN ? and ? AND uid = ? '
    const sqlArr = [timeStart, timeEnd, uid]
    return dbConfig.sqlConnect(sql, sqlArr)
  }

  /** 根据 筛选条件 获取收入数据
 * 
 * @param {*} uid 用户id
 * @param {*} timeStart 开始时间
 * @param {*} timeEnd  结束事件
 * @param {*} expendType_id 支出类型id
 * @param {*} lowPrice 最低价
 * @param {*} highPrice 最高价
 */
  getExpendBySearch (uid, timeStart, timeEnd, expendType_id, lowPrice = 0, highPrice) {
    let _SQL = ''
    const sqlArr = [uid]
    if (timeStart && timeEnd) {
      _SQL += ' AND expend_date BETWEEN ? AND ?'
      sqlArr.push(timeStart, timeEnd)
    }
    if (expendType_id) {
      _SQL += ' AND expendType_id = ?'
      sqlArr.push(expendType_id)
    }
    _SQL += ' AND expend_money >= ?'
    sqlArr.push(lowPrice)
    if (highPrice) {
      _SQL += ' AND expend_money <= ?'
      sqlArr.push(highPrice)
    }
    _SQL += ' order by expend_date asc limit ?,?'
    const sql = `select * from expend where uid = ? ${_SQL}`
    return dbConfig.sqlConnect(sql, sqlArr)
  }
}

module.exports = new expendDao()