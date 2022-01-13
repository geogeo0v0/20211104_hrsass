import { reqGetUserDetailById, reqGetUserInfo, reqLogin } from "@/api/user"
import { getToken, setToken, removeToken } from "@/utils/auth"
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'

const state = {
  token: getToken() || null,
  userInfo: {},
  routes: []
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
  },
  setRoutes(state, otherRoutes) {
    state.routes = [
      ...constantRoutes,
      ...otherRoutes,
      { path: '*', redirect: '/404', hidden: true }
    ]
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
    resetRouter()
    commit('setRoutes', [])
    // 5. 清除主题色信息
    commit('settings/resetTheme', null, { root: true })
  },

  // 获取用户资料
  async getUserInfo({ commit }) {
    const { data: data1 } = await reqGetUserInfo()
    const { data: data2 } = await reqGetUserDetailById(data1.userId)
    // 合并带头像信息的userInfo
    const baseData = { ...data1, ...data2 }
    commit('setUserInfo', baseData)
    return baseData
  },
  filterRoutes({ commit }, menus) {
    const otherRoutes = asyncRoutes.filter(item => {
      // 如果路由模块的首页name, 在menus数组中包含, 就是这个模块开放
      if (menus.includes(item.children[0].name)) {
        return true
      } else {
        return false
      }
    })
    commit('setRoutes', otherRoutes)
    return otherRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
