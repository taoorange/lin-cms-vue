<template>
  <div>
    <exact-search :handleSearch="handleSearch" ref="exactSearch" />

    <!-- 列表页面 -->
    <div class="container">
      <div class="table-button-wrap">
        <el-button type="primary" @click="jumpCreateWorker">按钮</el-button>
      </div>
      <!-- 表格 -->
      <lin-table
        title="客户信息管理"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        :showSelectCol="true"
        :index="true"
        :actionWidth="150"
        :pagination="pagination"
        @handleEdit="handleEdit"
        @goToGroupEditPage="goToGroupEditPage"
        :queryList="queryList"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        v-loading="loading"
      ></lin-table>
    </div>
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import model from '@/model/customer'
import LinTable from '@/component/base/table/lin-table'
import ExactSearch from './components/exactSearch'
import { dateFormat } from 'lin/util/util'
import { clientType, sourceType } from 'lin/format/customer'
import { setKEY, getKEY } from 'lin/util/storage'
export default {
  name: 'CustomerMg',
  components: {
    LinTable,
    ExactSearch,
  },
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          prop: 'client_type',
          label: '客户分类',
          render: (h, { index, row, col }) => {
            return <span>{clientType(row.client_type)}</span>
          },
        },
        { prop: 'client_name', label: '客户姓名' },
        { prop: 'phone', label: '手机号码' },
        { prop: 'product_num', label: '产品注册数量' },
        {
          prop: 'register_time',
          label: '客户注册时间',
          width: 140,
          render: (h, { index, row, col }) => {
            return <span>{dateFormat(row.register_time, 'yyyy-MM-dd')}</span>
          },
        },
        {
          prop: 'source',
          label: '客户来源',
          render: (h, { index, row, col }) => {
            return <span>{sourceType(row.source)}</span>
          },
        },
      ],
      tableData: [],
      operate: this.handleOperate(),
      showEdit: false,
      editBookID: 1,
      pagination: {
        page: 1, // 当前页码数
        page_size: 10, // 每页多少条
        pageTotal: 0,
      },
    }
  },
  async created() {
    const Qpagination = getKEY('Qpagination')
    if(Qpagination) {
      this.pagination = Qpagination
    }
    await this.queryList(this.pagination)
    console.log(99999)
  },
  watch: {
    pagination: {
      handler(val) {
        setKEY('Qpagination', val)
      },
      immediate: false,
      deep:true,
    },
  },
  methods: {
    async queryList() {
      this.loading = true
      try {
        const queryFields = Utils.removeEmptyAttr(this.queryObj)
        const params = Utils.assignObj(this.pagination, queryFields)
        const { code, data, total } = await model.queryList(params)
        this.tableData = data || []
        this.pagination.pageTotal = total
      } catch (error) {
        this.tableData = []
      }
      this.loading = false
    },
    // 搜索
    async handleSearch(query = {}) {
      this.pagination.page = 1
      this.queryObj = Utils.deepClone(query)
      delete this.queryObj.dateRange
      await this.queryList()
    },
    // 操作按钮
    handleOperate() {
      const operate = [
        {
          name: '详情',
          func: 'goToGroupEditPage',
          type: 'primary',
        },
      ]
      return operate
    },
    handleEdit(val) {
      this.dialogVisible = true
    },
    // 跳转去详情页
    goToGroupEditPage(val) {
      this.$router.push({
        path: '/customer/detail',
        query: {
          client_id: val.row.client_id,
        },
      })
    },
    // 切换当前页
    currentChange(val) {
      this.pagination.page = val
      setKEY('Qpagination', this.pagination)
      this.queryList()
    },
    sizeChange(val) {
      this.pagination.page_size = val
      this.pagination.page = 1
      setKEY('Qpagination', this.pagination)
      this.queryList()
    },
    // 跳转创建工单
    jumpCreateWorker() {
      
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
