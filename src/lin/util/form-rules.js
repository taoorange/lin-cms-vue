/**
 * 表单验证规则
 */
export default {
  install (Vue, options) {
    Vue.prototype.$formRules = function (item) {
      
      const result = []
      // 各种类型 - 类型优先
      if (item.type) {
        switch (item.type) {
          // 座机号码校验
          case 'phone':
            if (item.required) {
              result.push({
                required: true,
                message: item.required.message || '请输入电话号',
                trigger: 'blur'
              })
            }
            result.push({
              pattern: /^[\d-]*$/,
              message: '请输入正确的电话号',
              trigger: 'blur'
            })
            result.push({
              min: 6,
              max: 20,
              message: '长度在 6 到 20 个字符',
              trigger: 'blur'
            })
            break
          // 手机号校验
          case 'mobile':
            if (item.required) {
              result.push({
                required: true,
                message: item.required.message || '请输入手机号',
                trigger: 'blur'
              })
            }
            result.push({
              pattern: /^1\d{10}$/,
              message: '请输入正确的手机号',
              trigger: 'blur'
            })
            result.push({
              min: 11,
              max: 11,
              message: '长度为 11 个字符',
              trigger: 'blur'
            })
            break
          // 名字
          case 'name':
            if (item.required) {
              result.push({
                required: true,
                message: item.required.message || '请输入姓名',
                trigger: 'blur'
              })
            }
            result.push({
              min: 1,
              max: 20,
              message: '长度在 1 到 10 个字符',
              trigger: 'blur'
            })
            break
          // 身份证号
          case 'idNumber':
            if (item.required) {
              result.push({
                required: true,
                message: '请输入身份证号',
                trigger: 'blur'
              })
            }
            result.push({
              pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
              message: '请输入正确的身份证号',
              trigger: 'blur'
            })
            result.push({
              min: 18,
              max: 18,
              message: '长度为 18 个字符',
              trigger: 'blur'
            })
            break 
        }
      } else {
        // 是否必填
        if (item.required) {
          result.push({
            required: true,
            message: item.required.message || '该项为必填项!',
            trigger: 'blur'
          })
        }
        // 判定长度
        if (item.length) {
          if (item.length.min && item.length.max) {
            result.push({
              min: item.length.min,
              max: item.length.max,
              message: `长度在 ${item.length.min} 到 ${item.length.max} 个字符`,
              trigger: 'blur'
            })
          } else {
            if (item.length.max) {
              result.push({
                min: 0,
                max: item.length.max,
                message: `长度不能超过 ${item.length.max} 个字符`,
                trigger: 'blur'
              })
            }
          }
        }
      }
      return result
    }
  }
}
