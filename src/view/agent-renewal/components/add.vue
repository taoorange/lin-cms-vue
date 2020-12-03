<template>
  <div class="container">
    <el-dialog
      :title="title"
      center
      @close="resetForm"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      width="900px"
      :visible.sync="dialogVisible"
    >
      <button type="button" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="closeDialog"></i>
      </button>
      <el-form
        :model="dialogForm"
        size="small"
        :inline="false"
        label-width="120px"
        ref="dialogForm"
        :rules="dialogRules"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="旧产品编码：" prop="p_code_old">
              <el-input v-model="dialogForm.p_code_old" @input="inputOldCode" maxlength="50" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <span class="huancheng">换成</span>
            <el-form-item label="" label-width="20px" prop="p_code_new">
              <el-input v-model="dialogForm.p_code_new" maxlength="50" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="dialogForm.name" maxlength="50" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话：" prop="phone">
              <el-input v-model="dialogForm.phone" maxlength="11" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="性别：">
              <el-radio-group v-model="dialogForm.sex">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄：">
              <el-input v-model="dialogForm.age" maxlength="50" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="省市区：">
              <map-select ref="selectMap" @onProvince="onProvince" @onCity="onCity" @onCounty="onCounty"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="产品问题：">
              <el-select v-model="dialogForm.defect_type" disabled placeholder="请选择">
                <el-option v-for="item in productsIssues" :key="item.code" :label="item.value" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item label="备注：">
              <el-input
                type="textarea"
                v-model="dialogForm.remark"
                :maxlength="350"
                :show-word-limit="true"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm"> 关 闭 </el-button>
        <el-button type="primary" @click="handleDialogForm"> 保 存 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MapSelect from '@/component/base/province-select'
import Model from '@/model/agent-replace'
import modelCustomer from '@/model/customer'
import { problemData, channelData } from 'lin/format/replace-sheet'
export default {
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
    rowData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      haveNoCode: false,
      dialogForm: {
        p_code_old: '',
        p_code_new: '',
        name: '',
        phone: '',
        sex: '',
        age: '',
        province: '',
        city: '',
        district: '',
        defect_type: 0,
        remark: ''
      },
      dialogRules: {
        p_code_old: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入旧产品编码'))
              }else if(this.haveNoCode) {
                callback(new Error('产品编号不存在'))
              } else {
                callback()
              }
            },
          }
        ],
        // p_code_old: [{ required: true, message: '请输入旧产品编码', trigger: 'change' }],
        p_code_new: [{ required: true, message: '请输入新产品编码', trigger: 'change' }],
        type: [{ required: true, message: '请选择客户分类', trigger: 'change' }],
        province: [{ required: true, message: '请选择省市区', trigger: 'change' }],
      },
      productsIssues: problemData(),
      matchSuccess: false,
      matchError: false,
    }
  },
  computed: {},
  watch: {
    rowData(val) {
      if (Object.keys(val.row).length) {
        this.dialogForm = val.row
      }
    },
  },
  components: {
    MapSelect,
  },
  methods: {
    resetForm(formName) {
      this.$refs['dialogForm'].resetFields()
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    handleDialogForm() {
      this.$refs['dialogForm'].validate(async valid => {
        if (valid) {
          try {
            const {code, message} = await Model.createReplace(this.dialogForm)
            if(code === 11) {
              this.$message.success(message)
              this.$emit('updateList')
              this.closeDialog()
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
    async inputOldCode(p_code) {
      await this.getAgentInfo(p_code)
    },
    // 通过p_code获取经销商信息
    async getAgentInfo(p_code) {
      try {
        const { code, data } = await Model.getAgentInfo({ p_code: p_code })
        if(code === 11) {
          this.haveNoCode = false
          await this.getProductUser(p_code)
        } else {
          this.haveNoCode = true
          const data = {
            name: '',
            phone: '',
            sex: '',
            age: '',
            province: '',
            city: '',
            district: '',
            user_id: '',
          }
          this.updateForm(data)
        }
      }catch(error) {
        this.haveNoCode = true
         console.log(error)
      }
    },
    async getProductUser(p_code) {
      try {
        const { code, data } = await modelCustomer.getProductUser({ p_code: p_code })
        if(code === 11) {
          this.updateForm(data)
        }
      }catch(error) {
        console.log(error)
      }
    },
    updateForm(data) {
      this.dialogForm.name = data.name || ''
      this.dialogForm.phone = data.phone || ''
      this.dialogForm.sex = data.sex || ''
      this.dialogForm.age = data.age || ''
      this.dialogForm.province = data.province || ''
      this.dialogForm.city = data.city || ''
      this.dialogForm.district = data.district || ''
      this.dialogForm.user_id = data.user_id || ''
      const provinceData = {
         province:data.province  || '',
         city:data.city  || '',
         county:data.district  || ''
      }
      this.$refs.selectMap.map = provinceData
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
</style>
