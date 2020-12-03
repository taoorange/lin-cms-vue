<template>
  <div>
    <exact-search :handleSearch="handleSearch" ref="exactSearch" />

    <!-- 列表页面 -->
    <div class="container">
     
      <!-- 表格 -->
      <lin-table
        title="换新列表"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :useActionRender="true"
        :action-render="actionRender"
        :showSelectCol="true"
        :index="true"
        :actionWidth="150"
        :pagination="pagination"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        v-loading="loading"
      ></lin-table>
    </div>

    <!-- 编辑换新单 -->
    <edit-renewal
      :title="dialogTitle2"
      :showClose="true"
      :isEdit="true"
      :partDisabled="partDisabled"
      :dialogVisible="dialogVisible2"
      @refreshList="queryList"
      @closeDialog="closeDialog2"
      :isView="isView"
      ref="editDg"
    />
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import { dateFormat } from 'lin/util/util'
import { buy_channel } from 'lin/format/replace-sheet'
import Model from '@/model/replace-sheets'
import LinTable from '@/component/base/table/lin-table'
import ExactSearch from './components/exactSearch'
// 编辑换新单
import EditRenewal from './components/add'
import { defect_type } from 'lin/format/replace-sheet'

export default {
  components: {
    LinTable,
    ExactSearch,
    EditRenewal,
  },
  data() {
    return {
      loading: false,
      queryObj: {},
      tableColumn: [
        { prop: 'post_phone', label: '手机号', width: 120 },
        { prop: 'p_code_old', label: '旧产品编码', width: 110 },
        { prop: 'p_code_new', label: '新产品编码', width: 110 },
        {
          prop: 'buy_channel',
          label: '购买渠道',
          render: (h, { index, row, col }) => {
            return <span>{buy_channel(row.buy_channel)}</span>
          },
        },
        {
          prop: 'status',
          label: '换新状态',
          render: (h, { index, row, col }) => {
            return <span>{row.status === 0 ? '处理中' : '已完成'}</span>
          },
        },
        {
          prop: 'defect_type',
          label: '产品问题',
          render: (h, { index, row, col }) => {
            return <span>{defect_type(row.defect_type)}</span>
          },
        },
        {
          prop: 'create_time',
          label: '创建时间',
          width: 140,
          render: (h, { index, row, col }) => {
            return <span>{dateFormat(row.create_time)}</span>
          },
        },
        { prop: 'process_name', label: '处理人' },
        { prop: 'post_by_name', label: '录入人' },
        {
          prop: 'end_time',
          label: '结束时间',
          width: 140,
          render: (h, { index, row, col }) => {
            return <span>{row.status === 1 ? dateFormat(row.update_time) : ''}</span>
          },
        },
      ],
      tableData: [],
      pagination: {
        page: 1,
        page_size: 10,
        pageTotal: 0,
      },
      dialogTitle2: '换新单编辑',
      dialogVisible2: false,
      isView: false,
      partDisabled: false,
    }
  },
  async created() {
    await this.queryList()
  },
  methods: {
    actionRender(h, { index, row, col }) {
      return (
        <div class="action-wrap">
          {row.status !== 1 ? (
            <el-button size="mini" plain type="primary" onClick={() => this.handleEdit(index, row, col)}>
              编辑
            </el-button>
          ) : (
            undefined
          )}
          <el-button size="mini" plain type="primary" onClick={() => this.handleDetail(index, row, col)}>
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
        const { code, data, message, total } = await Model.queryList(params)
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
      delete this.queryObj.process_time
      await this.queryList()
    },
    // 编辑换新
    async handleEdit(index, row, col) {
      this.dialogVisible2 = true
      this.dialogTitle2 = '换新单编辑'
      this.partDisabled = true
      // 获取换新单详情
      const { code, data, message } = await Model.getDetail(row.replace_id)
      if (code === 11 && data && data.length) {
        console.log(data)
        const form = Utils.deepClone(data[0])
        form.replace_id = row.replace_id
        form.replacesheet_id = row.replacesheet_id
        this.$nextTick(() => {
          this.$refs.editDg.dialogForm = form
        })
      }
    },
    // 查看详情时做判断，分别展示不同的详情弹框
    async handleDetail(index, row, col) {
      this.dialogTitle2 = '换新单详情'
      this.showEditDialog()
      this.isView = true
      const { code, data, message } = await Model.getDetail(row.replace_id)
      if (code === 11 && data && data.length) {
        this.$nextTick(() => {
          this.$refs.editDg.dialogForm = data[0]
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
    // 创建换新
    showEditDialog() {
      this.dialogVisible2 = true
    },
    // 编辑换新单弹框关闭
    closeDialog2() {
      this.dialogVisible2 = false
      this.partDisabled = false
      this.isView = false
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
  .create-worker {
    position: absolute;
    z-index: 200;
    top: 14px;
    right: 170px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
