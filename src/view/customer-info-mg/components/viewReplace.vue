<template>
  <div>
    <el-dialog
      title="换新记录"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogVisible">
      <button type="button" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="closeDialog"></i>
      </button>
      <el-form :model="form">
        <el-form-item label="" label-width="0">
          <el-card class="box-card">
            <p>换新时间：{{form.process_time}}</p>
            <p>{{form.p_code_old}} 换为 {{form.p_code_new}}</p>
          </el-card>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import replaceModel from '@/model/replace-sheets'
export default {
  name: 'viewReplaceDialog',
  components: {
  
  },
  props: {
    p_code: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
        dialogFormVisible: false,
        form: {},
    }
  },
  watch: {
    p_code: {
      handler(val) {
        if(val) {
          this.getReplaceInfo()
        }
      },
      immediate: true
    }
  },
  async created() {
   
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
    async getReplaceInfo() {
      const { code, data, message } = await replaceModel.queryList({p_code_new: this.p_code})
      if (code === 11) {
        this.form = data[0]
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  position: relative;

}
</style>
