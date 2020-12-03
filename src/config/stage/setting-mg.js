const systemSetting = {
  route: null,
  name: null,
  title: '系统设置',
  type: 'folder', // 类型: folder, tab, view
  icon: '/icons/system-setting.png',
  filePath: 'view/setting-mg/', // 文件路径
  order: 7,
  inNav: true,
  children: [
    {
      title: '账号管理',
      type: 'view',
      name: 'PeopleList',
      route: '/setting-mg/list',
      filePath: 'view/setting-mg/index.vue',
      inNav: true,
      icon: 'iconfont el-icon-tickets',
      permission: ['超级管理员']
    },
    {
      title: '修改密码',
      type: 'view',
      name: Symbol('center'),
      route: '/center',
      filePath: 'view/center/center.vue',
      inNav: true,
      icon: 'iconfont el-icon-edit',
    },
    {
      title: '导入',
      type: 'view',
      name: 'SettingImport',
      route: '/setting-import',
      filePath: 'view/setting-mg/setting-import.vue',
      inNav: true,
      icon: 'iconfont el-icon-upload',
      permission: ['客服'],
    },
  ],
}

export default systemSetting
