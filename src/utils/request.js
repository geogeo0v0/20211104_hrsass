import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
// 创建一个axios的实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})

// 请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (store.getters.token) {
    // 如果token存在 注入token
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(function (response) {
  const res = response.data
  // console.log('reponse解构一层的res', res)
  const { message, success } = res
  // 返回的success非true的错误
  if (!success) {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
  return res
}, function (error) {
  // token过期的处理
  if (error.response.status === 401 && error.response.data.code === 10002) {
    Message.error('登陆会话过期,请重新登陆')
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    // 服务器错误 404 500 505
    Message.error(error.message)
  }
  return Promise.reject(error)
})

export default instance // 导出axios实例
