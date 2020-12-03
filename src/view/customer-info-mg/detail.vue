<template>
  <div class="lin-container">
    <el-form :model="dto" :inline="false" size="small" ref="ruleForm" label-width="140px" class="demo-ruleForm">
      <!-- 客户信息 -->
      <template>
        <el-row :gutter="24">
          <div class="title">
            <h1>客户信息<span>{{dto.client_type === 1 ? '（会员）' : ''}}</span></h1>
          </div>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="姓名：">
              <span>{{ dto.client_name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：">
              <span>{{ dto.phone }}</span>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label="注册时间：">
              <span>{{ dto.register_time }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="所在省市：">
              <span>{{ dto.provice }}{{dto.city}}{{dto.district}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址：">
              <span>{{ dto.address }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!-- 产品信息 -->
      <!-- 只对普通客户才显示添加产品按钮 -->
      <div class="table-wraper">
        <el-row :gutter="24">
          <div class="title">
            <h1 @click="getProducts">产品信息<span>（{{tableData.length || 0}}）</span></h1>
          </div>
        </el-row>
        <div class="table-button-wrap" v-if="dto.client_type === 0">
          <el-button type="primary" @click="showAddDialog">添加产品</el-button>
        </div>
        <lin-table
          title="客户产品列表"
          :showHeader="false"
          :showPage="false"
          :tableColumn="tableColumn"
          :tableData="tableData"
          :useActionRender="true"
          :action-render="actionRender"
          :showSelectCol="true"
          :index="false"
          :actionWidth="150"
        ></lin-table>
      </div>

      <!-- 工单信息 -->
      <template>
        <el-row :gutter="24">
          <div class="title">
            <h1 @click="getWorkSheet">工单信息<span>（{{tableWorkerData.length || 0}}）</span></h1>
          </div>
        </el-row>
        <lin-table
          title="工单列表"
          :showPage="false"
          :showHeader="false"
          :tableColumn="tableWorkerColumn"
          :tableData="tableWorkerData"
          :useActionRender="true"
          :action-render="actionRenderSheet"
          :pagination="pagination"
          :showSelectCol="true"
          :index="false"
          :actionWidth="150"
        ></lin-table>
      </template>
    </el-form>
    
      <!-- 添加产品弹框 -->
      <add-products
        :title="dialogTitle"
        :editDsiabled="editDsiabled"
        :dialogVisible="dialogVisible"
        @closeDialog="closeDialog"
        :pagination="pagination"
        :clientId="clientId"
        :rowData="rowData"
        :clientInfo="dto"
        @getProductsList="getProducts"
        @updateEditDialog="updateEditDialog"
      />

      <!-- 换新情况弹窗 -->
      <view-replace
        :p_code="p_code"
        @closeDialog="closeDialog"
        :dialogVisible="dialogReplaceVisable" />

      <!-- 回访详情 -->
      <visit-dg
        title="回访记录"
        :isView="true"
        :editDsiabled="true"
        :visitInfo="visitInfo"
        :dialogVisible="dialogVisitVisible"
        @closeDialog="closeDialog"
        ref="addDg"
      />
  </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import AddProducts from './components/addProducts'
import model from '@/model/customer'
import { dateFormat } from 'lin/util/util'
import { productType } from 'lin/format/customer'
import ViewReplace from './components/viewReplace'
import { ws_type1, ws_type2, workStatus, workSource } from 'lin/format/workSheet'
import VisitDg from '../visit-mg/components/visit'
export default {
  data() {
    return {
      clientId: '',
      isRegister: false,
      dto: {},
      tableColumn: [
        { prop: 'p_type',
          label: '产品类型',
          render: (h, { index, row, col }) => {
            return (
             <span>{ productType(row.p_type) }</span>
            )
          },
        },
        { prop: 'p_code', label: '产品编码' },
        { prop: 'replace_num',
          label: '换新次数',
          render: (h, { index, row, col }) => {
            if(row.replace_num !==0) {
              return (
               <span class="table-link-btn" onClick={() => this.viewReplace(index, row, col)}>{ row.replace_num}</span>
              )

            } else {
              return (<span>{row.replace_num}</span>)
            }
          },
        },
        { prop: 'register_time',
          label: '注册时间',
          minWidth: 140,
          render: (h, { index, row, col }) => {
            return (
             <span>{ dateFormat(row.register_time) }</span>
            )
          },
        },
        { prop: 'name', label: '姓名' },
        { prop: 'phone', label: '电话', width: 120},
        { prop: 'visit_num',
          label: '回访次数',
          render: (h, { index, row, col }) => {
            if (row.visit_num !==0 ) {
              return (
               <span class="table-link-btn" onClick={() => this.viewVisit(index, row, col)}>{ row.visit_num}</span>
              )
            } else {
              return (<span>{row.visit_num}</span>)
            }
          },
        },
        { prop: 'province',
          label: '省市区',
          render: (h, { index, row, col }) => {
            return (
             <span>{ (row.province || '') + (row.city || '') + (row.district || '') }</span>
            )
          },
        },
        { prop: 'address', label: '详细地址' },
      ],
      tableData: [],
      pagination: {
        page: 1,
        page_size: 200,
        pageTotal: 0,
      },
      dialogVisible: false,
      dialogTitle: '添加产品',
      editDsiabled: false,
      rowData: {},
      tableWorkerColumn: [
        { prop: 'ws_code', label: '工单编号', width: 140 },
        { prop: 'ws_type1',
          label: '问题分类(一级)',
          width: 120,
          render: (h, { index, row, col }) => {
            return (
             <span>{ ws_type1(row.ws_type1) }</span>
            )
          },
        },
        { prop: 'ws_type2',
          label: '问题分类(二级)',
          width: 120,
          render: (h, { index, row, col }) => {
            return (
             <span>{ ws_type2(row.ws_type1, row.ws_type2) }</span>
            )
          },
        },
        { prop: 'phone', label: '手机号', width: 130 },
        { prop: 'p_code', label: '产品编码' },
        { prop: 'status',
          label: '工单状态',
          render: (h, { index, row, col }) => {
            return (
             <span>{ workStatus(row.status) }</span>
            )
          },
        },
        { prop: 'is_dispatch',
          label: '是否指派',
          render: (h, { index, row, col }) => {
            return (
             <span>{ row.is_dispatch === 1 ? '是': '否' }</span>
            )
          },
        },
        { prop: 'follow_time',
          label: '下次跟进时间',
          width: 120,
          render: (h, { index, row, col }) => {
            return (
             <span>{ dateFormat(row.follow_time) }</span>
            )
          },
        },
        { prop: 'create_time',
          label: '创建时间',
          width: 130,
          render: (h, { index, row, col }) => {
            return (
             <span>{ dateFormat(row.create_time) }</span>
            )
          },
        },
        { prop: 'update_time',
          label: '最近更新时间',
          width: 120,
          render: (h, { index, row, col }) => {
            return (
             <span>{ dateFormat(row.update_time) }</span>
            )
          },
        },
        { prop: 'processed_name', label: '当前处理人', width: 110 },
        { prop: 'created_name', label: '创建人' },
        { prop: 'source',
          label: '工单来源',
          render: (h, { index, row, col }) => {
            return (
             <span>{ workSource(row.source) }</span>
            )
          },
        },
      ],
      tableWorkerData: [],
      // 换新情况弹窗
      p_code: '',
      dialogReplaceVisable: false,

      dialogVisitVisible: false,
      visitInfo: {}

    }
  },
  components: {
    LinTable,
    AddProducts,
    ViewReplace,
    VisitDg
  },
  async created() {
    const {client_id} = this.$route.query
    this.clientId = String(client_id)
    if(client_id) {
      await this.getCustomerInfo()
      await this.getProducts()
      await this.getWorkSheet()
    }
  },
  methods: {
    // 客户产品列表按钮
    actionRender(h, { index, row, col }) {
      return (
        <div class="action-wrap">
          <el-button size="mini" plain type="primary" onClick={() => this.handleEdit(index, row, col)}>
            编辑
          </el-button>
        </div>
      )
    },
    // 客户产品列表按钮
    actionRenderSheet(h, { index, row, col }) {
      return (
        <div class="action-wrap">
          <el-button size="mini" plain type="primary" onClick={() => this.handleEditWorker(index, row, col)}>
            编辑
          </el-button>
          <el-button size="mini" plain type="primary" onClick={() => this.goToGroupEditPageWorker(index, row, col)}>
            详情
          </el-button>
        </div>
      )
    },
    // 获取客户信息
    async getCustomerInfo() {
      try {
        const { code, data, message } = await model.getInfo({uid: this.clientId})
        if(code === 11) {
          this.dto = data
          console.log(this.dto.client_type)
        } else {
          this.$message.error(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取客户产品列表
    async getProducts() {
      try {
        const { code, data, message } = await model.getProduct(this.clientId)
        this.tableData = data || []
      } catch (error) {
        this.tableData = []
      }
    },
    // 获取客户工单列表
    async getWorkSheet() {
      try {
        const { code, data, message } = await model.getWorkSheet(this.clientId)
        this.tableWorkerData = data || []
      } catch (error) {
        this.tableWorkerData = []
      }
    },
    // 跳转去编辑工单
    handleEditWorker(index, row, col) {
      this.$router.push({
        path: '/worker-order/edit',
        query: {
          ws_id: row.ws_id,
          p_code: row.p_code,
        },
      })
    },
    // 跳转工单详情
    goToGroupEditPageWorker(index, row, col) {
      this.$router.push({
        path: '/worker-order/view',
        query: {
          ws_id: row.ws_id,
          p_code: row.p_code,
        },
      })
    },
    // 添加产品弹框显示
    showAddDialog() {
      this.dialogVisible = true
      this.editDsiabled = false
      this.dialogTitle = '添加产品'
      this.rowData = this.dto
    },
    // 编辑产品
    handleEdit(index, row, col) {
      this.dialogVisible = true
      this.dialogTitle = '编辑产品'
      this.editDsiabled = true
      this.rowData = row
    },
    // 添加、编辑产品弹框关闭
    closeDialog() {
      this.dialogVisible = false
      this.dialogReplaceVisable = false
      this.dialogVisitVisible = false
      this.visitInfo = {}
      this.rowData = {}
    },
    updateEditDialog(val) {
      this.editDsiabled = val
    },
    // 查看换新
    viewReplace(index, row, col) {
      this.dialogReplaceVisable = true
      this.p_code = row.p_code
    },
    // 查看回访详情
    viewVisit(index, row, col) {
      this.dialogVisitVisible = true
      this.isVisitView = true
      row.visit_status = row.visit_num
      this.visitInfo = row
    },

  },
}
</script>

<style lang="scss" scoped>
.lin-container {
  .first-title {
    width: 100%;
    text-align: center;
    height: 40px;
    font-size: 20px;
    color: #3963bc;
    font-weight: 700;
  }
  .table-wraper {
    position: relative;
    margin-bottom: 20px;
    .table-button-wrap {
      top: 15px;
      right: 0;
    }
  }
}
</style>
