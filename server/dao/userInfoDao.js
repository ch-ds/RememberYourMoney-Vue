const baseDao = require('./baseDao')

class userInfoDao extends baseDao {
  constructor() {
    super('userInfo')
  }
}

module.exports = new userInfoDao()