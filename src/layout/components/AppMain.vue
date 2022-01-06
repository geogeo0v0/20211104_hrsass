<template>
  <section class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      // 两个路由的$route.path一样, 所以和没设置 key 属性一样, 会复用组件
      // /page?id=2, $route.fullPath不一样不会复用
      return this.$route.path
    },
    // 有个bug,关掉标签页重新进也不会发请求,所以添加缓存控制
    cachedViews() {
      return this.$store.state.tagsView.cachedViews.map(i => i[0].toUpperCase() + i.slice(1))
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
