/* eslint-disable class-methods-use-this */
import _axios, { get, post, patch } from '@/lin/plugin/axios'

class Customer {

  // 创建客户
  async createClient(data) {
    return _axios({
      method: 'post',
      url: '/v1/clients/create_one',
      data,
      handleError: true,
    })
  }

  // 编辑客户
  async editClient(data) {
    const res = await patch(`/v1/clients/modify`, data)
    return res
  }

  // 获取客户列表
  async queryList(params) {
    const res = await get('/v1/clients', params)
    return res
  }

  // 获取客户信息
  async getInfo(data) {
    return _axios({
      method: 'post',
      url: '/v1/clients/client_info',
      data,
      handleError: true,
    })
    // const res = await post('/v1/clients/client_info', data)
    // return res
  }

  // 获取客户的产品列表
  async getProduct(client_id, params) {
    const res = await get(`/v1/clients/${client_id}/products`, params)
    return res
  }

  // 获取客户工单
  async getWorkSheet(client_id) {
    const res = await get(`/v1/worksheets/${client_id}`)
    return res
  }

  // 添加产品使用人
  async addProduct(id, data) {
    const res = await post(`/v1/clients/${id}/products/add`, data)
    return res
  }

  // 编辑产品使用人
  async editProduct(pid, data) {
    const res = await patch(`/v1/clients/products/${pid}`, data)
    return res
  }

  // 编辑产品
  async productEdit(client_id, p_id, data) {
    const res = await patch(`/v1/clients/${client_id}/products/${p_id}`, data)
    return res
  }

  // 查询产品使用人
  async getProductUser(params) {
    return _axios({
      method: 'post',
      url: '/v1/clients/product_user',
      params,
      handleError: true,
    })
  }


}

export default new Customer()
