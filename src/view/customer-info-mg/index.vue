<template>
  <div>
    <exact-search :handleSearch="handleSearch" ref="exactSearch" />

    <div class="container">
      <div class="table-button-wrap">
        <el-button type="primary" @click="checkDebounce">按钮</el-button>
      </div>
      <!-- <lin-table
        title="客户信息管理"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :showSelectCol="true"
        :index="true"
        :actionWidth="150"
        :pagination="pagination"
        :queryList="queryList"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        v-loading="loading"
      ></lin-table> -->

       <RecycleScroller
          class="scroller"
          :items="tableList"
          :min-item-size="30"
          size-field="small"
          key-field="id"
          v-slot="{ item }"
        >
          <div class="user">
            {{ item.value }}
          </div>
        </RecycleScroller>
    </div>
  </div>
</template>

<script>
import Utils, { debounce2 } from 'lin/util/util'
import model from '@/model/customer'
import LinTable from '@/component/base/table/lin-table'
import ExactSearch from './components/exactSearch'
import { dateFormat } from 'lin/util/util'
import { clientType, sourceType } from 'lin/format/customer'
import { setKEY, getKEY } from 'lin/util/storage'
import FatherComponent from './father-component'
// https://www.yuque.com/docs/share/405eacee-a750-4547-b299-a74b14a72dca?# 《一次性渲染十万条数据》
let tableList = []
for(let i=0;i < 10000;i ++) {
  tableList.push({id: i + 1, value: `我是第${i + 1}个兄弟`})
}
export default {
  name: 'CustomerMg',
  components: {
    LinTable,
    ExactSearch,
    FatherComponent,
  },
  provide() {
    return {
      toSon: 'this is to my son'
    }
  },
  data() {
    return {
      tableList,
      loading: false,
      tableColumn: [
        {
          prop: 'client_type',
          label: '客户分类',
          render: (h, { index, row, col }) => {
            return <span>{clientType(row.client_type)}</span>
          },
        },
        { prop: 'client_name', label: '客户姓名' },
        { prop: 'phone', label: '手机号码' },
        { prop: 'product_num', label: '产品注册数量' },
        {
          prop: 'register_time',
          label: '客户注册时间',
          width: 140,
          render: (h, { index, row, col }) => {
            return <span>{dateFormat(row.register_time, 'yyyy-MM-dd')}</span>
          },
        },
        {
          prop: 'source',
          label: '客户来源',
          render: (h, { index, row, col }) => {
            return <span>{sourceType(row.source)}</span>
      
          },
        },
      ],
      tableData: [],
      showEdit: false,
      editBookID: 1,
      pagination: {
        page: 1, // 当前页码数
        page_size: 10, // 每页多少条
        pageTotal: 0,
      },
    }
  },
  async created() {
    let d = {a:2}
    Object.prototype.toString = function(){
      console.log('Object')
    }
    console.log(d)
  },
  watch: {
    pagination: {
      handler(val) {
        // console.log('分页发生了变化')
      },
      immediate: false,
      deep:true,
    },
  },
  methods: {
    async queryList() {
      this.loading = true
      try {
        const queryFields = Utils.removeEmptyAttr(this.queryObj)
        const params = Utils.assignObj(this.pagination, queryFields)
        const { code, data, total } = await model.queryList(params)
        this.tableData = data || []
        this.pagination.pageTotal = total
      } catch (error) {
        this.tableData = []
      }
      this.loading = false
    },
    // 搜索
    async handleSearch(query = {}) {
      this.pagination.page = 1
      this.queryObj = Utils.deepClone(query)
      delete this.queryObj.dateRange
      await this.queryList()
    },
    // 切换当前页
    currentChange(val) {
      this.pagination.page = val
      this.queryList()
    },
    sizeChange(val) {
      this.pagination.page_size = val
      this.pagination.page = 1
      this.queryList()
    },
    listenComponentC(data) {
      console.log(data)
    },
    sonSong(data) {
      console.log('爷爷',data)
    },
    checkDebounce: debounce2( function() {
        console.log('提交表单')
    }, 5000)
    
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  position: relative;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .scroller {
    height: 500px;
    border: 1px solid red;
  }
  .user {
    height: 50px;
    width: 100%;
    border: 1px solid green;
    padding: 0 12px;
    display: flex;
    align-items: center;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
