<template>
  <div class="container-content" :class="{ mr60: toFixed }">
    <div @click="togglePanel" :class="{ theme_color: isOpen, order_collapse: !toFixed, unfold_collapse: toFixed }">
      <i :class="isOpen ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i
      ><span v-text="isOpen ? '折叠全部' : '展开全部'"></span>
    </div>
    <el-form
      :model="dialogForm"
      size="small"
      :inline="false"
      label-width="130px"
      ref="dialogForm"
      :disabled="editDsiabled"
      :rules="dialogRules"
    >
      <el-collapse :class="{ 'third-title': isInOrder }" v-model="collapseName">
        <!-- 客户信息 -->
        <el-collapse-item title="客户信息" :name="1" v-if="!isInOrder">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="姓名：">
                <span>{{dialogForm.client_name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话：">
                <span>{{dialogForm.phone}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在省市：">
                <span>{{dialogForm.province}}{{dialogForm.city}}{{dialogForm.district}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="详细地址：">
                <span>{{dialogForm.address}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="注册时间：">
                <span>{{dialogForm.register_time}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <!-- 基本信息 -->
        <el-collapse-item title="基本信息" :name="2">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="产品编码：">
                <span>{{dialogForm.p_code}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="归属经销商：">
                <span>{{dialogForm.agent_name}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <!-- 使用人基础信息（售后服务）此处调用添加产品的接口addProduct -->
        <el-collapse-item title="使用人基础信息" :name="3">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="是否本人：">
                <span v-if="isView" v-text="productUser.is_self === 1 ? '是' : '否'"></span>
                <el-radio-group v-else v-model="productUser.is_self" @change="changeSelfInject">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="关系：">
                <span v-if="isView">{{ f_relation(productUser.relation) }}</span>
                <el-select
                  v-else
                  v-model="productUser.relation"
                  :disabled="productUser.is_self === 1"
                  style="width: 100%;"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in relationData"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用者姓名：">
                <span v-if="isView">{{ productUser.name }}</span>
                <el-input v-else maxlength="20" v-model="productUser.name" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="使用者电话：" label-width="110px" prop="phone">
                <span v-if="isView">{{ productUser.phone }}</span>
                <el-input v-else maxlength="11" v-model="productUser.phone" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄：">
                <span v-if="isView">{{ productUser.age }}</span>
                <number-input v-else :integerOnly="true" v-model="productUser.age" placeholder="请输入"></number-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别：">
                <span v-if="isView">{{ productUser.sex === 1 ? '女' : '男'}}</span>
                <el-radio-group v-else v-model="productUser.sex">
                  <el-radio :label="0">男</el-radio>
                  <el-radio :label="1">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="使用者所在地:" label-width="120px" prop="province">
                <span v-if="isView">{{ productUser.province }}{{ productUser.city }}{{ productUser.district }}</span>
                <map-select
                  v-else
                  ref="userMapSelect"
                  @onProvince="onUserProvince"
                  @onCity="onUserCity"
                  @onCounty="onUserCounty"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="16">
              <el-form-item label="详细地址：">
                <span v-if="isView">{{productUser.address}}</span>
                <el-input v-else v-model="productUser.address" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <!-- 首次回访 -->
        <template v-if="activeName === 'first'">
          <!-- 有针注射糖尿病情况 -->
          <el-collapse-item title="有针注射糖尿病情况" :name="4">
            <!-- 糖尿病情况 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="糖尿病类型：">
                    <span v-if="isView">{{diabetesFormat(vistfirst.needle.diabetes_type)}}</span>
                    <el-select v-else v-model="vistfirst.needle.diabetes_type" placeholder="请选择">
                      <el-option
                        v-for="item in diabetesTypeList"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="糖尿病确诊时间：">
                    <span v-if="isView">{{dateFormat(vistfirst.needle.confirm_time)}}</span>
                    <el-date-picker
                      v-else
                      v-model="vistfirst.needle.confirm_time"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="胰岛素注射年限：" label-width="130px">
                    <span v-if="isView">{{vistfirst.needle.inject_years}}年</span>
                    <number-input v-else :remain="2" v-model="vistfirst.needle.inject_years" placeholder="请输入"></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row  :gutter="24">
                <el-col :span="8">
                  <el-form-item label="胰岛素种类：">
                    <span v-if="isView">{{insulinTypeFormat(vistfirst.needle.insulin_type)}}</span>
                    <el-select v-else v-model="vistfirst.needle.insulin_type" placeholder="请选择">
                      <el-option
                        v-for="item in insulinTypeList"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="170px" label="最后一次糖化血红蛋白：">
                    <span v-if="isView">{{ vistfirst.needle.hba1c_value }}%</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="%"
                      v-model="vistfirst.needle.hba1c_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <!-- 胰岛素注射方案 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8" class="second_title">
                  <el-form-item label="胰岛素注射方案：" label-width="140px"> </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="早餐计量：" label-width="90px">
                    <span v-if="isView">{{vistfirst.needle.breakfast_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="vistfirst.needle.breakfast_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="午餐计量：" label-width="90px">
                    <span v-if="isView">{{vistfirst.needle.lunch_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="vistfirst.needle.lunch_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="晚餐计量：" label-width="90px">
                    <span v-if="isView">{{vistfirst.needle.dinner_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="vistfirst.needle.dinner_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="睡前计量：" label-width="90px">
                    <span v-if="isView">{{vistfirst.needle.sleep_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="vistfirst.needle.sleep_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <!-- 血糖控制情况 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8" class="second_title">
                  <el-form-item label="血糖控制情况：" label-width="140px"></el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="空腹血糖值：" label-width="120px">
                    <span v-if="isView">{{vistfirst.needle.empty_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="vistfirst.needle.empty_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="早餐后血糖值：" label-width="120px">
                    <span v-if="isView">{{vistfirst.needle.breakfast_after_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="vistfirst.needle.breakfast_after_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="午餐前血糖值：" label-width="120px">
                    <span v-if="isView">{{vistfirst.needle.lunch_before_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="vistfirst.needle.lunch_before_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="午餐后血糖值：" label-width="120px">
                    <span v-if="isView">{{vistfirst.needle.lunch_after_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="vistfirst.needle.lunch_after_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="晚餐前血糖值：" label-width="120px">
                    <span v-if="isView">{{vistfirst.needle.dinner_before_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="vistfirst.needle.dinner_before_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="晚餐后血糖值：" label-width="120px">
                    <span v-if="isView">{{vistfirst.needle.dinner_after_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="vistfirst.needle.dinner_after_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="睡前血糖值：" label-width="120px">
                    <span v-if="isView">{{vistfirst.needle.sleep_before_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="vistfirst.needle.sleep_before_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <!-- 有未发生过低血糖 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8" class="second_title">
                  <el-form-item label="有未发生过低血糖：" label-width="140px" />
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否有低血糖症状：" label-width="150px">
                    <span v-if="isView">{{ vistfirst.needle.has_hypoglycemia === 1 ? '有' : '无' }}</span>
                    <el-radio-group
                      v-else
                      v-model="vistfirst.needle.has_hypoglycemia"
                      class="inline_group"
                      style="width: 150px;"
                    >
                      <el-radio :label="1">有</el-radio>
                      <el-radio :label="0">无</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && vistfirst.needle.has_hypoglycemia === 1"
                    >
                      {{vistfirst.needle.hypoglycemia_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && vistfirst.needle.has_hypoglycemia === 1"
                      style="width: 50%;"
                      v-model="vistfirst.needle.hypoglycemia_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="低血糖频率：">
                    <span v-if="isView">{{vistfirst.needle.hypoglycemia_rate}}</span>
                    <el-input v-else v-model="vistfirst.needle.hypoglycemia_rate" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="低血糖时间：">
                    <span v-if="isView">{{dateFormat(vistfirst.needle.hypoglycemia_time)}}</span>
                    <el-date-picker
                      v-else
                      v-model="vistfirst.needle.hypoglycemia_time"
                      type="datetime"
                      format="yyyy-MM-dd hh:mm"
                      value-format="yyyy-MM-dd hh:mm"
                      placeholder="选择日期时间"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="血糖值：">
                    <span v-if="isView">{{vistfirst.needle.hypoglycemia_value}}</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="vistfirst.needle.hypoglycemia_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-collapse-item>
          <!-- 有针注射问题 -->
          <el-collapse-item title="有针注射问题" :name="5">
            <template>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="疼痛：" label-width="130px">
                    <span v-if="isView">{{painLevel(vistfirst.needle.pain_level)}}</span>
                    <el-radio-group v-else v-model="vistfirst.needle.pain_level">
                      <el-radio :label="0">0分</el-radio>
                      <el-radio :label="1">3分</el-radio>
                      <el-radio :label="2">6分</el-radio>
                      <el-radio :label="3">10分</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="有无硬结：" label-width="130px">
                    <span v-if="isView">{{formatBoolean(vistfirst.needle.has_harden, true)}}</span>
                    <el-radio-group class="inline_group" v-else v-model="vistfirst.needle.has_harden">
                      <el-radio :label="true">有</el-radio>
                      <el-radio :label="false">无</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="有针注射更换频率：" label-width="140px">
                    <span v-if="isView">{{vistfirst.needle.change_rate}}</span>
                    <el-input v-else v-model="vistfirst.needle.change_rate" maxlength="10" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <template>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否漏液：" label-width="150px">
                    <span v-if="isView">{{ formatBoolean(vistfirst.needle.is_escaped) }}</span>
                    <el-radio-group class="inline_group" style="width: 150px;" v-else v-model="vistfirst.needle.is_escaped">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && vistfirst.needle.is_escaped"
                    >
                      {{ vistfirst.needle.escaped_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && vistfirst.needle.is_escaped"
                      style="width: 50%;"
                      v-model="vistfirst.needle.escaped_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否过敏：" label-width="150px">
                    <span v-if="isView">
                      {{ formatBoolean(vistfirst.needle.is_allergic) }}
                    </span>
                    <el-radio-group
                      v-else
                      class="inline_group"
                      style="width: 150px;"
                      v-model="vistfirst.needle.is_allergic">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && vistfirst.needle.is_allergic"
                    >
                      {{vistfirst.needle.allergic_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && vistfirst.needle.is_allergic"
                      style="width: 50%;"
                      v-model="vistfirst.needle.allergic_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否出血：" label-width="150px">
                    <span v-if="isView">{{ formatBoolean(vistfirst.needle.is_blood) }}
                    </span>
                    <el-radio-group
                      v-else
                      class="inline_group"
                      style="width: 150px;"
                      v-model="vistfirst.needle.is_blood">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && vistfirst.needle.is_blood"
                    >
                      {{vistfirst.needle.blood_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && vistfirst.needle.is_blood"
                      style="width: 50%;"
                      v-model="vistfirst.needle.blood_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否淤青：" label-width="150px">
                    <span v-if="isView">{{ formatBoolean(vistfirst.needle.is_bruise) }}</span>
                    <el-radio-group
                      v-else
                      class="inline_group"
                      style="width: 150px;"
                      v-model="vistfirst.needle.is_bruise">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && vistfirst.needle.is_bruise"
                    >
                      {{vistfirst.needle.bruise_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && vistfirst.needle.is_bruise"
                      style="width: 50%;"
                      v-model="vistfirst.needle.bruise_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <el-row>
              <el-col :span="16">
                <el-form-item label="其他：">
                  <span v-if="isView">{{vistfirst.needle.other_desc}}</span>
                  <el-input v-else type="textarea" v-model="vistfirst.needle.other_desc" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <!-- 无针注射糖尿病情况 -->
          <el-collapse-item title="无针注射糖尿病情况" :name="6">
            <el-row>
              <el-col :span="16">
                <el-form-item label="如何知道并购买：">
                  <span v-if="isView">
                    {{buyChannelFormat(vistfirst.inject.buy_channel)}}
                  </span>
                  <span v-if="isView && vistfirst.inject.buy_channel === 4">
                    {{vistfirst.inject.other_channel}}
                  </span>
                  <el-select
                    v-if="!isView"
                    v-model="vistfirst.inject.buy_channel"
                    style="width: calc(50% - 70px);"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in buyChannelList"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code">
                    </el-option>
                  </el-select>
                  <el-input
                    v-if="!isView && vistfirst.inject.buy_channel === 4"
                    style="width: 30%;"
                    v-modle="vistfirst.inject.other_channel"
                    placeholder="请输入购买渠道" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否本人注射：">
                  <span v-if="isView">{{
                    formatBoolean(vistfirst.inject.is_self_inject)}}</span>
                  <el-radio-group v-else v-model="vistfirst.inject.is_self_inject">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="首次注射时间：">
                  <span v-if="isView">
                    {{dateFormat(vistfirst.inject.inject_first_time, 'yyyy-MM-dd')}}
                  </span>
                  <el-date-picker
                    v-else
                    v-model="vistfirst.inject.inject_first_time"
                    type="date"
                    style="width: 100%;"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="胰岛素种类：">
                  <span v-if="isView">
                    {{insulinTypeFormat(vistfirst.inject.insulin_type)}}
                  </span>
                  <el-select v-else v-model="vistfirst.inject.insulin_type" placeholder="请选择">
                      <el-option
                        v-for="item in insulinTypeList"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="160px" label="是否到正规医院调糖：">
                  <span v-if="isView">
                    {{formatBoolean(vistfirst.inject.is_treatment_hospital)}}
                  </span>
                  <el-radio-group v-else v-model="vistfirst.inject.is_treatment_hospital">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
             <!-- 胰岛素注射方案 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8" class="second_title">
                  <el-form-item label="胰岛素注射方案：" label-width="140px"> </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="早餐计量：" label-width="90px">
                    <span v-if="isView">{{vistfirst.inject.breakfast_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="vistfirst.inject.breakfast_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="午餐计量：" label-width="90px">
                    <span v-if="isView">{{vistfirst.inject.lunch_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="vistfirst.inject.lunch_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="晚餐计量：" label-width="90px">
                    <span v-if="isView">{{vistfirst.inject.dinner_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="vistfirst.inject.dinner_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="睡前计量：" label-width="90px">
                    <span v-if="isView">{{vistfirst.inject.sleep_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="vistfirst.inject.sleep_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-collapse-item>
          <!-- 无针注射问题 -->
          <el-collapse-item title="无针注射问题" :name="7">
            <template>
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="疼痛：" label-width="130px">
                    <span v-if="isView">
                      {{painLevel(vistfirst.question.pain_level)}}
                    </span>
                    <el-radio-group v-else v-model="vistfirst.question.pain_level">
                      <el-radio :label="0">0分</el-radio>
                      <el-radio :label="1">3分</el-radio>
                      <el-radio :label="2">6分</el-radio>
                      <el-radio :label="3">10分</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="有无硬结：" label-width="130px">
                    <span v-if="isView">{{formatBoolean(vistfirst.question.has_harden, true)}}</span>
                     <el-radio-group
                      v-else
                      class="inline_group"
                      v-model="vistfirst.question.has_harden">
                      <el-radio :label="true">有</el-radio>
                      <el-radio :label="false">无</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <!-- 遇到问题 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否漏液：" label-width="150px">
                    <span v-if="isView">
                      {{formatBoolean(vistfirst.question.is_escaped)}}
                    </span>
                    <el-radio-group class="inline_group" style="width: 150px;" v-else v-model="vistfirst.question.is_escaped">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && vistfirst.question.is_escaped"
                    >
                      {{vistfirst.question.escaped_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && vistfirst.question.is_escaped"
                      style="width: 50%;"
                      v-model="vistfirst.question.escaped_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否过敏：" label-width="150px">
                    <span v-if="isView">
                      {{formatBoolean(vistfirst.question.is_allergic)}}
                    </span>
                    <el-radio-group class="inline_group" style="width: 150px;" v-else v-model="vistfirst.question.is_allergic">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && vistfirst.question.is_allergic"
                    >
                      {{vistfirst.question.allergic_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && vistfirst.question.is_allergic"
                      style="width: 50%;"
                      v-model="vistfirst.question.allergic_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否出血：" label-width="150px">
                    <span v-if="isView">
                      {{formatBoolean(vistfirst.question.is_blood)}}
                    </span>
                    <el-radio-group class="inline_group" style="width: 150px;" v-else v-model="vistfirst.question.is_blood">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && vistfirst.question.is_blood"
                    >
                      {{vistfirst.question.blood_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && vistfirst.question.is_blood"
                      style="width: 50%;"
                      v-model="vistfirst.question.blood_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="操作难易：" label-width="150px">
                    <span v-if="isView">
                      {{ vistfirst.question.operate_difficulty === 0 ? '容易'
                        : vistfirst.question.operate_difficulty === 1 ? '比较复杂'
                        : vistfirst.question.operate_difficulty === 2 ? '非常复杂' : ''
                      }}
                    </span>
                    <el-select v-else v-model="vistfirst.question.operate_difficulty" placeholder="请选择">
                      <el-option label="容易" :value="0" />
                      <el-option label="比较复杂" :value="1" />
                      <el-option label="非常复杂" :value="2" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <el-row>
              <el-col :span="16">
                <el-form-item label="备注：">
                  <span v-if="isView">{{vistfirst.question.remark}}</span>
                  <el-input v-else type="textarea" v-model="vistfirst.question.remark" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </template>
        <!-- 7天/三个月回访 -->
        <template v-if="activeName === 'second' || activeName === 'third'">
          <!-- 无针注射糖尿病情况 -->
          <el-collapse-item title="无针注射糖尿病情况" :name="4">
            <el-row :gutter="24">
              <el-col :span="8">
                  <el-form-item label="胰岛素种类：">
                    <span v-if="isView">{{insulinTypeFormat(visit7days.inject.insulin_type)}}</span>
                    <el-select
                      v-else
                      v-model="visit7days.inject.insulin_type"
                      placeholder="请选择">
                      <el-option
                        v-for="item in insulinTypeList"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="170px" label="最后一次糖化血红蛋白：">
                  <span v-if="isView">{{ visit7days.blood.hba1c_value }}%</span>
                  <number-input
                    v-else
                    :remain="2"
                    slotName="%"
                    v-model="visit7days.blood.hba1c_value"
                    placeholder="请输入"
                  ></number-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 胰岛素注射方案 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8" class="second_title">
                  <el-form-item label="胰岛素注射方案：" label-width="140px"> </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="早餐计量：" label-width="90px">
                    <span v-if="isView">{{visit7days.inject.breakfast_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="visit7days.inject.breakfast_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="午餐计量：" label-width="90px">
                    <span v-if="isView">{{visit7days.inject.lunch_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="visit7days.inject.lunch_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="晚餐计量：" label-width="90px">
                    <span v-if="isView">{{visit7days.inject.dinner_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="visit7days.inject.dinner_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="睡前计量：" label-width="90px">
                    <span v-if="isView">{{visit7days.inject.sleep_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="visit7days.inject.sleep_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <!-- 血糖控制情况 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8" class="second_title">
                  <el-form-item label="血糖控制情况：" label-width="140px"></el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="空腹血糖值：" label-width="120px">
                    <span v-if="isView">{{visit7days.blood.empty_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="visit7days.blood.empty_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="早餐后血糖值：" label-width="120px">
                    <span v-if="isView">{{visit7days.blood.breakfast_after_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="visit7days.blood.breakfast_after_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="午餐前血糖值：" label-width="120px">
                    <span v-if="isView">{{visit7days.blood.lunch_before_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="visit7days.blood.lunch_before_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="午餐后血糖值：" label-width="120px">
                    <span v-if="isView">{{visit7days.blood.lunch_after_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="visit7days.blood.lunch_after_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="晚餐前血糖值：" label-width="120px">
                    <span v-if="isView">{{visit7days.blood.dinner_before_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="visit7days.blood.dinner_before_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="晚餐后血糖值：" label-width="120px">
                    <span v-if="isView">{{visit7days.blood.dinner_after_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="visit7days.blood.dinner_after_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="睡前血糖值：" label-width="120px">
                    <span v-if="isView">{{visit7days.blood.sleep_before_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="visit7days.blood.sleep_before_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <!-- 有未发生过低血糖 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8" class="second_title">
                  <el-form-item label="有未发生过低血糖：" label-width="140px"> </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否有低血糖症状：" label-width="150px">
                    <span v-if="isView">
                      {{visit7days.blood.has_hypoglycemia == true ? '是'
                        : visit7days.blood.has_hypoglycemia == false ? '否' : ''}}
                    </span>
                    <el-radio-group
                     class="inline_group"
                     style="width: 150px;"
                     v-else
                     v-model="visit7days.blood.has_hypoglycemia">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && visit7days.blood.has_hypoglycemia"
                    >
                      {{visit7days.blood.hypoglycemia_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && visit7days.blood.has_hypoglycemia"
                      style="width: 50%;"
                      v-model="visit7days.blood.hypoglycemia_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="低血糖频率：">
                    <span v-if="isView">{{visit7days.blood.hypoglycemia_rate}}</span>
                    <el-input v-else v-model="visit7days.blood.hypoglycemia_rate" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="低血糖时间：">
                    <span v-if="isView">{{visit7days.blood.hypoglycemia_time}}</span>
                    <el-date-picker
                      v-else
                      v-model="visit7days.blood.hypoglycemia_time"
                      type="datetime"
                      format="yyyy-MM-dd hh:mm"
                      value-format="yyyy-MM-dd hh:mm"
                      placeholder="选择日期时间"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="血糖值：">
                    <span v-if="isView">{{visit7days.blood.hypoglycemia_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="visit7days.blood.hypoglycemia_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-collapse-item>
          <!-- 无针注射问题 -->
          <el-collapse-item title="无针注射问题" :name="5" v-if="activeName === 'second'">
            <!-- 注射感受 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8" class="second_title">
                  <el-form-item label="注射感受："> </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="疼痛：" label-width="130px">
                    <span v-if="isView">
                      {{painLevel(visit7days.question.pain_level)}}
                    </span>
                    <el-radio-group v-else v-model="visit7days.question.pain_level">
                      <el-radio :label="0">0分</el-radio>
                      <el-radio :label="1">3分</el-radio>
                      <el-radio :label="2">6分</el-radio>
                      <el-radio :label="3">10分</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="操作难易：" label-width="130px">
                    <span v-if="isView">
                      {{ visit7days.question.operate_difficulty === 0 ? '容易'
                        : visit7days.question.operate_difficulty === 1 ? '比较复杂'
                        : visit7days.question.operate_difficulty === 2 ? '非常复杂': ''
                      }}
                    </span>
                    <el-select v-else v-model="visit7days.question.operate_difficulty" placeholder="请选择">
                      <el-option label="容易" :value="0"></el-option>
                      <el-option label="比较复杂" :value="1"></el-option>
                      <el-option label="非常复杂" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="其他：" label-width="130px">
                    <span v-if="isView">{{visit7days.question.other_feel}}</span>
                    <el-input v-else v-model="visit7days.question.other_feel" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <!-- 遇到问题 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8" class="second_title">
                  <el-form-item label="遇到问题："> </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="是否漏液：" label-width="150px">
                    <span v-if="isView">
                      {{formatBoolean(visit7days.question.is_escaped)}}
                    </span>
                    <el-radio-group
                      class="inline_group"
                      style="width: 150px;"
                      v-else
                      v-model="visit7days.question.is_escaped">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && visit7days.question.is_escaped"
                    >
                      {{visit7days.question.escaped_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && visit7days.question.is_escaped"
                      style="width: 50%;"
                      v-model="visit7days.question.escaped_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否过敏：" label-width="150px">
                    <span v-if="isView">
                      {{formatBoolean(visit7days.question.is_allergic)}}
                    </span>
                    <el-radio-group class="inline_group" style="width: 150px;" v-else v-model="visit7days.question.is_allergic">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && visit7days.question.is_allergic"
                    >
                      {{visit7days.question.allergic_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && visit7days.question.is_allergic"
                      style="width: 50%;"
                      v-model="visit7days.question.allergic_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="是否出血：" label-width="150px">
                    <span v-if="isView">
                      {{ formatBoolean(visit7days.question.is_blood)}}
                    </span>
                    <el-radio-group class="inline_group" style="width: 150px;" v-else v-model="dialogForm.allergy">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && visit7days.question.is_blood"
                    >
                      {{visit7days.question.blood_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && visit7days.question.is_blood"
                      style="width: 50%;"
                      v-model="visit7days.question.blood_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="有无淤青：" label-width="150px">
                    <span v-if="isView">
                      {{formatBoolean(visit7days.question.is_bruise)}}
                    </span>
                    <el-radio-group class="inline_group" style="width: 150px;" v-else v-model="dialogForm.allergy">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && visit7days.question.is_bruise"
                    >
                      {{visit7days.question.bruise_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && visit7days.question.is_bruise"
                      style="width: 50%;"
                      v-model="visit7days.question.bruise_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <el-row>
              <el-col :span="8">
                <el-form-item label="其他：">
                  <span v-if="isView">{{visit7days.question.other_question}}</span>
                  <el-input v-else v-model="visit7days.question.other_question" maxlength="100" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="药管更换频率：">
                  <span v-if="isView">{{visit7days.question.material_rate}}</span>
                  <el-input v-else v-model="visit7days.question.material_rate" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="推荐给其他糖友：">
                  <span v-if="isView">
                    {{
                      visit7days.question.recommend_level === 0
                      ? '不愿意' : visit7days.question.recommend_level === 1 ?
                      '愿意' :  visit7days.question.recommend_level === 2 ? '非常愿意' : ''
                    }}
                  </span>
                  <el-radio-group class="inline_group" v-else v-model="visit7days.question.recommend_level">
                    <el-radio :label="0">不愿意</el-radio>
                    <el-radio :label="1">愿意</el-radio>
                    <el-radio :label="2">非常愿意</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="备注：">
                  <span v-if="isView">{{visit7days.question.remark}}</span>
                  <el-input v-else type="textarea" v-model="visit7days.question.remark" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="无针注射问题" :name="5" v-if="activeName === 'third'">
            <!-- 是否再入院： -->
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="是否再入院：">
                  <span v-if="isView">
                     {{formatBoolean(visit90days.question.is_hospital)}}
                  </span>
                  <el-radio-group
                    v-else
                    style="width: 200px;"
                    class="inline_group"
                    v-model="visit90days.question.is_hospital">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                  <span v-if="isView && visit90days.question.is_hospital">
                    {{visit90days.question.hospital_reason}}
                  </span>
                  <el-input
                    class="inline_group"
                    style="width:calc(100% - 250px)"
                    v-if="!isView && visit90days.question.is_hospital"
                    v-model="visit90days.question.hospital_reason"
                    placeholder="请输入" />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 是否到正规医院调糖： -->
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="是否到正规医院调糖：" label-width="180px">
                  <span v-if="isView">
                    {{formatBoolean(visit90days.question.is_treatment_hospital)}}
                  </span>
                  <el-radio-group v-else v-model="visit90days.question.is_treatment_hospital">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 注射部位 -->
            <el-row :gutter="24">
              <el-col :span="16">
                <el-form-item label="注射部位：">
                  <span v-if="isView">{{injectBodyFormat(visit90days.question.inject_body)}}</span>
                  <el-checkbox-group v-else v-model="visit90days.question.inject_body">
                    <el-checkbox label="0">脐周</el-checkbox>
                    <el-checkbox label="1">上臂外侧</el-checkbox>
                    <el-checkbox label="2">大腿前外侧</el-checkbox>
                    <el-checkbox label="3">臀部外上侧</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="有无并发症：">
                  <span v-if="isView">{{formatBoolean(visit90days.question.has_complication)}}</span>
                  <el-radio-group v-else v-model="visit90days.question.has_complication">
                    <el-radio :label="true">有</el-radio>
                    <el-radio :label="false">无</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 并发症 -->
            <el-row :gutter="24" v-if="visit90days.question.has_complication">
              <el-col :span="16">
                <el-form-item label="并发症：">
                  <span v-if="isView">{{ disease(visit90days.disease.checkList) }}</span>
                  <el-checkbox-group v-else v-model="visit90days.disease.checkList">
                    <el-checkbox
                      v-for="item in diseaseData"
                      :key="item.code"
                      :label="item.code">
                        {{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="其他" label-width="60px">
                  <span v-if="isView">{{ visit90days.disease.otherDisease }}</span>
                  <el-input v-else v-model="visit90days.disease.otherDisease" style="width: 200px;" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="24">
                <el-form-item label="操作问题：">
                  <span v-if="isView">{{visit90days.question.operate_question}}</span>
                  <el-input v-else type="textarea" v-model="visit90days.question.operate_question" placeholder="请输入"></el-input>
                </el-form-item>
            </el-col>
            <!-- 推荐给其他糖友 -->
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="推荐给其他糖友：">
                  <span v-if="isView">
                    {{
                      visit90days.question.recommend_level === 0
                      ? '不愿意' : visit90days.question.recommend_level === 1 ?
                      '愿意' : visit90days.question.recommend_level === 2 ? '非常愿意' : ''
                    }}
                  </span>
                  <el-radio-group v-else v-model="visit90days.question.recommend_level">
                    <el-radio :label="0">不愿意</el-radio>
                    <el-radio :label="1">愿意</el-radio>
                    <el-radio :label="2">非常愿意</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

          </el-collapse-item>
        </template>
        <!-- 一年回访 -->
        <template v-if="activeName === 'fourth'">
          <!-- 无针注射糖尿病情况 -->
          <el-collapse-item title="无针注射糖尿病情况" :name="4">
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="胰岛素种类：">
                    <span v-if="isView">{{insulinTypeFormat(visit365days.inject.insulin_type)}}</span>
                    <el-select
                      v-else
                      v-model="visit365days.inject.insulin_type"
                      placeholder="请选择">
                      <el-option
                        v-for="item in insulinTypeList"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="170px" label="最后一次糖化血红蛋白：">
                  <span v-if="isView">{{visit365days.blood.hba1c_value}}%</span>
                  <number-input
                    v-else
                    :remain="2"
                    slotName="%"
                    v-model="visit365days.blood.hba1c_value"
                    placeholder="请输入"
                  ></number-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 胰岛素注射方案 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8" class="second_title">
                  <el-form-item label="胰岛素注射方案：" label-width="140px"> </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="早餐计量：" label-width="90px">
                    <span v-if="isView">{{visit365days.inject.breakfast_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="visit365days.inject.breakfast_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="午餐计量：" label-width="90px">
                    <span v-if="isView">{{visit365days.inject.lunch_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="visit365days.inject.lunch_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="晚餐计量：" label-width="90px">
                    <span v-if="isView">{{visit365days.inject.dinner_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="visit365days.inject.dinner_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="睡前计量：" label-width="90px">
                    <span v-if="isView">{{visit365days.inject.sleep_dose}}</span>
                    <number-input
                      v-else
                      :integerOnly="true"
                      v-model="visit365days.inject.sleep_dose"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <!-- 有未发生过低血糖 -->
            <template>
              <el-row :gutter="24">
                <el-col :span="8" class="second_title">
                  <el-form-item label="有未发生过低血糖：" label-width="140px"> </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="是否有低血糖症状：" label-width="150px">
                    <span v-if="isView">
                        {{formatBoolean(visit365days.blood.has_hypoglycemia)}}
                    </span>
                    <el-radio-group
                     class="inline_group"
                     style="width: 150px;"
                     v-else
                     v-model="visit365days.blood.has_hypoglycemia">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                    <p
                      class="inline_group"
                      style="width: 50%;margin-left: 20px;"
                      v-if="isView && visit365days.blood.has_hypoglycemia"
                    >
                      {{visit365days.blood.hypoglycemia_desc}}
                    </p>
                    <el-input
                      class="inline_group"
                      v-if="!isView && visit365days.blood.has_hypoglycemia"
                      style="width: 50%;"
                      v-model="visit365days.blood.hypoglycemia_desc"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="低血糖频率：">
                    <span v-if="isView">{{visit365days.blood.hypoglycemia_rate}}</span>
                    <el-input v-else v-model="visit365days.blood.hypoglycemia_rate" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="低血糖时间：">
                    <span v-if="isView">{{visit365days.blood.hypoglycemia_time}}</span>
                    <el-date-picker
                      v-else
                      v-model="visit365days.blood.hypoglycemia_time"
                      type="datetime"
                      format="yyyy-MM-dd hh:mm"
                      value-format="yyyy-MM-dd hh:mm"
                      placeholder="选择日期时间"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="血糖值：">
                    <span v-if="isView">{{visit365days.blood.hypoglycemia_value}}mmol/l</span>
                    <number-input
                      v-else
                      :remain="2"
                      slotName="mmol/l"
                      v-model="visit365days.blood.hypoglycemia_value"
                      placeholder="请输入"
                    ></number-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

          </el-collapse-item>
          <!-- 无针注射问题 -->
          <el-collapse-item title="无针注射问题" :name="5">
            <!-- 注射部位，并发症 -->
            <el-row :gutter="24">
              <el-col :span="16">
                <el-form-item label="注射部位：">
                  <span v-if="isView">{{injectBodyFormat(visit365days.question.inject_body)}}</span>
                  <el-checkbox-group v-else v-model="visit365days.question.inject_body">
                    <el-checkbox label="0">脐周</el-checkbox>
                    <el-checkbox label="1">上臂外侧</el-checkbox>
                    <el-checkbox label="2">大腿前外侧</el-checkbox>
                    <el-checkbox label="3">臀部外上侧</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="有无并发症：">
                  <span v-if="isView">{{formatBoolean(visit365days.question.has_complication)}}</span>
                  <el-radio-group v-else v-model="visit365days.question.has_complication">
                    <el-radio :label="true">有</el-radio>
                    <el-radio :label="false">无</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 并发症： -->
            <el-row :gutter="24" v-if="visit365days.question.has_complication">
              <el-col :span="16">
                <el-form-item label="并发症：">
                  <span v-if="isView">{{ disease(visit365days.disease.checkList) }}</span>
                  <el-checkbox-group v-else v-model="visit365days.disease.checkList">
                    <el-checkbox
                      v-for="item in diseaseData"
                      :key="item.code"
                      :label="item.code">
                        {{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="其他" label-width="60px">
                  <span v-if="isView">{{ visit365days.disease.otherDisease }}</span>
                  <el-input v-else v-model="visit365days.disease.otherDisease" style="width: 200px;" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 是否再入院： -->
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="是否再入院：">
                  <span v-if="isView">
                     {{formatBoolean(visit365days.question.is_hospital)}}
                  </span>
                  <el-radio-group
                    v-else
                    style="width: 200px;"
                    class="inline_group"
                    v-model="visit365days.question.is_hospital">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                  <span v-if="isView && visit365days.question.is_hospital">
                    {{visit365days.question.hospital_reason}}
                  </span>
                  <el-input
                    class="inline_group"
                    style="width:calc(100% - 250px)"
                    v-if="!isView && visit365days.question.is_hospital"
                    v-model="visit365days.question.hospital_reason"
                    placeholder="请输入" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="16">
                <el-form-item label="脱落原因：">
                  <span v-if="isView">{{visit365days.question.drop_reason}}</span>
                  <el-input v-else v-model="visit365days.question.drop_reason" maxlength="100" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否到正规医院调糖：" label-width="180px">
                  <span v-if="isView">
                    {{formatBoolean(visit365days.question.is_treatment_hospital)}}
                  </span>
                  <el-radio-group v-else v-model="visit365days.question.is_treatment_hospital">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="推荐给其他糖友：">
                  <span v-if="isView">
                    {{
                      visit365days.question.recommend_level === 0
                      ? '不愿意' : visit365days.question.recommend_level === 1 ?
                      '愿意' : visit365days.question.recommend_level === 2 ? '非常愿意' : ''
                    }}
                  </span>
                  <el-radio-group v-else v-model="visit365days.question.recommend_level">
                    <el-radio :label="0">不愿意</el-radio>
                    <el-radio :label="1">愿意</el-radio>
                    <el-radio :label="2">非常愿意</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="使用感受：">
                  <span v-if="isView">
                    {{feelLevelFormat(visit365days.question.feel_level)}}
                  </span>
                  <el-radio-group v-else v-model="visit365days.question.feel_level">
                    <el-radio :label="0">差</el-radio>
                    <el-radio :label="1">良好</el-radio>
                    <el-radio :label="2">好</el-radio>
                    <el-radio :label="3">非常好</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="再次启用率：">
                  <span v-if="isView">{{visit365days.question.reuse_rate}}</span>
                  <el-input v-else v-model="visit365days.question.reuse_rate" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="备注：">
                  <span v-if="isView">{{visit365days.question.remark}}</span>
                  <el-input v-else type="textarea" v-model="visit365days.question.remark" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </template>
      </el-collapse>
    </el-form>
  </div>
</template>

<script>
import Utils, { dateFormat } from 'lin/util/util'
import { problemData, channelData } from 'lin/format/replace-sheet'
import { painLevel, relationData, f_relation, diseaseData, disease } from 'lin/format/workSheet'
import { buyChannelData, buyChannelFormat, diabetesTypeData, diabetesFormat, insulinTypeData, insulinTypeFormat, injectBodyFormat, feelLevelFormat } from 'lin/format/visit'
import MapSelect from '@/component/base/province-select'
import Model from '@/model/visit'
import modelCustomer from '@/model/customer'
import NumberInput from '@/component/base/number-input'

export default {
  components: {
    NumberInput,
    MapSelect
  },
  props: {
    editDsiabled: {
      type: Boolean,
      default: false,
    },
    isView: {
      type: Boolean,
      default: false,
    },
    // 用于标记该组件是否是用在了工单中
    isInOrder: {
      type: Boolean,
      default: false,
    },
    activeName: {
      type: String,
      default: 'first',
    },
    toFixed: {
      type: Boolean,
      default: true,
    },
    // 列表条目信息
    visitInfo: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      painLevel,
      f_relation,
      dateFormat,
      injectBodyFormat,
      feelLevelFormat,
      disease,
      buyChannelFormat,
      diabetesFormat,
      insulinTypeFormat,
      relationData: relationData(),
      buyChannelList: buyChannelData(),
      diseaseData: diseaseData(),
      collapseName: [1, 2, 3, 4, 5, 6, 7],
      dialogRules: {},
      productsIssues: problemData(),
      purChannels: channelData(),
      isOpen: true,
      diabetesTypeList: diabetesTypeData(),
      insulinTypeList: insulinTypeData(),
      dialogForm: {
        client_id: '',
        client_name: '',
        age: '',
        sex: '',
        register_time: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        address: '',
      },
      productUser: {
        is_self: '',
        relation: '',
        name: '',
        phone: '',
        age: '',
        sex: '',
        province: '',
        city: '',
        district: '',
        address: '',
      },
      vistfirst: {
        needle: { // 有针注射
          user_id: '',
          diabetes_type: '',
          confirm_time: '',
          inject_years: '',
          insulin_type: '',
          hba1c_value: '',
          breakfast_dose: '',
          lunch_dose: '',
          dinner_dose: '',
          sleep_dose: '',
          empty_value: '',
          breakfast_after_value: '',
          lunch_before_value: '',
          lunch_after_value: '',
          dinner_before_value: '',
          dinner_after_value: '',
          sleep_before_value: '',
          has_hypoglycemia: '',
          hypoglycemia_desc: '',
          hypoglycemia_rate: '',
          hypoglycemia_time: '',
          hypoglycemia_value: '',
          pain_level: '',
          has_harden: '',
          is_allergic: '',
          allergic_desc: '',
          is_blood: '',
          blood_desc: '',
          is_escaped: '',
          escaped_desc: '',
          is_bruise: '',
          bruise_desc: '',
          change_rate: '',
          other_desc: '',
        },
        inject: { // 无针注射糖尿病情况
          user_id: '',
          buy_channel: '',
          other_channel: '',
          is_self_inject: '',
          inject_first_time: '',
          insulin_type: '',
          breakfast_dose: '',
          lunch_dose: '',
          dinner_dose: '',
          sleep_dose: '',
        },
        question: { // 无针注射产品问题
          user_id: '',
          pain_level: '',
          has_harden: '',
          is_allergic: '',
          allergic_desc: '',
          is_blood: '',
          blood_desc: '',
          is_escaped: '',
          escaped_desc: '',
          operate_difficulty: '',
          remark: '',
        }
      },
      visit7days: { // 7天和3个月的回访有重合的部分
        inject: {
          user_id: '',
          insulin_type: '',
          breakfast_dose: '',
          lunch_dose: '',
          dinner_dose: '',
          sleep_dose: '',
        },
        blood: {
          user_id: '',
          hba1c_value: '',
          empty_value: '',
          breakfast_after_value: '',
          lunch_before_value: '',
          lunch_after_value: '',
          dinner_before_value: '',
          dinner_after_value: '',
          sleep_before_value: '',
          has_hypoglycemia: '',
          hypoglycemia_desc: '',
          hypoglycemia_rate: '',
          hypoglycemia_time: '',
          hypoglycemia_value: '',
        },
        question: {
          user_id: '',
          pain_level: '',
          operate_difficulty: '',
          other_feel: '',
          is_allergic: '',
          allergic_desc: '',
          is_blood: '',
          blood_desc: '',
          is_escaped: '',
          escaped_desc: '',
          is_bruise: '',
          bruise_desc: '',
          other_question: '',
          material_rate: '',
          recommend_level: '',
          remark: '',
        }
      },
      visit90days: {
        question: {
          user_id: '',
          is_hospital: '',
          hospital_reason: '',
          is_treatment_hospital: '',
          inject_body: [],
          has_complication: '',
          operate_question: '',
          recommend_level: ''
        },
        disease: {
          checkList: [],
          otherDisease: '',
        },
      },
      visit365days: {
        inject: {
          user_id: '',
          insulin_type: '',
          breakfast_dose: '',
          lunch_dose: '',
          dinner_dose: '',
          sleep_dose: '',
        },
        blood: {
          user_id: '',
          hba1c_value: '',
          empty_value: '',
          breakfast_after_value: '',
          lunch_before_value: '',
          lunch_after_value: '',
          dinner_before_value: '',
          dinner_after_value: '',
          sleep_before_value: '',
          has_hypoglycemia: '',
          hypoglycemia_desc: '',
          hypoglycemia_rate: '',
          hypoglycemia_time: '',
          hypoglycemia_value: '',
        },
        question: {
          user_id: '',
          is_hospital: '',
          hospital_reason: '',
          is_treatment_hospital: '',
          inject_body: [],
          has_complication: '',
          complication: '',
          recommend_level: '',
          feel_level: '',
          drop_reason: '',
          reuse_rate: '',
          remark: '',
        },
        disease: {
          checkList: [],
          otherDisease: '',
        },

      }
    }
  },
  computed: {},
  watch: {
    visitInfo: {
      async handler(val) {
        if (!this.isInOrder) {
          await this.handleVisitInfo(val)
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async handleVisitInfo(data) {
      const val = Utils.deepClone(data)
      const { p_code, user_id } = val
      if (p_code) {
        /**
         * 在工单中查看的话，不需要再次请求，工单中会请求这部分信息，后期做一下处理
         * */
        await this.getClinet(p_code)
        await this.getProductUser(p_code)
      }
      if (user_id && this.isView) {
        // 默认首次的详情展示
        await this.getFirstVisit(val)
      }
    },
    // 获取客户信息
    async getClinet(p_code) {
      try {
        const { code, data } = await modelCustomer.getInfo({ p_code })
        if (code === 11) {
          const clientInfo = Utils.deepClone(data)
          clientInfo.p_code = p_code
          this.dialogForm = Utils.assignObj(this.dialogForm, clientInfo)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取产品使用人信息
    async getProductUser(p_code) {
      try {
        const { code, data } = await modelCustomer.getProductUser({ p_code })
        if (code === 11) {
          this.productUser = Utils.deepClone(data)
          this.productUser.is_self = 0 // 默认不是本人
          this.dialogForm.p_id = data.p_id
          if (data.relation === 0) {
            this.productUser.is_self = 1
          }
          const { province, city, district } = data
          const mapData = {
            province,
            city,
            county: district,
          }
          if (!this.isView) {
            this.$nextTick(() => {
              this.$refs.userMapSelect.map = mapData
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
      await this.getIsSelf(p_code)
    },
    submitForm() {
      this.$refs.dialogForm.validate(async valid => {
        if (valid) {
          await this.updateProductUser()
          if (this.activeName === 'first') {
            await this.submitFirstVisit()
          } else if (this.activeName === 'second') {
            await this.submit7daysVisit()
          } else if (this.activeName === 'third') {
            await this.submit90daysVisit()
          } else if (this.activeName === 'fourth') {
            await this.submit365daysVisit()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取首次回访信息
    async getFirstVisit(val) {
      const visitInfo = val || this.visitInfo
      const { user_id } = visitInfo
      // 获取首次回访有针使用信息
      const needle = await Model.getFirstVisitNeedleInfo(user_id)
      // 获取首次回访无针注射信息
      const inject = await Model.getFirstVisitInjectInfo(user_id)
      // 获取首次回访使用问题
      const question = await Model.getFirstVisitQuestion(user_id)

      if (needle.code === 11) {
        this.vistfirst.needle = needle.data
      }
      if (inject.code === 11) {
        this.vistfirst.inject = inject.data
      }
      if (question.code === 11) {
        this.vistfirst.question = question.data
      }
    },
    // 获取7回访信息
    async get7daysVisit() {
      const { user_id } = this.visitInfo
      const inject = await Model.get7VisitInjectInfo(user_id)
      const blood = await Model.get7VisitBloodInfo(user_id)
      const question = await Model.get7VisitQuestion(user_id)
      if (inject.code === 11) {
        this.visit7days.inject = inject.data
      }
      if (blood.code === 11) {
        this.visit7days.blood = blood.data
      }
      if (question.code === 11) {
        this.visit7days.question = question.data
      }
    },
    // 获取90天回访信息
    async get90daysVisit() {
      const { user_id } = this.visitInfo
      const inject = await Model.get90VisitInjectInfo(user_id)
      const blood = await Model.get90VisitBloodInfo(user_id)
      const question = await Model.get90VisitQuestion(user_id)
      // 7天和90天的公用的一个表单
      if (inject.code === 11) {
        this.visit7days.inject = inject.data
      }
      if (blood.code === 11) {
        this.visit7days.blood = blood.data
      }

      if (question.code === 11) {
        const { data } = question
        this.visit90days.question = data

        // 修改并发症信息
        if (data.has_complication && data.complication) {
          const list = data.complication.split(',')
          if (list.length) {
            const last = list[list.length - 1]
            if (!last) {
              this.visit90days.disease.checkList = list.map(item => Number(item))
            } else {
              const checkList = list.slice(0, list.length - 1)
              this.visit90days.disease.checkList = checkList.map(item => Number(item))
              this.visit90days.disease.otherDisease = list[list.length - 1]
            }
          }
        }

        // 注射部位
        if (data.inject_body) {
          const inject_body = data.inject_body.split(',')
          if (inject_body.length) {
            this.visit90days.question.inject_body = inject_body.map(item => Number(item))
          }
        }
        this.$forceUpdate()
      }
    },
    // 获取365天回访详情
    async get365daysVisit() {
      const { user_id } = this.visitInfo
      const inject = await Model.get365VisitInjectInfo(user_id)
      const blood = await Model.get365VisitBloodInfo(user_id)
      const question = await Model.get365VisitQuestion(user_id)
      // 7天和90天的公用的一个表单
      if (inject.code === 11) {
        this.visit365days.inject = inject.data
      }
      if (blood.code === 11) {
        this.visit365days.blood = blood.data
      }
      if (question.code === 11) {
        const { data } = question
        this.visit365days.question = data

        // 修改并发症信息
        if (data.has_complication && data.complication) {
          // console.log('有并发症')
          const list = data.complication.split(',')
          if (list.length) {
            const last = list[list.length - 1]
            if (!last) {
              this.visit365days.disease.checkList = list.map(item => Number(item))
            } else {
              const checkList = list.slice(0, list.length - 1)
              this.visit365days.disease.checkList = checkList.map(item => Number(item))
              this.visit365days.disease.otherDisease = list[list.length - 1]
            }
          }
        }
        // 注射部位
        if (data.inject_body) {
          const inject_body = data.inject_body.split(',')
          this.visit365days.question.inject_body = inject_body.map(item => Number(item))
        }
        this.$forceUpdate()
      }
    },
    // 首次回访所有提交
    async submitFirstVisit() {
      await this.modifyFirstVisitNeedleInfo()
      await this.modifyFirstVisitInjectInfo()
      await this.modifyFirstVisitQuestion()
      await this.closeAndRefresh()
    },
    // 7天回访提交
    async submit7daysVisit() {
      await this.modify7VisitInjectInfo()
      await this.modify7VisitBloodInfo()
      await this.modify7VisitQuestion()
      await this.closeAndRefresh()
    },
    // 90天回访提交
    async submit90daysVisit() {
      await this.modify90VisitInjectInfo()
      await this.modify90VisitBloodInfo()
      await this.modify90VisitQuestion()
      await this.closeAndRefresh()
    },
    // 一年回访提交
    async submit365daysVisit() {
      await this.modify365VisitInjectInfo()
      await this.modify365VisitBloodInfo()
      await this.modify365VisitQuestion()
      await this.closeAndRefresh()
    },
    // 修改365天回访注射信息
    async modify365VisitInjectInfo() {
      try {
        const params = Utils.deepClone(this.visit365days.inject)
        params.user_id = this.visitInfo.user_id
        const { code, message } = await Model.modify365VisitInjectInfo(params)
        if (code === 11) {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改365天回访血糖信息
    async modify365VisitBloodInfo() {
      try {
        const params = Utils.deepClone(this.visit365days.blood)
        params.user_id = this.visitInfo.user_id
        const { code, message } = await Model.modify365VisitBloodInfo(params)
        if (code === 11) {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改365天回访使用问题
    async modify365VisitQuestion() {
      try {
        const params = Utils.deepClone(this.visit365days.question)
        params.user_id = this.visitInfo.user_id
        const list = Utils.deepClone(this.visit365days.disease.checkList)
        const { otherDisease } = this.visit365days.disease
        list.push(otherDisease)
        params.complication = list.toString()
        params.inject_body = params.inject_body.toString()
        const { code, message } = await Model.modify365VisitQuestion(params)
        if (code === 11) {
          this.$message.success('回访记录成功')
        } else {
          this.$message.error(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改90天回访注射信息
    async modify90VisitInjectInfo() {
      try {
        const params = Utils.deepClone(this.visit7days.inject)
        params.user_id = this.visitInfo.user_id
        const { code, message } = await Model.modify90VisitInjectInfo(params)
        if (code === 11) {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改90天回访血糖信息
    async modify90VisitBloodInfo() {
      try {
        const params = Utils.deepClone(this.visit7days.blood)
        params.user_id = this.visitInfo.user_id
        const { code, message } = await Model.modify90VisitBloodInfo(params)
        if (code === 11) {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改90天回访使用问题
    async modify90VisitQuestion() {
      try {
        const params = Utils.deepClone(this.visit90days.question)
        params.user_id = this.visitInfo.user_id
        const list = Utils.deepClone(this.visit90days.disease.checkList)
        const { otherDisease } = this.visit90days.disease
        list.push(otherDisease)
        params.complication = list.toString()
        params.inject_body = params.inject_body.toString()
        const { code, message } = await Model.modify90VisitQuestion(params)
        if (code === 11) {
          this.$message.success('90天回访记录成功')
        } else {
          this.$message.error(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改7天回访注射信息
    async modify7VisitInjectInfo() {
      try {
        const params = Utils.deepClone(this.visit7days.inject)
        params.user_id = this.visitInfo.user_id
        const { code, message } = await Model.modify7VisitInjectInfo(params)
        if (code === 11) {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改7天回访血糖信息
    async modify7VisitBloodInfo() {
      try {
        const params = Utils.deepClone(this.visit7days.blood)
        params.user_id = this.visitInfo.user_id
        const { code, message } = await Model.modify7VisitBloodInfo(params)
        if (code === 11) {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改7天回访使用问题
    async modify7VisitQuestion() {
      try {
        const params = Utils.deepClone(this.visit7days.question)
        params.user_id = this.visitInfo.user_id
        const { code, message } = await Model.modify7VisitQuestion(params)
        if (code === 11) {
          this.$message.success('7天回访记录成功')
        } else {
          this.$message.error(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改首次回访有针使用信息
    async modifyFirstVisitNeedleInfo() {
      try {
        const params = Utils.deepClone(this.vistfirst.needle)
        params.user_id = this.visitInfo.user_id
        const { code, message } = await Model.modifyFirstVisitNeedleInfo(params)
        if (code === 11) {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改首次回访注射信息
    async modifyFirstVisitInjectInfo() {
      try {
        const params = Utils.deepClone(this.vistfirst.inject)
        params.user_id = this.visitInfo.user_id
        const { code, message } = await Model.modifyFirstVisitInjectInfo(params)
        if (code === 11) {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改首次回访使用问题
    async modifyFirstVisitQuestion() {
      try {
        const params = Utils.deepClone(this.vistfirst.question)
        params.user_id = this.visitInfo.user_id
        const { code, message } = await Model.modifyFirstVisitQuestion(params)
        if (code === 11) {
          this.$message.success('首次回访记录成功')
        } else {
          this.$message.error(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 添加、修改使用人信息
    async updateProductUser() {
      const params = Utils.deepClone(this.productUser)
      params.p_code = this.visitInfo.p_code
      params.user_id = this.visitInfo.p_code
      let response = null
      try {
        if (this.productUser.p_id) { // 有p_id说明之前有使用人，编辑
          response = await modelCustomer.editProduct(this.dialogForm.p_id, params)
        } else { // 创建
          response = await modelCustomer.addProduct(this.clientId, params)
        }
        const { code, message } = response
        if (code === 11) {
          console.log(message)
        } else {
          this.$message.error(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 折叠、展开面板
    togglePanel() {
      if (this.collapseName.length) {
        this.collapseName = []
        this.isOpen = false
      } else {
        this.collapseName = [1, 2, 3, 4, 5, 6, 7]
        this.isOpen = true
      }
    },
    changeSelfInject() {
      const val = this.productUser.is_self
      if (val === 1) {
        this.relationData = relationData()
        this.productUser.relation = 0
      } else {
        this.relationData = relationData(true)
        this.productUser.relation = 1
      }
    },
    onUserProvince(val) {
      this.productUser.province = val.province
    },
    onUserCity(val) {
      this.productUser.city = val.city
    },
    onUserCounty(val) {
      this.productUser.district = val.county
    },
    closeAndRefresh() {
      this.$emit('closeDialog')
      this.$emit('refreshList')
    },
    /**
     * 根据产品编码查询产品列表的is_self字段
     * 接口为查询客户产品列表的接口
     * */
    async getIsSelf(p_code) {
      try {
        const { code, data } = await modelCustomer.getProduct(this.dialogForm.client_id, { p_code })
        if (code === 11 && data.length) {
          const product = data[0]
          this.productUser.is_self = product.is_self
          this.$forceUpdate()
        }
      } catch (error) {
        console.log(error)
      }
    },
    formatBoolean(value, type) {
      if (type) {
        return value === true ? '有' : value === false ? '无' : ''
      }
      return value === true ? '是' : value === false ? '否' : ''
    }
  },
}
</script>

<style lang="scss" scoped>
.container-content {
  position: relative;
  padding: 25px 25px 30px;
  margin-top: -10px;
  &.mr60 {
    margin-top: 60px;
  }
  .title {
    h1 {
      font-size: 16px;
      font-weight: 500;
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
  .second_title {
    /deep/.el-form-item__label {
      color: #4c76af;
    }
  }
  .unfold_collapse {
    position: fixed;
    right: 47px;
    top: 70px;
    z-index: 300;
    cursor: pointer;
    &.theme_color {
      color: #3963bc;
    }
  }
  .order_collapse {
    bottom: 20px;
    text-align: right;
    cursor: pointer;
    &.theme_color {
      color: #3963bc;
    }
  }
  .inline_group {
    display: inline-block;
  }
}
</style>
