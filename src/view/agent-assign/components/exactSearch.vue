<template>
  <basic-search
    :label-width="82"
    :query="query"
    :show-more="true"
    :closed="closed"
    :mode="2"
    :toggle-more="toggleMore"
    :handle-search="handleSearch"
    :handle-reset="handleReset"
  >
    <el-row :gutter="24">
      <el-col :span="6">
        <el-form-item label="工单编号">
          <el-input v-model="query.ws_code" maxlength="50" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="客户姓名">
          <el-input v-model="query.name"  maxlength="20" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="服务人员">
          <el-input v-model="query.seviced_by" maxlength="20" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="解决结果">
          <el-select v-model="query.status" style="width: 100%" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="已解决" :value="1"></el-option>
            <el-option label="未解决" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <div class="more-row-wrap" v-show="!closed">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="指派时间">
            <el-date-picker
              v-model="query.dispatch_time"
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
        <el-col :span="12">
          <el-form-item label="问题分类">
            <el-select v-model="query.ws_type1"
              @change="changeWS_Type"
              clearable placeholder="请选择一级分类" 
              style="width: 45%;margin-right: 10px;">
              <el-option label="售前" :value="0"></el-option>
              <el-option label="售后" :value="1"></el-option>
            </el-select>
            <el-select v-model="query.ws_type2" clearable filterable style="width: 45%;" placeholder="请选择二级分类">
              <template v-if="query.ws_type1 === 0">
                <el-option
                  v-for="item in issuesListPre"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code"
                ></el-option>
              </template>
              <template v-if="query.ws_type1 === 1">
                <el-option
                  v-for="item in issuesListAfter"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </basic-search>
</template>

<script>
import ExactSearch from '@/lin/mixin/exact-search'
import { wsTypeData } from 'lin/format/workSheet'
export default {
  mixins: [ ExactSearch ],
  components: {},
  props: {},
  data() {
    return {
      issuesListPre: wsTypeData(0),
      issuesListAfter: wsTypeData(1),
    }
  },
  watch: {
    'query.dispatch_time':function(val) {
      if(val && val.length === 2) {
        this.query.dispatch_time_start = val[0]
        this.query.dispatch_time_end = val[1]
      } else {
        this.query.dispatch_time_start = undefined
        this.query.dispatch_time_end = undefined
      }
    }
  },
  beforeCreate() {
    this.fields = [
      'ws_code', 
      'name', 
      'seviced_by' , 
      'status',
      'dispatch_time',
      'dispatch_time_start',
      'dispatch_time_end',
      'ws_type1',
      'ws_type2',
      ]
  },
  created() {
    this.issuesListPre.unshift(
      { value: '全部', code: undefined },
    )
    this.issuesListAfter.unshift(
      { value: '全部', code: undefined },
    )
  },
  mounted() {},
  methods: {
    changeWS_Type(val) {
      this.query.ws_type2 = ''
    }
  },
}
</script>
