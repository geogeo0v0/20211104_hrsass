import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import request from './utils/request'
Vue.prototype.$request = request

// 注册全局过滤器
import * as filters from '@/filters'
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

// 注册全局指令
import * as directives from '@/directives'
Object.keys(directives).forEach(k => Vue.directive(k, directives[k]))
// Vue.directive('名称', 方法))
// for (const k in directives) {
//   Vue.directive(k, directives[k])
// }
// 注册全局组件
import components from './components'
Vue.use(components)
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
import Print from 'vue-print-nb'
Vue.use(Print)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
