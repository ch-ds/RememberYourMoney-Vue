const baseDao = require('./baseDao')

class incomeTypeDao extends baseDao {
  constructor() {
    super('income_type')
  }

  /** 删除的类，及其所属下类
 * 
 * @param {*} incomeType_id 
 */
  deleteIncomeType (incomeType_id) {
    const sql = 'DELETE FROM income_type WHERE incomeType_id = ? or incomeType_pid = ?'
    const sqlArr = [incomeType_id, incomeType_id]
    return dbConfig.sqlConnect(sql, sqlArr)
  }
}

module.exports = new incomeTypeDao()