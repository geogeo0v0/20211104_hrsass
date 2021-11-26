import { logout, reqGetUserDetailById, reqGetUserInfo, reqLogin } from "@/api/user"
import { getToken, setToken, removeToken } from "@/utils/auth"

const state = {
  token: getToken() || null,
  userInfo: {}
}

const mutations = {
  setToken(state, newToken) {
    state.token = newToken
    setToken(newToken) // 同时 也要同步到本地cookies中
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },

  setUserInfo(state, newUserInfo) {
    state.userInfo = newUserInfo

  },
  removeUserInfo(state) {
    state.userInfo = {}
  }

}

const actions = {
  // 登陆并存储token
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      // 发送登录请求
      reqLogin(data).then(res => {
        const newToken = res.data
        commit('setToken', newToken)
        // 成功resolve
        resolve(res)
      }).catch(error => {
        // 失败reject
        reject(error)
      })
    })
  },

  // 退出登陆
  logout({ commit }) {
    commit('removeToken')
    commit('removeUserInfo')

  },

  // 获取用户资料
  // async getUserInfo({ commit }) {
  //   const { data: data1 } = await reqGetUserInfo()
  //   const { data: data2 } = await reqGetUserDetailById(data1.userId)
  //   // 合并带头像信息的userInfo
  //   const baseData = { ...data1, ...data2 }
  //   commit('setUserInfo', baseData)
  //   return baseData
  // }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
