const { sqlConnect } = require('../untils/dbConfig')

class baseDao {
  // 接收一个表的名字
  constructor(tableName) {
    this.tableName = tableName
  }

  /********************* 查询方法 *************************/

  /**
   * 不带过滤条件的查询 
   * @param {String} result sql语句返回的字段，默认*
   */
  findAll (result = '*') {
    let sql = `select ${result} FROM ${this.tableName}`
    return sqlConnect(sql)
  }


  /**
   * 带过滤条件的查询方法
   * @param {Object} where 过滤条件
   * @param {String} result sql语句返回的字段，默认*
   */
  findByFilter (where, result = '*') {
    // 查询条件名称
    let _SET = ''
    // 查询条件的内容
    let _WHERE = []
    for (let k in where) {
      _SET += k + ' = ? AND '
      _WHERE.push(where[k])
    }
    // 去掉最后一次循环里多余的AND
    _SET = _SET.slice(0, -4)
    const sql = `SELECT ${result} FROM ${this.tableName} where ${_SET}`
    const sqlArr = _WHERE
    return sqlConnect(sql, sqlArr)
  }

  /**
   * 带过滤条件的模糊查询
   * @param {Object} where 过滤条件
   * @param {String} result sql语句返回的字段，默认*
   */
  findByLikeFilter (where, result = '*') {
    // 查询条件的名称
    let _SET = ''
    // 查询条件的内容
    let _WHERE = []
    for (let k in where) {
      // 这里开始必须有空格，因为k=不需要空格，但是k like 需要空格，
      _SET += k + ' like ? AND '
      // 自动添加引号，所以不需要额外添加
      _WHERE.push(`%where[k]%`)
    }
    _SET = _set.slice(0, -4)
    const sql = `SELECT ${result} FROM ${this.tableName} WHERE ${_SET}`
    const sqlArr = _WHERE
    return sqlConnect(sql, sqlArr)
  }


  /**********************  更新方法  ******************/
  /**
   * @param {Object} set 需要修改的数据
   * @param {Object} where 条件
   */
  update (set, where) {
    // 修改SET之后的语句
    let _SET = ''
    // 修改值的内容和条件的内容
    let _WHERE = []
    for (let k in set) {
      _SET += k + '=?,'
      _WHERE.push(set[k])
    }
    // 删除 _SET 的多余 , 号，并添加 WHERE 关键字
    _SET = _SET.slice(0, -1)
    _SET += ' WHERE '
    for (let k in where) {
      _SET += k + '= ? AND '
      _WHERE.push(where[k])
    }
    // 删除 _SET 多余的 AND
    _SET = _SET.slice(0, -4)
    const sql = `UPDATE ${this.tableName} SET ${_SET}`
    const sqlArr = _WHERE
    return sqlConnect(sql, sqlArr)
  }

  /************************ 添加方法 **********************/
  /**
   * @param {Object} where 添加的数据
   */
  insert (where) {
    // 添加的字段名
    let _SET = ''
    // 防sql注入的?个数
    let _MARK = ''
    // 添加的字段值
    let _WHERE = []
    for (let k in where) {
      _SET += k + ','
      _MARK += '?,'
      _WHERE.push(where[k])
    }
    _SET = _SET.slice(0, -1)
    _MARK = _MARK.slice(0, -1)
    const sql = `INSERT INTO ${this.tableName} (${_SET}) values (${_MARK})`
    const sqlArr = _WHERE
    return sqlConnect(sql, sqlArr)
  }

  /*************************** 删除方法 ************************/
  /**
   * @param {Object} where 删除的条件
   */
  delete (where) {
    let _SET = ''
    let _WHERE = []
    for (let k in where) {
      _SET += k + '= ? AND '
      _WHERE.push(where[k])
    }
    _SET = _SET.slice(0, -4)
    const sql = `DELETE FROM ${this.tableName} WHERE ${_SET}`
    const sqlArr = _WHERE
    console.log(sql)
    return sqlConnect(sql, sqlArr)
  }
}

module.exports = baseDao