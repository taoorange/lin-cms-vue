<template>
  <basic-search
    :label-width="80"
    :query="query"
    :show-more="true"
    :closed="closed"
    :mode="2"
    :toggle-more="toggleMore"
    :handle-search="handleSearch"
    :handle-reset="handleReset"
  >
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="手机号">
          <el-input v-model="query.phone" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="产品编码">
          <el-input v-model="query.p_code" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="工单编号" label-width="100px">
          <el-input v-model="query.ws_code" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <div class="more-row-wrap" v-show="!closed">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="工单状态">
            <el-select v-model="query.ws_status" placeholder="请选择" clearable>
              <el-option v-for="item in sheetStatus" :key="item.code" :label="item.value" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="问题分类">
            <el-select v-model="query.ws_type1" style="width: 45%;margin-right: 10px;" clearable placeholder="请选择一级分类">
              <el-option label="售前" :value="0"></el-option>
              <el-option label="售后" :value="1"></el-option>
            </el-select>
            <el-select v-model="query.ws_type2" style="width: 45%" clearable placeholder="请选择二级分类">
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
        <el-col :span="8">
          <el-form-item label="工单类型" label-width="100px">
            <el-select v-model="query.is_dispatch" clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="指派工单" :value="1"></el-option>
              <el-option label="客服工单" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="工单来源">
            <el-select v-model="query.source" clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="400" :value="0"></el-option>
              <el-option label="微信" :value="1"></el-option>
              <el-option label="公众号" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="处理人">
            <el-select v-model="query.processed_by" style="width: 100%;" clearable placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in serviceList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建人" label-width="100px">
            <el-select v-model="query.created_by" style="width: 100%;" clearable placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in serviceList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="10">
          <el-form-item label="创建时间">
            <el-date-picker
              clearable
              style="width: 100%;"
              v-model="query.create_time"
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
        <el-col :span="10">
          <el-form-item label="更新时间">
            <el-date-picker
              clearable
              style="width: 100%;"
              v-model="query.update_time"
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
import { wsTypeData, workStatusData } from 'lin/format/workSheet'
import { mapGetters } from 'vuex'
export default {
  mixins: [ExactSearch],
  components: {},
  props: {
    searchTrems: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      sheetStatus: workStatusData(true),
      customerType: [
        { value: '意向用户', code: '1' },
        { value: '注册用户', code: '2' },
        { value: '未注册用户', code: '3' },
      ],
      issuesListPre: wsTypeData(0),
      issuesListAfter: wsTypeData(1),
      query: {},
    }
  },
  computed: {
     ...mapGetters(['user', 'serviceList']),
  },
  watch: {
    'query.create_time':function(val) {
      if(val && val.length === 2) {
        this.query.create_time_start = val[0]
        this.query.create_time_end = val[1]
      } else {
        this.query.create_time_start = undefined
        this.query.create_time_end = undefined
      }
    },
    'query.update_time':function(val) {
      if(val && val.length === 2) {
        this.query.update_time_start = val[0]
        this.query.update_time_end = val[1]
      } else {
        this.query.update_time_start = undefined
        this.query.update_time_end = undefined
      }
    },

  },
  beforeCreate() {
    this.fields = [
      'phone',
      'p_code',
      'ws_id',
      'ws_code',
      'ws_status',
      'ws_type1',
      'ws_type2',
      'is_dispatch',
      'source',
      'processed_name',
      'created_name',
      'create_time',
      'create_time_start',
      'create_time_end',
      'update_time',
      'update_time_start',
      'update_time_end'
    ]
  },
  created() {
    // console.log(this.serviceList)
  },
  mounted() {
    // console.log(this.query)
  },
  methods: {},
}
</script>
