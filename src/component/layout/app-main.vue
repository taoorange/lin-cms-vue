<template>
  <section class="container">
    <div class="wrapper" id="wrapper">
      <transition name="fade-transform" mode="out-in">
         <!-- :include="keepAliveInclude" -->
        <!-- <keep-alive> -->
          <router-view v-if="isRouterAlive"></router-view>
        <!-- </keep-alive> -->
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  watch: {
    $route() {
      if (this.$previewInstance) {
        this.$previewInstance.destroy()
      }
    },
  },
  // provide() {
  //   return {
  //     reload: this.reload,
  //   }
  // },
  data() {
    return {
      isRouterAlive: true,
    }
  },
  methods: {
    // 用于手动刷新页面
    // reload() {
    //   this.isRouterAlive = false
    //   this.$nextTick(function() {
    //     this.isRouterAlive = true
    //   })
    // },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .wrapper {
    width: 100%;
    height: 100%;
    text-align: left;
  }
}
</style>
