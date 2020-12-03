import _axios, { get, post, patch } from '@/lin/plugin/axios'

class Visit {
  
  // 回访列表
  async queryList(params) {
    const res = await get('/v1/visit/users', params)
    return res
  }
  /**
   * 首次回访接口 8个
   * 
   * **/
  // 获取首次回访有针使用信息
  async getFirstVisitNeedleInfo(user_id) {
    const res = await get(`/v1/visit/first/needle/${user_id}`)
    return res
  }

  // 修改首次回访有针使用信息
  async modifyFirstVisitNeedleInfo(data) {
    const res = await post('/v1/visit/first/needle', data)
    return res
  }

  // 获取首次回访使用情况信息
  async getFirstVisitSituation(user_id) {
    const res = await get(`/v1/visit/first/situation/${user_id}`)
    return res
  }

  // 修改首次回访使用情况信息
  async modifyFirstVisitSituation(params) {
    const res = await post('/v1/visit/first/situation', params)
    return res
  }

  // 获取首次回访无针注射信息
  async getFirstVisitInjectInfo(user_id) {
    const res = await get(`/v1/visit/first/inject_info/${user_id}`)
    return res
  }

  // 修改首次回访无针注射信息
  async modifyFirstVisitInjectInfo(data) {
    const res = await post('/v1/visit/first/inject_info', data)
    return res
  }

  // 获取首次回访使用问题
  async getFirstVisitQuestion(user_id) {
    const res = await get(`/v1/visit/first/use_question/${user_id}`)
    return res
  }

  // 修改首次回访使用问题
  async modifyFirstVisitQuestion(data) {
    const res = await post('/v1/visit/first/use_question', data)
    return res
  }
  /**
   * 7天接口
   * get7VisitInjectInfo
   * modify7VisitInjectInfo
   * get7VisitBloodInfo
   * modify7VisitBloodInfo
   * get7VisitQuestion
   * modify7VisitQuestion
   * ***/

  // 获取7天回访注射信息
  async get7VisitInjectInfo(user_id) {
    const res = await get(`/v1/visit/7/inject_info/${user_id}`)
    return res
  }

  // 修改7天回访注射信息
  async modify7VisitInjectInfo(data) {
    const res = await post('/v1/visit/7/inject_info', data)
    return res
  }

  // 获取7天回访血糖信息
  async get7VisitBloodInfo(user_id) {
    const res = await get(`/v1/visit/7/blood_info/${user_id}`)
    return res
  }

  // 修改7天回访血糖信息
  async modify7VisitBloodInfo(data) {
    const res = await post('/v1/visit/7/blood_info', data)
    return res
  }

  // 获取7天回访使用问题
  async get7VisitQuestion(user_id) {
    const res = await get(`/v1/visit/7/use_question/${user_id}`)
    return res
  }

  // 修改7天回访使用问题
  async modify7VisitQuestion(data) {
    const res = await post('/v1/visit/7/use_question', data)
    return res
  }

  /**
   * 90天回访接口 6个
   * **/

  // 获取90天回访注射信息
  async get90VisitInjectInfo(user_id) {
        
    const res = await get(`/v1/visit/90/inject_info/${user_id}`)
    return res
  }

  // 修改90天回访注射信息
  async modify90VisitInjectInfo(data) {
    const res = await post('/v1/visit/90/inject_info', data)
    return res
  }

  // 获取90天回访血糖信息
  async get90VisitBloodInfo(user_id) {
    const res = await get(`/v1/visit/90/blood_info/${user_id}`)
    return res
  }

  // 修改90天回访血糖信息
  async modify90VisitBloodInfo(data) {
    const res = await post('/v1/visit/90/blood_info', data)
    return res
  }

  // 获取90天回访使用问题
  async get90VisitQuestion(user_id) {
    const res = await get(`/v1/visit/90/use_question/${user_id}`)
    return res
  }

  // 修改90天回访使用问题
  async modify90VisitQuestion(data) {
    const res = await post('/v1/visit/90/use_question', data)
    return res
  }

  /**
   * 1年接口 6个
   * **/

  // 获取365天回访注射信息
  async get365VisitInjectInfo(user_id) {
    const res = await get(`/v1/visit/365/inject_info/${user_id}`)
    return res
  }

  // 修改365天回访注射信息
  async modify365VisitInjectInfo(data) {
    const res = await post('/v1/visit/365/inject_info', data)
    return res
  }

  // 获取1年回访血糖信息
  async get365VisitBloodInfo(user_id) {
    const res = await get(`/v1/visit/365/blood_info/${user_id}`)
    return res
  }

  // 修改1年回访血糖信息
  async modify365VisitBloodInfo(data) {
    const res = await post('/v1/visit/365/blood_info', data)
    return res
  }

  // 获取1年回访使用问题
  async get365VisitQuestion(user_id) {
    const res = await get(`/v1/visit/365/use_question/${user_id}`)
    return res
  }

  // 修改1年回访使用问题
  async modify365VisitQuestion(data) {
    const res = await post('/v1/visit/365/use_question', data)
    return res
  }

}

export default new Visit()
