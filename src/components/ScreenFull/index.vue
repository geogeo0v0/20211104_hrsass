<template>
  <div>
    <!-- svg-icon组件, 配置icon-class属性, 配置成svg的文件名即可 -->
    <svg-icon
      v-if="!isFullScreen"
      icon-class="fullscreen"
      class="fullscreen"
      @click="toggleFullScreen"
    />
    <svg-icon
      v-else
      icon-class="exit-fullscreen"
      class="fullscreen"
      @click="toggleFullScreen"
    />
  </div>
</template>

<script>
// import ScreenFull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullScreen: false
    }
  },
  methods: {
    toggleFullScreen() {
      // // 支持全屏
      // if (ScreenFull.isEnabled) {
      //   this.isFullScreen = !this.isFullScreen
      //   // 不传元素 默认传递了document.documentElement=>html
      //   ScreenFull.toggle()
      // } else {
      //   this.$message.error('大哥 你的浏览器不支持全屏')
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  fill: #666;
  cursor: pointer;
}
</style>
