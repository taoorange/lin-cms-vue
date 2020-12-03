const workerOrder = {
  route: null,
  name: null,
  title: '工单管理',
  type: 'folder', // 类型: folder, tab, view
  icon: '/icons/tab-worker-order.png',
  filePath: 'view/worker-order-mg/', // 文件路径
  order: 2,
  inNav: true,
  permission: ['客服'],
  children: [
    {
      title: '工单列表',
      type: 'view',
      name: 'WorkerOrderList',
      route: '/worker-order/list',
      filePath: 'view/worker-order-mg/index.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
      permission: ['客服'],
    },
    {
      title: '创建工单',
      type: 'view',
      name: 'WorkerOrderCreate',
      route: '/worker-order/create',
      filePath: 'view/worker-order-mg/create.vue',
      inNav: true,
      icon: 'iconfont el-icon-edit-outline',
      permission: ['客服'],
    },
    {
      title: '查看工单',
      type: 'view',
      name: 'WorkerOrderView',
      route: '/worker-order/view',
      filePath: 'view/worker-order-mg/view.vue',
      inNav: false,
      icon: 'iconfont el-icon-info',
      permission: ['客服',],
    },
    {
      title: '编辑工单',
      type: 'view',
      name: 'WorkerOrderEdit',
      route: '/worker-order/edit',
      filePath: 'view/worker-order-mg/edit.vue',
      inNav: false,
      icon: 'iconfont el-icon-edit-outline',
      permission: ['客服'],
    },
    // 历史工单详情弹框
    {
      title: '工单详情',
      type: 'view',
      name: 'OrderDetailDg',
      route: '/worker-order/detail',
      filePath: 'view/worker-order-mg/detailUnit.vue',
      inNav: false,
      icon: 'iconfont el-icon-edit-outline',
      permission: ['客服'],
    },
  ],
}

export default workerOrder
