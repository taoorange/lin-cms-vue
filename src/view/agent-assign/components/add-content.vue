<template>
  <div class="container">
    <el-form
      :model="dialogForm"
      size="small"
      :inline="false"
      label-width="120px"
      ref="dialogForm"
      :disabled="editDsiabled"
      :rules="dialogRules"
    >
      <!-- 基础信息 -->
      <template>
        <el-row :gutter="24">
          <div class="title">
            <h1>基础信息</h1>
          </div>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="客户姓名：" prop="name">
              <span v-if="isView">{{ dialogForm.name }}</span>
              <el-input v-else v-model="dialogForm.name" maxlength="50" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别：" prop="sex">
              <span v-if="isView">{{ dialogForm.sex === 1 ? '女' : '男' }}</span>
              <el-radio-group v-else v-model="dialogForm.sex">
                <el-radio :label="1">女</el-radio>
                <el-radio :label="0">男</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄：" prop="age">
              <span v-if="isView">{{ dialogForm.age }}</span>
              <el-input v-else v-model="dialogForm.age" maxlength="50" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="电话：" prop="phone">
              <span v-if="isView">{{ dialogForm.phone }}</span>
              <el-input v-else v-model="dialogForm.phone" maxlength="50" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关系：" prop="relation">
              <span v-if="isView">{{ f_relation(dialogForm.relation) }}</span>
              <el-select v-else v-model="dialogForm.relation" placeholder="请选择">
                <el-option v-for="item in relationList" :key="item.code" :label="item.value" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="省市区：">
              <span v-if="isView">{{ dialogForm.province }}{{ dialogForm.city }}{{ dialogForm.district }}</span>
              <map-select ref="mapProvince" v-else @onProvince="onProvince" @onCity="onCity" @onCounty="onCounty" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item label="详细地址：" prop="address">
              <span v-if="isView">{{ dialogForm.address }}</span>
              <el-input v-else v-model="dialogForm.address" maxlength="100" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="注射器编码：" prop="p_code">
              <span>{{ dialogForm.p_code }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="问题分类：">
              <span>
                {{ f_ws_type1(dialogForm.ws_type1) }}
                {{ f_ws_type2(dialogForm.ws_type1, dialogForm.ws_type2) }}
              </span>
              <template v-if="false">
                <el-select 
                  v-model="dialogForm.ws_type1"
                  placeholder="请选择一级分类"
                  @change="changeWS_Type1"
                  style="margin-right: 10px;">
                  <el-option label="售前" :value="0"></el-option>
                  <el-option label="售后" :value="1"></el-option>
                </el-select>
                <el-select v-model="dialogForm.ws_type2" placeholder="请选择二级分类">
                  <template v-if="dialogForm.ws_type1 === 0">
                    <el-option
                      v-for="item in issuesListPre"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code"
                    ></el-option>
                  </template>
                  <template v-if="dialogForm.ws_type1 === 1">
                    <el-option
                      v-for="item in issuesListAfter"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code"
                    ></el-option>
                  </template>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="服务人员：" prop="seviced_by">
              <span v-if="isView">{{ dialogForm.seviced_by }}</span>
              <el-input v-else v-model="dialogForm.seviced_by" maxlength="100" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上门时间：" prop="service_time">
              <span v-if="isView">{{ dateFormat(dialogForm.service_time) }}</span>
              <el-date-picker
                v-else
                v-model="dialogForm.service_time"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item label="是否解决：" prop="task_status">
              <!-- task_status 0：未记录（初始状态）、1、已解决 2、未解决 -->
              <span v-if="isView">{{ dialogForm.status === 1 ? '已解决' : '未解决' }}</span>
              <el-radio-group v-else v-model="dialogForm.task_status">
                <el-radio :label="1">已解决</el-radio>
                <el-radio :label="2">未解决</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24" v-if="!isView">
          <el-col :span="16">
            <el-form-item label="问题描述：" prop="question">
              <el-input
                type="textarea"
                v-model="dialogForm.question"
                :maxlength="350"
                :show-word-limit="true"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24" v-if="!isView">
          <el-col :span="16">
            <el-form-item label="结果描述：" prop="treatment">
              <el-input
                type="textarea"
                v-model="dialogForm.treatment"
                :maxlength="350"
                :show-word-limit="true"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <template v-if="isView">
        <el-row :gutter="24">
          <div class="title">
            <h1>记录</h1>
          </div>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="" label-width="50px">
              <!-- <el-card class="box-card"> -->
                <p>时间：{{ dateFormat(dialogForm.service_time) }}</p>
                <p>处理人：{{ dialogForm.seviced_by }}</p>
                <p>问题描述：{{ dialogForm.question }}</p>
                <p>结果描述：{{ dialogForm.treatment }}</p>
              <!-- </el-card> -->
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
  </div>
</template>

<script>
import MapSelect from '@/component/base/province-select'
import Utils from 'lin/util/util'
import { dateFormat } from 'lin/util/util'
import { problemData } from 'lin/format/replace-sheet'
import { wsTypeData, relationData, f_relation, ws_type1, ws_type2 } from 'lin/format/workSheet'
import Model from '@/model/agent-task'
export default {
  components: {
    MapSelect,
  },
  props: {
    dialogForm: {
      type: Object,
      default: () => {},
    },
    records: {
      type: Object,
      default: () => {},
    },
    dialogRules: {
      type: Object,
      default: () => {},
    },
    editDsiabled: {
      type: Boolean,
      default: false,
    },
    isView: {
      type: Boolean,
      default: false,
    },
    agent: {
      type: Object,
      default: () => {},
    },
    updateProvince: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      f_relation: f_relation,
      f_ws_type1: ws_type1,
      f_ws_type2: ws_type2,
      dateFormat: dateFormat,
      issuesListPre: wsTypeData(0),
      issuesListAfter: wsTypeData(1),
      relationList: relationData(),
    }
  },
  computed: {},
  created() {},
  watch: {
    // 更新地图组件数据
    updateProvince(val) {
      if(val && Object.keys(this.dialogForm).length) {
        const mapData ={
          province: this.dialogForm.province,
          city: this.dialogForm.city,
          county: this.dialogForm.district,
        }
        this.$nextTick(() => {
          this.$refs.mapProvince.map = mapData
        })
      }
    }
  },
  methods: {
    onProvince(val) {
      this.$emit('onProvince', val)
    },
    onCity(val) {
      this.$emit('onCity', val)
    },
    onCounty(val) {
      this.$emit('onCounty', val)
    },
    resetForm() {
      this.$refs.dialogForm.resetFields()
    },
    submitForm() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          const params = Utils.deepClone(this.dialogForm)
          params.agent_id = this.agent.agent_id
          params.ws_code = this.agent.ws_code
          params.task_id = this.agent.task_id
          // 为显示经销商名称
          params.addedBy = this.agent.agent_id
          params.type = 1
          // console.log(params)
          try {
            const { code, message } = await Model.createTaskDetail(params)
            if (code === 11) {
              this.$message.success(message)
              this.$emit('closeDialog')
              this.$emit('updateList')
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeWS_Type1(val) {
      // this.dialogForm.ws_type2 = ''
      this.$emit('updateWSTYPE2', '')
    }
  },
}
</script>

<style lang="scss" scoped>
.title {
  h1 {
    font-size: 14px;
    font-weight: 600;
    height: 30px;
    padding: 0 20px;
    &:before {
      content: '';
      display: inline-block;
      height: 20px;
      width: 3px;
      background-color: #3963bc;
      vertical-align: middle;
      margin-right: 15px;
      border-radius: 2px;
    }
  }
}
.huancheng {
  position: absolute;
  vertical-align: middle;
  margin-top: 8px;
  left: 32.5%;
  z-index: 200;
}
/deep/.el-table .cell.el-tooltip {
  white-space: pre-wrap;
}
</style>
