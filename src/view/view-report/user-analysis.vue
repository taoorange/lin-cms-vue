<template>
  <div class="lin-container">
    <exact-search :handleSearch="handleSearch" ref="exactSearch" />
    <el-row class="chart-main" v-loading="loading">
      <el-card class="chart-box" v-if="showSexPie">
        <el-echarts id="sexPie" :option="sexPie"/>
      </el-card>
      <el-card class="chart-box" v-if="showDiabetesPie">
        <el-echarts id="diabetesPie" :option="diabetesPie"/>
      </el-card>
      <el-card class="chart-box" v-if="showAgeBar">
        <el-echarts id="ageBar" :option="ageBar"/>
      </el-card>
      <el-card class="chart-box" v-if="showHardenPie">
        <el-echarts id="harderPie" :option="harderPie"/>
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
const hasData = obj => {
  if(Array.isArray(obj)) {
    if(obj.length) {
      return true
    }
  }else {
    if(Object.keys(obj).length) {
        return true
      }
    }
    return false
}

export default {
  components: {
   ElEcharts,
   ExactSearch
  },
  data() {
    return {
      loading: false,
      queryObj: {},
      showSexPie: false,
      showDiabetesPie: false,
      showAgeBar: false,
      showHardenPie: false,
      sexPie: {
        color: color,
        title: {
          text: '性别',
          left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['男', '女']
        },
        series: [
            {
                name: '男女比例',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                    {value: 335, name: '男'},
                    {value: 220, name: '女'},
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    normal: {
                      show:true,
                      position:'inner',
                      textStyle: {
                          fontWeight: 200,
                          fontSize: 14   //文字的字体大小
                      },
                      formatter: '{d}%',/*饼状图内显示百分比*/
                    },
                    emphasis: {
                        show: false,/*空心文字出现*/
                    }
                },
            }
        ]
      },
      diabetesPie: {
        color: color,
        title: {
          text: '糖尿病类型',
          left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['I型糖尿病', 'Ⅱ型糖尿病', '妊娠型糖尿病', '其他需胰岛素']
        },
        series: [
            {
                name: '访问来源',
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
      ageBar:{
        color: color,
        title: { text: '年龄' },
        tooltip: {},
        legend: {
          data: ['男', '女']
        },
        xAxis: {
          type: 'category',
          axisTick: {show: false},
          data: ["20以下","21-40","41-50","51-60","61-70","80以上"]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '男',
            type: 'bar',
            barGap: 0,
            stack: '总量',
            barCategoryGap: 0,
            label: labelOption,
            data: [5, 20, 36, 10, 10, 20]
          },
          {
            name: '女',
            type: 'bar',
            barGap: 0,
            stack: '总量',
            barCategoryGap: 20,
            label: labelOption,
            data: [45, 20, 16, 70, 20, 9]
          },
        ]
      },
      hardenBar: {
        title: { text: '硬结' },
        tooltip: {},
        legend: {
          data: ['有针', '无针']
        },
        xAxis: {
          type: 'category',
          axisTick: {show: false},
          data: ["没有硬结","脐周脂肪轻微增厚","质地硬，明显增厚"]
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
            data: [5, 20, 36]
          },
          {
            name: '无针',
            type: 'bar',
            barGap: 0,
            barCategoryGap: 20,
            label: labelOption,
            data: [45, 20, 16]
          },
        ]
      },
      harderPie: {
        color: color,
        title: {
          text: '硬结',
          left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['有针', '无针']
        },
        series: [
            {
                name: '硬结',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    normal: {
                      show:true,
                      position:'inner',
                      textStyle: {
                          fontWeight: 200,
                          fontSize: 14   //文字的字体大小
                      },
                      formatter: '{d}%',/*饼状图内显示百分比*/
                    },
                    emphasis: {
                        show: false,/*空心文字出现*/
                    }
                },
            }
        ]
      },
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
        const { code, data, total } = await Model.getReportForUsers(params)
        if(code === 11) {
          await this.renderSexPie(data.sex_age)
          await this.renderDiabetesPie(data.diabetes_type)
          await this.renderAgeBar(data.sex_age)
          await this.renderHardenPie(data.has_harden)
        }
      } catch (error) {
         console.log(error)
      }
      this.loading = false
    },
    renderSexPie(data) {
      const sexData = [
        {value: data.male.total, name: '男'},
        {value: data.female.total, name: '女'},
      ]
      this.sexPie.series[0].data = sexData
      this.showSexPie = true
    },
    renderDiabetesPie(data) {
      try {
        if(hasData(data)) {
          const debets = [
              {value: data.dia_num_one, name: 'I型糖尿病'},
              {value: data.dia_num_two, name: 'Ⅱ型糖尿病'},
              {value: data.dia_num_rs, name: '妊娠型糖尿病'},
              {value: data.dia_num_other, name: '其他需胰岛素'},
          ]
          this.diabetesPie.series[0].data = debets
          this.showDiabetesPie = true
        }
      } catch(error) {
        console.log(error)
      }
    },
    renderAgeBar(data) {
       try {
        if(hasData(data)) {
          const {female, male} = data
          const femaleData = [female.age20W, female.above20W, female.above40W, female.above50W, female.above60W, female.above70W]
          const maleData = [male.age20M, male.above20M, male.above40M, male.above50M, male.above60M, male.above70M]
          this.ageBar.series[0].data = maleData
          this.ageBar.series[1].data = femaleData
          this.showAgeBar = true
        }
      } catch(error) {
        console.log(error)
      }
    },
    renderHardenPie(data) {
      const {has_num_free, has_num_needle} = data
      let sumFree = 0, sumNeedle = 0
      Object.keys(has_num_free).forEach(key => { sumFree += has_num_free[key] })
      Object.keys(has_num_needle).forEach(key => { sumNeedle += has_num_needle[key]})
      const harderData = [
          {value: sumNeedle, name: '有针'},
          {value: sumFree, name: '无针'},
      ]
      this.harderPie.series[0].data = harderData
      this.showHardenPie = true
    },
   // 搜索
    handleSearch(query = {}) {
      this.queryObj = Utils.deepClone(query)
      delete this.queryObj.dateRange
      this.queryList()
    },
  },
}
</script>

<style lang="scss" scoped>
.lin-container {
  padding: 0 30px;
  position: relative;
  width: 100%;
  height: 100%;
  /deep/.el-card__body {
    width: 100%;
    height: 100%;
  }
  .search-wrapper {
    margin: 20px 10px 0 10px;
  }
  .chart-box {
    display: inline-block;
    width: 40%;
    height: 400px;
    margin: 10px;
  }
}
</style>
