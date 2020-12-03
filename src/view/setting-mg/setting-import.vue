<template>
  <div class="lin-container">
    <el-form ref="ruleForm" size="medium" label-width="140px" class="demo-ruleForm">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="导入经销商信息：">
            <el-upload
              class="upload-demo"
              action="#"
              :headers="authData"
              :show-file-list="false"
              :http-request="handleUploadAgent"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            >
              <el-button size="medium" type="primary"> 
                {{uploadingAgent ? '上传中' : '导入'}}
              </el-button>
            </el-upload>
            <div class="progress-bar" v-show="uploadingAgent">
              <el-progress :percentage="uploadingPercent"></el-progress>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="导入产品信息：">
            <el-upload
              class="upload-demo"
              action="#"
              :show-file-list="false"
              :headers="authData"
              :http-request="handleUploadAgentProduct"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            >
              <el-button size="medium" type="primary"> 导 入 </el-button>
            </el-upload>
            <div class="progress-bar" v-show="uploadingAgentProduct">
              <el-progress :percentage="uploadingPercent"></el-progress>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getToken, saveAccessToken, saveTokens } from '@/lin/util/token'
import Model from '@/model/sys-set'
import _axios from '@/lin/plugin/axios'
export default {
  components: {},
  data() {
    return {
      uploadingAgent: false,
      uploadingAgentProduct: false,
      fileList: [ ],
      authData: {
        Authorization: getToken('access_token'),
      },
      uploadingPercent: 0
    }
  },
  methods: {
    // 上传之前，限制文件格式和文件大小
    beforeUpload(file) {
      console.log(file.type)
      const isXLS = file.type === 'application/vnd.ms-excel'
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isLt2M = file.size / 1024 / 1024 < 2
      const isFormat = isXLS || isXLSX

      if (!isFormat) {
        this.$message.error('上传文件只能是 xls或xlsx 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isFormat && isLt2M
    },
    // 上传经销商信息
    async handleUploadAgent(file) {
      const self = this
      this.uploadingAgent = true
      const formData = new FormData();
      formData.append("file", file.file);
      try {
        // const {code, message} = await Model.handleUploadAgent(formData)
        // if(code === 11) {
        //   this.$message.success(message)
        // } else {
        //   this.$message.error(message)
        // }
        _axios({
          method: 'post',
          url: '/v1/agents',
          data: formData,
          onUploadProgress: function (progressEvent) {
            let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
            self.uploadingPercent = complete
          },
        }).then( ({code, message}) => {
          self.uploadingAgent = false
          console.log(code)
          if(code === 11) {
            this.$message.success(message)
          } else {
            this.$message.error(message)
          }
        }).catch(err => {
           self.uploadingAgent = false
        })
      } catch(error) {
        console.log(error)
      }
      
    },
    // 上传经销商产品信息
    async handleUploadAgentProduct(file) {
      const self = this
      const formData = new FormData();
      formData.append("file", file.file);
      this.uploadingAgentProduct = true
      try {
        // const {code, message} = await Model.handleUploadAgentProduct(formData)
        // if(code === 11) {
        //   this.$message.success(message)
        // } else {
        //   this.$message.error(message)
        // }
        _axios({
          method: 'post',
          url: '/v1/agents/products',
          data: formData,
          onUploadProgress: function (progressEvent) {
            let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
            self.uploadingPercent = complete
          },
        }).then( ({code, message}) => {
          self.uploadingAgentProduct = false
          if(code === 11) {
            this.$message.success(message)
          } else {
            this.$message.error(message)
          }
        }).catch(err => {
           self.uploadingAgentProduct = false
        })
      } catch(error) {
        console.log(error)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.lin-container {
  padding: 20px 30px;
  position: relative;
  .progress-bar {
    width: 300px;
  }
}
</style>
