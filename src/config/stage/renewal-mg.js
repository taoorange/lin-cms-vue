const renewalConfig = {
  route: null,
  name: null,
  title: '换新管理',
  type: 'folder', // 类型: folder, tab, view
  icon: '/icons/renewal-mg.png',
  filePath: 'view/renewal-mg/', // 文件路径
  order: 3,
  inNav: true,
  permission: ['客服', '经销商'],
  children: [
    {
      title: '客服换新',
      type: 'view',
      name: 'RenewalList',
      route: '/renewal-mg/list',
      filePath: 'view/renewal-mg/index.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
      permission: ['客服'],
    },
    {
      title: '经销商换新',
      type: 'view',
      name: 'AgentRenewalList',
      route: '/agent-renewal/list',
      filePath: 'view/agent-renewal/index.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
      permission: ['客服', '经销商'],
    },
  ],
}

export default renewalConfig
