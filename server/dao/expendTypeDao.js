const baseDao = require('./baseDao')

class expendTypeDao extends baseDao{
  constructor(){
    super('expend_type')
  }
}

module.exports = new expendTypeDao()