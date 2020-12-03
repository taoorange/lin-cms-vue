<template>
  <div>
    <el-input
      :disabled="disabled"
      :readonly="readonly"
      :value="value"
      :size="size"
      :positive="positive"
      :integerOnly="integerOnly"
      :placeholder="placeholder"
      :remain="remain"
      :max="max"
      @input="changeInput($event)"
    >
      <template v-if="slotName" :slot="slotType">{{ slotName }}</template>
    </el-input>
    <div v-if="errorMessage" class="el-form-item__error">{{ errorMessage }}</div>
  </div>
</template>
<script>
// 对</el-input>做二次封装，主要用来处理数字输入的小数点保留问题
export default {
  name: 'NumberInput',
  props: {
    slotType: {
      type: String,
      default: 'append',
    },
    slotName: {
      type: String,
      default: null,
    },
    value: {
      type: [Number, String],
      default: null,
    },
    size: {
      type: String,
      default: 'small',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      defalut: '请输入',
    },
    remain: {
      type: [Number, String],
      default: 2, // 默认保留2位小数
    },
    // 限制是否只能输入为正整数
    integerOnly: {
      type: Boolean,
      defalut: false,
    },
    min: {
      type: Number,
      default: -999999999999,
    },
    max: {
      type: Number,
      default: 99999999999999,
    },
    // 限制是否只能为正数
    positive: {
      type: Boolean,
      defalut: false,
    },
  },
  data() {
    return {
      errorMessage: '',
    }
  },
  methods: {
    changeInput(value) {
      let val
      if (!this.integerOnly) {
        // 限制输入框只能为数字和小数点，限制可输入数字的位数
        // 限制只能为正数
        if (this.positive) {
          val = value.replace(/[^\d.]/g, '')
        } else {
          val = value.replace(/[^\d.-]/g, '')
          // val = value.replace(/[^\-?][\d][\.?][\d]/g, '')
        }

        // 校验小数点位数
        if (val.toString().indexOf('.') > -1) {
          const a = val.toString().split('.')
          if (a[1].length > this.remain) {
            val = parseFloat(val).toFixed(this.remain)
            this.errorMessage = `仅支持${this.remain}位小数输入`
          } else {
            this.errorMessage = null
          }
        }
      } else {
        // 限制输入框只能为正整数
        val = value.replace(/[^\d]/g, '')
      }
      if (val > this.max) {
        val = this.max
      }
      if (val && val < this.min) {
        val = this.min
      }
      this.$emit('input', val)
    },
  },
}
</script>
<style lang="scss" scoped>
  /deep/.el-input-group__append {
    padding: 0 5px;
    font-size: 13px;
  }
</style>
