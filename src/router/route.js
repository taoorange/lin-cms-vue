import homeRouter from './home-router'

/**
 * 重定向设置：
 * 超级管理员和客服(role1、2)：/customer/list
 * 经销商（role 3）：/agent-renewal/list
 * 查看报表（role 4）： /view-report/user
 * **/

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/customer/list',
    component: () => import('@/view/home/home'),
    children: [...homeRouter],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/view/login/login'),
  },
  {
    redirect: '/404',
    path: '*',
  },
]

export default routes
