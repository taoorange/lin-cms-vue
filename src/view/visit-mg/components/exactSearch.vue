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
        <el-form-item label="用户来源">
          <el-select v-model="query.relation" clearable placeholder="请选择">
            <el-option
              v-for="item in customerSource"
              :key="item.code"
              :label="item.value"
              :value="item.code" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="使用者手机">
          <el-input v-model="query.phone" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="使用者姓名">
          <el-input v-model="query.user_name" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <div class="more-row-wrap" v-show="!closed">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="产品编号">
            <el-input v-model="query.p_code" maxlength="20" placeholder="请输入" clearable> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="注册时间段" label-width="100px">
            <el-date-picker
              v-model="query.register_time"
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
export default {
  mixins: [ExactSearch],
  components: {},
  props: {},
  data() {
    return {
      customerSource: customerSourceData()
    }
  },
  watch: {
    'query.register_time':function(val) {
      if(val && val.length === 2) {
        this.query.register_time_start = val[0]
        this.query.register_time_end = val[1]
      } else {
        this.query.register_time_start = undefined
        this.query.register_time_end = undefined
      }
    },
  },
  beforeCreate() {
    this.fields = [
      'relation',
      'phone',
      'user_name',
      'p_code',
      'register_time',
      'register_time_start',
      'register_time_end'
    ]
  },
  mounted() {},
  methods: {},
}
</script>
