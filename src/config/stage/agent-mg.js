const agentMg = {
  route: null,
  name: null,
  title: '经销商',
  type: 'folder', // 类型: folder, tab, view
  icon: '/icons/agent-mg.png',
  filePath: 'view/agent-mg/', // 文件路径
  order: 5,
  inNav: true,
  permission: ['经销商'],
  children: [
    {
      title: '经销商产品信息',
      type: 'view',
      name: 'AgentList',
      route: '/agent-mg/list',
      filePath: 'view/agent-mg/index.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
      permission: ['经销商'],
    },
    {
      title: '经销商工单列表',
      type: 'view',
      name: 'AgentWorkerOrderList',
      route: '/agent-mg/worker-order/list',
      filePath: 'view/worker-order-mg/index.vue',
      inNav: false,
      icon: 'iconfont el-icon-tickets',
      permission: ['经销商'],
    },
    {
      title: '经销商工单详情',
      type: 'view',
      name: 'AgentWorkerOrderView',
      route: '/agent-mg/worker-order/view',
      filePath: 'view/worker-order-mg/view.vue',
      inNav: false,
      icon: 'iconfont el-icon-info',
      permission: ['经销商'],
    },
  ],
}

export default agentMg
