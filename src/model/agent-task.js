// 指派经销商
import _axios, { get, post, patch } from '@/lin/plugin/axios'

class AgentsTask {

  async queryList(params) {
    const res = await get('/v1/agents/task', params)
    return res
  }

  // 获取经销商任务详情
  async getDetail(params) {
    const res = await get('/v1/agents/task/detail', params)
    return res
  }

  // 录入经销商任务详情
  async createTaskDetail(data) {
    const res = await post('/v1/agents/task/detail', data)
    return res
  }


  

}

export default new AgentsTask()
