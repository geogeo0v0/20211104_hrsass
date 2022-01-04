import defaultSettings from '@/settings'
import { getThemeCookie, setThemeCookie, removeThemeCookie } from '@/utils/themeCookie'
const { showSettings, fixedHeader, sidebarLogo } = defaultSettings
const themeDefaultColor = '#5485fd'
const themeKey = 'hm-hrsaas-exm-theme'
const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  theme: getThemeCookie() || themeDefaultColor
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
    if (key === 'theme') {
      setThemeCookie(value)
    }
  },
  resetTheme: (state) => {
    // 重置成默认颜色
    state.theme = themeDefaultColor
    // cookies中也要移出
    removeThemeCookie(themeKey)
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

