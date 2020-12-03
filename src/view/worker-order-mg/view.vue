<template>
  <div>
    <create-order
      :isMember="isMember"
      ref="createOrder"
      @matchClientId="matchClientId"
      @matchCode="matchCode" />
  </div>
</template>

<script>
import CreateOrder from './minxin/eao.js'
import modelCustomer from '@/model/customer'
export default {
  name: 'workerOrderDetail',
  data() {
    return {
      isMember: true,
    }
  },
  computed: {},
  watch: {},
  inject: [],
  components: {
    CreateOrder,
  },
  created() {},
  methods: {
    // 根据产品编码获取客户信息
    async matchCode(val) {
      try {
        const { code, data } = await modelCustomer.getInfo({p_code: val})
        if(code === 11) {
          this.isMember = true
          this.$refs.createOrder.updateMember(data)
        } else {
          this.isMember = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    async matchClientId(val) {
      try {
        const { code, data } = await modelCustomer.getInfo({uid: val})
        if(code === 11) {
          this.isMember = true
          this.$refs.createOrder.updateMember(data)
        } else {
          this.isMember = false
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
