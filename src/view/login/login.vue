<template>
  <div class="login">
    <div class="box-wrapper">
      <div class="logo-wrapper">
        <img src="static/img/logo.png" alt="" />
      </div>
      <div class="form-box" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
        <div class="title"><h1 title="Lin">快舒尔客服系统</h1></div>
        <form class="login-form" autocomplete="off" @submit.prevent="throttleLogin()">
          <div class="form-item nickname">
            <input type="text" v-model="form.account" autocomplete="off" placeholder="用户名" />
          </div>
          <div class="form-item password">
            <input type="password" v-model="form.password" autocomplete="off" placeholder="密码" />
          </div>
          <button class="submit-btn" type="submit">登 录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import User from '@/lin/model/user'
import Utils from '@/lin/util/util'

export default {
  name: 'login',
  data() {
    return {
      loading: false, // 加载动画
      wait: 2000, // 2000ms之内不能重复发起请求
      throttleLogin: null, // 节流登录
      form: {
        account: '',
        password: '',
      },
    }
  },
  methods: {
    ...mapActions(['setUserAndState', 'setService']),
    ...mapMutations({
      setUserPermissions: 'SET_USER_PERMISSIONS',
    }),
    async login() {
      const { account, password } = this.form
      this.loading = true
      try {
        // 登录接口
        const { code, data, message } =  await User.getToken(account, password)
        // role取值为:1超级管理员；2客服；3经销商 ；4只看报表
        if( code === 11) {
          await this.setUserAndState(data)
          await this.setPermission(data)
          await this.jumpHomePage(data)
        } else {
          this.$message.error(message)
        }
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    },
    // 登录成功设置角色权限信息
    setPermission(data) {
      try {
        const { role } = data
        const roleList = ['超级管理员','客服', '经销商','查看报表']
        const roleName = roleList[(role - 1)]
        // 设置登录权限
        this.setUserPermissions([roleName])
      } catch (error) {
        console.log(error)
      }
    },
    // 根据四种角色跳转不同的首页
    jumpHomePage(data) {
      const { role } = data
      if(role === 1 || role === 2) {
        this.$router.push('/customer/list')
        this.setService()  // 获取客服列表
      } else if(role === 3) {
        this.$router.push('/agent-renewal/list')
      } else if(role === 4) {
        this.$router.push('/view-report/user')
      }
    }
  },
  created() {
    // 节流登录
    this.throttleLogin = Utils.throttle(this.login, this.wait)
  },
  components: {},
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background: #fff url('../../assets/image/login/login-ba.jpg') no-repeat center center;
  background-size: 100% 100%;
  .box-wrapper {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.12);
    .logo-wrapper {
      width: 200px;
      position: absolute;
      left: 10%;
      top: 10%;
    }
    .form-box {
      position: fixed;
      left: 20%;
      top: 50%;
      transform: translateY(-50%);
      width: 350px;
      .title {
        height: 37px;
        font-size: 28px;
        line-height: 37px;
        margin-bottom: 15%;
        h1 {
          text-align: center;
          box-sizing: border-box;
          color: #666666;
        }
      }

      .login-form {
        width: 100%;
        .form-item {
          width: 100%;
          height: 40px;
          background-color: #fff;
          border-radius: 8px;
          box-sizing: border-box;
          margin-bottom: 34px;
          // box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
          input {
            width: 100%;
            height: 100%;
            background: transparent;
            color: #000;
            font-size: 14px;
            padding-left: 30px;
            box-sizing: border-box;
            &::-webkit-input-placeholder {
              font-family: PingFangSC-Light, PingFang SC;
              color: #666;
              font-size: 13px;
              font-weight: 300;
            }
          }
        }

        // .form-item.nickname {
        //   background: url('../../assets/image/login/nickname.png') no-repeat;
        //   background-size: 100% auto;
        //   background-position: left bottom;
        // }

        // .form-item.password {
        //   background: url('../../assets/image/login/password.png') no-repeat;
        //   background-size: 100% auto;
        //   background-position: left bottom;
        // }

        .submit-btn {
          width: 100%;
          height: 46px;
          color: #fff;
          font-size: 18px;
          font-weight: 500;
          text-align: center;
          box-sizing: border-box;
          padding: 0 10px;
          border: none;
          background: #5974ca;
          // box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
