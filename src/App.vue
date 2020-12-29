<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created () {
    window.addEventListener('unload', this.saveState)
    this.removeState()
  },
  methods: {
    saveState () {
      // 保存当前的 state 刷新会被删除的数据
      sessionStorage.setItem('userObj', JSON.stringify(this.$store.state.userObj))
      sessionStorage.setItem('userInfo', JSON.stringify(this.$store.state.userInfo))
    },
    removeState () {
      const userObj = JSON.parse(sessionStorage.getItem('userObj'))
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if (userObj !== null) {
        // 刷新完后，将数据返回给state
        this.$store.commit('setUserObj', userObj)
        // 删除保存的state 刷新会被删除的数据
        sessionStorage.removeItem('userObj')
      }
      if (userInfo !== null) {
        // 刷新完后，将数据返回给state
        this.$store.commit('setUserInfo', userInfo)
        // 删除保存的state 刷新会被删除的数据
        sessionStorage.removeItem('userInfo')
      }
    }
  }
}
</script>

<style>
</style>
