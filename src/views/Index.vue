<template>
  <div class="index" id="index">
    <!-- header顶部 -->
    <header class="index-header">
      <div class="header-logo-wrap">
        <img alt="logo" src="~@/assets/logo.png" />
      </div>
      <div class="header-info-wrap">
        <div class="tool-row">
          <el-button @click="showAside = !showAside"
            ><i class="el-icon-s-grid"></i
          ></el-button>
        </div>
        <div class="info-row">
          <p class="info-name">
            欢迎你,<strong>{{ username || '未命名用户' }}</strong>
          </p>
          <el-badge :value="4" type="success">
            <i class="iconfont icon-icon-test1"></i>
          </el-badge>
          <el-badge :value="5" type="danger">
            <i class="iconfont icon-icon-test"></i>
          </el-badge>
          <el-button>
            <i class="iconfont icon-tuichu6" @click="signOut">退出</i>
          </el-button>
        </div>
      </div>
    </header>
    <!-- 侧边栏aside -->
    <transition-group name="asideBox" tag="main">
      <aside class="index-aside" v-show="showAside" key="aside">
        <!-- 头像区域 -->
        <div class="aside-info-wrap">
          <img
            :src="
              image
                ? `http://localhost:8081/image?uid=${uid}&url=${image}`
                : require('@/assets/images/header.png')
            "
            alt="头像"
          />
          <p>{{ remark || '未设置个人简介' }}</p>
          <router-link to="/setup/userInfo">
            <i class="el-icon-edit"></i>账号设置
          </router-link>
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
        <router-view :key="$route.path"></router-view>
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
            name: '收入登记',
            router: '/addBill/income',
            icon: 'iconfont icon-income-o'
          }, {
            id: '22',
            name: '支出登记',
            router: '/addBill/expend',
            icon: 'iconfont icon-jiaoyizhichu'
          }]
        }, {
          id: '3',
          name: '账单',
          icon: 'el-icon-document',
          children: [{
            id: '31',
            name: '明细账单',
            icon: 'iconfont icon-mingxi',
            children: [{
              id: '311',
              name: '收入明细',
              icon: 'iconfont icon-shourumingxi',
              router: '/detailBill/income'
            }, {
              id: '312',
              name: '支出明细',
              icon: 'iconfont icon-zhichumingxi',
              router: '/detailBill/expend'
            }]
          }/* , {
            id: '32',
            name: '总账单',
            icon: 'iconfont icon-zhangdan',
            children: [{
              id: '321',
              name: '收入总账单',
              icon: 'iconfont icon-zhou',
              router: ''
            }, {
              id: '322',
              name: '支出总账单',
              icon: 'iconfont icon-yue',
              router: ''
            }]
          } */]
        }, {
          id: '4',
          name: '设置',
          icon: 'el-icon-s-tools',
          children: [{
            id: '41',
            name: '账单分类',
            icon: 'el-icon-s-grid',
            router: '',
            children: [{
              id: '411',
              name: '收入分类',
              router: '/setup/incomeType'
            }, {
              id: '412',
              name: '支出分类',
              router: '/setup/expendType'
            }]
          }, {
            id: '42',
            name: '个人信息设置',
            icon: 'el-icon-user-solid',
            router: '/setup/userInfo'
          }]

        }
      ]
    }
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      const { data: res } = await this.$http.get('/userInfo/' + this.$store.state.userObj.uid)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.$store.state.userInfo = res.data[0]
    },
    // 退出按钮
    signOut () {
      console.log('退出')
      this.$store.commit('resetVuex')
      sessionStorage.clear()
      this.$router.push('/login')
    }
  },
  mounted () {
    this.getUserInfo()
  },
  computed: {
    uid () {
      return this.$store.state.userInfo.uid
    },
    username () {
      return this.$store.state.userInfo.username
    },
    remark () {
      return this.$store.state.userInfo.remark || ''
    },
    image () {
      return this.$store.state.userInfo.image
    }
  },
  components: {
    MenuTree
  }
}
</script>

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
    width: 250px;
    min-height: 100%;
    > .aside-info-wrap {
      position: relative;
      padding: 10px;
      height: 220px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background-color: var(--aside-color);
      > img {
        position: relative;
        left: 50%;
        transform: translateX(-50px);
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      > p {
        color: rgb(173, 174, 174);
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
        margin: auto auto;
      }

      > a {
        position: absolute;
        bottom: 10px;
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
      /deep/ .el-submenu__title,
      /deep/ .el-menu-item {
        text-align: start;
        font-size: 16px;
      }
      /deep/ i {
        font-size: 24px;
      }
      /deep/ .el-submenu__title:hover,
      /deep/ .el-menu-item:hover {
        background-color: var(--aside-color) !important;
        color: var(--font-color-active) !important;
      }
      /deep/ .el-submenu__title:hover i,
      /deep/ .el-menu-item:hover i {
        color: var(--font-color-active) !important;
      }
      /deep/ .is-active {
        background-color: var(--aside-color) !important;
      }
    }
  }
  > .index-content {
    width: calc(100% - 250px);
    height: 100%;
    color: var(--font-color-active);
    background-color: var(--article-color);
  }
}
</style>
