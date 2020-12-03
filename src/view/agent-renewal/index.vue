<template>
  <div>
    <exact-search :handleSearch="handleSearch" :role="user.role" ref="exactSearch" />

    <!-- 列表页面 -->
    <div class="container">
      <div class="table-button-wrap">
        <el-button type="primary" v-if="user.role === 3" @click="showDialog">换新</el-button>
        <!-- 会有多级经销商，只有总经销商有权限登录系统，这个功能用于手机下级经销商换新信息的导入 -->
        <el-upload
          v-if="user.role === 3"
          class="upload-demo"
          :show-file-list="false"
          action="http://101.201.111.237:5000/v1/replacesheets/agent/import"
          :headers="authData"
          :http-request="handleUploadReplace"
          :limit="1"
        >
          <el-button  v-loading="uploading"  element-loading-spinner="el-icon-loading" type="primary">导入换新</el-button>
        </el-upload>
      </div>
      <!-- 表格 -->
      <lin-table
        title="经销商换新"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :showSelectCol="true"
        :searchList="searchList"
        :index="true"
        :actionWidth="150"
        :pagination="pagination"
        :currentChange="currentChange"
        v-loading="loading"
      ></lin-table>
    </div>

    <!-- 经销商换新弹框 -->
    <add-renewal
      :title="dialogTitle"
      :showClose="true"
      :dialogVisible="dialogVisible"
      @closeDialog="closeDialog"
      @updateList="queryList"
      ref="addDg"
    />

    <!-- 客服修改换新问题弹框 -->
    <switch-defects
      title="修改产品问题"
      @closeDialog="closeSwitchDialog"
      @updateList="queryList"
      :replaceId="replaceId"
      :dialogVisible="dialogSwitchVisable"
    />
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import { dateFormat } from 'lin/util/util'
import { mapGetters } from 'vuex'
import Model from '@/model/agent-replace'
import LinTable from '@/component/base/table/lin-table'
import ExactSearch from './components/exactSearch'
import AddRenewal from './components/add'
import switchDefects from './components/switchDefects'
import { defect_type } from 'lin/format/replace-sheet'
import { getToken } from '@/lin/util/token'
export default {
  components: {
    LinTable,
    ExactSearch,
    AddRenewal,
    switchDefects,
  },
  data() {
    return {
      uploading: false,
      authData: {
        Authorization: getToken('access_token'),
      },
      loading: false,
      queryObj: {},
      tableColumn: [
        { prop: 'p_code_old', label: '旧产品编码', width: 110 },
        { prop: 'p_code_new', label: '新产品编码', width: 110 },
        {
          prop: 'defect_type',
          label: '产品问题',
          render: (h, { index, row }) => {
            if (this.user.role === 1 || this.user.role === 2) {
              return (
                <div class="table-link-btn" onClick={() => this.changeDefects(index, row)}>
                  {defect_type(row.defect_type)}
                </div>
              )
            }
            return <span>壳体开裂</span>
          },
        },
        {
          prop: 'replace_time',
          label: '操作时间',
          width: 140,
          render: (h, { index, row, col }) => {
            return <span>{dateFormat(row.replace_time)}</span>
          },
        },
        { prop: 'remark', label: '备注' },
      ],
      tableData: [],
      showEdit: false,
      pagination: {
        page: 1,
        page_size: 10,
        pageTotal: 0,
      },
      searchList: [{ name: '手机号', type: 'input' }],
      // 弹框
      dialogTitle: '经销商换新',
      dialogVisible: false,
      agentLogin: true, // 默认经销商登录
      dialogSwitchVisable: false,
      replaceId: '',
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  async created() {
    await this.queryList()
  },
  mounted() {
    this.handleTable()
  },
  methods: {
    handleTable() {
      if (this.user.role === 1 || this.user.role === 2) {
        this.tableColumn.unshift({ prop: 'agent_name', label: '经销商', width: 110 })
      }
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
        console.log(error)
        this.tableData = []
      }
      this.loading = false
    },
    async handleSearch(query = {}) {
      this.pagination.page = 1
      this.queryObj = Utils.deepClone(query)
      await this.queryList()
    },
    // 查看详情
    // 查看详情时做判断，分别展示不同的详情弹框
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
    showDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      // 关闭弹框的时候，重置form
      // const form = this.$refs.addDg.dialogForm
      // form.newNo = ''
      // for (const key in form) {
      //   console.log(key)
      // }
      return false
    },
    // 上传失败
    uploadErr(response, file, fileList) {
      console.log(response, file, fileList)
    },
    // 上传成功
    uploadSuccess(response, file, fileList) {
      console.log(response, file, fileList)
      const {code, message} = response
      if(code === 11) {
        this.$message.success(message)
      } else {
        this.$message.error(message)
      }
    },
    // 客服登录时候去修改问题
    changeDefects(index, row) {
      this.dialogSwitchVisable = true
      this.replaceId = row.replace_id
      this.switchRow = row
    },
    closeSwitchDialog() {
      this.dialogSwitchVisable = false
    },
    // 上传换新列表
    async handleUploadReplace(file) {
      this.uploading = true
      const formData = new FormData();
      formData.append("file", file.file);
      try {
        const {code, message} = await Model.agentUploadReplace(formData)
        if(code === 11) {
          this.$message.success(message)
          this.uploading = false
        } else {
          this.uploading = false
          this.$message.error(message)
        }
      } catch(error) {
        this.uploading = false
        console.log(error)
      }
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
  .upload-demo {
    display: inline-block;
    margin-left: 15px;
  }
  /deep/.el-loading-spinner {
    margin-top: -8px;
  }
}
</style>
