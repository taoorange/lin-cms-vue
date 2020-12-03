// import pluginsConfig from './plugin'
import Utils from '@/lin/util/util'
import customerConfig from './customer-mg'
import viewReport from './view-report'

let homeRouter = [
  {
    title: '404',
    type: 'view',
    name: Symbol('404'),
    route: '/404',
    filePath: 'view/error-page/404.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
  },
  customerConfig,
  viewReport,
]

// 这个里面是数据分析、自定义组件、UI这三个模块，这三个模块作为插件引入
// const plugins = [...pluginsConfig]

// 筛除已经被添加的插件
function filterPlugin(data) {
  // if (plugins.length === 0) {
  //   return
  // }
  if (Array.isArray(data)) {
    data.forEach(item => {
      filterPlugin(item)
    })
  } else {
    // const findResult = plugins.findIndex(item => data === item)
    // if (findResult >= 0) {
    //   plugins.splice(findResult, 1)
    // }
    if (data.children) {
      filterPlugin(data.children)
    }
  }
}

filterPlugin(homeRouter)

// homeRouter = homeRouter.concat(plugins)

// 处理顺序
homeRouter = Utils.sortByOrder(homeRouter)

// 使用 Symbol 处理 name 字段, 保证唯一性
const deepReduceName = target => {
  if (Array.isArray(target)) {
    target.forEach(item => {
      if (typeof item !== 'object') {
        return
      }
      deepReduceName(item)
    })
    return
  }
  if (typeof target === 'object') {
    if (typeof target.name !== 'symbol') {
      target.name = target.name || Utils.getRandomStr()
      target.name = Symbol(target.name)
    }

    if (Array.isArray(target.children)) {
      target.children.forEach(item => {
        if (typeof item !== 'object') {
          return
        }
        deepReduceName(item)
      })
    }
  }
}

deepReduceName(homeRouter)

export default homeRouter
