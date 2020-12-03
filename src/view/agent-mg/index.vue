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
        title="经销商产品列表"
        :tableColumn="tableColumn"
        :tableData="tableData"
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

    <!-- 回访信息详情弹框 -->
    <visit-dg
      title="回访记录"
      :dialogVisible="dialogVisible"
      @closeDialog="closeDialog"
      :visitInfo="visitInfo"
      :editDsiabled="editDsiabled"
      ref="addDg"
      :isView="isView"
    />
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import Model from '@/model/agents'
import LinTable from '@/component/base/table/lin-table'
import ExactSearch from './components/exactSearch'
import VisitDg from '../visit-mg/components/visit'
import { mapGetters } from 'vuex'
export default {
  components: {
    LinTable,
    ExactSearch,
    VisitDg,
  },
  data() {
    return {
      loading: false,
      queryObj: {},
      tableColumn: [
        { prop: 'p_code', label: '产品编码' },
        {
          prop: 'ws_num',
          label: '工单数',
          render: (h, { index, row, col }) => {
            if(row.ws_num !== 0) {
              return (
                <div class="table-link-btn" onClick={() => this.jumpOrderMg(index, row, col)}>
                  {row.ws_num}
                </div>
              )
            } else {
              return (
                <span> {row.ws_num} </span>
              )
            }
          },
        },
        {
          prop: 'visit_num',
          label: '回访次数',
          render: (h, { index, row, col }) => {
            if(row.visit_num !== 0) {
              return (
                <div class="table-link-btn" onClick={() => this.jumpVisitDetail(index, row, col)}>
                  { row.visit_num }
                </div>
              )
            } else {
              return (
               <span>{ row.visit_num }</span>
              )
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
      dialogVisible: false,
      isView: false,
      editDsiabled: false,
      visitInfo: {}
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.editDsiabled = false
        console.log(val)
      }
    },
  },
  computed: {
    ...mapGetters(['user']),
  },
  async created() {
    await this.queryList()
  },
  methods: {
    async queryList() {
      this.loading = true
      try {
        const queryFields = Utils.removeEmptyAttr(this.queryObj)
        const params = Utils.assignObj(this.pagination, queryFields)
        params.agent_id = this.user.account_id
        delete params.pageTotal
        const { code, data, total } = await Model.queryServiceList(params)
          this.tableData = data || []
          this.pagination.pageTotal = total
      } catch (error) {
        console.log(error)
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
    // 查看详情
    handleEnter(index, row, col) {
      this.dialogVisible = true
    },
    // 跳转去工单管理
    jumpOrderMg(index, row, col) {
      this.$router.push({
        path: '/agent-mg/worker-order/list',
        query: {
          p_code: row.p_code,
        },
      })
    },
    // 跳转回访详情页
    jumpVisitDetail(index, row, col) {
      this.dialogVisible = true
      this.isView = true
      this.editDsiabled = true
      const data = Utils.deepClone(row)
      data.visit_status = data.visit_num
      this.visitInfo = data
    },
    closeDialog() {
      this.dialogVisible = false
      this.isView = false
      this.editDsiabled = false
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
