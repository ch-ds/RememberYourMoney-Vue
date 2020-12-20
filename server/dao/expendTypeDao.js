const baseDao = require('./baseDao')
const dbConfig = require('../untils/dbConfig')

class expendTypeDao extends baseDao {
  constructor() {
    super('expend_type')
  }

  /** 删除的类，及其所属下类
   * 
   * @param {*} incomeType_id 
   */
  deleteExpendType (expendType_id) {
    const sql = 'DELETE FROM expend_type WHERE expendType_id = ? or expendType_pid = ?'
    const sqlArr = [expendType_id, expendType_id]
    return dbConfig.sqlConnect(sql, sqlArr)
  }
}

module.exports = new expendTypeDao()