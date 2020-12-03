<template>
  <div class="container">
   <div class="echarts-content" :id="id"></div>
  </div>
</template>

<script>
import Utils from 'lin/util/util'
let echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入饼状图组件
require('echarts/lib/chart/pie')
// 引入提示框
require('echarts/lib/component/tooltip')
// title组件
require('echarts/lib/component/title')
// legend
require("echarts/lib/component/legend");
export default {
  name: 'EchartsPie',
  props: {
    id: {
      type: String,
      default: 'myChart'
    },
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  async mounted() {
    await this.drawLine();
  },
  methods: {
   async drawLine() {
    // 基于准备好的dom，初始化echarts实例
    let myChart =await echarts.init(document.getElementById(this.id))
    // 绘制图表
    myChart.setOption(this.option)
   }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  position: relative;
  width: 100%;
  height: 100%;
  .echarts-content {
    width: 100%;
    height: 100%;
  }
}
</style>
