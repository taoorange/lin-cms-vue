<template>
  <basic-search
    :label-width="90"
    :query="query"
    :show-more="true"
    :closed="closed"
    :mode="1"
    :toggle-more="toggleMore"
    :handle-search="handleSearch"
    :handle-reset="handleReset"
  >
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="input输入">
          <el-input v-model="query.name" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="input输入">
          <el-input v-model="query.phone" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <div class="more-row-wrap" v-show="!closed">
      <el-row :gutter="24">
        <el-col :span="16">
          <el-form-item label="时间" label-width="100px">
            <el-date-picker
              v-model="query.dateRange"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </basic-search>
</template>

<script>
import ExactSearch from '@/lin/mixin/exact-search'
import { customerSourceData } from 'lin/format/replace-sheet'
import { customerTypeData } from 'lin/format/customer'
export default {
  mixins: [ExactSearch],
  components: {},
  props: {},
  data() {
    return {
      customerSource: customerSourceData(),
      selectList:[],
      dateRange: []
    }
  },
  watch: {
    'query.dateRange':function(val) {
      if(val && val.length === 2) {
        this.query.start_time = val[0]
        this.query.end_time = val[1]
      } else {
        this.query.start_time = undefined
        this.query.end_time = undefined
      }
    }
  },
  beforeCreate() {
    this.fields = ['phone', 'source', 'name', 'client_type', 'dateRange']
  },
}
</script>
