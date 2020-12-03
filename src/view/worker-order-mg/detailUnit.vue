<template>
  <div>
    <el-dialog
      title=""
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      size="small"
      width="95%"
      :visible.sync="dialogVisible"
    >
      <button type="button" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="closeDialog"></i>
      </button>
      <create-order :row="row" ref="createOrder" :isDialog="true" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 工单调用自身，作为弹框出现
export default {
  name: 'detailUnit',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    // 将弹框接收到的数据再次回传给createOrder，用于改变数据
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  inject: [],
  components: {
    // CreateOrder: () => import('./components/createOrder2.vue'),
    CreateOrder: () => import('./minxin/eao.js'),
  },
  created() {
    // const createOrder = this.$refs.createOrder.isView
    // console.log(createOrder)
    // console.log(this.$refs.createOrder)
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>
