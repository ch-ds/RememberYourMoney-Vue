const baseDao = require('./baseDao')

class incomeTypeDao extends baseDao{
  constructor(){
    super('income_type')
  }
}

module.exports = new incomeTypeDao()