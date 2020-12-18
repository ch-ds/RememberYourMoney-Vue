<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航栏 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>账单分类</el-breadcrumb-item>
        <el-breadcrumb-item>收入类型</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
    console.log(this.$route)
  }
}
</script>

<style lang="scss" scoped>
</style>
