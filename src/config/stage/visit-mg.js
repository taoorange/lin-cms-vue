const visitMg = {
  route: null,
  name: null,
  title: '回访列表',
  type: 'folder', // 类型: folder, tab, view
  icon: '/icons/visit-mg.png',
  filePath: 'view/visit-mg/', // 文件路径
  order: 6,
  inNav: true,
  permission: ['客服'],
  children: [
    {
      title: '回访列表',
      type: 'view',
      name: 'FirstVisitList',
      route: '/visit-mg/list',
      filePath: 'view/visit-mg/index.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
      permission: ['客服'],
    },
  ],
}

export default visitMg
