<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航栏 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>账单分类</el-breadcrumb-item>
        <el-breadcrumb-item>支出类型</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="expendTypeList"
        row-key="expendType_id"
        default-expand-all
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column
          label="分类名称"
          prop="expendType_name"
        ></el-table-column>
        <el-table-column label="分类级别">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.expendType_leave === 1">
              一级
            </el-tag>
            <el-tag
              size="small"
              v-else-if="scope.row.expendType_leave === 2"
              type="success"
            >
              二级
            </el-tag>
            <el-tag size="small" v-else type="warning"> 三级 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="showEditDialog(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteBtn(scope.row.expendType_id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog
      title="添加支出分类"
      :visible.sync="addDialogVisible"
      @closed="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="120px"
      >
        <el-form-item label="支出分类名称" prop="expendType_name">
          <el-input v-model="addForm.expendType_name"></el-input>
        </el-form-item>
        <el-form-item label="上级分类" prop="expendType_pid">
          <el-cascader
            v-model="addForm.expendType_pid"
            :options="addExpendTypeList"
            :props="{
              checkStrictly: true,
              label: 'expendType_name',
              value: 'expendType_id',
            }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addBtn">确定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑支出分类"
      :visible.sync="editDialogVisible"
      @closed="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="120px"
      >
        <el-form-item label="支出分类名称" prop="expendType_name">
          <el-input v-model="editForm.expendType_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editBtn">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 支出类型数据
      expendTypeList: [],
      // 添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加表单
      addForm: {},
      addExpendTypeList: [{
        expendType_name: '无上级分类',
        expendType_id: null
      }],
      // 添加表单验证规则
      addFormRules: {
        expendType_name: [{ required: true, msg: '请输支出分类名称', trigger: 'blur' }],
        expendType_pid: [{ type: 'array', required: true, msg: '请选择上级分类', trigger: 'change' }]
      },
      // 编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑表单
      editForm: {},
      editFormRules: {
        expendType_name: [{ required: true, msg: '请输支出分类名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getExpendTypeList () {
      const { data: res } = await this.$http.get('/expend/type')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.expendTypeList = res.data
      this.addExpendTypeList.push(...this.deepExpendType(res.data))
    },
    // 分类深拷贝函数
    deepExpendType (obj) {
      // 如果不是对象，直接返回
      if (typeof obj !== 'object' || obj === null) return obj
      // 数组兼容
      const target = Array.isArray(obj) ? [] : {}
      for (const key in obj) {
        if (key === 'children' && obj.expendType_leave === 2) {
          continue
        }
        if (obj[key] !== null && typeof obj[key] === 'object') {
          target[key] = this.deepExpendType(obj[key])
        } else {
          target[key] = obj[key]
        }
      }
      return target
    },
    // 显示添加对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加对话框关闭回调
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 确定添加
    addBtn () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        let leave = 1
        let pid = this.addForm.expendType_pid[0]
        if (this.addForm.expendType_pid[0]) {
          leave = this.addForm.expendType_pid.length + 1;
          [pid] = [...this.addForm.expendType_pid].reverse()
        }
        const { data: res } = await this.$http.post('/expendType', {
          expendType_name: this.addForm.expendType_name,
          expendType_pid: pid,
          expendType_leave: leave
        })
        if (res.meta.status !== 200) return this.$message.error('添加失败')
        this.getExpendTypeList()
        this.$refs.addFormRef.resetFields()
        this.$message.success('添加成功')
        this.addDialogVisible = false
      })
    },
    // 显示编辑对话框
    showEditDialog (info) {
      this.editForm = {
        expendType_id: info.expendType_id,
        expendType_name: info.expendType_name
      }
      this.editDialogVisible = true
    },
    // 确定修改
    editBtn () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/expendType/' + this.editForm.expendType_id, {
          expendType_name: this.editForm.expendType_name
        })
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.getExpendTypeList()
        this.$refs.editFormRef.resetFields()
        this.$message.success('修改成功')
        this.editDialogVisible = false
      })
    },
    // 修改对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 删除支出数据按钮
    async deleteBtn (id) {
      const confirmResult = await this.$confirm('此操作将永久删除,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'cancel') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('/expendType/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.getExpendTypeList()
      this.$message.success('删除成功')
    }
  },
  mounted () {
    this.getExpendTypeList()
  }
}
</script>

<style lang="scss" scoped>
</style>
