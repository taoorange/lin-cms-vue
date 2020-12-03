const customerConfig = {
  route: null,
  name: null,
  title: '客户信息管理',
  type: 'folder', // 类型: folder, tab, view
  icon: '/icons/tab-customer.png',
  filePath: 'view/customer-info-mg/', // 文件路径
  order: 1,
  inNav: true,
  permission: ['客服'],
  children: [
    {
      title: '客户列表',
      type: 'view',
      name: 'CustomerList',
      route: '/customer/list',
      filePath: 'view/customer-info-mg/index.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
      permission: ['客服'],
    },
    {
      title: '客户详情',
      type: 'view',
      name: 'CustomerDetail',
      route: '/customer/detail',
      filePath: 'view/customer-info-mg/detail.vue',
      inNav: false,
      icon: 'iconfont el-icon-info',
      permission: ['客服'],
    },
  ],
}

export default customerConfig
