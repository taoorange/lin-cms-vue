import { getKEY } from 'lin/util/storage'
import store from '@/store'
const serviceList = store._vm.serviceList || getKEY('QServiceList')


// 渠道数据
export function channelData(isShowAll) {
  const arr = [
    { value: '京东', code: 0 },
    { value: '京东自营', code: 1 },
    { value: '天猫', code: 2 },
    { value: 'OTC', code: 3 },
    { value: '医院', code: 4 },
  ]
  if(isShowAll) {
    arr.unshift({ value: '全部', code: '' })
  }
  return arr
}

// 格式化渠道数据
export function buy_channel(type) {
  switch(type) {
    case 0:
      return '京东';
    case 1:
      return '京东自营';
    case 2:
      return '天猫';
    case 3:
      return 'OTC';
    case 4:
      return '医院';
    default:
      return ''
  }
}

// 用户来源
export function customerSourceData() {
  const data = [
    { value: '全部', code: '' },
    { value: '产品注册', code: 0 },
    { value: '客服记录', code: 1 },
    { value: '经销商提供', code: 2 },
    { value: '其他', code: 3 },
  ]
  return data
}
// 格式化用户来源
export function f_customerSource(type) {
  switch(type) {
    case 0:
      return '产品注册';
    case 1:
      return '客服记录';
    case 2:
      return '经销商提供';
    case 3:
      return '其他';
    default:
      return ''
  }
}


// 换新产品问题数据
export function problemData(showAll) {
  const data = [
    
    { value: '壳体开裂', code: 0 },
    { value: '注射按钮开裂', code: 1 },
    { value: '钢柱脱落引起的故障', code: 2 },
    { value: '刻度窗口脱落', code: 3 },
    { value: '注射器断裂', code: 4 },
    { value: '明显加压旋转不畅', code: 5 },
    { value: '其他', code: 6 },
  ]
  if(showAll) {
    data.unshift({ value: '全部', code: '' },)
  }
  return data
}

// 产品问题格式化
export function defect_type(type) {
  switch(type) {
    case 0:
      return '壳体开裂';
    case 1:
      return '注射按钮开裂';
    case 2:
      return '钢柱脱落引起的故障';
    case 3:
      return '刻度窗口脱落';
    case 4:
      return '注射器断裂';
    case 5:
      return '明显加压旋转不畅';
    case 6:
      return '其他';
    default:
      return ''
  }
}

// 处理客服id
export function service_id(id) {
  for(let i=0;i<serviceList.length;i ++) {
    if(serviceList[i].id == id) {
      return serviceList[i].name
    }
  }
  return ''
}