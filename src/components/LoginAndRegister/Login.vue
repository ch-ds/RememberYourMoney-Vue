<template>
  <div class="login">
    <!-- 登录区域 -->
    <div class="login-img">
      <img src="../../assets/images/login_img.jpg" alt="" />
      <span>理财早规划 用钱不慌张</span>
    </div>
    <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
      <el-form-item prop="username">
        <el-input
          prefix-icon="el-icon-user-solid"
          v-model="loginForm.username"
          placeholder="账号"
          maxlength="16"
          @keyup.enter.native="login"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          prefix-icon="el-icon-lock"
          v-model="loginForm.password"
          placeholder="密码"
          show-password
          maxlength="16"
          @keyup.enter.native="login"
        ></el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="captchaCode" class="captcha-item">
        <el-input
          v-model="loginForm.captchaCode"
          placeholder="验证码"
          :maxlength="captchaValue.length"
          @keyup.enter.native="login"
        >
        </el-input>
        <captcha
          :value="captchaValue"
          @click.native="refreshCaptchaValue"
          :width="130"
        ></captcha>
      </el-form-item>
      <el-form-item>
        <el-button @click="login">登录</el-button>
      </el-form-item>
      <el-form-item class="form-util">
        <router-link to="/register">忘了密码</router-link>
        <router-link to="/register">注册新账号</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Captcha from '../util/Captcha'
export default {
  data () {
    // 表单验证码验证
    const CodeVaild = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入验证码'))
      }
      return callback()
    }
    return {
      captchaValue: '',
      loginForm: {
        username: '',
        password: '',
        captchaCode: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captchaCode: [{ validator: CodeVaild, trigger: 'blur' }]
      }
    }
  },
  methods: {
    login (event) {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        if (this.loginForm.captchaCode.toLowerCase() !== this.captchaValue.toLowerCase()) {
          event.target.blur()
          this.$alert('验证码错误', '信息', {
            confirmButtonText: '确定',
            callback: item => { console.log(item) }
          })
          return this.refreshCaptchaValue()
        }
        const { data: res } = await this.$http.post('/login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) {
          this.refreshCaptchaValue()
          return this.$message.error('账号或密码错误')
        }
        // 登录成功，存储用户信息
        this.$store.commit('setUserObj', res.data)
        // 清楚页面数据，跳转页面
        this.$refs.loginFormRef.resetFields()
        this.$router.push('/index')
      })
    },
    // 随机数字
    randomNumber (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + 1)
    },
    // 获取验证码
    getCaptchaValue (len = 4) {
      const chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
      for (let i = 0, charsLen = chars.length - 1; i < len; i++) {
        this.captchaValue += chars[this.randomNumber(0, charsLen)]
      }
    },
    // 刷新验证码
    refreshCaptchaValue (len = 4) {
      this.captchaValue = ''
      this.getCaptchaValue()
    }
  },
  mounted () {
    this.getCaptchaValue()
  },
  components: {
    Captcha
  }
}
</script>

<style lang="scss">
.login .el-input__inner::-webkit-input-placeholder {
  color: #999;
}
</style>

<style lang="scss" scoped>
.login {
  width: 750px;
  height: 350px;
  display: flex;
  > .login-img {
    height: 100%;
    position: relative;
    > img {
      margin: 0;
      padding: 0;
      height: 100%;
    }
    > span {
      position: absolute;
      left: 0;
      top: 20px;
      width: 100%;
      font-weight: bold;
      font-size: 24px;
    }
  }
  > .el-form {
    width: 100%;
    color: #000;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .el-button {
      width: 100%;
      background-color: #32bfb2;
      color: white;
      font-size: 16px;
    }
    > .captcha-item {
      /deep/ .el-form-item__content {
        display: flex;
        .captcha {
          margin-left: 20px;
          border-radius: 5px;
          cursor: pointer;
        }
      }
    }
    > .form-util {
      margin: 0;
      /deep/ .el-form-item__content {
        > a {
          text-decoration: none;
          color: #000;
          &:hover {
            color: rgba(0, 0, 0, 0.6);
            text-decoration: underline;
          }
          &:first-child {
            float: left;
          }
          &:last-child {
            float: right;
          }
        }
      }
    }
  }
}
</style>
