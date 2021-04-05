module.exports = {
  lintOnSave: false,
  publicPath: "/demos/vue-shop/",
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // config.entry('app').clear()获取并清空默认入口文件
      config.entry('app').clear().add('./src/main-prod.js')
      // CDN资源导入
      config.set('externals', {
        vue: 'Vue', 'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress', 'vue-quill-editor': 'VueQuillEditor'
      })
      // 页面标题
      config.plugin('html').tap(args => {
        args[0].title = "电商后台管理系统"
        return args
      })
    })
    // 开发环境
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      // 页面标题
      config.plugin('html').tap(args => {
        args[0].title = "电商后台管理系统"
        return args
      })
      // CDN资源导入
      config.set('externals', {
        vue: 'Vue', 'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress', 'vue-quill-editor': 'VueQuillEditor'
      })
    })
  }
}