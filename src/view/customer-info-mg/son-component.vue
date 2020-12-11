<template>
  <div class="son-component">
    <slot :userInfo="userInfo" :hobby="hobby"></slot>
    <p>上面是插槽</p>
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import NumberInput from '@/component/base/number-input'
export default {
  name: '',
  props: {
    // ...this.$attrs
  },
  components: {
    NumberInput
  },
  data() {
    return {
      userInfo: {
        name: '张飞',
        age: 230
      },
      hobby: {
        first: 'sing',
        second: 'paint'
      }
    }
  },
  beforeCreate() {
 
  },
  async created() {
    
  },
  methods: {
   
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  position: relative;
}
</style>
