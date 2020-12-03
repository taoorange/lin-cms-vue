import * as types from './mutation-type'
import { removeToken } from '@/lin/util/token'
import { rmLKEY, rmKEY } from '../lin/util/storage'
import accountModel from '@/model/sys-set'

export default {
  setUserAndState({ commit }, user) {
    // 如果登陆成功，设置logined标志位
    commit(types.SET_LOGINED, true)
    // 设置全局用户状态
    commit(types.SET_USER, user)
  },

  loginOut({ commit }) {
    removeToken()

    rmKEY('Qpagination')
    rmLKEY('vuex')
    commit(types.REMOVE_LOGINED, false) // 清除登陆标记，路由会进行拦截然后跳转到登录页
    // 断开websocket连接
    if(window.UdeskCCPaasApiClassInstance) {
      window.UdeskCCPaasApiClassInstance.Destroy()
    }
  },

  readMessage({ commit }, message) {
    commit(types.REMOVE_UNREAD_MESSAGE, message.id)
    commit(types.ADD_READED_MESSAGE, message)
  },

  async setService({ commit }) {
    try {
      const { code, data, message } = await accountModel.getUsers()
      if (code === 11) {
        let serviceList = []
        data.forEach(item => {
          if (item.role === 1 || item.role === 2) {
            serviceList.push(item)
          }
        })
        commit(types.SET_SERVICE_LIST, serviceList)
      } else {
        commit(types.SET_SERVICE_LIST, [])
      }
    } catch (error) {
      console.log(error)
    }
  },
}
