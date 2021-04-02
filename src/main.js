import Vue from 'vue'
// 先导入element-ui降低权重
import './plugins/element.js'
import App from './App.vue'
import router from './router'
//导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
// 导入vue-table-tree-grid插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文本样式表
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
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
// 将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor)

// 全局过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');
  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
