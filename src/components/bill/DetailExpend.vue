<template>
  <div class="expendBill">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航栏 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账单</el-breadcrumb-item>
        <el-breadcrumb-item>明细账单</el-breadcrumb-item>
        <el-breadcrumb-item>支出明细</el-breadcrumb-item>
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
              @change="getExpendList"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="支出类型" prop="expendType_id">
            <el-cascader
              v-model="searchForm.expendType_id"
              :options="expendTypeOptions"
              clearable
              @change="getExpendList"
              :props="{
                expandTrigger: 'hover',
                value: 'expendType_id',
                label: 'expendType_name',
              }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="价格区间（元）">
            <el-form-item prop="lowPrice">
              <el-input
                v-model="searchForm.lowPrice"
                clearable
                placeholder="最低价"
                @input="getExpendList"
              ></el-input>
            </el-form-item>
            <p></p>
            <el-form-item prop="highPrice">
              <el-input
                v-model="searchForm.highPrice"
                clearable
                placeholder="最高价"
                @input="getExpendList"
              ></el-input>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 表单区域 -->
      <el-table
        stripe
        :data="expendList"
        style="width: 100%"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column type="index" width="30"></el-table-column>
        <el-table-column label="日期" width="170">
          <template slot-scope="scope">
            {{ scope.row.expend_date | dateFormat('yyyy-mm-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="expendType_name"
          label="收入类型"
        ></el-table-column>
        <el-table-column prop="expend_msg" label="备注"></el-table-column>
        <el-table-column prop="expend_money" label="金额">
          <template slot-scope="scope">
            {{ scope.row.expend_money | moneyFormat }}
          </template>
        </el-table-column>
        <el-table-column label="图片(只显示第一张)">
          <template slot-scope="scope">
            <!-- 只显示一张，等查看详情时可查看全部 -->
            <images
              :imgList="scope.row.expend_images.slice(0, 1)"
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
            <el-tooltip :enterable="false" content="删除" placement="top">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteExpend(scope.row.expend_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="pageHandleSizeChange"
        @current-change="pageHandleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[5, 10, 20, 40, 80, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改对话框 -->
    <el-dialog
      :visible.sync="editDialogVisible"
      title="详情"
      width="50%"
      @closed="editDialogClosed"
    >
      <!-- 底部按钮 -->
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="editFormRules"
        label-position="top"
        class="editForm"
      >
        <el-form-item prop="expend_date" label="日期">
          <el-date-picker
            v-model="editForm.expend_date"
            type="date"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="expendType_id" label="收入类型">
          <el-cascader
            v-model="editForm.expendType_id"
            :options="expendTypeOptions"
            :props="{
              expandTrigger: 'hover',
              value: 'expendType_id',
              label: 'expendType_name',
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="expend_money" label="金额">
          <el-input v-model="editForm.expend_money"></el-input>
        </el-form-item>
        <el-form-item prop="expend_msg" label="备注">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="点击写备注..."
            v-model.trim="editForm.expend_msg"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editExpend">确定</el-button>
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
      // 日期范围搜索选择器表单数据
      searchForm: {
        timeArr: [],
        expendType_id: [],
        lowPrice: '',
        highPrice: ''
      },
      searchFormRules: {
        timeArr: [],
        expendType_id: [],
        lowPrice: [],
        highPrice: []
      },
      // 表单数据
      expendList: [],
      expendListSumMoney: 0,
      // 分页对象
      page: {
        pageSize: 5,
        currentPage: 1
      },
      // 总数居
      total: 0,
      // 修改对话框显示与隐藏
      editDialogVisible: false,
      // 修改表单数据
      editForm: {},
      editFormRules: {
        expend_date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        expendType_id: [
          { required: true, message: '请选择收入类型', trigger: 'change' }
        ],
        expend_money: [
          { required: true, validator: valiNumberMoney, trigger: 'blur' }
        ],
        expend_msg: []
      },
      // 图片数组
      fileList: [],
      // 图片放大对话框显示与隐藏
      imgDialogVisible: false,
      // 图片放大url
      imageDialogUrl: '',
      // 支出类型级联选择器数据
      expendTypeOptions: []
    }
  },
  methods: {
    // 重置表单
    resetForm () {
      this.$refs.searchForm.resetFields()
      this.getExpendList()
    },
    // 获取支出数据
    async getExpendList () {
      let timeStart, timeEnd, expendTypeId
      if (this.searchForm.timeArr && this.searchForm.timeArr.length > 0) {
        timeStart = this.searchForm.timeArr[0] + ' 00:00:00'
        timeEnd = this.searchForm.timeArr[1] + ' 23:59:59'
      }
      if (this.searchForm.expendType_id && this.searchForm.expendType_id.length > 0) {
        [expendTypeId] = [...this.searchForm.expendType_id].reverse()
      }
      const { data: res } = await this.$http.get(`/expend/${this.$store.state.userObj.uid}`, {
        params: {
          timeStart,
          timeEnd,
          expendType_id: expendTypeId,
          lowPrice: this.searchForm.lowPrice,
          highPrice: this.searchForm.highPrice,
          page: this.page
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.expendList = res.data.goods
      this.total = res.data.total
      this.expendListSumMoney = res.data.sumMoney
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
          case 1:
            sums[index] = '总支出'
            return
          case 2:
            sums[index] = this.expendListSumMoney + ' 元'
            return
          case 3:
            sums[index] = '当前页总收入'
            return
        }
        if (column.property === 'expend_money') {
          const values = data.map(item => Number(item.expend_money))
          sums[index] = values.reduce((total, num) => total + num, 0) + ' 元'
          console.log(sums[index])
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    },
    // 获取级联选择器数据
    async getExpendTypeOptions () {
      const { data: res } = await this.$http.get('/expend/type')
      if (res.meta.status !== 200) return this.$message.error('获取支出类型数据失败')
      this.expendTypeOptions = res.data
    },
    // 修改每页数据
    pageHandleSizeChange (val) {
      this.page.pageSize = val
      this.getExpendList()
    },
    // 修改页数
    pageHandleCurrentChange (val) {
      this.page.currentPage = val
      this.getExpendList()
    },
    // 点击按钮显示详情
    showEditDialog (info) {
      this.editForm = this.deepClone(info)
      this.editForm.expend_date = new Date(this.editForm.expend_date).getTime()
      this.fileList = []
      this.fileList = info.expend_images.map(item => ({
        url: `http://127.0.0.1:8081/image?uid=${this.$store.state.userObj.uid}&url=${item}`
      }))
      this.editDialogVisible = true
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
    // 点击修改按钮
    editExpend () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        let expendTypeId = this.editForm.expendType_id
        if (this.editForm.expendType_id instanceof Array) {
          [expendTypeId] = [...this.editForm.expendType_id]
        }
        const formData = new FormData()
        formData.append('expendType_id', expendTypeId)
        formData.append('expend_date', this.editForm.expend_date)
        formData.append('expend_money', this.editForm.expend_money)
        formData.append('expend_msg', this.editForm.expend_msg)
        // 获取旧数据
        let oldFileList = this.fileList.filter(item => !(item instanceof File))
        oldFileList = oldFileList.map(item => ({ url: item.url.split('/').pop() }))
        // 获取新添加的数据
        const newFileList = this.fileList.filter(item => item instanceof File)
        // 从旧的图片中找到需要删除的
        const deleteFileList = this.editForm.expend_images.filter(item => {
          const index = oldFileList.findIndex(subItem => subItem.url === item)
          return index === -1
        })
        deleteFileList.forEach(item => {
          formData.append('deleteFileList', item)
        })
        newFileList.forEach(item => {
          formData.append('newFileList', item)
        })
        oldFileList.forEach(item => {
          formData.append('oldFileList', item.url)
        })

        const { data: res } = await this.$http.put(`/expend/${this.editForm.uid}/${this.editForm.expend_id}`, formData)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getExpendList()
        this.editDialogVisible = false
      })
    },
    // 修改对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮删除数据
    async deleteExpend (expendId) {
      const confirmResult = await this.$confirm('此操作将永久删除,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'cancel') return this.$message.info('已取消删除')
      // 开始删除
      const { data: res } = await this.$http.delete(`/expend/${expendId}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      // 如果数据是最后一页的最后一条
      if ((this.total - 1) % this.page.pageSize === 0) {
        this.page.currentPage -= 1
      }
      console.log(this.page.currentPage)
      // 删除成功刷新数据
      this.getExpendList()
    }
  },
  mounted () {
    this.getExpendList()
    this.getExpendTypeOptions()
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
  },
  components: {
    Images,
    AddImage
  }
}
</script>

<style lang="scss" scoped>
.expendBill {
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
    background-color: var(--article-color-active);
    /deep/ .cell {
      // 设置单行显示，超出省略
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .images {
      /deep/ .image {
        height: 48px;
      }
    }
  }
  .el-pagination {
    display: flex;
    margin-top: 20px;
    /deep/ span {
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
