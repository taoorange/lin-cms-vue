
// 回访分类
export function visitStatus(type) {
  switch(type) {
    case 0:
      return '首次回访';
    case 1:
      return '七天回访';
    case 2:
      return '三月回访';
    case 3:
      return '一年回访';
    default:
      return ''
  }
}

// 回访按钮列表
export function visitTabList(status, isView) {
  // 此处status是visit_status + 1
  /**
   * 最多会有四次回访
   * **/
  const tabList = [
    { label: '首次回访', name: 'first', code: 0, success: true },
    { label: '七天回访', name: 'second', code: 1, success: true },
    { label: '三月回访', name: 'third', code: 2, success: true  },
    { label: '一年回访', name: 'fourth', code: 3, success: true },
    { label: '已完成回访', name: 'fifth', code: 4, success: true},
  ]
  if(status) {
    const data = tabList.slice(0, Number(status))
    if(!isView) {
      data[data.length - 1].success = false
    }
    return data
  }
  return tabList
}

// 格式化当前tab，返回visit_status
export function visitTabFormat(activeName) {
  const tabList = [
    { label: '首次回访', name: 'first', code: 0, success: true },
    { label: '七天回访', name: 'second', code: 1, success: true },
    { label: '三月回访', name: 'third', code: 2, success: true  },
    { label: '一年回访', name: 'fourth', code: 3, success: true },
    { label: '已完成回访', name: 'fifth', code: 4, success: false},
  ]
  const result = tabList.filter(item => {
    return item.name === activeName
  })
  if(result.length) {
    const visit_status = result[0].code
    return visit_status
  }
  return 0
}

// 糖尿病类型
export function diabetesTypeData() {
  const data = [
    { value: "Ⅰ型糖尿病", code: 0, },
    { value: "Ⅱ型糖尿病", code: 1, },
    { value: "妊娠糖尿病", code: 2, },
    { value:  "其他患者", code: 3 }
  ]
  return data
}

// 格式化糖尿病类型
export function diabetesFormat(type) {
  switch(type) {
    case 0:
      return 'Ⅰ型糖尿病';
    case 1:
      return 'Ⅱ型糖尿病';
    case 2:
      return '妊娠糖尿病';
    case 3:
      return '其他患者';
    default:
      return ''
  }
}

// 胰岛素种类
export function insulinTypeData() {
  const data = [
    { value: '预混', code: 0, },
    { value: '长效', code: 1, },
    { value: '中效', code: 2, },
    { value: '短效', code: 3, },
    { value: '速效', code: 4, },
    { value: '其他', code: 5, },
  ]
  return data
}

// 胰岛素种类格式化
export function insulinTypeFormat(type) {
  switch(type) {
    case 0:
      return '预混';
    case 1:
      return '长效';
    case 2:
      return '中效';
    case 3:
      return '短效';
    case 4:
      return '速效';
    case 5:
      return '其他';
    default:
      return ''
  }
}

// 购买渠道
export function buyChannelData(params) {
  const data = [
      { value: '网上', code: 0},
      { value: '医院', code: 1},
      { value: '药店', code: 2},
      { value: '朋友介绍', code: 3},
      { value: '其他', code: 4 },
    ]
  return data
}

// 格式化购买渠道
export function buyChannelFormat(type) {
  switch(type) {
    case 0:
      return '网上';
    case 1:
      return '医院';
    case 2:
      return '药店';
    case 3:
      return '朋友介绍';
    case 4:
      return '其他';
    default:
      return ''
  }
}

// 胰岛素注射部位格式化
export function injectBodyFormat(data) {
  let list = []
  if(typeof data === 'string') {
    list = data.split(',')
  }
  if(Array.isArray(data)) {
    list = data
  }
  if(list && list.length) {
    const data = [
      { value: '脐周', code: 0},
      { value: '上臂外侧', code: 1},
      { value: '大腿前外侧', code: 2},
      { value: '臀部外上侧', code: 3},
    ]
    const result = []
    data.forEach(item => {
      list.forEach(code => {
        if(item.code === code) {
          result.push(item.value)
        }
      })
    })
    if(result.length) {
      return result.join('、')
    }
  }
  return ''
}

// 使用感受
export function feelLevelFormat(type) {
  switch(type) {
    case 0:
      return '差';
    case 1:
      return '良好';
    case 2:
      return '好';
    case 3:
      return '非常好';
    default:
      return ''
  }
}