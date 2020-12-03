import Utils from 'lin/util/util'
import BasicSearch from '@/component/base/basic-search'
/**
 * 列表页查询表单公共方法混入
 */
export default {
  components: {
    BasicSearch,
  },
  props: {
    updateState: Function,
    handleSearch: Function,
  },
  data() {
    return {
      query: this.getDefaultQuery(),
      closed: true,
    }
  },
  methods: {
    toggleMore() {
      this.closed = !this.closed
    },
    handleReset() {
      this.query = this.getDefaultQuery()
      this.handleSearch(this.query)
    },
    getDefaultQuery() {
      const { fields } = this
      const query = {}
      for (let i = 0; i < fields.length; i++) {
        if (Utils.isObject(fields[i])) {
          query[fields[i].key] = fields[i].default
        } else {
          query[fields[i]] = undefined
        }
      }
      return query
    },
  },
}
