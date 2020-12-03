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
      <el-form
        :model="dialogForm"
        ref="dialogForm"
        size="small"
        :inline="false"
        label-width="110px"
        :rules="dialogRules"
      >
        <!-- 客服收货 -->
        <template>
          <el-row :gutter="24">
            <div class="title">
              <h1>客服收货</h1>
            </div>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="处理人：" prop="process_by">
                <span v-if="isView || partDisabled">
                  {{Replace.service_id(dialogForm.process_by)}}
                </span>
                <el-select v-else v-model="dialogForm.process_by" :disabled="partDisabled" placeholder="请选择">
                  <el-option v-for="item in serviceList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="处理日期：" prop="process_time">
                <span v-if="isView || partDisabled">{{dateFormat(dialogForm.process_time)}}</span>
                <el-date-picker
                  v-else
                  type="date"
                  v-model="dialogForm.process_time"
                  style="width: 100%;"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="注射器编号：" label-width="120px" prop="p_code_old">
                <span>{{dialogForm.p_code_old}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="产品问题：" prop="defect_type">
                <span v-if="isView || partDisabled">{{Replace.defect_type(dialogForm.defect_type)}}</span>
                <el-select v-else v-model="dialogForm.defect_type" :disabled="partDisabled" placeholder="请选择">
                  <el-option v-for="item in productsIssues" :key="item.code" :label="item.value" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="购买渠道：" prop="buy_channel">
                <span v-if="isView || partDisabled">{{Replace.buy_channel(dialogForm.buy_channel)}}</span>
                <el-select v-else v-model="dialogForm.buy_channel" :disabled="partDisabled" placeholder="请选择">
                  <el-option v-for="item in purChannels" :key="item.code" :label="item.value" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-if="partDisabled">
            <el-col :span="24">
               <el-form-item label="" label-width="10px">
                 <span class="tip-color el-icon-success">已告知用户返厂信息</span>
               </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- 申请换新 -->
        <template>
          <el-row :gutter="24">
            <div class="title">
              <h1>申请换新</h1>
            </div>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="换新编码：" prop="p_code_new">
                <span v-if="isView">{{dialogForm.p_code_new}}</span>
                <el-input v-else v-model="dialogForm.p_code_new" maxlength="50" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- 邮寄信息 -->
        <template>
          <el-row :gutter="24">
            <div class="title">
              <h1>邮寄信息</h1>
            </div>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="收货人：" prop="post_name">
                <span v-if="isView">{{dialogForm.post_name}}</span>
                <el-input v-else v-model="dialogForm.post_name" maxlength="50" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货电话：" prop="post_phone">
                <span v-if="isView">{{dialogForm.post_phone}}</span>
                <el-input v-else v-model="dialogForm.post_phone" maxlength="11" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收货地址：" prop="post_address">
                <span v-if="isView">{{dialogForm.post_address}}</span>
                <el-input v-else v-model="dialogForm.post_address" maxlength="50" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="快递公司：" prop="post_company">
                <span v-if="isView">{{dialogForm.post_company}}</span>
                <el-input v-else v-model="dialogForm.post_company" maxlength="50" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="快递单号：" prop="post_order">
                <span v-if="isView">{{dialogForm.post_order}}</span>
                <el-input v-else v-model="dialogForm.post_order" maxlength="50" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="录入人：" prop="post_by">
                <span v-if="isView">{{Replace.service_id(dialogForm.post_by)}}</span>
                <el-select v-else v-model="dialogForm.post_by" placeholder="请选择">
                  <el-option v-for="item in serviceList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- <el-row :gutter="24">
          <el-col :span="8" v-if="!isView">
            <el-form-item label="短信模板：" prop="type">
              <el-select v-model="dialogForm.type" placeholder="请选择">
                <el-option label="告知模板" value="1" />
                <el-option label="发货模板" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" label-width="0">
              <el-button type="primary" v-if="!showSentTip && !isView" @click="sendSMS">发送</el-button>
              <div class="sent-message" v-if="showSentTip || isView"><i class="el-icon-success"></i>已发送告知短信</div>
            </el-form-item>
          </el-col>
        </el-row> -->
        
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="换新状态：" prop="type">
              <span v-if="isView">{{dialogForm.status === 1 ? '已完成' : '换新中'}}</span>
              <el-select v-else v-model="dialogForm.status" placeholder="请选择">
                <el-option label="换新中" :value="0" />
                <el-option label="已完成" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog"> 关 闭 </el-button>
        <el-button type="primary" @click="handleDialogForm"> 完 成 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dateFormat } from 'lin/util/util'
import { problemData, channelData} from 'lin/format/replace-sheet'
import * as Replace from 'lin/format/replace-sheet'
import Model from '@/model/replace-sheets'
import accountModel from '@/model/sys-set'
import Utils from 'lin/util/util'

export default {
  props: {
    partDisabled: {
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
    ws_code: {
      type: String,
      default: '',
    },
    p_code: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // 获取当前登录人信息和客服列表信息
    ...mapGetters(['user', 'serviceList'])
  },
  data() {
    return {
      dateFormat: dateFormat,
      Replace: Replace,
      dialogForm: {
        process_by: '',
        process_name: '',
        process_time: '',
        p_code_old: '',
        defect_type: '',
        buy_channel: '',
        p_code_new: '',
        post_name: '',
        post_phone: '',
        post_address: '',
        post_company: '',
        post_order: '',
        post_by: '',
        status: '',
      },
      dialogRules: {
        defect_type: [{ required: true, message: '请选择产品问题', trigger: 'change' }],
        buy_channel: [{ required: true, message: '请选择购买渠道', trigger: 'change' }],
      },
      productsIssues: problemData(),
      purChannels: channelData(),
      showSentTip: false,
    }
  },
  watch: {
    p_code: {
      handler(val) {
        if(val) {
          this.dialogForm.p_code_old = val
        }
      },
      immediate: true
    }
  },
  created() {
    // console.log(this.serviceList)
  },
  mounted() {
    this.dialogForm.process_by = this.user.account_id
    this.dialogForm.post_by = this.user.account_id
    this.dialogForm.process_time = dateFormat(new Date().getTime())
  },
  methods: {
    resetForm(formName) {
      this.$refs.dialogForm.resetFields()
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    // 提交表单
    handleDialogForm: Utils.debounce(function() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          try {
            if(this.isEdit) { // 编辑换新单
              await this.editReplace()
            } else {
              await this.createReplace()
            }
          } catch (error){
            console.log(error)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }, 1500, {'leading': true, 'trailing': false}),
    async createReplace() {
      const params = Utils.deepClone(this.dialogForm)
            params.ws_code = this.ws_code
            try {
              const {code, data, message} = await Model.createReplace(params)
              if(code === 11) {
                this.$message.success(message)
                this.closeDialog()
                this.$emit('updateWorkSheet')
              }
            } catch(error) {
              console.log(error)
            }
    },
    // 编辑
    async editReplace() {
      const params = Utils.deepClone(this.dialogForm)
            delete params.process_by
            delete params.process_time
            delete params.p_code_old
            delete params.defect_type
            delete params.buy_channel
            try {
              const {code, data, message} = await Model.editReplace(params.replacesheet_id, params)
              if(code === 11) {
                this.$message.success(message)
                this.closeDialog()
                this.$emit('refreshList')
              }
            } catch (error) {
              console.log(error)
            }
    },
    sendSMS() {
      this.showSentTip = true
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
.sent-message {
  i {
    margin-right: 5px;
    color: #67c23a;
  }
}
.tip-color {
  color: #596c8e;
  font-size:12px;
}
</style>
