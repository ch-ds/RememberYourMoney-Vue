<template>
  <div class="expend-container">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航栏 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>记账</el-breadcrumb-item>
        <el-breadcrumb-item>支出登记</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <!-- 卡片视图 -->
    <el-card class="formCard">
      <!-- 表单区域 -->
      <el-form
        :model="expendForm"
        :rules="expendRules"
        ref="expendFormRef"
        :label-position="labelPosition"
        size="small"
      >
        <el-form-item label="支出类型" prop="type">
          <el-cascader
            v-model="expendForm.type"
            :options="cascaderOptions"
            :props="{
              expandTrigger: 'hover',
              value: 'expendType_id',
              label: 'expendType_name',
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="expendForm.date"
            type="date"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="expendForm.money" class="formMoneyInput">
            <template slot="suffix">元 </template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="msg">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2 }"
            placeholder="点击写备注..."
            v-model.trim="expendForm.msg"
            show-word-limit
            :maxlength="140"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="images">
          <add-image
            :fileList="expendForm.images"
            :on-preview="imgHandlePictureCardPreview"
          ></add-image>
        </el-form-item>
        <el-form-item>
          <el-button @click="extendSubmit">提交</el-button>
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
    // 金额小数点验证规则
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
      // 支出表单
      expendForm: {
        type: [],
        date: new Date().getTime(),
        money: '',
        msg: '',
        images: []
      },
      // 支出表单规则
      expendRules: {
        type: [
          { type: 'array', required: true, msg: '请选择支出类型', trigger: 'change' }
        ],
        date: [
          { type: 'date', required: true, msg: '请选择日期', trigger: 'change' }
        ],
        money: [
          { required: true, validator: valiNumberMoney, trigger: 'blur' }
        ],
        msg: [],
        images: []
      },
      // 级联选择器绑定元素
      cascaderOptions: [],
      dialogVisible: false,
      dialogImageUrl: '',
      labelPosition: 'top'
    }
  },
  created () {
    this.getExpendTypeList()
  },
  methods: {
    // 获取支出类型
    async getExpendTypeList () {
      const { data: res } = await this.$http.get('/expend/type')
      if (res.meta.status !== 200) return this.$message.error('获取支出类型数据失败')
      this.cascaderOptions = res.data
      console.log(this.cascaderOptions)
    },
    // 删除图片
    imgHandleRemove (file, index) {
      this.expendForm.images.splice(index, 1)
    },
    // 放大图片
    imgHandlePictureCardPreview (file) {
      console.log(file)
      // 赋值
      this.dialogImageUrl = file.url
      // 显示对话框
      this.dialogVisible = true
    },
    // 添加图片
    imgHandleAdd (file) {
      this.expendForm.images.push(file)
    },
    // 表单提交
    extendSubmit () {
      this.$refs.expendFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error('请正确填写完必填项')
          return false
        }
        // 处理表单数据
        // 获取type数组中的最后一项
        const [expendTypeId] = [...this.expendForm.type].reverse()
        // 创建 FormData 对象
        const formData = new FormData()
        // 将需要传递的数据 append 进 FormData 对象里
        formData.append('expendType_id', expendTypeId)
        formData.append('expend_date', this.expendForm.date)
        formData.append('expend_money', this.expendForm.money)
        formData.append('expend_msg', this.expendForm.msg)
        // 处理图片，因为有多个图片，所以循环存入同一个 key 中
        this.expendForm.images.forEach(item => {
          formData.append('expend_images', item)
        })

        // 发送数据
        const { data: res } = await this.$http.post('/expend/' + this.$store.state.userObj.uid, formData)
        if (res.meta.status !== 200) {
          return this.$message.error('提交失败,原因:' + res.meta.msg)
        }
        // 清楚数据
        this.$refs.expendFormRef.resetFields()
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
.expend-container {
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
.expend-container {
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
