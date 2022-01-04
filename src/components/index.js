import PageTools from './PageTools'
import UploadExcel from './UploadExcel.vue'
import ScreenFull from './ScreenFull'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ScreenFull', ScreenFull)
  }
}
