<template>
  <div>
    <exact-search v-permission="['客服']" :handleSearch="handleSearch" ref="exactSearch" />

    <!-- 列表页面 -->
    <div class="container">
      <div class="table-button-wrap">
        <!-- 客服登录有这个按钮 -->
        <el-button  v-permission="['客服']" type="primary" @click="jumpCreateWorker">创建工单</el-button>
      </div>
      <!-- 表格 -->
      <lin-table
        title="工单列表"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :useActionRender="true"
        :action-render="actionRender"
        :showSelectCol="true"
        :index="true"
        :actionWidth="150"
        :pagination="pagination"
        @handleEdit="handleEdit"
        @goToGroupEditPage="goToGroupEditPage"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        v-loading="loading"
      ></lin-table>
    </div>
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import { dateFormat } from 'lin/util/util'
import { ws_type1, ws_type2, workStatus, workSource } from 'lin/format/workSheet'
import Model from '@/model/work-sheet'
import LinTable from '@/component/base/table/lin-table'
import ExactSearch from './components/exactSearch'
import { mapGetters } from 'vuex'
export default {
  name: 'WorderOrder',
  components: {
    LinTable,
    ExactSearch,
  },
  data() {
    return {
      loading: false,
      tableColumn: [
        { prop: 'ws_code', label: '工单编号', width: 140 },
        { prop: 'phone', label: '手机号', width: 120 },
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
        { prop: 'p_code', label: '产品编码', minWidth: 130 },
        {
          prop: 'follow_time',
          label: '下次跟进时间',
          width: 140,
          render: (h, { index, row, col }) => {
            return <span>{dateFormat(row.follow_time)}</span>
          },
        },
        {
          prop: 'status',
          label: '工单状态',
          width: 130,
          render: (h, { index, row, col }) => {
            return <span>{workStatus(row.status)}</span>
          },
        },
        {
          prop: 'is_dispatch',
          label: '是否指派',
          render: (h, { index, row, col }) => {
            return <span>{row.is_dispatch === 1 ? '是' : '否'}</span>
          },
        },
        {
          prop: 'create_time',
          label: '创建时间',
          width: 135,
          render: (h, { index, row, col }) => {
            return <span>{dateFormat(row.create_time)}</span>
          },
        },
        {
          prop: 'update_time',
          label: '最近更新时间',
          width: 135,
          render: (h, { index, row, col }) => {
            return <span>{dateFormat(row.update_time)}</span>
          },
        },
        { prop: 'processed_name', label: '当前处理人', width: 110 },
        { prop: 'created_name', label: '创建人' },
        {
          prop: 'source',
          label: '工单来源',
          render: (h, { index, row, col }) => {
            return <span>{workSource(row.source)}</span>
          },
        },
      ],
      tableData: [
        {create_time: "2020-11-10T02:47:37.000Z",
          created_by: 1,
          created_name: "root",
          follow_time: "2020-11-18T00:00:00.000Z",
          is_dispatch: 0,
          p_code: "80",
          phone: "18233560009",
          processed_by: 1,
          processed_name: "root",
          source: 1,
          status: 0,
          update_time: "2020-11-10T02:47:37.000Z",
          ws_code: "QWS20201110002",
          ws_id: 85,
          ws_type1: 1,
          ws_type2: 1,
        }
      ],
      showEdit: false,
      editBookID: 1,
      pagination: {
        page: 1,
        page_size: 10,
        pageTotal: 0,
      },
      searchList: [{ name: '手机号', type: 'input' }],
      queryObj: {}
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  async created() {
    const { p_code } = this.$route.query
    if (p_code) {
      this.queryObj.p_code = p_code
      this.$nextTick(() => {
         this.$refs.exactSearch.query.p_code = p_code
      })
    }
   
    await this.queryList()
    // console.log(window.location)
  },
  methods: {
    actionRender(h, { index, row, col }) {
      const authority = this.user.role === 0 || this.user.role === 1 ? true : false
      return (
        <div class="action-wrap">
          {/*客服登录才有编辑按钮*/}
          <el-button v-permission={['客服']} size="mini" plain type="primary" onClick={() => this.handleEdit(index, row, col)}>
            编辑
          </el-button>
          <el-button size="mini" plain type="primary" onClick={() => this.goToGroupEditPage(index, row, col)}>
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
      delete this.queryObj.create_time
      delete this.queryObj.update_time
      await this.queryList()
    },
    // 编辑工单
    handleEdit(index, row, col) {
      this.$router.push({
        path: '/worker-order/edit',
        query: {
          ws_id: row.ws_id,
          p_code: row.p_code,
        },
      })
    },
    // 查看工单详情
    goToGroupEditPage(index, row, col) {
      const {path} = this.$route
      // console.log(path)
      if(path === '/agent-mg/worker-order/list') {
        this.$router.push({
          path: '/agent-mg/worker-order/view',
          query: {
            ws_id: row.ws_id,
            p_code: row.p_code,
            // row: JSON.stringify(row),
          },
        })
      } else {
        this.$router.push({
          path: '/worker-order/view',
          query: {
            ws_id: row.ws_id,
            p_code: row.p_code,
            // row: JSON.stringify(row),
          },
        })
      }
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
    editClose() {
      this.showEdit = false
      this.getBooks()
    },
    // 跳转创建工单
    jumpCreateWorker() {
      this.$router.push({ path: '/worker-order/create' })
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
