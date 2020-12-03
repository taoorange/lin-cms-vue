<template>
  <basic-search
    :label-width="90"
    :query="query"
    :show-more="true"
    :closed="closed"
    :mode="1"
    :showMore="false"
    :toggle-more="toggleMore"
    :handle-search="handleSearch"
    :handle-reset="handleReset"
  >
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="产品编码">
          <el-input v-model="query.p_code" maxlength="30" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
      <template v-if="role === 1 || role === 2">
        <el-col :span="8">
          <el-form-item label="产品问题">
            <el-select v-model="query.defect_type" placeholder="请选择">
              <el-option v-for="item in productsIssues" :key="item.code" :label="item.value" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经销商">
            <el-select v-model="query.agent_id" placeholder="请选择">
              <el-option v-for="item in agentList" :key="item.agent_id" :label="item.agent_name" :value="item.agent_id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </basic-search>
</template>

<script>
import ExactSearch from '@/lin/mixin/exact-search'
import { mapGetters } from 'vuex'
import { problemData } from 'lin/format/replace-sheet'
import agentsModel from '@/model/agents'
export default {
  mixins: [ExactSearch],
  components: {},
  props: {
    agentLogin: {
      type: Boolean,
      default: true,
    },
    role: {
      type: Number,
      default: '',
    }
  },
  data() {
    return {
      agentList: [],
      productsIssues: problemData(true),
    }
  },
  beforeCreate() {
    this.fields = ['p_code', 'defect_type', 'agent_id']
  },
  async created() {
    await this.getAgents()
  },
  mounted() {},
  methods: {
    async getAgents() {
      try {
        const {code, data, total} = await agentsModel.queryList()
        if(code === 11) {
          this.agentList = data
          this.agentList.unshift({agent_name: '全部', agent_id: ''})
        }
      } catch (error) {
        console.log(error)
        this.agentList = []
      }
    }
  },
}
</script>
