<template>
  <div>
   
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import BigBrother from './son-component'
export default {
  name: '',
  props: {
    ...BigBrother.props
    // modelSon: {
    //   type: String,
    //   default: ''
    // }
  },
  inject: {
    toSon: {
      default: ''
    }
  },
  data() {
    return {
      
    }
  },
  inheritAttrs: false,
  async created() {
    console.log(BigBrother.props)
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
