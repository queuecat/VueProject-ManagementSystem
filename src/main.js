import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
// 导入vue-table-tree-grid插件
import TreeTable from 'vue-table-with-tree-grid'
//导入axios
import axios from 'axios'
//设置axios默认设置
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"//默认路径
// axios请求拦截,添加token
axios.interceptors.request.use(config => {
  var token = window.sessionStorage.getItem('token')
  // 为请求头对象，添加 Token 验证的 Authorization 字段
  if (token)
    config.headers.Authorization = token
  return config
})
//将axios挂载到Vue原型上，方便在组件中使用
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册全局组件vue-table-tree-grid
Vue.component('tree-table', TreeTable)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
