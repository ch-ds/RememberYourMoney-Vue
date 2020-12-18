import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userObj: {}
  },
  mutations: {
    setUserObj (state, userObj) {
      state.userObj = userObj
    }
  },
  actions: {
  },
  modules: {
  }
})
