<template>
  <div class="web-socket">
    <!-- 客户信息管理中有数据的展示样式 -->
    <el-dialog
      title="客户来电"
      width="800px"
      :close-on-click-modal="false"
      :visible.sync="dataVisable">
      <div class="dialog-header">
        <i class="el-icon-phone-outline"></i>
        <el-form label-width="90px" size="small" class="demo-form-inline">
          <el-row :gutter="24">
            <el-col :span="8" v-if="dto.client_type === 0 || dto.client_type === 1">
              <el-form-item label="姓名：">
                <span>{{dto.client_name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户分类：">
                <span>{{customerTypeFormat(dto.client_type)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="主叫：">
                <span>{{dto.phone}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24" v-if="dto.client_type === 0 || dto.client_type === 1">
            <el-col :span="8">
              <el-form-item label="注射器编号：" label-width="100px">
                <el-select v-model="dto.p_code" placeholder="请选择">
                  <el-option
                    v-for="item in codeList"
                    :key="item.p_code"
                    :label="item.p_code"
                    :value="item.p_code">
                  </el-option>
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在省市：">
                <span>{{dto.province}}{{dto.city}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="dto.client_type === 1">
              <el-form-item label="注册时间：">
                <span>{{dto.register_time}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="dialog-main" v-if="tableData.length">
        <lin-table
        title="未完工单"
        :tableColumn="tableColumn"
        :tableData="tableData"
        :showSelectCol="false"
        :index="false"
        :actionWidth="150"
        :showPage="false"
        :pagination="pagination"
        />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="jumpWorkerOrder">创建工单</el-button>
        <el-button @click="dataVisable = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Utils from 'lin/util/util'
import LinTable from '@/component/base/table/lin-table'
import { mapGetters } from 'vuex'
import { ws_type1, ws_type2, workStatus, workSource } from 'lin/format/workSheet'
import { clientType } from 'lin/format/customer'
import { dateFormat } from 'lin/util/util'
import modelCustomer from '@/model/customer' // 客户相关接口
import modelSheet from '@/model/work-sheet' // 工单相关接口
import { getKEY, rmKEY } from 'lin/util/storage'

const crypto = require('crypto');
const APPID = '7b4f2c27-0cce-468e-4042-1402293c0f5a'
const secret = 'secret-37b13758-b13c-4307-780e-1ed526391947'
// 初始化udesk实例
function timest() {
  var tmp = Date.parse( new Date() ).toString();
  tmp = tmp.substr(0,10);
  return tmp;
}
const now = timest();
function getToken(now) {
  const alg = APPID + now
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(alg);
  return hmac.digest('hex')
}

export default {
  components: {
    LinTable
  },
  data() {
    return {
      callType: '', // 1:已购买产品用户（客户下有产品）， 2：未购买产品用户（客户下无产品）
      dataVisable: false,
      clock: false,
      tableData: [],
      tableColumn: [
        { prop: 'ws_code',
          label: '工单编号',
          width: 140,
          render: (h, { index, row, col }) => {
            return (
              <div class="table-link-btn" onClick={() => this.jumpOrderDetail(index, row, col)}>
                {row.ws_code}
              </div>
            )
          },
        },
        {
          prop: 'status',
          label: '工单状态',
          width: 100,
          render: (h, { index, row, col }) => {
            return <span>{workStatus(row.status)}</span>
          },
        },
        {
          prop: 'update_time',
          label: '最近更新时间',
          width: 140,
          render: (h, { index, row, col }) => {
            return <span>{dateFormat(row.update_time)}</span>
          },
        },
        {
          prop: 'ws_type1',
          label: '问题分类(一级)',
          width: 120,
          render: (h, { index, row, col }) => {
            return <span>{ws_type1(row.ws_type1)}</span>
          },
        },
        {
          prop: 'ws_type2',
          label: '问题分类(二级)',
          minWidth: 130,
          render: (h, { index, row, col }) => {
            return <span>{ws_type2(row.ws_type1, row.ws_type2)}</span>
          },
        },
        { prop: 'created_name', label: '创建人' },
        {
          prop: 'create_time',
          label: '创建时间',
          width: 135,
          render: (h, { index, row, col }) => {
            return <span>{dateFormat(row.create_time, 'yyyy-MM-dd HH:mm')}</span>
          },
        },
      ],
      dto: {
        client_name: '',
        client_type: '',
        phone: '',
        p_code: '',
        province: '',
        city: '',
        register_time: '',
      },
      customerTypeFormat: clientType,
      dateFormat: dateFormat,
      pagination: {
        page: 1,
        page_size: 100,
      },
      codeList: []
    }
  },
  computed: {
    ...mapGetters(['logined', 'user']),
  },
  mounted() {
   
  },
  created() {
    // 模拟弹框假数据
  },
  watch: {
    dataVisable(val) {
      if(val === false) {
        this.tableData = []
        this.callType = ''
        for(let key in this.dto) {
          this.dto[key] = ''
        }
      }
    }
  },
  methods: {
    initSocket() {
      console.log('调用了websocket的初始化事件')
      const self = this
      const auth = this.judgeAuth(this.logined, this.user)
      if(!auth) {
        return false
      }
      if(!this.user.udesk_serverid) {
        console.log('当前登录客服没有udesk_serverid，请联系开发人员进行添加')
        return false
      }
      let AppDataProviderBase = UdeskCCPaasApiClass.AppDataProvider;
      class AppDataProvider extends AppDataProviderBase {
        GetToken() {
          return new Promise((resolve, reject) => {
              // 设置鉴权信息
              const data = {
                  appId: APPID,     //租户唯一标识
                  timestamp: now,  //鉴权用的时间戳
                  token: getToken(now),
              }
              resolve(data)
          });
        }
      }
      window.UdeskCCPaasApiClassInstance = new UdeskCCPaasApiClass({
          AgentId: this.user.udesk_serverid,
          AppId: APPID,
          AutoConnect: true,
          AppDataProvider: new AppDataProvider(),
          Log: function (message, type) {}
      });
      UdeskCCPaasApiClassInstance.Init();
      sessionStorage.setItem('webSockedHasConnected', true)
      // 事件捕获，监听电话振铃
      UdeskCCPaasApiClassInstance.on('Delivered', function(resp) {
        const { Data: { CallerInfo } } = resp
        if (Object.keys(CallerInfo).length) {
          if(auth) {
            const { TelNumber } = CallerInfo
            const regPhone = /^1\d{10}$/
            if (TelNumber && regPhone.test(TelNumber)) {
              self.dataVisable = true
              self.getClientInfo(TelNumber)
              self.dto.phone = TelNumber
            }
          }
        }
      })
    },
    // 判断当前为客户，且已经登录
    judgeAuth(login, user) {
      if(login && user && user.role ===2) {
        return true
      }
      return false
    },
    // 创建工单
    jumpWorkerOrder() {
      rmKEY('callUserInfo')
      const callType = this.callType
      if(this.dto.client_type === 0 || this.dto.client_type === 1) {
        this.$store.commit('storeCallUser', this.dto)
      }
      this.$router.push({
        path: '/worker-order/create',
        query: {
          call_phone: this.dto.phone
        },
      })
      this.dataVisable = false
    },
    // 跳转工单详情
    jumpOrderDetail(index, row, col) {
      this.$router.push({
        path: '/worker-order/view',
        query: {
          ws_id: row.ws_id,
          p_code: row.p_code,
          row: JSON.stringify(row),
        },
      })
      this.dataVisable = false
    },
    // 获取客户信息
    getClientInfo: Utils.debounce(async function(phone) {
      if(this.clock) {
        return
      }
      try {
        this.clock = true
        const { code, data } = await modelCustomer.getInfo({phone: phone})
        if(code === 11) {
          const fields = ['client_name', 'client_type', 'phone', 'p_code', 'province', 'city', 'register_time']
          this.dto.client_name = data.client_name
          this.dto.client_type = data.client_type
          this.dto.p_code = data.p_code
          this.dto.province = data.province
          this.dto.city = data.city
          this.dto.register_time = data.register_time
          if(data.client_id) {
            await this.getWorkSheet(data.client_id)
            await this.getClientProduct(data.client_id)
          }
        }
        this.clock = false
      } catch (error) {
        this.clock = false
        console.log(error)
      }

    }, 2000,
      { leading: true, trailing: false}),
    // 获取客户工单列表
    async getWorkSheet(client_id) {
      try {
        const { code, data, message, total } = await modelCustomer.getWorkSheet(client_id)
        if(data && data.length) {
          this.tableData = data.filter(item => {
            return item.status !== 4
          })
        } else {
          this.tableData = []
        }
      } catch (error) {
        this.tableData = []
        console.log(error)
      }
    },
    // 获取客户产品列表
    async getClientProduct(client_id) {
       try {
        const { code, data } = await modelCustomer.getProduct(client_id)
        if(data.length) {
          this.callType = 1 // 查询到产品，标记来电类型为客户
          this.codeList = data
          // 默认初始化p_code为产品列表的第一个，下拉选择
          const product = data[0]
          this.dto.p_code = product.p_code
        } else if(data.length === 0) {
          this.callType = 2
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.web-socket {
  position: relative;
  /deep/.el-form-item__content {
    margin-bottom: 0;
  }
  .click-btn {
    color: #3963bc;
    cursor: pointer;
  }
  /deep/.el-form-item__content {
    text-align: left;
  }
  /deep/.el-dialog {
    top: 10px;
    transform: translate(-50%, 0);
  }
  .el-icon-phone-outline {
    position: absolute;
    display: block;
    font-size: 20px;
    color: #67c23a;
    top: 20px;
    left: 50%;
    margin-left: 40px;
    animation: msClock 1.2s linear infinite;
  }
  @keyframes msClock {
    0%,90%,100% {
      transform: rotate(0) scale(1);
    }
    20%,40% {
      transform: rotate(-15deg) scale(1.1);
    }
    30%,50% {
    transform: rotate(15deg) scale(1.1);
    }
  }
}
</style>
