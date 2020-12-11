<template>
  <div class="father-component">
    <son-component v-bind="$attrs" >
      往插槽填写内容
      <template v-slot="scope">
        <pre>
          {{scope}}
        </pre>
        <p>姓名：{{scope.userInfo.name}}</p>
      </template>
    </son-component>
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import SonComponent from './son-component'
import SonComponent2 from './son-component2'
export default {
  name: '',
  components: {
    SonComponent,
    SonComponent2
  },
  data() {
    return {
     a: 123
    }
  },
  watch: {
    modelSon(val) {
      console.log(val)
    }
  },
  async created() {},
  mounted() {
   console.log(this.$propsData)
  },
  methods: {
    selectListen(val) {
      console.log(val)
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  position: relative;

}
</style>
