<template>
  <div class="container">
    <el-dialog
      :title="title"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      size="small"
      width="900px"
      :visible.sync="dialogVisible"
    >
      <button type="button" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="resetForm"></i>
      </button>
      <el-form :model="dialogForm" :inline="false" label-width="110px" ref="dialogForm" :rules="dialogRules">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item label="账号：" prop="account">
              <span v-if="editDsiabled">{{dialogForm.account}}</span>
              <el-input
                v-else
                v-model="dialogForm.account"
                :disabled="editDsiabled"
                maxlength="50"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="dialogForm.name" maxlength="30" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item label="电话：" prop="phone">
              <el-input v-model="dialogForm.phone" maxlength="11" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item label="角色：" prop="role">
              <!-- role取值为:1超级管理员、2客服 、3经销商 、4只看报表 -->
              <span v-if="editDsiabled">{{dialogForm.roleName}}</span>
              <el-radio-group v-else v-model="dialogForm.role" :disabled="editDsiabled">
                <el-radio :label="2">客服</el-radio>
                <el-radio :label="4">查看报表</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="handleDialogForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Model from '@/model/sys-set'
import { roleType } from 'lin/format/sys-set'
import Utils from 'lin/util/util'
const regPhone = /^1\d{10}$/
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
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogForm: {
        account: '',
        name: '',
        phone: '' ,
        role: ''
      },
      dialogRules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }],
        phone: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入电话'))
              } else {
                const check = regPhone.test(value)
                if (!check) {
                  callback(new Error('请输入正确的号码格式'))
                } else {
                  callback()
                }
              }
            },
          },
        ],
      },
    }
  },
  methods: {
    resetForm() {
      this.$refs.dialogForm.resetFields()
      this.dialogForm = {
        account: '',
        name: '',
        phone: '' ,
        role: ''
      },
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    handleDialogForm() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          let response = {}
          if(!this.editDsiabled) {
            response =  await Model.createAccount(this.dialogForm)
          } else {
            const params = Utils.pick(this.dialogForm,['name', 'phone'])
            response =  await Model.editAccount(this.rowData.id, params)
          }
          const {code, message} = response
          if(code === 11) {
            this.$message.success(message)
            this.resetForm()
            this.$emit('updateUser')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onProvince(val) {
      console.log(val)
      this.dialogForm.province = val.province
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px 30px;
  position: relative;
}
  /deep/.el-form-item  {
    padding-bottom: 20px;
  }
</style>
