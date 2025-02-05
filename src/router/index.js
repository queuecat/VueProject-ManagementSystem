import Vue from "vue"
import VueRouter from "vue-router"
// // 引入登录组件
// import Login from "../components/Login.vue"
// //引入home组件
// import Home from "../components/Home.vue"
// //导入home组件的子路由welcome
// import Welcome from "../components/Welcome.vue"
// //导入home组件的子路由users
// import Users from "../components/user/Users.vue"
// //导入home组件的子路由rights
// import Rights from "../components/power/rights.vue"
// //导入home组件的子路由Roles
// import Roles from "../components/power/Roles.vue"
// //导入home组件的子路由cate
// import Cate from "../components/goods/Cate.vue"
// //导入home组件的子路由params
// import Params from "../components/goods/Params.vue"
// //导入home组件的子路由List
// import List from "../components/goods/List.vue"
// //导入home组件的子路由Add
// import Add from "../components/goods/Add.vue"
// //导入home组件的子路由Order
// import Order from "../components/order/Order.vue"
// //导入home组件的子路由Report
// import Report from "../components/report/Report.vue"
// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login-home-welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login-home-welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login-home-welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/rights.vue')
const Roles = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "Cate-Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate-Params" */ '../components/goods/Params.vue')

const Add = () => import(/* webpackChunkName: "Add-List" */ '../components/goods/Add.vue')
const List = () => import(/* webpackChunkName: "Add-List" */ '../components/goods/List.vue')

const Order = () => import(/* webpackChunkName: "Order-Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order-Report" */ '../components/report/Report.vue')


Vue.use(VueRouter)
//配置路由规则
const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/login"
    }, //登录路由
    {
      path: "/login",
      component: Login
    }, //主页路由
    {
      path: "/home",
      component: Home,
      redirect: '/welcome',
      children: [
        //二级路由
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report },
      ]
    }
  ]
})
// 为路由对象，添加 beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === "/login") return next()
  // 若访问的非登录页面
  // 从 sessionStorage 中获取到 保存的 token 值
  const tokenStr = window.sessionStorage.getItem("token")
  // 没有token，强制跳转到登录页
  if (!tokenStr) return next("/login")
  // 含有token放行
  next()
})

export default router
