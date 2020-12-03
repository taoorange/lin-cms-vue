<template>
  <basic-search
    :label-width="90"
    :query="query"
    :show-more="false"
    :closed="closed"
    :mode="1"
    :toggle-more="toggleMore"
    :handle-search="handleSearch"
    :handle-reset="handleReset"
  >
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="产品编号">
          <el-input v-model="query.p_code" placeholder="请输入" clearable> </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </basic-search>
</template>

<script>
import ExactSearch from '@/lin/mixin/exact-search'

export default {
  mixins: [ExactSearch],
  components: {},
  props: {},
  data() {
    return {}
  },
  beforeCreate() {
    this.fields = ['p_code']
  },
  mounted() {},
  methods: {},
}
</script>
