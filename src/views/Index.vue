<template>
  <div class="index" id="index">
    <!-- header顶部 -->
    <header class="index-header">
      <div class="header-logo-wrap">
        <img alt="logo" src="../assets/logo.png" />
      </div>
      <div class="header-info-wrap">
        <div class="tool-row">
          <el-button @click="showAside = !showAside"
            ><i class="el-icon-s-grid"></i
          ></el-button>
          <el-input placeholder="搜索内容..." v-model="searchValue"></el-input>
          <el-button><i class="el-icon-search"></i></el-button>
        </div>
        <div class="info-row">
          <span class="info-name">欢迎你,某某某</span>
          <el-badge :value="4" type="success">
            <i class="iconfont icon-icon-test1"></i>
          </el-badge>
          <el-badge :value="5" type="danger">
            <i class="iconfont icon-icon-test"></i>
          </el-badge>
          <el-button>
            <i class="iconfont icon-tuichu6">退出</i>
          </el-button>
        </div>
      </div>
    </header>
    <!-- 侧边栏aside -->
    <transition-group name="asideBox" tag="main">
      <aside class="index-aside" v-show="showAside" key="aside">
        <!-- 头像区域 -->
        <div class="aside-info-wrap">
          <img src="../assets/images/user.jpg" alt="头像" />
          <p>AMeekPerson</p>
          <a href=""><i class="el-icon-edit"></i>账号设置</a>
        </div>
        <!-- 导航栏区域 -->
        <el-menu
          background-color="var(--header-color)"
          text-color="var(--font-color)"
          active-text-color="var(--font-color-active)"
          unique-opened
          router
          :default-active="$route.path"
        >
          <!-- 子菜单,引入组件 -->
          <menu-tree :menuData="menuList"></menu-tree>
        </el-menu>
      </aside>
      <!-- 主内容 -->
      <article class="index-content" key="article">
        <router-view></router-view>
      </article>
    </transition-group>
  </div>
</template>

<script>
import MenuTree from '../components/menu/MenuTree'
export default {
  data () {
    return {
      // asideBox的展示与隐藏
      showAside: true,
      // 搜索框数据
      searchValue: '',
      // 列表数组
      menuList: [
        {
          id: '1',
          name: '首页',
          router: '/home',
          icon: 'el-icon-s-home'
        }, {
          id: '2',
          name: '记账',
          icon: 'el-icon-plus',
          children: [{
            id: '21',
            name: '收入登记表',
            router: '/income',
            icon: 'iconfont icon-income-o'
          }, {
            id: '22',
            name: '支出登记表',
            router: '/expend',
            icon: 'iconfont icon-jiaoyizhichu'
          }]
        }, {
          id: '3',
          name: '明细账单',
          icon: 'iconfont icon-mingxi',
          children: [{
            id: '31',
            name: '收入明细',
            icon: 'iconfont icon-shourumingxi',
            children: [{
              id: '311',
              name: '周收入明细',
              icon: 'iconfont icon-zhou',
              router: ''
            }, {
              id: '312',
              name: '月收入明细',
              icon: 'iconfont icon-yue',
              router: ''
            }, {
              id: '313',
              name: '年收入明细',
              icon: 'iconfont icon-nian',
              router: ''
            }]
          }, {
            id: '32',
            name: '支出明细',
            icon: 'iconfont icon-zhichumingxi',
            children: [{
              id: '321',
              name: '周支出明细',
              icon: 'iconfont icon-zhou',
              router: ''
            }, {
              id: '322',
              name: '月支出明细',
              icon: 'iconfont icon-yue',
              router: ''
            }, {
              id: '323',
              name: '年支出明细',
              icon: 'iconfont icon-nian',
              router: ''
            }]
          }]
        }, {
          id: '4',
          name: '总账单',
          icon: 'iconfont icon-zhangdan',
          children: [{
            id: '41',
            name: '周总账单',
            icon: 'iconfont icon-zhou',
            router: ''
          }, {
            id: '42',
            name: '月总账单',
            icon: 'iconfont icon-yue',
            router: ''
          }, {
            id: '43',
            name: '年总账单',
            icon: 'iconfont icon-nian',
            router: ''
          }]
        }]
    }
  },
  components: {
    MenuTree
  }
}
</script>

<style lang="css">
.tool-row .el-input__inner {
  width: 300px;
  height: 50px;
  font-size: 16px;
  color: var(--font-color-active);
  outline: none;
  border: none;
  background-color: var(--header-color);
}
.index-aside .el-submenu__title,
.index-aside .el-menu-item {
  text-align: start;
  font-size: 16px;
}
.index-aside .el-menu i {
  font-size: 24px;
}
.index-aside .el-submenu__title:hover,
.index-aside .el-menu-item:hover {
  background-color: var(--aside-color) !important;
  color: var(--font-color-active) !important;
}
.index-aside .el-submenu__title:hover i,
.index-aside .el-menu-item:hover i {
  color: var(--font-color-active) !important;
}
.is-active {
  background-color: var(--aside-color) !important;
}
</style>
<style lang="scss" scoped>
// transition动画
.asideBox-enter-active,
.asideBox-leave-active {
  transition: all 0.6s;
}
.asideBox-enter,
.asideBox-leave-to {
  opacity: 0;
  width: 0;
}

.asideBox-move {
  transition: all 0.6s;
  width: 0;
}
.asideBox-leave-active {
  position: absolute;
}

.index-header {
  width: 100%;
  height: 50px;
  display: flex;
  > .header-logo-wrap {
    font-size: 0;
    background-color: var(--header-color-active);
  }
  > .header-info-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--header-color);
    > .tool-row {
      display: flex;
      > .el-button {
        font-size: 24px;
        background-color: var(--header-color);
        border: none;
        &:hover {
          background-color: var(--header-color-active);
          color: var(--font-color-active);
        }
      }
    }
    > .info-row {
      color: var(--font-color-active);
      height: 100%;
      > .info-name {
        display: inline-block;
        height: 100%;
        color: rgb(168, 168, 168);
        &:hover {
          color: var(--font-color-active);
          cursor: pointer;
        }
      }
      > .el-badge {
        margin: 0 20px;
        color: rgb(168, 168, 168);
        &:hover {
          cursor: pointer;
          color: var(--font-color-active);
        }
        > i {
          height: 100%;
          font-size: 24px;
        }
      }
      > .el-button {
        margin-left: 10px;
        margin-right: 20px;
        background-color: var(--header-color);
        border: none;
        color: rgb(168, 168, 168);
        height: 50px;
        &:hover {
          color: var(--font-color-active);
        }
      }
    }
  }
}
main {
  display: flex;
  min-height: calc(100vh - 50px);
  background-color: var(--article-color);
  > .index-aside {
    // position: absolute;
    width: 250px;
    min-height: 100%;
    > .aside-info-wrap {
      padding: 20px 0 0 20px;
      height: 220px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background-color: var(--aside-color);

      > img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }

      > p {
        color: rgb(173, 174, 174);
      }

      > a {
        color: var(--font-color);
        text-decoration: none;
        &:hover {
          color: rgb(173, 174, 174);
        }
      }
    }
    > .el-menu {
      height: calc(100% - 220px);
      border-right: 0;
    }
  }
  > .index-content {
    flex: 1;
    height: 100%;
    color: var(--font-color-active);
    background-color: var(--article-color);
  }
}
</style>
