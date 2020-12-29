const userDao = require('../dao/userDao')
// 引入 token 令牌
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, EXPIRESD } = require('../config/store')

class userService {
  constructor() { }
  // 登录
  async login ({ username, password }) {
    let data = await userDao.findByFilter({ username, password })
    if (data.length !== 0) {
      // 获取token
      data[0].token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: EXPIRESD })
      console.log(jwt.sign({ username }, PRIVATE_KEY, { expiresIn: EXPIRESD }))
      // 将密码数据删除发送给前端
      delete data[0].password
      return data[0]
    } else {
      return {}
    }
  }


  // 检查账号是否存在
  async isUsername (username) {
    const data = await userDao.findByFilter({ username }, 'count(*) as number')
    if (data[0].number > 0) {
      // 说明该账号被注册过,返回一个空数组
      return false
    }
    return true
  }

  // 注册
  async register ({ username, password, realname }) {
    // 先做一次查询，查看账号是否相同
    let flag = await isUsername(username)
    if (!flag) {
      // 说明该账号被注册过,返回一个空数组
      return []
    }
    // 进行注册
    const data = await userDao.insert({ username, password, realname })
    return data
  }

  // 修改密码
  async updatePwd (uid, oldPwd, newPwd) {
    // 先检查旧密码是否正确，若错误直接返回
    let data = await userDao.findByFilter({ uid, password: oldPwd })
    if (data.length === 0) throw new Error('原密码错误')
    data = await userDao.update({ password: newPwd }, { uid })
    if (data.affectedRows > 0) {
      return true
    } else {
      return false
    }
  }
}


module.exports = new userService()