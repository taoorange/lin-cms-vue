// 角色分类
export function roleType(type) {
  // role取值为:1超级管理员、2、客服 3、经销商 4、只看报表
  switch(type) {
    case 1:
      return '超级管理员';
    case 2:
      return '客服';
    case 3:
      return '经销商';
    case 4:
      return '只看报表';
    default:
      return ''
  }
}

// 账号状态
export function f_status(type) {
  const arr = ['已关闭', '启用',]
  return arr[type]
}