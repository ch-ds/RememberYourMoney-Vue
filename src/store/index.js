import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userObj: {},
    userInfo: {}
  },
  mutations: {
    setUserObj (state, userObj) {
      state.userObj = userObj
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    resetVuex (state) {
      state.userObj = {}
      state.userInfo = {}
    }
  },
  actions: {
  },
  modules: {
  }
})
