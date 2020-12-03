const agentRenewal = {
  route: null,
  name: null,
  title: '经销商换新',
  type: 'folder', // 类型: folder, tab, view
  icon: '/icons/agent-renewal.png',
  filePath: 'view/agent-renewal/', // 文件路径
  order: 6,
  inNav: true,
  permission: ['经销商', '客服'],
  children: [
    {
      title: '经销商换新',
      type: 'view',
      name: 'AgentRenewalList',
      route: '/agent-renewal/list',
      filePath: 'view/agent-renewal/index.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
      permission: ['经销商', '客服'],
    },
  ],
}

export default agentRenewal
