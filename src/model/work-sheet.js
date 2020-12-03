// 工单相关接口
import _axios, { get, post, patch } from '@/lin/plugin/axios'

class WorkSheet {

  // 获取列表
  async queryList(params) {
    const res = await get('/v1/worksheets', params)
    return res
  }

  // 创建工单
  async createSheet(data) {
    const res = await post('/v1/worksheets', data)
    return res
  }

  // 创建工单
  async editSheet(ws_id, data) {
    const res = await patch(`/v1/worksheets/${ws_id}`, data)
    return res
  }

  // 获取工单详情
  async getSheetDetail(ws_id) {
    const res = await get(`/v1/worksheets/${ws_id}/detail`)
    return res
  }

  // 修改使用人注射信息
  async updateInjectInfo(data) {
    const res = await post('/v1/worksheets/inject_info', data)
    return res
  }

  // 获取使用人注射信息（工单相关联）
  async getInjectInfo(user_id) {
    const res = await get(`/v1/worksheets/inject_info/${user_id}`)
    return res
  }

  // 修改使用人血糖信息
  async updateBloodInfo(data) {
    const res = await post('/v1/worksheets/blood_info', data)
    return res
  }

   // 获取使用人血糖信息（工单相关联）
   async getBloodInfo(user_id) {
    const res = await get(`/v1/worksheets/blood_info/${user_id}`)
    return res
  }

  // 修改使用人用药及并发症信息
  async updateComplication(data) {
    const res = await post('/v1/worksheets/complication_info', data)
    return res
  }

  // 获取使用人用药及并发症信息
  async getComplication(user_id) {
    const res = await get(`/v1/worksheets/complication_info/${user_id}`)
    return res
  }

  // 修改使用人产品使用问题信息（工单相关联）
  async updateProductProblems(data) {
    const res = await post(`/v1/worksheets/use_info`, data)
    return res
  }

  // 获取使用人产品使用问题信息（工单相关联）
  async getProductProblems(user_id) {
    const res = await get(`/v1/worksheets/use_info/${user_id}`)
    return res
  }

  // 回访信息
  async getVisitList(params) {
    const res = await get('/v1/visit/users', params)
    return res
  }

  // 通过p_code查询经销商信息
  async getAgentFormPCode(params) {
    const res = await get('v1/agents/query', params)
    return res
  }
  
  // 通过p_code查询经销商信息
  async getAgentInfo(params) {
    const res = await get('v1/agents/query', params)
    return res
  }
  

}

export default new WorkSheet()
