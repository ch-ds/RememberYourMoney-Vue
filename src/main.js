import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入 axios
import axios from 'axios'
// 导入全局css
import './assets/fonts/iconfont.css'
// 导入全局scss
import './assets/scss/global.scss'
// 导入echarts
import echarts from 'echarts'

// 配置 axios
axios.defaults.baseURL = 'http://127.0.0.1:8081'
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  // 为请求头添加token
  if (sessionStorage.getItem('token')) {
    config.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
  }
  return config
}, err => {
  console.log('失败心思：' + err)
})

Vue.config.productionTip = false

// 注册echarts为全局配置
Vue.prototype.$echarts = echarts

// 注册一个全局时间过滤组件
Vue.filter('dateFormat', function (date, format = 'yyyy-mm-dd h:m:s') {
  const time = new Date(date)
  const y = time.getFullYear()
  const mm = (time.getMonth() + 1 + '').padStart(2, 0)
  const d = (time.getDate() + '').padStart(2, 0)
  const h = (time.getHours() + '').padStart(2, 0)
  const m = (time.getMinutes() + '').padStart(2, 0)
  const s = (time.getSeconds() + '').padStart(2, 0)
  // 判断传入的格式
  if (format === 'yyyy-mm-dd') {
    return `${y}-${mm}-${d}`
  } else {
    return `${y}-${mm}-${d} ${h}:${m}:${s}`
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
