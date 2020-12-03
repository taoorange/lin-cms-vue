<template>
  <div class="container">
    <el-dialog
      :title="title"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      size="small"
      width="900px"
      :visible.sync="dialogVisible"
    >
      <button type="button" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="closeDialog"></i>
      </button>
      <el-form :model="dialogForm" size="small" :inline="false" label-width="110px" ref="dialogForm" :rules="dialogRules">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="是否本人：" prop="is_self">
              <el-radio-group v-model="dialogForm.is_self" @change="changeIsSelf">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="dialogForm.name" maxlength="30" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别：" prop="sex">
              <el-radio-group v-model="dialogForm.sex">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄：" prop="age">
              <el-input v-model="dialogForm.age" maxlength="3" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="电话：" prop="phone">
              <el-input v-model="dialogForm.phone" maxlength="11" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关系：">
              <el-select :disabled="dialogForm.is_self === 1" v-model="dialogForm.relation" style="width: 100%;" placeholder="请选择">
                <el-option
                  v-for="item in relationData"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="产品类型：" prop="p_type">
              <span v-if="editDsiabled">{{productType(dialogForm.p_type)}}</span>
              <el-select v-else :disabled="editDsiabled" v-model="dialogForm.p_type" placeholder="请选择">
                <el-option
                  v-for="item in productTypeData"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品编码：" prop="p_code">
              <span v-if="editDsiabled">{{dialogForm.p_code}}</span>
              <el-input
                v-else
                v-model="dialogForm.p_code"
                :disabled="editDsiabled"
                maxlength="30"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="省市区：" prop="province">
              <map-select ref="selectMap" @onProvince="onProvince" @onCity="onCity" @onCounty="onCounty"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item label="详细地址：" prop="address">
              <el-input v-model="dialogForm.address" maxlength="200" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="handleDialogForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MapSelect from '@/component/base/province-select'
import model from '@/model/customer'
import { f_relation, relationData } from 'lin/format/workSheet'
import { productType, productTypeData } from 'lin/format/customer'
import Utils from 'lin/util/util'
export default {
  props: {
    editDsiabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '添加产品',
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    rowData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // 产品客户信息
    clientInfo: {
      type: Object,
      default: () => {}
    },
    clientId: {
      type: String,
    }
  },
  data() {
    return {
      f_relation: f_relation,
      productType: productType,
      productTypeData: productTypeData(),
      relationData: relationData(),
      dialogForm: {
        p_type: 1,
        p_code: '',
        name: '',
        sex: '',
        age: '',
        phone: '',
        relation: '',
        is_self: 1,
        province: '',
        city: '',
        district: '',
        address: '',
        relation: 0
      },
      dialogRules: {
        p_code: [
          { required: true, message: '请输入产品编码', trigger: 'blur' },
        ],
        p_type: [
          { required: true, message: '请选择产品类型', trigger: 'change' },
        ],
        phone: [
          { required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              const regPhone = /^1\d{10}$/
              if (value === '') {
                callback(new Error('请输入手机号哟'));
              } else if (!regPhone.test(value)) {
                callback(new Error('请输入正确的手机号格式'));
              } else {
                callback();
              }
            }
          },
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {},
  watch: {
    rowData(val) {
      if (Object.keys(val).length) {
        this.dialogForm.name = val.name || val.client_name
        this.dialogForm.sex = val.sex
        this.dialogForm.age = val.age
        this.dialogForm.phone = val.phone
        this.dialogForm.province = val.province
        this.dialogForm.city = val.city
        this.dialogForm.district = val.district
        this.dialogForm.address = val.address
        const {province, city, district} = val
        const mapData = {
          province: province,
          city: city,
          county: district,
        }
        this.$nextTick(() => {
          this.$refs.selectMap.map = mapData
        })
        if(this.title === '编辑产品') {
           this.dialogForm.relation = Number(val.relation)
           this.dialogForm.p_code = val.p_code
           this.dialogForm.p_type = val.p_type
           this.dialogForm.p_id = val.p_id
           this.getIsSelf(val.p_code)
        }
      }
    },
  },
  components: {
    MapSelect,
  },
  methods: {
    // 更新客户产品列表
    getProductsList() {
      this.$emit('getProductsList')
    },
    handleDialogForm() {
      this.$refs['dialogForm'].validate(valid => {
        if (valid) {
          this.submitForm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submitForm() {
      try {
        let response = {}
        if(this.dialogForm.p_id) {  // 编辑
          response = await model.editProduct(this.dialogForm.p_id, this.dialogForm)
          await this.productEdit(this.clientId, this.dialogForm.p_id, {is_self: this.dialogForm.is_self})
        } else {  // 创建
          response = await model.addProduct(this.clientId, this.dialogForm)
        }
        const { code, message } = response
        if(code === 11) {
          this.$message.success(message)
          this.closeDialog()
          this.getProductsList()
        } else {
          this.$message.error(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 单独修改is_self字段
    async productEdit(clientId, p_id, params) {
      const {code, data } = await model.productEdit(clientId, p_id, params)
    },
    // 选择是否本人
    changeIsSelf(val) {
      if(val === 1) { // 是本人
        this.relationData = relationData()
        this.dialogForm.relation = 0
        if (this.title === '添加产品' && Object.keys(this.clientInfo).length) {
            const clientInfo = Utils.deepClone(this.clientInfo)
            this.dialogForm.name = clientInfo.client_name
            this.dialogForm.age = clientInfo.age
            this.dialogForm.sex = clientInfo.sex
            this.dialogForm.phone = clientInfo.phone
            this.dialogForm.province = clientInfo.province
            this.dialogForm.city = clientInfo.city
            this.dialogForm.district = clientInfo.district
            this.dialogForm.address = clientInfo.address
            const mapData = {
              province: clientInfo.province,
              city: clientInfo.city,
              county: clientInfo.district,
            }
            this.$nextTick(() => {
              this.$refs.selectMap.map = mapData
            })
        }
      } else {
        this.relationData = relationData(true)
        this.dialogForm.relation = 1
      }
    },
    onProvince(val) {
      this.dialogForm.province = val.province
    },
    onCity(val) {
      this.dialogForm.city = val.city
    },
    onCounty(val) {
      this.dialogForm.district = val.county
    },
    // 获取产品的is_self字段
    async getIsSelf(p_code) {
      try {
        const { code, data } = await model.getProduct(this.clientInfo.client_id, {p_code: p_code})
        if(code === 11 && data.length) {
          const product = data[0]
          this.dialogForm.is_self = product.is_self
          if(product.is_self === 0) {
            this.relationData = relationData(true)
          }
          if(product.is_self === 1) {
            this.relationData = relationData()
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    closeDialog() {
      this.$emit('closeDialog')
      this.dialogForm = {
        p_type: 1,
        p_code: '',
        name: '',
        sex: '',
        age: '',
        phone: '',
        relation: '',
        is_self: 1,
        province: '',
        city: '',
        district: '',
        address: '',
        relation: 0
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px 30px;
  position: relative;
}
</style>
