// 系统设置相关接口
import _axios, { get, post, patch } from '@/lin/plugin/axios'

class Setting {

  // 获取账号列表
  async getUsers(params) {
    const res = await get('/v1/users', params)
    return res
  }

  // 登录账号
  async login(data) {
    const res = await post('v1/users/login', data)
    return res
  }

  // 开启、关闭账号
  async changeAccount(id, data) {
    const res = await post(`v1/users/${id}/change`, data)
    return res
  }

  // 账户密码重置
  async resetPassword(id) {
    const res = await post(`/v1/users/${id}/password/reset`)
    return res
  }

  // 修改本人账户密码
  async changePassword(data) {
    const res = await post(`/v1/users/password/modify`, data)
    return res
  }

  // 创建账号
  async createAccount(data) {
    const res = await post(`/v1/users`, data)
    return res
  }

  // 编辑账号
  async editAccount(id, data) {
    const res = await patch(`/v1/users/${id}`, data)
    return res
  }

  // 刷新token
  async refreshToken() {
    const res = await get('/v1/users/refresh')
    return res
  }

  // 上传经销商信息
  async handleUploadAgent(file) {
    const res = await post(`/v1/agents`, file)
    return res
  }

  // 上传经销商产品
  async handleUploadAgentProduct(file) {
    const res = await post(`/v1/agents/products`, file)
    return res
  }



}

export default new Setting()
