import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局css
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
// 导入echarts
import echarts from 'echarts'

Vue.config.productionTip = false

// 注册echarts为全局配置
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
