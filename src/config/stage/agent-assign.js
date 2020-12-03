const agentAssign = {
  route: null,
  name: null,
  title: '指派问题',
  type: 'folder', // 类型: folder, tab, view
  icon: '/icons/assign-agent.png',
  filePath: 'view/agent-assign/', // 文件路径
  order: 4,
  inNav: true,
  permission: ['经销商'],
  children: [
    {
      title: '指派问题',
      type: 'view',
      name: 'AgentAssignList',
      route: '/agent-assign/list',
      filePath: 'view/agent-assign/index.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
      permission: ['经销商'],
    },
  ],
}

export default agentAssign
