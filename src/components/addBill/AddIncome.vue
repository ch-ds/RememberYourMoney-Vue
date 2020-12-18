<template>
  <div class="income-container">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航栏 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>记账</el-breadcrumb-item>
        <el-breadcrumb-item>收入登记</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <!-- 卡片视图 -->
    <el-card class="formCard">
      <!-- 表单验证 -->
      <el-form
        :model="incomeForm"
        :rules="incomeRules"
        ref="incomeFormRef"
        :label-position="labelPosition"
        size="small"
      >
        <el-form-item label="收入类型" prop="type">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="incomeForm.type"
            :options="cascaderOptions"
            :props="{
              expandTrigger: 'hover',
              value: 'incomeType_id',
              label: 'incomeType_name',
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <!-- 日期选择器 -->
          <el-date-picker
            v-model="incomeForm.date"
            type="date"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="incomeForm.money" class="formMoneyInput">
            <template slot="suffix"> 元 </template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="msg">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2 }"
            placeholder="点击写备注..."
            v-model.trim="incomeForm.msg"
            show-word-limit
            :maxlength="140"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="images">
          <!-- 自定义添加图片组件 -->
          <add-image
            :fileList="incomeForm.images"
            :on-preview="imgHandlePictureCardPreview"
          ></add-image>
        </el-form-item>
        <el-form-item>
          <el-button @click="incomeSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 图片对话框 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import AddImage from '../util/AddImage'
export default {
  data () {
    // 小数的数字正则
    const valiNumberMoney = (rule, value, callback) => {
      const reg = /^(0|([1-9]\d*))(\.\d+)?$/g
      if (value === '') {
        callback(new Error('请输入金额'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      // label标签字对齐方式
      labelPosition: 'top',
      // 表单绑定数据
      incomeForm: {
        type: [],
        date: new Date().getTime(),
        money: '',
        msg: '',
        images: []
      },
      // 获取点击时的图片
      dialogImageUrl: '',
      // 控制对话框的显示与隐藏
      dialogVisible: false,
      // 表单验证规则
      incomeRules: {
        type: [
          { required: true, message: '请选择收入类型', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        money: [
          { required: true, validator: valiNumberMoney, trigger: 'blur' }
        ],
        msg: [],
        images: []
      },
      // 级联选择器数据
      cascaderOptions: []
    }
  },
  created () {
    this.getIncomeTypeList()
  },
  methods: {
    // 初始化级联选择器
    async getIncomeTypeList () {
      const { data: res } = await this.$http.get('/income/type')
      if (res.meta.status !== 200) return this.$message.error('获取收入类型数据失败')
      console.log(res.data)
      this.cascaderOptions = res.data
    },
    // 放大图片
    imgHandlePictureCardPreview (file) {
      // 赋值
      this.dialogImageUrl = file.url
      // 显示对话框
      this.dialogVisible = true
    },
    // 表单提交
    incomeSubmit () {
      this.$refs.incomeFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error('请填写必填项再提交')
          return false
        }
        const [lastType] = [...this.incomeForm.type].reverse()
        const formData = new FormData()
        this.incomeForm.images.forEach((item, index) => {
          formData.append('income_images', item)
        })
        formData.append('incomeType_id', lastType)
        formData.append('income_date', this.incomeForm.date)
        formData.append('income_money', this.incomeForm.money)
        formData.append('income_msg', this.incomeForm.msg)
        // 发送数据
        // console.log('发送请求')
        const { data: res } = await this.$http.post('/income/' + this.$store.state.userObj.uid, formData)
        if (res.meta.status !== 200) {
          return this.$message.error('提交失败,原因:' + res.meta.msg)
        }
        // 清除表单数据
        this.$refs.incomeFormRef.resetFields()
        this.dialogImageUrl = ''
        this.$message.success('提交成功')
      })
    }
  },
  components: {
    AddImage
  }
}
</script>

<style lang="scss">
.income-container {
  .el-form-item__label {
    font-size: 20px;
    color: var(--font-color);
  }
  .el-input__inner {
    font-size: 20px;
  }
  .el-textarea__inner {
    font-size: 20px;
  }
}
</style>
<style lang="scss" scoped>
.income-container {
  width: 100%;
  > .title {
    text-align: start;
  }
  > .formCard {
    padding: 0 50px;
  }
}
.el-form {
  font-size: 24px;
  > .el-form-item {
    text-align: start;
  }
  > .el-form-item:nth-child(n + 2) {
    margin: 20px 0;
  }

  // .el-cascader,
  // .el-date-editor,
  .formMoneyInput {
    width: 300px;
  }

  .el-textarea {
    width: 500px;
  }

  .el-input {
    font-size: 16px;
  }
}
</style>
