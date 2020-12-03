// 经销商产品服务信息
import _axios, { get, post, patch } from '@/lin/plugin/axios'

class Agents {

  // 获取经销商列表
  async queryList(params) {
    const res = await get('v1/agents', params)
    return res
  }

  // 获取经销商服务信息
  async queryServiceList(params) {
    const res = await get('v1/agents/products/service', params)
    return res
  }

  // 通过p_code查询经销商信息
  async getAgentInfo(params) {
    const res = await get('v1/agents/query', params)
    return res
  }
  

}

export default new Agents()
