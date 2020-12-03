<template>
  <div class="container">
    <el-dialog
      :title="title"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      width="80%"
      :visible.sync="dialogVisible"
    >
      <button type="button" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="closeDialog"></i>
      </button>
      <!-- 查看详情时候显示tab栏 -->
      <div class="tab-wrapper">
        <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
          <el-tab-pane v-for="item in tabList" :key="item.name" :label="item.label" :name="item.name">
            <span slot="label">
              <i v-if="item.success" class="completed-visit el-icon-success"></i>
              {{ item.label }}
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <vist-content
        ref="formContent"
        :activeName="activeName"
        @closeDialog="closeDialog"
        @refreshList="refreshList"
        :visitInfo="visitInfo"
        :isView="isView"
        :toFixed="true"
        :editDsiabled="editDsiabled"
      />
      <div slot="footer" class="dialog-footer">
        <template v-if="!isView">
          <el-button type="primary" @click="jumpOrderEdit"> 创建工单 </el-button>
          <el-button type="primary" @click="handleDialogForm"> 保存 </el-button>
        </template>
        <el-button @click="closeDialog"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import VistContent from './visit-content'
// 分类按钮
import { visitTabList } from 'lin/format/visit'
import modelCustomer from '@/model/customer'
export default {
  components: { VistContent },
  props: {
    editDsiabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '添加产品',
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    isView: {
      type: Boolean,
      default: false,
    },
    visitInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogRules: {
        type: [{ required: true, message: '请选择客户分类', trigger: 'change' }],
        province: [{ required: true, message: '请选择省市区', trigger: 'change' }],
      },
      activeName: 'first',
      tabList: [],
    }
  },
  computed: {},
  watch: {
    visitInfo: {
      handler(val) {
        const { visit_status, p_code } = val
        if(!this.isView) { // 记录回访
          this.tabList = visitTabList(visit_status + 1, this.isView)
          const nameList = ['first', 'second', 'third', 'fourth']
          this.activeName = nameList[visit_status]
        } else {  // 查看详情
          this.tabList = visitTabList(visit_status, this.isView)
        }
      },
      immediate: true
    },
  },
  mounted() {
   
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
    refreshList() {
      this.$emit('refreshList')
    },
    handleDialogForm() {
      this.$refs.formContent.submitForm()
    },
    tabClick(tab, event) {
      console.log(this.activeName)
      if(this.activeName === 'first') {
        this.$refs.formContent.getFirstVisit()
      } else if(this.activeName === 'second') {
        this.$refs.formContent.get7daysVisit()
      } else if(this.activeName === 'third') {
        this.$refs.formContent.get90daysVisit()
      } else if(this.activeName === 'fourth') {
        this.$refs.formContent.get365daysVisit()
      }
    },
    // 跳转去创建工单
    jumpOrderEdit() {
      // 将本页的信息带到创建工单页，根据产品id去匹配会员信息
      const dialogForm = this.$refs.formContent.dialogForm
      const productUser = this.$refs.formContent.productUser
      const params = {
        dialogForm: dialogForm,
        productUser: productUser
      }
      const { visit_status, p_code } = this.visitInfo
      this.$router.push({
        path: '/worker-order/create',
        query: {
          p_code: p_code, // 带入客户信息、产品信息，用p_code去查询
          user_phone: productUser.phone,
          type: 'jump'
        },
      })
      this.$store.commit('vistJumpSheetCreate', params)
      // this.closeDialog()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}
/deep/.el-dialog--center .el-dialog__body {
  padding: 0;
}
.title {
  h1 {
    font-size: 14px;
    font-weight: 600;
    height: 30px;
    padding: 0 20px;
    &:before {
      content: '';
      display: inline-block;
      height: 20px;
      width: 3px;
      background-color: #3963bc;
      vertical-align: middle;
      margin-right: 15px;
      border-radius: 2px;
    }
  }
}
.huancheng {
  position: absolute;
  vertical-align: middle;
  margin-top: 8px;
  left: 32.5%;
  z-index: 200;
}
/deep/.el-table .cell.el-tooltip {
  white-space: pre-wrap;
}
.completed-visit {
  color: #67c23a;
}
.tab-wrapper {
  position: fixed;
  width: 98%;
  z-index: 200;
  background-color: #fff;
}
</style>
