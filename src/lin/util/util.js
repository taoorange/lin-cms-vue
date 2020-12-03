import { 
  cloneDeep, 
  throttle, 
  debounce, 
  pick, 
  isObject, 
  isArray,
  isUndefined,
  isNull,
  isString,
  trim
} from 'lodash'

/* eslint-disable */
const Utils = {}

/** 参数说明：
 * 根据长度截取先使用字符串，超长部分追加…
 * str 对象字符串
 * len 目标字节长度
 * 返回值： 处理结果字符串
 */
Utils.cutString = (str, len) => {
  if (str.length * 2 <= len) {
    return str
  }
  let strlen = 0
  let s = ''
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-line
    s += str.charAt(i)
    if (str.charCodeAt(i) > 128) {
      strlen += 2
      if (strlen >= len) {
        return `${s.substring(0, s.length - 1)}...`
      }
    } else {
      strlen += 1
      if (strlen >= len) {
        return `${s.substring(0, s.length - 2)}...`
      }
    }
  }
  return s
}

/**
 * 简单数组的交集
 * @param {Array} a
 * @param {Array} b
 */
Utils.getIntersect = (a, b) => {
  if (a.constructor === Array && b.constructor === Array) {
    const set1 = new Set(a)
    const set2 = new Set(b)
    return Array.from(new Set([...set1].filter(x => set2.has(x))))
  }
  return null
}

/**
 * 防抖函数
 * @param {*} func 函数体
 * @param {*} wait 延时
 */
// Utils.debounce = (func, wait = 50) => debounce(func, wait)
Utils.debounce = debounce
Utils.pick = pick
Utils.isObject = isObject
Utils.isArray = isArray

/**
 * 节流函数
 * @param {*} func 函数体
 * @param {*} wait 延时
 */
Utils.throttle = (func, wait = 50) => throttle(func, wait)

/**
 * 返回 n 位的随机字符串
 * @param {Number} n
 */
Utils.getRandomStr = (n = 6) => {
  let str = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  for (let i = 0; i < n; i += 1) {
    str += chars.charAt(Math.floor(Math.random() * 62))
  }
  return str
}

// 检验数据类型
export function toRawType (value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

function insertItem(item, arr) {
  const { order } = item
  if (typeof arr[order] !== 'number') {
    arr[order] = item
    return
  }
  let moveBegin
  let moveEnd
  let pos
  let i = order + 1

  while (arr[i]) {
    if (arr[i].order > order) {
      if (!moveBegin) {
        moveBegin = i
        pos = i
      }
    }
    i += 1
  }

  if (moveBegin) {
    moveEnd = i
  } else {
    pos = i
  }

  if (!moveEnd) {
    arr[pos] = item
    return
  }

  // 需要移动
  for (let i = moveEnd; i >= moveBegin; i -= 1) {
    arr[i + 1] = arr[i]
  }
  arr[pos] = item
}

/**
 * 根据数组的 order 字段排序
 * @param {Array} source
 */
Utils.sortByOrder = (source = []) => {
  if (!Array.isArray(source)) {
    console.error('sortByOrder 传入参数不符合要求, 应为数组', source)
    return source
  }
  const tmp = []
  let target = []

  // 将带排序的子项添加进临时数组 tmp
  for (let i = 0; i < source.length; i += 1) {
    if (typeof source[i].order !== 'number') {
      continue
    }
    let { order } = source[i]
    // 支持设置倒数顺序
    if (order < 0) {
      order = source.length + order
      if (order < 0) {
        order = 0
      }
    }

    // 确保整数
    source[i].order = Math.floor(order)

    // 插入临时数组
    insertItem(source[i], tmp)
  }

  // 合并临时数组和原数组
  for (let i = 0, j = 0; i < source.length; i += 1) {
    if (typeof source[i].order === 'number') {
      continue
    }
    // 找需要填的坑
    while (tmp[j]) {
      j += 1
    }
    tmp[j] = source[i]
  }
  // 筛除空隙
  target = tmp.filter(item => !!item)
  return target
}

/**
 * 深度遍历，深拷贝
 * @param {*} data
 */
Utils.deepClone = data => cloneDeep(data)

/**
 * 中划线转驼峰
 */
Utils.came = str => {
  return `${str}`.replace(/-\D/g, match => match.charAt(1).toUpperCase())
}

/**
 * 判断权限
 */
Utils.hasPermission = (permissions, route, user) => {
  if (user && user.role === 1) {  // 超级管理员
    const { title } = route
    if(title === '指派问题' || title === '经销商' || title === '经销商产品信息') {
      return false
    }
    return true
  }
  if (route.permission) {
    return permissions.some(permission => route.permission.indexOf(permission) > -1)
  }
  return true
}

let cached
/**
 * 获取窗口滚动条大小, From: https://github.com/react-component/util/blob/master/src/getScrollBarSize.js
 * @param {boolean} fresh 强制重新计算
 * @returns {number}
 */
export function getScrollBarSize(fresh) {
  if (fresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthScroll
  }
  return cached
}

/**
 * 遍历对象，去掉为值为空、为null、为undefined的键* */
Utils.removeEmptyAttr = object => {
  const obj = cloneDeep(object)
  if (isObject(obj)) {
    for (let key in obj) {
      if (isObject(obj[key]) || isArray(obj[key])) {
        console.log(obj[key])
        Utils.removeEmptyAttr(obj[key])
      } else {
        if (isUndefined(obj[key]) || isNull(obj[key]) || (isString(obj[key]) && trim(obj[key]) === '')) {
          delete obj[key]
        }
      }
    }
  } else if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj.removeEmptyAttr(obj[i])
    }
  }
  return obj
}

// 正则校验
Utils.regExp = (val, type) => {
  const regExp = /^1\d{10}$/
  switch (type) {
    case 'phone':
      return regExp.test(val)
  }
}

// 合并对象
Utils.assignObj = (obj1, obj2) => {
  const obj = {}
  Object.assign(obj,obj1,obj2)
  return obj
}

export default Utils

// 处理时间格式
function hasT(date) {
  if (typeof date === 'string' && date.includes('T') && date.includes('Z')) {
    return true
  }
  return false
}
function formatT(date, fmt) {
  const data = new Date(+new Date(date) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '')
  if(!fmt) {
    return data.substring(0,10)
  } 
  return data.substring(0,fmt.length)
}
export const dateFormat = (date, fmt) => {
  // 处理后端返回的日期格式，可以为时间戳、可以为ZT格式，转化为 yyyy-MM-dd HH:mm:ss 格式
  if(!date) {
    return ''
  }
  const type = typeof date
  if (hasT(date)) {
    return formatT(date, fmt)
  } else {
    if (type === 'string') {
      date = new Date(Number(date))
    } else if (type === 'number') {
      date = new Date(date)
    }
    // 设置默认的时间戳格式处理方案
    if (!fmt) {
      fmt = 'yyyy-MM-dd'
    }
    var o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'S+': date.getMilliseconds(),
    }
    //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
    if (/(y+)/.test(fmt)) {
      //第一种：利用字符串连接符“+”给date.getFullYear()+''，加一个空字符串便可以将number类型转换成字符串。
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length))
      }
    }
    return fmt
  }
}

// 校验字段是否为空
export const regEmpty = (val) => {
  if(val === '' || val === null || val === undefined) {
    return true
  }
  return false
}

// 处理不同角色的重定向
export const handleRedirect = function(user) {
  const { role } = user
  if(role === 1 || role === 2) {
    return '/customer/list'
  } else if(role === 3) {
    return '/agent-renewal/list'
  } else if(role === 4) {
    return '/view-report/user'
  }
  return '/404'
}
