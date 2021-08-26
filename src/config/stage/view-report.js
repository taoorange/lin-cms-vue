const viewReport = {
  route: null,
  name: null,
  title: '数据分析模板',
  type: 'folder', // 类型: folder, tab, view
  icon: '/icons/view-report.png',
  filePath: 'view/view-report/', // 文件路径
  order: 8,
  inNav: true,
  // permission: ['客服', '查看报表'],
  children: [
    {
      title: '用户分析',
      type: 'view',
      name: 'UserAnalysis',
      route: '/view-report/user',
      filePath: 'view/view-report/user-analysis',
      inNav: true,
      icon: 'iconfont el-icon-s-data',
      // permission: ['客服', '查看报表'],
    },
    {
      title: '产品分析',
      type: 'view',
      name: 'ProductAnalysis',
      route: '/view-report/product',
      filePath: 'view/view-report/product-analysis',
      inNav: true,
      icon: 'iconfont el-icon-s-data',
      // permission: ['客服', '查看报表'],
    },
  ],
}

export default viewReport
