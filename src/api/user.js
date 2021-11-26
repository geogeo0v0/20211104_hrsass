import request from '@/utils/request'

export function reqLogin(data) {
  return request({
    method: 'post',
    url: '/sys/login',
    data
  })

}


/**
 * 获取用户的基本资料
 ***/
// export function reqGetUserInfo(token) {
//   return request({
//     method: 'post',
//     url: '/sys/profile'
//   })
// }

/** *
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 * **/
export function reqGetUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}