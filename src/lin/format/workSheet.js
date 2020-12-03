// 问题分类一级
export function ws_type1(type) {
  switch(type) {
    case 0:
      return '售前';
    case 1:
      return '售后';
    default:
      return ''
  }
}

// 问题分类二级
export function ws_type2(type1, type2) {
  if(type1 === 0 || type1 === '0') {
    switch(type2) {
      case 0:
        return '咨询产品详细信息';
      case 1:
        return '咨询怎么代理';
      case 2:
        return '咨询产品的适用范围';
      case 3:
        return '咨询产品使用效果';
      case 4:
        return '咨询体验或购买详细信息';
      case 5:
        return '其它';
      default:
        return ''
    }
  } else if(type1 === 1 || type1 === '1'){
    switch(type2) {
      case 0:
        return '咨询产品使用问题';
      case 1:
        return '咨询注射后症状处理';
      case 2:
        return '咨询注射器故障';
      case 3:
        return '咨询产品维修问题';
      case 4:
        return '咨询老款产品相关问题';
      case 5:
        return '咨询产品注册和质保延保';
      case 6:
        return '产品质量投诉';
      case 7:
        return '咨询退换货问题';
      case 8:
        return '服务相关投诉';
      case 9:
        return '客户建议';
      case 10:
        return '其他咨询/其他投诉';
      case 11:
        return '咨询产品使用效果';
      default:
        return ''
    }
  } else {
    return ''
  }
}

// 工单状态
export function workStatus(status) {
  // 0--进行中 1--经销商处理中 2--经销商未解决 3--经销商已解决 4--完成
  const arr = ['进行中', '经销商处理中', '经销商未解决', '经销商已解决', '完成']
  return arr[status]
}

export function workStatusData(showAll) {
  const data = [
    { value: '进行中', code: 0, disabled: false},
    { value: '经销商处理中', code: 1, disabled: true},
    { value: '经销商未解决', code: 2, disabled: true},
    { value: '经销商已解决', code: 3, disabled: true},
    { value: '完成', code: 4, disabled: false},
  ]
  if(showAll) {
    data.unshift({ value: '全部', code: ''})
  }
  return data
}


// 工单来源
export function workSource(status) {
  const arr = ['400', '微信', '公众号']
  return arr[status]
}

// 男女
export function f_sex(sex) {
  // 0：男，1：女
  const arr = ['男', '女',]
  return arr[sex]
}

// 使用者关系
export function f_relation(type) {
  switch(type) {
    case 0:
      return '本人';
    case 1:
      return '配偶';
    case 2:
      return '子女';
    case 3:
      return '父母';
    case 4:
      return '亲戚';
    case 5:
      return '朋友';
    case 6:
      return '其他';
    default:
      return ''
  }
}

// 来电者来源
export function channelType(type) {
  switch(type) {
    case 0:
      return '百度';
    case 1:
      return '今日头条';
    case 2:
      return '广告';
    case 3:
      return '其他';
    default:
      return ''
  }
}

// 产品类型
export function f_p_type(type) {
  switch(type) {
    case 0:
      return 'QS-M';
    case 1:
      return 'QS-P';
    default:
      return ''
  }
}

// 关系数据
export function relationData(noSelf) {
  // noSelf标记不包含本人字段
  const data = [
    {value: "本人", code: 0 },
    {value: "配偶", code: 1 },
    {value: "子女", code: 2 },
    {value: "父母", code: 3 },
    {value: "亲戚", code: 4 },
    {value: "朋友", code: 5 },
    {value: "其他", code: 6 },
  ]
  if(noSelf) {
    data.shift()
    return data
  }
  return data
}

// 问题分类
export function wsTypeData(type) {
  // 售前问题
  const issuesListPre = [
    { value: '咨询产品详细信息', code: 0 },
    { value: '咨询怎么代理', code: 1 },
    { value: '咨询产品的适用范围', code: 2 },
    { value: '咨询产品使用效果', code: 3 },
    { value: '咨询体验或购买详细信息', code: 4 },
  ]
  // 售后问题
  const issuesListAfter = [
    { value: '咨询产品的使用问题', code: 0 },
    { value: '咨询注射后出现的症状如何处理', code: 1 },
    { value: '咨询注射器故障', code: 2 },
    { value: '咨询产品维修问题', code: 3 },
    { value: '咨询老款产品相关问题', code: 4 },
    { value: '咨询产品注册和质保延保', code: 5 },
    { value: '产品质量投诉', code: 6 },
    { value: '咨询退换货问题', code: 7 },
    { value: '服务相关投诉', code: 8 },
    { value: '客户建议', code: 9 },
    { value: '其他咨询/其他投诉', code: 10 },
    { value: '咨询产品使用效果', code: 11 },
  ]
  if( type === 0 || type === '0') {
    return issuesListPre
  } else {
    return issuesListAfter
  }
}

// 疼痛感等级
export function painLevel(val) {
  switch(val) {
    case 0:
      return '0分';
    case 1:
      return '3分';
    case 2:
      return '6分';
    case 3:
      return '10分';
    default:
      return ''
  }
}

// 并发症数据格式化
export function diseaseData(list) {
  const arr = [
    { value:'糖尿病肾病', code: 0},
    { value:'糖尿病眼部并发症', code: 1},
    { value:'糖尿病足', code: 2},
    { value:'糖尿病心血管并发症', code: 3},
    { value:'糖尿病性脑血管病', code: 4},
    { value:'糖尿病神经病变', code: 5},
  ]
  return arr
}

// 并发症数据格式化
export function disease(list) {
  const arr = [
    '糖尿病肾病', 
    '糖尿病眼部并发症', 
    '糖尿病足', 
    '糖尿病心血管并发症',
    '糖尿病性脑血管病',
    '糖尿病神经病变'
  ]
  const newArr = []
  arr.forEach((item, index) => {
    list.forEach(item2 => {
      if(Number(index) === Number(item2)) {
        newArr.push(item)
      }
    })
  })
  const result =[... new Set(newArr)]
  return result.join('、')
}