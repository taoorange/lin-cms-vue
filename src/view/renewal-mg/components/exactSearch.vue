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
        <el-form-item label="手机号">
          <el-input v-model="query.phone"  placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="旧产品编码">
          <el-input v-model="query.p_code_old" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="新产品编码">
          <el-input v-model="query.p_code_new" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <div class="more-row-wrap" v-show="!closed">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="换新状态">
            <el-select v-model="query.status" clearable placeholder="请选择">
              <el-option v-for="item in renewalType" :key="item.code" :label="item.value" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品问题">
            <el-select v-model="query.defect_type" clearable placeholder="请选择">
              <el-option v-for="item in productsIssues" :key="item.code" :label="item.value" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="购买渠道">
            <el-select v-model="query.buy_channel" clearable placeholder="请选择">
              <el-option v-for="item in purChannels" :key="item.code" :label="item.value" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间段">
            <el-date-picker
              v-model="query.process_time"
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
    </div>
  </basic-search>
</template>

<script>
import ExactSearch from 'lin/mixin/exact-search'
import { channelData, problemData, customerSourceData } from 'lin/format/replace-sheet'
export default {
  mixins: [ExactSearch],
  components: {},
  props: {},
  data() {
    return {
      customerSource: customerSourceData(),
      renewalType: [
        { value: '全部', code: '' }, 
        { value: '处理中', code: '0' }, 
        { value: '已完成', code: '1' }
      ],
      productsIssues: problemData(true),
      purChannels: channelData(true)
    }
  },
  watch: {
    'query.process_time':function(val) {
      if(val && val.length === 2) {
        this.query.process_time_start = val[0]
        this.query.process_time_end = val[1]
      } else {
        this.query.process_time_start = undefined
        this.query.process_time_end = undefined
      }
    },
  },
  beforeCreate() {
    this.fields = [
      'phone', 
      'p_code_old',
      'p_code_new',
      'status',
      'defect_type',
      'buy_channel',
      'process_time',
      'process_time_start',
      'process_time_end'
    ]
  },
  mounted() {},
  methods: {},
}
</script>
