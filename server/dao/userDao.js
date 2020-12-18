const baseDao = require('./baseDao')

class userDao extends baseDao {
  constructor(){
    super('user')
  }
}

module.exports = new userDao()