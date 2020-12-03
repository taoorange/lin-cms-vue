<template>
  <div class="container">
    <el-dialog
      :title="title"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      width="900px"
      :visible.sync="dialogVisible"
    >
      <button type="button" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="closeDialog"></i>
      </button>
      <add-content
        ref="dialogFormContent"
        :agent="agent"
        :dialogForm="dialogForm"
        :records="records"
        :editDsiabled="editDsiabled"
        :dialogRules="dialogRules"
        :isView="isView"
        @closeDialog="closeDialog"
        @updateWSTYPE2="updateWSTYPE2"
        @updateList="updateList"
        @onProvince="onProvince"
        @onCity="onCity"
        @onCounty="onCounty"
        :updateProvince="updateProvince"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog"> 关 闭 </el-button>
        <el-button v-if="!editDsiabled" type="primary" @click="handleDialogForm"> 创 建 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MapSelect from '@/component/base/province-select'
import LinTable from '@/component/base/table/lin-table'
import AddContent from './add-content'
import modelCustomer from '@/model/customer'
export default {
  components: {
    MapSelect,
    LinTable,
    AddContent,
  },
  props: {
    editDsiabled: {
      type: Boolean,
      default: false,
    },
    isView: {
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
    rowData: {
      type: Object,
      default: () => {},
    },
    agent: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogForm: {
        name: '',
        sex: '',
        age: '',
        phone: '',
        relation: '',
        province: '',
        city: '',
        district: '',
        address: '',
        ws_type1: '',
        ws_type2: '',
        p_code: '',
        seviced_by: '',
        service_time: '',
        question: '',
        task_status: '',
        treatment: '',
      },
      records: {},
      dialogRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        seviced_by: [{ required: true, message: '请输入服务人员姓名', trigger: 'blur' }],
        type: [{ required: true, message: '请选择客户分类', trigger: 'change' }],
        province: [{ required: true, message: '请选择省市区', trigger: 'change' }],
        question: [{ required: true, message: '请输入问题', trigger: 'blur' }],
        treatment: [{ required: true, message: '请输入结果描述', trigger: 'blur' }],
        service_time: [{ required: true, message: '请选择上门时间', trigger: 'blur' }],
        task_status: [{ required: true, message: '请选择是否解决', trigger: 'change' }],
      },
      updateProvince: false
    }
  },
  computed: {},
  watch: {
    agent(val) {
      if (Object.keys(val).length) {
        const {p_code, ws_type1, ws_type2} = val
        if (p_code) {
          this.dialogForm.p_code = p_code
          this.dialogForm.ws_type1 = ws_type1
          this.dialogForm.ws_type2 = ws_type2
          if(! this.isView) {
            this.getUserInfo(p_code)
          }
        }
      }
    },
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
      this.resetForm()
    },
    updateList() {
      this.$emit('updateList')
    },
    resetForm() {
      Object.keys(this.dialogForm).forEach(key => {
        this.dialogForm[key] = ''
      })
    },
    // 提交表单
    handleDialogForm() {
      this.$refs.dialogFormContent.submitForm()
    },
    onProvince(val) {
      this.dialogForm.province = val.province
    },
    onCity(val) {
      this.dialogForm.city = val.city
    },
    onCounty(val) {
      this.dialogForm.district = val.county
    },
    // 查询客户信息
    async getClientInfo(p_code) {
      try {
        const { code, data } = await modelCustomer.getInfo({p_code: p_code})
        if(code === 11) {
          this.dialogForm.name = data.client_name
          this.dialogForm.sex = data.sex
          this.dialogForm.age = data.age
          this.dialogForm.phone = data.phone
          this.dialogForm.province = data.province
          this.dialogForm.city = data.city
          this.dialogForm.district = data.district
          this.dialogForm.address = data.address
          this.updateProvince = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 查询产品使用人信息
    async getUserInfo(p_code) {
      try {
        const { code, data } = await modelCustomer.getProductUser({p_code: p_code})
        if(code === 11) {
          this.dialogForm.name = data.name
          this.dialogForm.sex = data.sex
          this.dialogForm.age = data.age
          this.dialogForm.phone = data.phone
          this.dialogForm.relation = data.relation
          this.dialogForm.province = data.province
          this.dialogForm.city = data.city
          this.dialogForm.district = data.district
          this.dialogForm.address = data.address
          this.updateProvince = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    updateWSTYPE2(val) {
      this.dialogForm.ws_type2 = val
    }
  },
}
</script>

<style lang="scss" scoped>
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
</style>
