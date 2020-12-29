<template>
  <div class="register">
    <!-- 注册表单 -->
    <el-form
      :model="registerForm"
      ref="registerFormRef"
      :rules="registerFormRule"
    >
      <el-form-item prop="username">
        <el-input
          prefix-icon="el-icon-user-solid"
          placeholder="请输入账号"
          v-model="registerForm.username"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          prefix-icon="el-icon-lock"
          placeholder="请输入密码"
          show-password
          v-model="registerForm.password"
        ></el-input>
      </el-form-item>
      <el-form-item prop="isPassword">
        <el-input
          prefix-icon="el-icon-lock"
          placeholder="请确认密码"
          show-password
          v-model="registerForm.isPassword"
        ></el-input>
      </el-form-item>
      <el-form-item prop="service">
        <el-checkbox v-model="registerForm.service">
          同意
          <a href="">《服务条款》</a>、 <a href="">《隐私政策》</a>和
          <a href="">《儿童隐私政策》</a>
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="registerUser">注册</el-button>
      </el-form-item>
    </el-form>
    <!-- 图片信息 -->
    <div class="register-img">
      <img src="~@/assets/images/register_img.webp" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义表单验证
    const validUsername = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入账号'))
      }
      const reg = /^[a-zA-Z0-9_]{4,16}$/
      if (!reg.test(value)) {
        return callback(new Error('请输入 4 到 16 位的字母、数字、下划线'))
      } else {
        const { data: res } = await this.$http.post('/register/username', {
          username: value
        })
        if (res.meta.status !== 200) {
          return callback(new Error('该账号已存在'))
        }
        return callback()
      }
    }
    const validPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      }
      const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{6,20}$/
      if (!reg.test(value)) {
        return callback(new Error('密码由 6 到 20 位的小写字母、大写字母、数字、特殊符号组合'))
      } else {
        return callback()
      }
    }
    const validIsPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      }
      if (value !== this.registerForm.password) {
        return callback(new Error('两个密码不相等'))
      } else {
        return callback()
      }
    }
    const validService = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请先同意服务条款'))
      } else {
        return callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        isPassword: '',
        service: false
      },
      registerFormRule: {
        username: [{ validator: validUsername, trigger: 'blur' }],
        password: [{ validator: validPassword, trigger: 'blur' }],
        isPassword: [{ validator: validIsPassword, trigger: 'blur' }],
        service: [{ validator: validService, trigger: 'blur' }]
      }
    }
  },
  methods: {
    registerUser () {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put('/register', {
          username: this.registerForm.username,
          password: this.registerForm.password,
          realname: this.registerForm.realname
        })
        if (res.meta.status !== 200) return this.$message.error('注册用户失败')
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  width: 750px;
  height: 350px;
  display: flex;
  > .el-form {
    width: 100%;
    color: #000;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    button {
      width: 100%;
    }
    .el-checkbox {
      color: #949494;
      cursor: default;
      a {
        color: #000;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  > .register-img {
    height: 100%;
    > img {
      // width: 350px;
      // height: 350px;
      height: 100%;
    }
  }
}
</style>
