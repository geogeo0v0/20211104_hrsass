// 控制页面登录权限(路由访问)的文件
import router from '@/router'
import store from '@/store'
// import 'nprogress/nprogress.css' // 引入进度条样式
import { asyncRoutes } from '@/router'

const whiteList = ['/login', '/404']

// // 导航前置守卫
router.beforeEach(async (to, from, next) => {
  const token = store.getters.token
  // 1. 有token的话
  if (token) {
    // 1.1 有token的话去登录页也跳到首页
    if (to.path === '/login') {
      next('/')
      // 1.2 有token不去登录页的话
    } else {
      // 1.2.1 没有用户信息的话 调用getUserInfo方法获取并存储
      if (!store.state.user.userInfo.userId) {
        const { roles: { menus } } = await store.dispatch('user/getUserInfo')
        console.log('menus', menus)

        const otherRoutes = await store.dispatch('user/filterRoutes', menus)
        console.log('将来权限控制', otherRoutes)
        // --->动态添加路由的方法router.addRoutes([{},{}])
        router.addRoutes([...otherRoutes, { path: '*', redirect: '/404', hidden: true }])
        // --->重新配置过的路由需要重进下生效
        next({ ...to, replace: true }) // 再次进了同一个路由 配置replace防止路由地址重复
        return
      }
      next()
    }
  } else {
    // 2. 无token的话
    whiteList.includes(to.path) ? next() : next('/login')
    // NProgress.done()
  }
})

// // 导航后置守卫
// router.afterEach((to, from) => {
//   // NProgress.done()
// });
