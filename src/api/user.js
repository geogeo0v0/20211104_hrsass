import request from '@/utils/request'

// 登录请求
export function reqLogin(data) {
  return request({
    method: 'post',
    // /api 说明请求自己, 走代理, 其实所有的请求, 都要走代理, 所有的请求都希望以 /api 开头
    // 可以配置baseUrl, 统一添加 /api 前缀
    url: '/sys/login',
    data
  })
}

// 获取用户个人信息
export function reqGetUserInfo() {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}

// 获取员工基本信息 (包含头像)
export function reqGetUserDetailById(id) {
  return request({
    method: 'get',
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
