// 客户分类
export function clientType(type) {
  // client_type: 0--售前咨询 1--注册用户 2--未注册用户 3--其它
  switch(type) {
    case 0:
      return '普通客户';
    case 1:
      return '注册会员';
    case '':
      return '未识别';
    default:
      return ''
  }
}

// 客户分类数据
export function customerTypeData(showAll) {
  const data = [
    { value: '普通客户', code: 0 },
    { value: '注册会员', code: 1 },
  ]
  if(showAll) {
    data.unshift( { value: '全部', code: '' })
  }
  return data
}

// 客户来源
export function sourceType(type) {
  // source: 0--产品注册 1--客服记录 2--经销商提供 3--其它
  switch(type) {
    case 0:
      return '产品注册';
    case 1:
      return '客服记录';
    case 2:
      return '经销商提供';
    case 3:
      return '其它';
    default:
      return ''
  }
}

// 客户来源
export function channelType(type) {
  // source: 0--产品注册 1--客服记录 2--经销商提供 3--其它
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
// 目前先定义就这一种，后期再加
export function productType(type) {
  switch(type) {
    case 0:
      return 'QS-M';
    case 1:
      return 'QS-P';
    default:
      return ''
  }
}

// 产品类型p_type数据
export function productTypeData() {
  const data = [
    { value: 'QS-M' , code: 0 },
    { value: 'QS-P' , code: 1 },
  ]
  return data
}
