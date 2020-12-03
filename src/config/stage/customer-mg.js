const customerConfig = {
  route: null,
  name: null,
  title: '列表搜索模板',
  type: 'folder', // 类型: folder, tab, view
  icon: '/icons/tab-customer.png',
  filePath: 'view/customer-info-mg/', // 文件路径
  order: 1,
  inNav: true,
  permission: ['客服'],
  children: [
    {
      title: '列表',
      type: 'view',
      name: 'CustomerList',
      route: '/customer/list',
      filePath: 'view/customer-info-mg/index.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
      permission: ['客服'],
    },
  ],
}

export default customerConfig
