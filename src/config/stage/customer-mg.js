const customerConfig = {
  route: null,
  name: null,
  title: '列表搜索模板',
  type: 'folder', // 类型: folder, tab, view
  icon: '/icons/tab-customer.png',
  filePath: 'view/customer-info-mg/', // 文件路径
  order: 1,
  inNav: true,
  // permission: ['客服'],
  children: [
    {
      title: '列表',
      type: 'view',
      name: 'CustomerList',
      route: '/customer/list',
      filePath: 'view/customer-info-mg/index.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
      // permission: ['客服'],
    },
    {
      title: '兄弟',
      type: 'view',
      name: 'BortherTest',
      route: '/customer/brother',
      filePath: 'view/customer-info-mg/son-component2.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
    },
    {
      title: '抽奖',
      type: 'view',
      name: 'LuckDraw',
      route: '/customer/luck-draw',
      filePath: 'view/customer-info-mg/luck-draw.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
    },
  ],
}

export default customerConfig
