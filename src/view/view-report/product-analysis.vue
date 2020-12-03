<template>
  <div class="lin-container">
    <exact-search :handleSearch="handleSearch" ref="exactSearch" />

    <el-row v-loading="loading" class="chart-main">
      <el-card class="chart-box" v-if="showReplacePie">
        <el-echarts id="replaceReason" :option="replaceReason"/>
      </el-card>
      <el-card class="chart-box" v-if="showDifficultyPie">
        <el-echarts id="difficultyDegree" :option="difficultyDegree"/>
      </el-card>
      <el-card class="chart-box" v-if="showPainPie">
        <el-echarts id="painBar" :option="painBar"/>
      </el-card>
    </el-row>

  </div>
</template>

<script>
import Utils from 'lin/util/util'
import ElEcharts from '@/component/echarts/common'
import { color } from '@/component/echarts/common/option'
import ExactSearch from './components/exactSearch'
import Model from '@/model/report'
const labelOption = {
    show: false,
    position: 'insideBottom',
    distance: 10,
};
export default {
  components: {
   ElEcharts,
   ExactSearch
  },
  data() {
    return {
      loading: false,
      replaceReason: {
        color: color,
        title: {
          text: '换新原因',
          left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['壳体开裂', '注射按钮开裂', '钢珠脱落引起的故障', '刻度窗口脱落', '注射器断裂', '明显加压旋转不畅']
        },
        series: [
            {
                name: '换新原因',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      },
      difficultyDegree: {
        color: color,
        title: {
          text: '难易程度',
          left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['容易', '比较复杂', '非常复杂']
        },
        series: [
            {
                name: '换新原因',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      },
      painBar:{
        color: color,
        title: { text: '疼痛' },
        tooltip: {},
        legend: {
          data: ['有针', '无针']
        },
        xAxis: {
          type: 'category',
          axisTick: {show: false},
          data: ["0分","3分","6分","10分"]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '有针',
            type: 'bar',
            barGap: 0,
            barCategoryGap: 0,
            label: labelOption,
            data: [3, 80, 90, 30]
          },
          {
            name: '无针',
            type: 'bar',
            barGap: 0,
            barCategoryGap: 20,
            label: labelOption,
            data: [100, 70, 20, 4]
          },
        ]
      },
      showReplacePie: false,
      showDifficultyPie: false,
      showPainPie: false
    }
  },
  watch: {},
  async created() {
    await this.queryList()
  },
  methods: {
   // 获取图表数据
    async queryList() {
      this.loading = true
      try {
        const params = Utils.removeEmptyAttr(this.queryObj)
        const { code, data, total } = await Model.getReportForProducts(params)
        if(code === 11) {
          await this.renderReplacePie(data.change_reason)
          await this.renderDifficultyPie(data.difficult_level)
          await this.renderPainPie(data.pain_level)
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
   // 搜索
    handleSearch(query = {}) {
      this.queryObj = Utils.deepClone(query)
      delete this.queryObj.dateRange
      this.queryList()
    },
    renderReplacePie(data) {
      const  reasonData = [
          {value: data.reason_num_ktkl, name: '壳体开裂'},
          {value: data.reason_num_ankl, name: '注射按钮开裂'},
          {value: data.reason_num_gztl, name: '钢珠脱落引起的故障'},
          {value: data.reason_num_kdcktl, name: '刻度窗口脱落'},
          {value: data.reason_num_zsqdl, name: '注射器断裂'},
          {value: data.reason_num_xzbc, name: '明显加压旋转不畅'},
      ]
      this.replaceReason.series[0].data = reasonData
      this.showReplacePie = true
    },
    renderDifficultyPie(data) {
      const difData = [
        {value: data.diff_num_easy, name: '容易'},
        {value: data.diff_num_complex, name: '比较复杂'},
        {value: data.diff_num_very_complex, name: '非常复杂'},
      ]
      this.difficultyDegree.series[0].data = difData
      this.showDifficultyPie = true
    },
    renderPainPie(data) {
      const free = [
        data[0].free_zero,
        data[0].free_one,
        data[0].free_two,
        data[0].free_three,
      ]
      const needle = [
        data[1].needle_zero,
        data[1].needle_one,
        data[1].needle_two,
        data[1].needle_zero,
      ]
      this.painBar.series[0].data = needle
      this.painBar.series[1].data = free
      this.showPainPie = true
    }
  },
}
</script>

<style lang="scss" scoped>
.lin-container {
  padding: 0 30px;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /deep/.el-card__body {
    width: 100%;
    height: 100%;
  }
  .chart-box {
    display: inline-block;
    width: calc(50% - 25px);
    height: 500px;
    margin: 10px;
  }
}
</style>
