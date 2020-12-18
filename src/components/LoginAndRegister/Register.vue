<template>
  <div class="register">
    <!-- 注册表单 -->
    <el-form
      :model="registerForm"
      ref="registerFormRef"
      :rules="registerFormRule"
    >
      <el-form-item prop="realname">
        <el-input
          placeholder="请输入用户名"
          v-model="registerForm.realname"
        ></el-input>
      </el-form-item>
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
      <img src="../../assets/images/register_img.webp" alt="" />
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
      const reg = /^[a-zA-Z0-9_]{4,16}$/
      if (!reg.test(value)) {
        return callback(new Error('账号 4 到 16 位的字母、数字、下划线组合'))
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
        realname: '',
        username: '',
        password: '',
        service: false
      },
      registerFormRule: {
        realname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 7, message: '用户名的长度在 3 到 7 之间', trigger: 'blur' }
        ],
        username: [{ validator: validUsername, trigger: 'blur' }],
        password: [{ validator: validPassword, trigger: 'blur' }],
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
