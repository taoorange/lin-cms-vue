<template>
  <div class="container">
    <el-dialog
      :title="title"
      center
      @close="resetForm"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      width="600px"
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
          <el-col :span="24">
            <el-form-item label="产品问题：" prop="defect_type">
              <el-select v-model="dialogForm.defect_type" placeholder="请选择">
                <el-option v-for="item in productsIssues" :key="item.code" :label="item.value" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm"> 关 闭 </el-button>
        <el-button type="primary" @click="handleDialogForm"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MapSelect from '@/component/base/province-select'
import { problemData } from 'lin/format/replace-sheet'
import Model from '@/model/agent-replace'
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
    replaceId: {
      type: [String, Number],
      default: '',
    }
  },
  data() {
    return {
      dialogForm: {
        defect_type: '',
      },
      dialogRules: {
        defect_type: [{ required: true, message: '请选择产品问题', trigger: 'change' }],
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
      this.$refs.dialogForm.resetFields()
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    handleDialogForm() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          try {
            const {code, message} = await Model.changeDetectType(this.replaceId, this.dialogForm)
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
      console.log(val)
      this.dialogForm.province = val.province
    },
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
