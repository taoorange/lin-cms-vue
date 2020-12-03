import { setKEY, setLKEY } from 'lin/util/storage'
import * as types from './mutation-type'

export default {
  [types.SET_LOGINED](state) {
    state.logined = true
  },

  [types.REMOVE_LOGINED](state) {
    state.logined = false
    state.user = null
  },
  // 将登录信息存储在本地
  [types.SET_USER](state, payload) {
    state.user = payload
  },

  [types.ADD_READED_MESSAGE](state, payload) {
    state.readedMessages.push(payload)
  },

  [types.ADD_UNREAD_MESSAGE](state, payload) {
    state.unreadMessages.push(payload)
  },

  [types.REMOVE_UNREAD_MESSAGE](state, payload) {
    const { unreadMessages } = state
    const index = unreadMessages.findIndex(el => el.id === payload)
    unreadMessages.splice(index, 1)
  },
  [types.SET_USER_PERMISSIONS](state, permissions) {
    // const _permissions = []
    // for (let i = 0; i < permissions.length; i++) {
    //   for (const key in permissions[i]) {
    //     for (let j = 0; j < permissions[i][key].length; j++) {
    //       _permissions.push(permissions[i][key][j].permission)
    //     }
    //   }
    // }
    state.permissions = permissions
  },

  [types.SET_REFERSH_OPTION](state, option) {
    state.refreshOptions = option
  },
  // 设置客服列表信息
  [types.SET_SERVICE_LIST](state, option) {
    state.serviceList = option
    // setLKEY('QServiceList', option)
  },

  // 储存来电用户信息
  storeCallUser(state, option) {
    state.callUserInfo = option
    // setLKEY('callUserInfo', option)
  },

  // 储存
  vistJumpSheetCreate(state, option) {
    state.vistJumpSheetCreateInfo = option
    setKEY('vistJumpSheetCreateInfo', option)
  }
  
}
