<template>
  <div>
    <exact-search :handleSearch="handleSearch" ref="exactSearch" />

    <!-- 列表页面 -->
    <div class="container">
      <div class="table-button-wrap">
        <!-- <el-button type="primary" @click="showDialog"></el-button> -->
      </div>
      <!-- 表格 -->
      <lin-table
        title="指派问题"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :useActionRender="true"
        :action-render="actionRender"
        :showSelectCol="true"
        :searchList="searchList"
        :index="true"
        :actionWidth="150"
        :pagination="pagination"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        v-loading="loading"
      ></lin-table>
    </div>

    <!-- 添加和详情页 -->
    <template v-if="dialogVisible">
      <add-renewal
        :title="dialogTitle"
        :showClose="true"
        :dialogVisible="dialogVisible"
        :editDsiabled="editDsiabled"
        :isView="isView"
        :agent="agent"
        @closeDialog="closeDialog"
        @updateList="queryList"
        ref="addDg"
      />
    </template>
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import { dateFormat } from 'lin/util/util'
import { ws_type1, ws_type2 } from 'lin/format/workSheet'
import LinTable from '@/component/base/table/lin-table'
import ExactSearch from './components/exactSearch'
import AddRenewal from './components/add'
import Model from '@/model/agent-task'

export default {
  components: {
    LinTable,
    ExactSearch,
    AddRenewal,
  },
  data() {
    return {
      loading: false,
      queryObj: null,
      tableColumn: [
        {
          prop: 'ws_code',
          label: '工单编号',
          width: 150,
          render: (h, { index, row, col }) => {
            return (
              <div class="table-link-btn" onClick={() => this.jumpOrderDetail(index, row, col)}>
                {row.ws_code}
              </div>
            )
          },
        },
        {
          prop: 'ws_type1',
          label: '问题分类(一级)',
          width: 120,
          render: (h, { index, row, col }) => {
            return <span>{ws_type1(row.ws_type1)}</span>
          },
        },
        {
          prop: 'ws_type2',
          label: '问题分类(二级)',
          minWidth: 130,
          render: (h, { index, row, col }) => {
            return <span>{ws_type2(row.ws_type1, row.ws_type2)}</span>
          },
        },
        { prop: 'client_name', label: '客户姓名' },
        {
          prop: 'dispatch_time',
          label: '指派时间',
          width: 140,
          render: (h, { index, row, col }) => {
            return <span>{dateFormat(row.dispatch_time)}</span>
          },
        },
        { prop: 'seviced_by', label: '服务人员' },
        {
          prop: 'status',
          label: '解决结果',
          render: (h, { index, row, col }) => {
            if (row.status === 0) {
              return <span></span>
            } else if (row.status === 1) {
              return <span>已解决</span>
            } else if (row.status === 2) {
              return <span>未解决</span>
            }
          },
        },
        
      ],
      tableData: [],
      showEdit: false,
      editBookID: 1,
      pagination: {
        page: 1,
        page_size: 10,
        pageTotal: 100,
      },
      searchList: [{ name: '手机号', type: 'input' }],
      // 弹框
      dialogTitle: '基础信息',
      dialogVisible: false,
      editDsiabled: false,
      isView: false,
      agent: {},
    }
  },
  watch: {},
  async created() {
    await this.queryList()
  },
  methods: {
    actionRender(h, { index, row, col }) {
      return (
        <div class="action-wrap">
          {row.status === 0 ? (
            <el-button size="mini" plain type="primary" onClick={() => this.handleEnter(index, row, col)}>
              录入
            </el-button>
          ) : (
            ''
          )}
          <el-button size="mini" plain type="primary" onClick={() => this.showDetail(index, row, col)}>
            详情
          </el-button>
        </div>
      )
    },
    async queryList() {
      this.loading = true
      try {
        const queryFields = Utils.removeEmptyAttr(this.queryObj)
        const params = Utils.assignObj(this.pagination, queryFields)
        const { code, data, total } = await Model.queryList(params)
        this.tableData = data || []
        this.pagination.pageTotal = total
      } catch (error) {
        this.tableData = []
      }
      this.loading = false
    },
    async handleSearch(query = {}) {
      this.pagination.page = 1
      this.queryObj = Utils.deepClone(query)
      delete this.queryObj.dispatch_time
      await this.queryList()
    },
    jumpOrderDetail(index, row, col) {
      this.$router.push({
        path: '/agent-mg/worker-order/view',
        query: {
          ws_id: row.ws_id,
          p_code: row.p_code,
        },
      })
    },
    // 录入信息
    handleEnter(index, row, col) {
      this.dialogVisible = true
      // 录入时候去查询产品使用人信息，不需要问题详情
      this.$nextTick(() => {
        this.agent = row
      })
    },
    // 查看详情
    async showDetail(index, row, col) {
      this.dialogVisible = true
      this.editDsiabled = true
      this.isView = true
      try {
        const { agent_id, ws_code, task_id } = row
        const { code, data } = await Model.getDetail({agent_id, ws_code, task_id})
        if (code === 11) {
          this.$nextTick(() => {
            this.$refs.addDg.dialogForm = data
          })
        }
      } catch (error) {
        console.error(error)
      }
    },
    closeDialog() {
      this.dialogVisible = false
      this.isView = false
      this.editDsiabled = false
      this.$refs.addDg.dialogForm.resetForm
      this.agent = {}
    },
    currentChange(val) {
      this.pagination.page = val
      this.queryList()
    },
    sizeChange(val) {
      this.pagination.page_size = val
      this.pagination.page = 1
      this.queryList()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  position: relative;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
