/**
 * 数据分析图表相关接口
 * **/
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Report {

  // 用户分析图表数据
  async getReportForUsers(params) {
    const res = await get('/v1/reports/users', params)
    return res
  }
  
  // 产品分析图表接口
  async getReportForProducts(params) {
    const res = await get('/v1/reports/products', params)
    return res
  }
}

export default new Report()
