import PageTools from './PageTools'
import UploadExcel from './UploadExcel.vue'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}