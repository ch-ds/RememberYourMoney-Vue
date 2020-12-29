<template>
  <div class="userInfo">
    <!-- 面包屑导航 -->
    <el-card>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息设置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <el-card>
      <!-- 内容标题 -->
      <el-row>
        <el-col class="userInfo-title">个人信息</el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="tabsName">
        <el-tab-pane label="基本信息" name="info">
          <!-- 基本信息表单 -->
          <el-form
            :model="infoForm"
            :rules="infoFormRules"
            ref="infoFormRef"
            label-width="100px"
          >
            <el-form-item label="昵称：" prop="username">
              <el-input v-model="infoForm.username"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
              <el-select v-model="infoForm.sex">
                <el-option label="无" value="无"></el-option>
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话：" prop="phone">
              <el-input v-model="infoForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="infoForm.email"></el-input>
            </el-form-item>
            <el-form-item label="个人简介：" prop="remark">
              <el-input
                type="textarea"
                v-model="infoForm.remark"
                show-word-limit
                :autosize="{ minRows: 3 }"
                maxlength="140"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateInfo">保存信息</el-button>
              <el-button @click="resetInfoForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="pwd">
          <el-form
            :model="pwdForm"
            ref="pwdFormRef"
            :rules="pwdFormRules"
            label-width="100px"
          >
            <el-form-item label="旧密码" prop="oldPwd">
              <el-input v-model="pwdForm.oldPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
              <el-input v-model="pwdForm.newPwd" type="password"></el-input>
              <span>
                密码设置至少 6 位，由大写字母、小写字母、数字、特殊字符中任意 1
                种组成,长度为 6 到 20 位,特殊字符为._~!@#$^&*
              </span>
            </el-form-item>
            <el-form-item label="确认密码" prop="isPwd">
              <el-input v-model="pwdForm.isPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updatePwd">修改密码</el-button>
              <el-button @click="resetPwdForm">清空</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改头像" name="headImg">
          <el-row>
            <el-col :span="4" class="img-title">
              <span>
                <i class="el-icon-picture"></i>
                选择本地图片
              </span>
              <input type="file" @change="inputImg" />
            </el-col>
          </el-row>
          <div class="img-content">
            <!-- <div
              class="img-tracker"
              ref="img-tracker"
              v-show="imgFlag"
              @mousedown.stop="handleMousedown"
            >
              <div class="tracker"></div>
              <div class="leftTop"></div>
              <div class="top"></div>
              <div class="rightTop"></div>
              <div class="left"></div>
              <div class="right"></div>
              <div class="leftBottom"></div>
              <div class="bottom"></div>
              <div class="rightBottom"></div>
            </div> -->
            <img :src="imgUrl + ''" alt="" ref="img" />
          </div>
          <el-row>
            <el-col>
              <el-button type="primary" @click="updateImg">保存</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 手机验证规则
    const validPhone = (rule, value, callback) => {
      if (!value) return callback()
      const reg = /^1[3456789]\d{9}$/
      if (!reg.test(value)) {
        return callback(new Error('请输入正确的手机号'))
      } else {
        return callback()
      }
    }
    // 邮箱验证规则
    const validEmail = (rule, value, callback) => {
      if (!value) return callback()
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!reg.test(value)) {
        return callback(new Error('请输入正确的手机号'))
      } else {
        return callback()
      }
    }
    // 密码验证规则
    const validPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      }
      const reg = /^[A-Za-z0-9._~!@#$^&*]{6,20}$/
      if (!reg.test(value)) {
        return callback(new Error('密码由 6 到 20 位的小写字母、大写字母、数字、特殊符号组合'))
      } else {
        return callback()
      }
    }
    // 确认密码验证规则
    const validIsPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      }
      if (value !== this.pwdForm.newPwd) {
        return callback(new Error('两个密码不相等'))
      } else {
        return callback()
      }
    }
    return {
      // 标签页名称
      tabsName: 'info',
      // 个人信息表单
      infoForm: {},
      infoFormRules: {
        username: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ],
        sex: [],
        phone: [{ validator: validPhone, trigger: 'blur' }],
        email: [{ validator: validEmail, trigger: 'blur' }],
        remark: []
      },
      // 修改密码表单
      pwdForm: {},
      pwdFormRules: {
        oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPwd: [{ required: true, validator: validPassword, trigger: 'blur' }],
        isPwd: [{ required: true, validator: validIsPassword, trigger: 'blur' }]
      },
      // 图片数据
      imgUrl: require('@/assets/images/header.png'),
      // 图片对象
      imgFile: {},
      // 图片控制的显示与隐藏
      // imgFlag: false,
      // 拖拽时鼠标所在位置
      moveObj: {},
      isMove: false
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      const { data: res } = await this.$http.get('/userInfo/' + this.$store.state.userObj.uid)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.$store.commit('setUserInfo', res.data[0])
      this.infoForm = {
        username: res.data[0].username,
        sex: res.data[0].sex,
        phone: res.data[0].phone,
        email: res.data[0].email,
        remark: res.data[0].remark
      }
    },
    // 保存信息按钮
    updateInfo () {
      this.$refs.infoFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/userInfo/' + this.$store.state.userInfo.infoId, this.infoForm)
        if (res.meta.status !== 200) return this.$message.error('保存信息失败')
        this.$message.success('保存信息成功')
        this.getUserInfo()
      })
    },
    // 重置信息表单按钮
    resetInfoForm () {
      this.$refs.infoFormRef.resetFields()
      this.infoForm = {
        username: this.$store.state.userInfo.username,
        sex: this.$store.state.userInfo.sex,
        phone: this.$store.state.userInfo.phone,
        email: this.$store.state.userInfo.email,
        remark: this.$store.state.userInfo.remark
      }
    },
    // 修改密码按钮
    updatePwd () {
      this.$refs.pwdFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/user/' + this.$store.state.userObj.uid, {
          oldPwd: this.pwdForm.oldPwd,
          newPwd: this.pwdForm.newPwd
        })
        if (res.meta.status === 401) return this.$message.error('原密码错误')
        if (res.meta.status !== 200) return this.$message.error('修改密码失败')
        this.$message.success('修改密码成功')
        this.$refs.pwdFormRef.resetFields()
      })
    },
    // 重置密码表单按钮
    resetPwdForm () {
      this.$refs.pwdFormRef.resetFields()
    },
    // 深拷贝函数
    deepClone (obj) {
      if (typeof obj !== 'object' || obj === null) return obj
      const target = Array.isArray(obj) ? [] : {}
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          target[key] = this.deepClone(obj[key])
        } else {
          target[key] = obj[key]
        }
      }
      return target
    },
    // 图片上传
    inputImg (e) {
      if (!e.target.files[0]) return
      const reg = /^image\/.*$/g
      if (!reg.test(e.target.files[0].type)) return this.$message.error('请选择图片')
      this.imgFile = e.target.files[0]
      const fileReader = new FileReader()
      fileReader.readAsDataURL(e.target.files[0])
      fileReader.onload = () => {
        this.imgUrl = fileReader.result
        /* this.$refs.img.onload = () => {
          // 图片加载完毕后，获取图片的宽高
          const width = this.$refs.img.width
          const height = this.$refs.img.height
          // 控制显示区域的宽高
          if (width > height) {
            this.$refs['img-tracker'].style.width = Number.parseInt(height / 2) + 'px'
            this.$refs['img-tracker'].style.height = Number.parseInt(height / 2) + 'px'
            this.$refs['img-tracker'].style.left = Number.parseInt(width / 4) + 'px'
            this.$refs['img-tracker'].style.top = Number.parseInt(height / 4) + 'px'
          } else {
            this.$refs['img-tracker'].style.width = Number.parseInt(width / 2) + 'px'
            this.$refs['img-tracker'].style.height = Number.parseInt(width / 2) + 'px'
            this.$refs['img-tracker'].style.left = Number.parseInt(width / 4) + 'px'
            this.$refs['img-tracker'].style.top = Number.parseInt(height / 4) + 'px'
          }
          this.imgFlag = true
        } */
      }
    },
    // 保存图片
    async updateImg () {
      if (!this.imgUrl) return this.$message.error('请上传图片')
      const formData = new FormData()
      formData.append('imageFile', this.imgFile)
      const { data: res } = await this.$http.put('/userInfo/image/' + this.$store.state.userObj.uid, formData)
      if (res.meta.status !== 200) return this.$message.error('图片保存失败')
      this.$message.success('图片保存成功')
      this.$data.imgUrl = this.$options.data().imgUrl
      this.$data.imgFile = this.$options.data().imgFile
      this.getUserInfo()
    }
    /*
    // 鼠标按下时的事件
    handleMousedown (e) {
      const classNames = ['leftTop', 'top', 'rightTop', 'left',
        'right', 'leftBottom', 'bottom', 'rightBottom']
      const className = e.target.className
      const flag = classNames.indexOf(className) === -1
      // 记录起始位置数据
      // 鼠标位置
      this.moveObj.x = e.x
      this.moveObj.y = e.y
      // 元素位移距离
      this.moveObj.offsetLeft = this.$refs['img-tracker'].offsetLeft
      this.moveObj.offsetTop = this.$refs['img-tracker'].offsetTop
      // 获取本身的宽度，高度
      this.moveObj.width = this.$refs['img-tracker'].offsetWidth
      this.moveObj.height = this.$refs['img-tracker'].offsetHeight
      // 获取图片元素宽度
      this.moveObj.imgWidth = this.$refs.img.width
      this.moveObj.imgHeight = this.$refs.img.height
      this.isMove = true
      const body = document.querySelector('body')
      // 鼠标拖动事件
      body.onmousemove = (event) => {
        if (!this.isMove) return
        // 获取拖动鼠标位置
        const moveX = event.x
        const moveY = event.y
        if (flag) {
          let left = this.moveObj.offsetLeft + moveX - this.moveObj.x
          let top = this.moveObj.offsetTop + moveY - this.moveObj.y
          // 判断边界值
          if (left <= 0) {
            left = 0
          }
          if ((left + this.moveObj.width) >= this.moveObj.imgWidth) {
            left = this.moveObj.imgWidth - this.moveObj.width
          }
          if (top <= 0) {
            top = 0
          }
          if ((top + this.moveObj.height) >= this.moveObj.imgHeight) {
            top = this.moveObj.imgHeight - this.moveObj.height
          }
          this.$refs['img-tracker'].style.left = left + 'px'
          this.$refs['img-tracker'].style.top = top + 'px'
        } else {
          const countX = moveX - this.moveObj.x
          const countY = moveY - this.moveObj.y
          let width = this.moveObj.width + countX
          let height = this.moveObj.height + countY
          width = height = Math.min(width, height)
          if (width <= 0 || height <= 0) {
            width = height = 0
          }
          if (width >= this.moveObj.imgWidth || height >= this.moveObj.imgHeight) {
            const min = Math.min(this.moveObj.width, this.moveObj.height)
            width = height = min
          }
          this.$refs['img-tracker'].style.width = width + 'px'
          this.$refs['img-tracker'].style.height = height + 'px'
        }
      }
      body.onmouseup = (event) => {
        this.isMove = false
        document.querySelector('body').onmousemove = null
      }
    } */
  }
}
</script>

<style lang="scss" scoped>
.userInfo {
  color: var(--font-color);
  .userInfo-title {
    color: var(--font-color-active);
    font-weight: bold;
  }
  .el-tab-pane {
    > .el-form {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      width: 50%;
      ::v-deep .el-form-item__label {
        color: var(--font-color);
      }
    }
    &[id='pane-headImg'] {
      .img-title {
        position: relative;
        height: 30px;
        background-color: var(--aside-color-active);
        > span {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        > input[type='file'] {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          z-index: 111;
          outline: none;
          cursor: pointer;
        }
      }
      > .img-content {
        width: 300px;
        height: 300px;
        border: 1px solid var(--font-color);
        position: relative;
        margin: 20px 0;
        /* > .img-tracker {
          position: absolute;
          border: 1px dashed #eee;
          z-index: 1111;
          cursor: move;
          > .tracker {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: red;
          }
          > div {
            position: absolute;
            width: 10px;
            height: 10px;
            border: 1px solid #eee;
            &[class='leftTop'] {
              transform: translate(-50%, -50%);
              cursor: nw-resize;
            }
            &[class='top'] {
              left: 50%;
              transform: translate(-50%, -50%);
              cursor: n-resize;
            }
            &[class='rightTop'] {
              right: 0;
              transform: translate(50%, -50%);
              cursor: ne-resize;
            }
            &[class='left'] {
              top: 50%;
              transform: translate(-50%, -50%);
              cursor: w-resize;
            }
            &[class='right'] {
              right: 0;
              top: 50%;
              transform: translate(50%, -50%);
              cursor: e-resize;
            }
            &[class='leftBottom'] {
              bottom: 0;
              transform: translate(-50%, 50%);
              cursor: sw-resize;
            }
            &[class='bottom'] {
              bottom: 0;
              left: 50%;
              transform: translate(-50%, 50%);
              cursor: s-resize;
            }
            &[class='rightBottom'] {
              right: 0;
              bottom: 0px;
              transform: translate(50%, 50%);
              cursor: se-resize;
            }
          }
        } */
        > img {
          max-width: 100%;
          max-height: 100%;
          display: block;
        }
      }
    }
  }
}
</style>
