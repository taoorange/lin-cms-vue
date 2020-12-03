<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="table-button-wrap">
        <el-button type="primary" @click="showAddDialog">新增账号</el-button>
        <!-- <el-button type="primary" @click="refreshToekn">刷新令牌</el-button> -->
      </div>
      <!-- 表格 -->
      <lin-table
        title="人员列表"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :useActionRender="true"
        :action-render="actionRender"
        :showSelectCol="true"
        :index="true"
        :actionWidth="300"
        :pagination="pagination"
        :onQueryChange="onQueryChange"
        @handleEdit="handleEdit"
        @goToGroupEditPage="goToGroupEditPage"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        v-loading="loading"
      ></lin-table>
    </div>

    <add-people
      center
      :title="dialogTitle"
      :editDsiabled="editDsiabled"
      :dialogVisible="dialogVisible"
      @closeDialog="closeDialog"
      @updateUser="updateUser"
      ref="addAccount"
      :rowData="rowData"
    />
  </div>
</template>

<script>
import Model from '@/model/replace-sheets'
import LinTable from '@/component/base/table/lin-table'
import model from '@/model/sys-set'
import { roleType, f_status } from 'lin/format/sys-set'
import { dateFormat } from 'lin/util/util'
import AddPeople from './components/addPeople'
import Utils from 'lin/util/util'
export default {
  components: {
    LinTable,
    AddPeople,
  },
  data() {
    return {
      loading: false,
      tableColumn: [
        { prop: 'name', label: '姓名' },
        { prop: 'account', label: '账号',minWidth: 220 },
        { prop: 'phone', label: '电话', minWidth: 120, },
        {
          prop: 'create_time',
          label: '开通时间',
          minWidth: 140,
          render: (h, { index, row, col }) => {
            return <span>{ dateFormat(row.create_time) }</span>
          },
        },
        {
          prop: 'role',
          label: '角色',
          render: (h, { index, row, col }) => {
            return <span>{ roleType(row.role) }</span>
          },
        },
        {
          prop: 'status',
          label: '状态',
          render: (h, { index, row, col }) => {
            return <span>{ f_status(row.status) }</span>
          },
        }
      ],
      tableData: [],
      showEdit: false,
      editBookID: 1,

      pagination: {
        page: 1,
        page_size: 10,
        pageTotal: 0,
      },
      dialogTitle: '新增账号',
      editDsiabled: false,
      dialogVisible: false,
      rowData: {},
    }
  },
  async created() {
    this.loading = true
    await this.queryList()
    this.loading = false
  },
  methods: {
    actionRender(h, { index, row, col }) {
      return (
        <div class="action-wrap">
          <el-button size="mini" plain type="primary" onClick={() => this.handleEdit(row)}>
            编辑
          </el-button>
          <el-button size="mini" plain type="primary" onClick={() => this.resetPassword(row)}>
            重置密码
          </el-button>
          {row.status !== 1 ? (
            <el-button size="mini" plain type="primary" onClick={() => this.handleOpen(row)}>
              开启
            </el-button>
          ) : (
            <el-button size="mini" plain type="primary" onClick={() => this.handleOff(row)}>
              关闭
            </el-button>
          )}
        </div>
      )
    },
    // 获取账号列表
    async queryList() {
      try {
        const params = Utils.deepClone(this.pagination)
        params.size = params.page_size
        delete params.page_size
        delete params.pageTotal
        const { data, total } = await model.getUsers(params)
        if(data && data.length) {
          this.tableData = data.filter(item => {
            return item.role !== 1
          })
        } else {
          this.tableData = []
        }
        this.pagination.pageTotal = total
      } catch (error) {
        this.tableData = []
      }
    },
    async refreshToekn() {
      try {
        const { data } = await model.refreshToken()
        
      } catch (error) {
        console.log(error)
      }
    },
    handleEdit(val) {
      this.showAddDialog()
      this.dialogTitle = '编辑账号'
      this.editDsiabled = true
      this.rowData = val
      const form = Utils.pick(val, ['phone', 'account', 'name', 'role'])
      form.roleName = roleType(val.role)
      this.$refs.addAccount.dialogForm = form
    },
    resetPassword(row) {
      this.$confirm('确定要重置密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
           try {
            const { code, data, message } = await model.resetPassword(row.id)
            if(code === 11) {
              this.$message.success(message)
              this.queryList()
            }
          } catch (error) {
            console.log(error)
          }
        })
        .catch(() => {})
    },
    // 增加新员工
    showAddDialog() {
      this.dialogVisible = true
    },
    // 跳转去详情页
    goToGroupEditPage(val) {
      this.$router.push({
        path: '/worker-order/view',
        query: {
          id: val.row.id,
        },
      })
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
    // 搜索
    onQueryChange(query) {
      console.log(query)
      if (!query) {
        return false
      }
      // 当前搜索trim处理
      this.searchKeyword = query.trim()
      // this.loading = true
      // 请求搜索接口
    },
    closeDialog() {
      this.dialogVisible = false
      this.editDsiabled = false
    },
    handleOpen(row) {
      this.$confirm('确认开启账号吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.changeAccount(row)
        })
        .catch(() => {})
    },
    handleOff(row) {
      this.$confirm('确认关闭账号吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.changeAccount(row)
        })
        .catch(() => {})
    },
    async changeAccount(row) {
      const arr = [1, 0]
      const params = {
        status: arr[row.status]
      }
      try {
        const { code, data, message } = await model.changeAccount(row.id, params)
        if(code === 11) {
          this.$message.success(message)
          this.queryList()
        }
      } catch (error) {
        console.log(error)
      }
    },
    updateUser() {
      this.queryList()
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

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
