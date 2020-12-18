const mysql = require('mysql')
// 导入数据库配置
const { config } = require('../config/db')

module.exports = {
  // 连接池,使用promise异步
  sqlConnect (sql, sqlArr = []) {
    return new Promise((resolve, reject) => {
      let pool = mysql.createPool(config)
      pool.getConnection((err, conn) => {
        if (err) {
          reject('数据库连接失败，原因：' + err)
        } else {
          // 事件回调驱动
          conn.query(sql, sqlArr, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
          // 释放连接
          // conn.release()
          pool.releaseConnection(conn)
        }
      })
    }).catch((err) => {
      console.log(err)
    })
  }
}