<template>
  <div>
    <exact-search :handleSearch="handleSearch" ref="exactSearch" />

    <!-- 列表页面 -->
    <div class="container">
      <!-- tab选项按钮 -->
      <div class="tab-wrapper">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane v-for="item in tabList" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </div>

      <lin-table
        :title="tableTitle"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :showTab="true"
        :tabList="tabList"
        :activeName="activeName"
        :showSelectCol="true"
        :useActionRender="true"
        :action-render="actionRender"
        :index="true"
        :actionWidth="150"
        :pagination="pagination"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        v-loading="loading"
      ></lin-table>
    </div>

    <template v-if="dialogVisible">
      <visit-dg
        :title="dialogTitle"
        :showClose="true"
        :visitInfo="visitInfo"
        :dialogVisible="dialogVisible"
        @closeDialog="closeDialog"
        @refreshList="queryList"
        :editDsiabled="editDsiabled"
        ref="addDg"
        :isView="isView"
      />
    </template>
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import { dateFormat } from 'lin/util/util'
import { visitTabList, visitTabFormat } from 'lin/format/visit'
import { f_customerSource } from 'lin/format/replace-sheet'
import Model from '@/model/visit'
import LinTable from '@/component/base/table/lin-table'
import ExactSearch from './components/exactSearch'
import VisitDg from './components/visit'

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
      tableTitle: '首次回访',
      tableColumn: [
        { prop: 'relation', 
          label: '用户来源',
          render: (h, { index, row, col }) => {
            return <span>{ f_customerSource(row.relation) }</span>
          },
        },
        { prop: 'user_phone',
          label: '使用者手机',
          width: 130,
          render: (h, { index, row, col }) => {
            return <span  class="table-link-btn" onClick={() => this.makeCall(index, row, col)}>{ row.user_phone }</span>
          },
        },
        { prop: 'user_name', label: '使用者姓名' },
        { prop: 'p_code', label: '产品编号' },
        { prop: 'register_time',
          label: '注册时间',
          render: (h, { index, row, col }) => {
            return <span>{ dateFormat(row.register_time) }</span>
          },
        },
      ],
      tableData: [],
      pagination: {
        page: 1,
        page_size: 10,
        pageTotal: 0,
      },
      // 弹框
      dialogTitle: '回访记录',
      dialogVisible: false,
      editDsiabled: false,
      activeName: 'first',
      tabList: visitTabList(),
      isView: false,
      visitInfo: {}
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.editDsiabled = false
      }
    },
  },
  async created() {
    await this.queryList()
  },
  methods: {
    actionRender(h, { index, row, col }) {
      return (
        <div class="action-wrap">
        {
          row.visit_status !== 4
          ? <el-button size="mini" plain type="primary" onClick={() => this.handleEdit(index, row, col)}>
            记录
          </el-button> : ''
        }
        {
           row.visit_status !== 0
           ? <el-button size="mini" plain type="primary" onClick={() => this.handleDetail(index, row, col)}>
              详情
            </el-button> : undefined
        }
        </div>
      )
    },
    handleTabClick(tab, event) {
      this.tableTitle = tab.label
      const visit_status = visitTabFormat(this.activeName)
      this.queryList(visit_status)
    },
    async queryList(visit_status = 0) {
      this.loading = true
      try {
        const queryFields = Utils.removeEmptyAttr(this.queryObj)
        const params = Utils.assignObj(this.pagination, queryFields)
        const status = visitTabFormat(this.activeName)
        params.visit_status = status
        const { data, total } = await Model.queryList(params)
        this.tableData = data || []
        this.pagination.pageTotal = total
      } catch (error) {
        this.tableData = []
        console.log(error)
      }
      this.loading = false
    },
    async handleSearch(query = {}) {
      this.pagination.page = 1
      this.queryObj = Utils.deepClone(query)
      await this.queryList()
    },
    // 记录
    handleEdit(index, row, col) {
      this.dialogVisible = true
      this.visitInfo = row
    },
    // 回访记录详情
    handleDetail(index, row, col) {
      this.dialogVisible = true
      this.isView = true
      this.visitInfo = row
      this.editDsiabled = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.editDsiabled = false
      this.isView = false
      this.visitInfo = {}
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
    // 打电话呼叫
    makeCall(index, row, col) {
      const phone = String(row.user_phone)
      UdeskCCPaasApiClassInstance.MakeCallAsync(phone).then(resp=>{
        console.log(resp)
      }).catch(error => {
        console.log(error)
      })
    }
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

  .tab-wrapper {
    margin-bottom: -16px;
    margin-top: 16px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
