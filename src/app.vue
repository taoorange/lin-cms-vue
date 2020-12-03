<template>
  <div id="app">
    <router-view />
    <socket-sub />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Vue from 'vue'

// 来电弹窗，会一直保持与后端的ws连接
import SocketSub from '@/component/web-socket'
export default {
  data() {
    return {
      timer: null,
      eventBus: new Vue(),
    }
  },
  components: { SocketSub },
  mounted() {
    document.getElementById('loader').style.display = 'none'
  },
  provide() {
    // eventBus挂载的事件： addGroup addUser
    return {
      eventBus: this.eventBus,
    }
  },
  methods: {
    ...mapActions(['loginOut']),
  },
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition-delay: 99999s;
    transition: color 99999s ease-out, background-color 99999s ease-out;
  }
}
</style>
