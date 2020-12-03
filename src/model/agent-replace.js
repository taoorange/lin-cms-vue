// 经销商换新接口
import _axios, { get, post, patch } from '@/lin/plugin/axios'

class AgentReplace {

  async queryList(params) {
    const res = await get('/v1/replacesheets/agent', params)
    return res
  }

  // 修改经销商记录的产品问题
  async changeDetectType(id, data) {
    const res = await patch(`/v1/replacesheets/agent/${id}`, data)
    return res
  }

  // 创建换新记录
  async createReplace(data) {
    const res = await post('/v1/replacesheets/agent', data)
    return res
  }

  // 经销商上传换新列表
  async agentUploadReplace(file) {
    const res = await post('/v1/replacesheets/agent/import', file)
    return res
  }

  // 通过p_code查询经销商信息
  async getAgentInfo(params) {
    const res = await get('v1/agents/query', params)
    return res
  }

  

}

export default new AgentReplace()
