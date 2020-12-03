<template>
  <div class="basic-search">
    <div class="basic-search__hd" v-show="showHd">
      <span class="basic-search__hd-line"></span>
      <span class="basic-search__hd-title">筛选条件</span>
    </div>
    <el-row class="basic-search__bd">
      <el-col class="basic-search__col-l" :span="leftSpan">
        <el-form
          ref="form"
          :model="query"
          :label-position="labelPosition"
          :label-width="labelWidth + 'px'"
          @submit.native.prevent
          :size="size"
        >
          <slot>&nbsp;</slot>
        </el-form>
      </el-col>
      <el-col class="basic-search__col-r" :span="24 - leftSpan">
        <template v-if="mode === 2">
          <el-row>
            <el-col :span="24">
              <el-button type="primary" icon="el-icon-search" @click="handleSearch(query)">查询</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button icon="el-icon-refresh" @click="handleReset" v-if="showReset">重置</el-button>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch(query)">查询</el-button>
          <span style="margin:0 2px;">&nbsp;</span>
          <el-button icon="el-icon-refresh" @click="handleReset" v-if="showReset">重置</el-button>
        </template>
        <a
          title="展开更多"
          class="toggle-more-btn"
          :class="[closed ? 'open' : 'close']"
          @click="toggleMore"
          v-if="showMore"
        ></a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    showHd: {
      type: Boolean,
      default: true
    },
    labelPosition: {
      type: String,
      default: 'right',
    },
    labelWidth: {
      type: Number,
      default: 80,
    },
    // 模式(1: 单行, 2: 多行)
    mode: {
      type: Number,
      default: 2,
    },
    showMore: {
      type: Boolean,
      default: false,
    },
    showReset: {
      type: Boolean,
      default: true,
    },
    closed: {
      type: Boolean,
      default: true,
    },
    query: {
      type: Object,
      default() {
        return {}
      },
    },
    toggleMore: {
      type: Function,
      default: () => {},
    },
    handleSearch: {
      type: Function,
      default: () => {},
    },
    handleReset: {
      type: Function,
      default: () => {},
    },
    size: {
      type: String,
      default: 'small',
    },
  },
  computed: {
    leftSpan() {
      if (this.showReset) {
        return this.mode === 2 ? 21 : 18
      }
      return 21
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/.el-select {
  width: 100%;
}
.basic-search {
  border-bottom: 1px solid #e2e2e5;
  padding: 20px 30px;
}
.basic-search__hd {
  margin-bottom: 24px;
}
.basic-search__hd-line {
  display: inline-block;
  margin-right: 10px;
  width: 4px;
  height: 16px;
  border-radius: 4px;
  vertical-align: middle;
  background: #4186f6;
}
.basic-search__hd-title {
  color: #3f4656;
  font-size: 14px;
}
.basic-search__bd {
  padding: 0 20px 0 15px;
}
.basic-search__col-l {
  padding-right: 16px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.basic-search__col-r {
  position: relative;
  /deep/ .el-row:first-child {
    margin-bottom: 22px;
  }

  .toggle-more-btn {
    position: absolute;
    top: 50%;
    right: -18px;
    width: 14px;
    height: 14px;
    margin-top: -8px;
    background: no-repeat center center;
    background-size: contain;
    &.open {
      background-image: url('~@/assets/image/icon-open.png');
    }
    &.close {
      background-image: url('~@/assets/image/icon-close.png');
    }
  }
}
/deep/.el-form-item__label {
  text-align: left;
}
</style>
