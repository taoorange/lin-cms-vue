<template>
  <div>
    <create-order
      :isMember="isMember"
      ref="createOrder"
      @matchCode="matchCode"
      @matchPhone="matchPhone"
      @updateMember="updateMember"
      />
  </div>
</template>

<script>
import CreateOrder from './minxin/eao.js'
import modelCustomer from '@/model/customer'
export default {
  name: 'workerOrderCreate',
  data() {
    return {
      isMember: false,
      client: {
        client_id: '',
        client_name: '',
        register_time: '',
        sex: '',
        age: '',
        phone: '',
        provice: '',
        city: '',
        district: '',
        address: '',
      }
    }
  },

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
          this.$refs.createOrder.updateMember(data, true)
        } else {
          this.isMember = false
          this.$message.error('没有匹配到客户信息')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async matchPhone(val) {
      try {
        const { code, data } = await modelCustomer.getInfo({phone: val})
        if(code === 11) {
          this.isMember = true
          this.$refs.createOrder.updateMember(data)
        } else {
          this.isMember = false
          this.$refs.createOrder.updateMember(this.client)
        }
      } catch (error) {
        console.log(error)
      }
    },
    updateMember(val) {
      this.isMember = val
    }
  },
}
</script>

<style lang="scss" scoped></style>
