import _axios, { get, post, patch } from '@/lin/plugin/axios'

class ReplaceSheet {

  // 获取列表
  async queryList(params) {
    const res = await get('/v1/replacesheets', params)
    return res
  }

  // 创建换新单
  async createReplace(data) {
    const res = await post('/v1/replacesheets', data)
    return res
  }
  
  // 编辑换新单
  async editReplace(id, data) {
    const res = await patch(`/v1/replacesheets/${id}`, data)
    return res
  }

  // 获取换新单详情
  async getDetail(id) {
    const res = await get(`/v1/replacesheets/${id}/detail`)
    return res
  }



}

export default new ReplaceSheet()
