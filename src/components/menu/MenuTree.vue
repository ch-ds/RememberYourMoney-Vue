<template>
  <div>
    <template v-for="item in menuData">
      <el-submenu :key="item.id" :index="item.id + ''" v-if="item.children">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </template>
        <menu-tree :menuData="item.children"></menu-tree>
      </el-submenu>
      <el-menu-item :key="item.id" :index="item.router" v-else>
        <i :class="item.icon"></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  props: ['menuData'],
  name: 'MenuTree'
}
</script>

<style lang="scss">
.iconfont {
  margin-right: 5px;
}
</style>
