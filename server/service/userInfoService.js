const userInfoDao = require('../dao/userInfoDao')
const fs = require('fs')

class UserInfoService {
  constructor() { }

  // 查找用户信息
  selectUserInfo (uid) {
    return userInfoDao.findByFilter({ uid })
  }

  // 修改用户信息
  updateUserInfo (infoId, obj) {
    const updateObj = {}
    console.log(obj)
    for (const key in obj) {
      if (obj[key]) {
        updateObj[key] = obj[key]
      }
    }
    console.log(updateObj)
    if (Object.keys(updateObj).length === 0) return null
    return userInfoDao.update(updateObj, { infoId })
  }

  // 修改用户头像
  async updateImage (uid, dir, files) {
    // 获取用户之前的图片路径
    const imgUrl = await userInfoDao.findByFilter({ uid }, 'image')
    if (imgUrl[0].image) {
      // 如果有数据，就删除图片
      fs.unlink(dir + '/' + imgUrl[0].image, err => {
        if (err) {
          console.log('删除图片失败' + err)
        }
      })
    }
    // 将新图片路径添加进去
    const [newImgUrl] = files.imageFile[0].path.split('\\').reverse()
    return userInfoDao.update({ image: newImgUrl }, { uid })
  }
}


module.exports = new UserInfoService()