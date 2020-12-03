<template>
  <basic-search
    class="chart-search"
    :label-width="90"
    :query="query"
    :show-more="false"
    :showHd="false"
    :closed="closed"
    :mode="1"
    :toggle-more="toggleMore"
    :handle-search="handleSearch"
    :handle-reset="handleReset"
  >
    <el-row :gutter="24">
      <el-col :span="12">
          <el-form-item label="时间段">
            <el-date-picker
              v-model="query.dateRange"
              type="daterange"
              range-separator="至"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
    </el-row>
    <!-- <div class="more-row-wrap" v-show="!closed"></div> -->
  </basic-search>
</template>

<script>
import ExactSearch from 'lin/mixin/exact-search'
export default {
  mixins: [ExactSearch],
  watch: {
    'query.dateRange':function(val) {
      if(val && val.length === 2) {
        this.query.start_time = val[0]
        this.query.end_time = val[1]
      } else {
        this.query.start_time = undefined
        this.query.end_time = undefined
      }
    },
  },
  beforeCreate() {
    this.fields = [
      'dateRange', 
      'start_time',
      'end_time',
    ]
  },
}
</script>
<style lang="scss">
  .chart-search {
    padding: 10 !important;
    padding-bottom: 0 !important;
  }
</style>
