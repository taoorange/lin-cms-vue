<template>
  <div class="province_box">
    <el-select
      value-key="code"
      clearable
      v-model="map.province"
      :placeholder="placeProvince"
      @change="onProvinceChange($event)"
    >
      <el-option v-for="item of provinces" :key="item.code" :value="item.value" :label="item.value" />
    </el-select>
    <el-select
      value-key="code"
      v-if="showCity"
      clearable
      :placeholder="placeCity"
      v-model="map.city"
      @change="onCityChange($event)"
    >
      <el-option v-for="item of cities" :key="item.code" :value="item.value" :label="item.value" />
    </el-select>
    <el-select
      value-key="code"
      v-if="showCounty"
      clearable
      :placeholder="placeCounty"
      v-model="map.county"
      @change="onCountyChange($event)"
    >
      <el-option v-for="item of counties" :key="item.code" :value="item.value" :label="item.value" />
    </el-select>
    <!-- <el-select value-key="code" v-model="map.town" @change="onTownChange($event)">
      <el-option v-for="item of towns" :key="item.code" :value="item" :label="item.value" />
    </el-select> -->
  </div>
</template>

<script>
// 省市县（区）三级联动地图
import provinceMap from './province'
export default {
  name: 'ProvinceSelect',
  props: {
    showCity: {
      type: Boolean,
      default: true,
    },
    showCounty: {
      type: Boolean,
      default: true,
    },
    placeProvince: {
      type: String,
      default: '请选择',
    },
    placeCity: {
      type: String,
      default: '请选择',
    },
    placeCounty: {
      type: String,
      default: '请选择',
    },
  },
  data() {
    return {
      map: {
        province: '',
        city: '',
        county: '',
      },
      provinces: [{ code: '1', value: '北京市' }, { code: '2', value: '天津市' }],
      cities: [],
      counties: [],
      towns: [],
    }
  },
  created() {
    this.handlePrivince()
    this.queryProvinces()
  },
  methods: {
    updateMap(val) {
      this.map = val
    },
    handlePrivince() {},
    // 一级：获取省份
    queryProvinces() {
      this.provinces = provinceMap.map(item => {
        return {
          code: item.code,
          value: item.name,
        }
      })
    },
    // 二级：获取城市
    queryCities(name) {
      const province = provinceMap.filter(item => {
        return item.name === name
      })
      if (province.length && province[0].cityList.length) {
        this.cities = province[0].cityList.map(item => {
          return {
            code: item.code,
            value: item.name,
            areaList: item.areaList || [],
          }
        })
      }
    },
    // 三级：获取区县
    queryCounties(name) {
      const city = this.cities.filter(item => {
        return item.value === name
      })
      if (city.length) {
        if (city[0].areaList.length) {
          this.counties = city[0].areaList.map(item => {
            return {
              code: item.code,
              value: item.name,
            }
          })
        } else {
          /* 特殊数据处理，香港、澳门只有2级地址，台湾有3级地址
           ** 当县级地址数据查询为空，确定省份为香港或澳门
           ** 将市级数据复制给县级和镇级
           */
          this.map.county = this.map.city
        }
      }
    },
    // 选择省
    onProvinceChange(province) {
      this.map.province = province
      this.map.city = null
      this.map.county = null
      this.cities = []
      this.counties = []
      this.queryCities(province)
      this.$emit('onProvince', this.map)
    },
    // 选择城市
    onCityChange(city) {
      this.map.city = city
      this.map.county = null
      this.counties = []
      this.queryCounties(city)
      this.$emit('onCity', this.map)
    },
    // 选择区县
    onCountyChange(county) {
      this.map.county = county
      this.$emit('onCounty', this.map)
    },
  },
}
</script>

<style lang="scss" scoped>
.province_box {
  display: inline-block;
  /deep/.el-select {
    margin-right: 10px;
  }
}
</style>
