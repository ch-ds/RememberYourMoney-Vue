<template>
  <div class="incomeBox">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航栏 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账单</el-breadcrumb-item>
        <el-breadcrumb-item>明细账单</el-breadcrumb-item>
        <el-breadcrumb-item>收入明细</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <!-- 卡片视图 -->
    <el-card class="search-card">
      <!-- 搜索头 -->
      <div class="search-head-wrap">
        <div class="search-title">
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
        </div>
        <div class="search-button">
          <el-button size="mini" @click="resetForm">重置</el-button>
        </div>
      </div>
      <div class="search-box">
        <!-- 表单 -->
        <el-form
          ref="searchForm"
          :model="searchForm"
          class="searchForm"
          :rules="searchFormRules"
          size="small"
        >
          <el-form-item label="时间范围" prop="timeArr">
            <el-date-picker
              v-model="searchForm.timeArr"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              unlink-panels
              value-format="yyyy-MM-dd"
              @change="getIncomeList"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="收入类型" prop="incomeType_id">
            <el-cascader
              v-model="searchForm.incomeType_id"
              :options="incomeOptions"
              @change="getIncomeList"
              :props="{
                expandTrigger: 'hover',
                value: 'incomeType_id',
                label: 'incomeType_name',
              }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="价格区间（元）">
            <el-form-item prop="lowPrice">
              <el-input
                v-model="searchForm.lowPrice"
                placeholder="最低价"
                @change="getIncomeList"
              ></el-input>
            </el-form-item>
            <p></p>
            <el-form-item prop="highPrice">
              <el-input
                v-model="searchForm.highPrice"
                placeholder="最高价"
                @change="getIncomeList"
              ></el-input>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 表单 -->
      <el-table
        stripe
        :data="incomeList"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column type="index" width="30"> </el-table-column>
        <el-table-column prop="income_date" label="日期" width="170">
          <template slot-scope="scope">
            {{ scope.row.income_date | dateFormat('yyyy-mm-dd') }}
          </template>
        </el-table-column>
        <el-table-column prop="incomeType_name" label="收入类型">
        </el-table-column>
        <el-table-column prop="income_msg" label="备注"> </el-table-column>
        <el-table-column prop="income_money" label="金额" width="200">
          <template slot-scope="scope">
            {{ scope.row.income_money | moneyFormat }}
          </template>
        </el-table-column>
        <el-table-column label="图片(只显示第一张)">
          <template slot-scope="scope">
            <!-- 只显示一张，等查看详情时可查看全部 -->
            <images
              :imgList="scope.row.income_images.slice(0, 1)"
              isPreview
            ></images>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" content="修改" placement="top">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" content="修改" placement="top">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteIncome(scope.row.income_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[5, 10, 20, 40, 80, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 查看对话框 -->
    <el-dialog
      title="详情"
      :visible.sync="editDialogVisible"
      width="50%"
      @closed="editDialogClosed"
    >
      <!-- 表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        class="editForm"
        label-position="top"
      >
        <el-form-item label="日期" prop="income_date">
          <el-date-picker
            v-model="editForm.income_date"
            type="date"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收入类型" prop="incomeType_id">
          <el-cascader
            v-model="editForm.incomeType_id"
            :options="incomeOptions"
            :props="{
              expandTrigger: 'hover',
              value: 'incomeType_id',
              label: 'incomeType_name',
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="金额" prop="income_money">
          <el-input v-model="editForm.income_money"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="income_msg">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="点击写备注..."
            v-model.trim="editForm.income_msg"
            resize="none"
            show-word-limit
            :maxlength="140"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <add-image
            :fileList="fileList"
            :on-preview="handleImagePreview"
          ></add-image>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editSubmit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 图片放大对话框 -->
    <el-dialog :visible.sync="imgDialogVisible">
      <img :src="imageDialogUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import Images from '../util/Images'
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
      // 日期范围搜索选择器数据
      searchForm: {
        timeArr: [],
        incomeType_id: [],
        lowPrice: '',
        highPrice: ''
      },
      searchFormRules: {
        timeArr: [],
        incomeType_id: [],
        lowPrice: '',
        highPrice: ''
      },
      // 表格数据
      incomeList: [],
      incomeListSumMoney: 0,
      // 修改对话框
      // 控制修改对话框的显示和隐藏
      editDialogVisible: false,
      // 修改对话框的表单数据
      editForm: {},
      editFormRules: {
        income_date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        incomeType_id: [
          { required: true, message: '请选择收入类型', trigger: 'change' }
        ],
        income_money: [
          { required: true, validator: valiNumberMoney, trigger: 'blur' }
        ],
        income_msg: []
      },
      // 级联选择器
      incomeOptions: [],
      // 图片列表
      fileList: [],
      // 图片对话框
      imgDialogVisible: false,
      imageDialogUrl: '',
      // 分页对象
      page: {
        pageSize: 5,
        currentPage: 1
      },
      total: 50
    }
  },
  mounted () {
    this.getIncomeList()
    this.getIncomeOptions()
  },
  methods: {
    // 重置表单
    resetForm () {
      this.$refs.searchForm.resetFields()
      this.getIncomeList()
    },
    // 获取表单数据
    async getIncomeList () {
      console.log(this.searchForm.timeArr)
      let timeStart, timeEnd, incomeTypeId
      if (this.searchForm.timeArr && this.searchForm.timeArr.length > 0) {
        console.log(this.searchForm.timeArr)
        timeStart = this.searchForm.timeArr[0] + ' 00:00:00'
        timeEnd = this.searchForm.timeArr[1] + ' 23:59:59'
      }
      if (this.searchForm.incomeType_id && this.searchForm.incomeType_id.length > 0) {
        [incomeTypeId] = [...this.searchForm.incomeType_id].reverse()
      }
      const { data: res } = await this.$http.get('/income/' + this.$store.state.userObj.uid, {
        params: {
          timeStart,
          timeEnd,
          incomeType_id: incomeTypeId,
          lowPrice: this.searchForm.lowPrice,
          highPrice: this.searchForm.highPrice,
          page: this.page
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取表单收入数据失败')
      this.incomeList = res.data.goods
      this.total = res.data.total
      this.incomeListSumMoney = res.data.sumMoney
    },
    // 获取级联选择器数据
    async getIncomeOptions () {
      const { data: res } = await this.$http.get('/income/type')
      if (res.meta.status !== 200) return this.$message.error('获取不到收入类型数据')
      this.incomeOptions = res.data
    },
    // 表格合计行数据
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        switch (index) {
          case 0:
            sums[index] = ''
            return
          case 1: {
            sums[index] = '总收入'
            return
          }
          case 2:
            sums[index] = this.incomeListSumMoney + ' 元'
            return
          case 3:
            sums[index] = '当前页总收入'
            return
        }
        if (column.property === 'income_money') {
          const values = data.map(item => Number(item.income_money))
          sums[index] = values.reduce((total, num) => total + num, 0) + ' 元'
          console.log(sums[index])
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    },
    showEditDialog (info) {
      this.fileList = []
      info.income_date = new Date(info.income_date).getTime()
      this.editForm = this.deepClone(info)
      // this.editForm = info
      this.editDialogVisible = true
      info.income_images.forEach(item => {
        this.fileList.push({ url: `http://127.0.0.1:8081/image/${this.$store.state.userObj.uid}/${item}` })
      })
    },
    // 对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 深拷贝函数
    deepClone (obj) {
      // 判断是否是对象,不是直接返回
      if (typeof obj !== 'object' || obj === null) return obj
      // 数组兼容
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
    // 放大图片
    handleImagePreview (file) {
      console.log(file)
      this.imgDialogVisible = true
      this.imageDialogUrl = file.url
    },
    // 确定修改
    editSubmit () {
      console.log('修改操作开始:')
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 创建一个 formdata 对象
        let incomeTypeId = this.editForm.incomeType_id
        if (this.editForm.incomeType_id instanceof Array) {
          // 取出 incomeType_id
          [incomeTypeId] = this.editForm.incomeType_id.reverse()
        }
        const formData = new FormData()
        formData.append('incomeType_id', incomeTypeId)
        formData.append('income_date', this.editForm.income_date)
        formData.append('income_money', this.editForm.income_money)
        formData.append('income_msg', this.editForm.income_msg)
        // 定义两个变量, oldImageList 代表已有的图片列表, uploadImageList 代表上传图片列表
        const oldImageList = this.fileList.filter(item => !(item instanceof File))
        const uploadImageList = this.fileList.filter(item => item instanceof File)
        console.log(oldImageList)
        // console.log(uploadImageList)
        const deleteImageList = this.editForm.income_images.filter(item => {
          return oldImageList.every(subItem => subItem.url.split('/').pop() !== item)
        })
        console.log(deleteImageList)
        // 将之前存在的图片列表发送
        oldImageList.forEach(item => {
          const array = item.url.split('/')
          formData.append('oldImageList', array[array.length - 1])
        })
        // 进行操作,找到删除的图片数组
        deleteImageList.forEach(item => {
          formData.append('deleteImageList', item)
        })

        // 进行操作,将添加的数组传进去
        uploadImageList.forEach(item => {
          formData.append('uploadImageList', item)
        })

        const { data: res } = await this.$http.put(`/income/${this.editForm.uid}/${this.editForm.income_id}`, formData)
        console.log('修改成功:')
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getIncomeList()
        this.editDialogVisible = false
      })
    },
    // 删除操作
    async deleteIncome (id) {
      console.log('删除的id值:' + id)
      const confirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 确定返回confirm,取消返回cancel
      if (confirmResult === 'cancel') return this.$message.info('已取消删除')
      // 开始删除
      const { data: res } = await this.$http.delete('/income/' + id)
      if (res.meta.status !== 200) this.$message.error('删除失败')
      // 当删除最后一行时
      this.total--
      if (this.total % this.page.pageSize === 0) {
        this.page.currentPage -= 1
      }
      console.log(this.page.currentPage)
      this.getIncomeList()
      this.$message.success('删除成功')
    },
    // 修改每页条数
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getIncomeList()
    },
    // 修改当前页
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getIncomeList()
    }
  },
  components: {
    Images,
    AddImage
  },
  filters: {
    moneyFormat (money) {
      money = String(money)
      // 格式化参数，有小数点的补充，没有的补充小数点
      const moneyArr = money.split('.')
      moneyArr[1] = moneyArr[1] ? moneyArr[1].padEnd(2, 0) : '00'
      // 当长度小于3，不需要被格式化
      if (moneyArr[0].length <= 3) {
        return moneyArr[0] + '.' + moneyArr[1]
      }
      // 获取需要被截取到的位置
      const num = moneyArr[0].length % 3
      // 多余的部分
      let output = moneyArr[0].substring(0, num)
      output = output === '' ? output : output + ','
      // 需要整改的部分
      let newMoney = moneyArr[0].substring(num).replace(/(.{3})/g, '$1,')
      // 删除最后一位多出来的,
      newMoney = newMoney.slice(0, -1)
      money = output + newMoney
      return money + '.' + moneyArr[1]
    }
  }
}
</script>

<style lang="scss" scoped>
.incomeBox {
  > .search-card {
    .search-head-wrap {
      width: 100%;
      display: flex;
      color: var(--font-color);
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 18px;
      > .search-title {
        > span {
          margin-left: 5px;
        }
      }
    }
    .search-box {
      .searchForm {
        display: flex;
        flex-wrap: wrap;
        ::v-deep .el-form-item__label {
          color: var(--font-color);
        }
        > .el-form-item {
          text-align: start;
          display: flex;
          margin-right: 30px;
        }
        > .el-form-item:last-child {
          ::v-deep .el-form-item__content {
            display: flex;
            .el-input__inner {
              width: 150px;
            }
            p {
              width: 15px;
              margin: 0 5px;
              &::before {
                content: '';
                position: absolute;
                top: 16px;
                // top: 50%;
                // transform: translateY(-2px);
                width: 15px;
                border-bottom: 4px var(--font-color) solid;
              }
            }
          }
        }
      }
    }
  }
  .el-table {
    ::v-deep .cell {
      // 设置单行显示，超出省略
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .images {
      ::v-deep .image {
        height: 48px;
      }
    }
  }
  .el-pagination {
    display: flex;
    margin-top: 20px;
    ::v-deep span {
      color: var(--font-color);
    }
  }
  .editForm {
    text-align: start;
    .el-date-editor {
      width: 100%;
    }
    .el-cascader {
      width: 100%;
    }
    .add-image {
      display: inline-block;
    }
  }
}
</style>
