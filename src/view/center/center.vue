<template>
  <div class="container">
    <div class="title">个人中心</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <div class="password">
            <div class="title">修改密码</div>
            <el-form
              :model="form"
              status-icon
              :rules="rules"
              label-position="left"
              ref="form"
              size="small"
              label-width="90px"
              @submit.native.prevent
            >
              <el-form-item label="原始密码" prop="old_password">
                <el-input type="password" v-model="form.old_password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="new_password">
                <el-input type="password" v-model="form.new_password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirm_password" label-position="top">
                <el-input type="password" v-model="form.confirm_password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('form')">保存</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Vue from 'vue'
import Model from '@/model/sys-set'
import 'vue-croppa/dist/vue-croppa.css'
import defaultAvatar from '@/assets/image/user/user.png'

export default {
  name: 'center',
  components: {},
  data() {
    const oldPassword = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('原始密码不能为空'))
      }
      if (value.length < 6) {
        callback(new Error('密码长度不能少于6位数'))
      }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位数'))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.form.validateField('confirm_password')
        }
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      username: null,
      form: {
        old_password: '',
        new_password: '',
        confirm_password: '',
      },
      rules: {
        old_password: [{ validator: oldPassword, trigger: 'blur', required: true }],
        new_password: [{ validator: validatePassword, trigger: 'blur', required: true }],
        confirm_password: [{ validator: validatePassword2, trigger: 'blur', required: true }],
      },
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  watch: {
   
  },
  created() {
    
  },
  methods: {
    submitForm(formName) {
      if (this.form.old_password === '' && this.form.new_password === '' && this.form.confirm_password === '') {
        this.dialogFormVisible = false
        return
      }
      if (this.form.old_password === this.form.new_password) {
        this.$message.error('新密码不能与原始密码一样')
        return
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { old_password, new_password } = this.form
          const params = {
            oldpassword: old_password,
            newpassword: new_password
          }
          const { code, message } = await Model.changePassword(params)
          if (code === 11) {
           this.$message.success(message)
           this.resetForm('form')
          }
        } else {
          console.log('error submit!!')
          this.$message.error('请填写正确的信息')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 20px;
    max-width: 800px;
    .user {
      padding: 0px 20px 25px 30px;
      z-index: 100;
      position: relative;
      border-bottom: 1px solid #dae1ec;
      .title {
        font-weight: bold;
        font-size: 16px;
        color: #3a3a3a;
        text-indent: 0px;
        border: none;
      }
      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name-wrapper {
          display: flex;
          align-items: center;
          .label {
            margin-right: 20px;
            color: #333;
            font-weight: bold;
            font-size: 14px;
          }
          .name {
            font-weight: 500;
          }
        }
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          cursor: pointer;
          overflow: hidden;
          position: relative;

          .mask {
            opacity: 0;
            transition: all 0.2s;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: white;

            input {
              display: none;
            }
          }

          &:hover {
            .mask {
              opacity: 1;
            }
          }
        }

        .text {
          margin-left: 20px;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .username {
            margin-bottom: 10px;
            font-size: 16px;
            cursor: pointer;
          }

          .desc {
            font-size: 14px;
            color: rgba(222, 226, 230, 1);
          }
        }

        .info {
          position: absolute;
          bottom: 10px;
          right: 10px;
          display: flex;
          color: #fff;
          font-size: 14px;
          height: 20px;
          line-height: 20px;

          .mid {
            padding: 0 5px;
          }
        }
      }
    }
    .password {
      padding: 25px 20px 25px 30px;
      .title {
        color: #3a3a3a;
        font-weight: bold;
        font-size: 16px;
        text-indent: 0px;
        margin-bottom: 20px;
        border: none;
      }
    }
  }
}
</style>
