<template>
  <div class="lin-container">
    <h1 v-if="isDialog" class="first-title" @click="togglePanel">工单详情</h1>
    <h1 v-else class="first-title" @click="togglePanel">{{ title }}</h1>
    <h1 class="order-id">
      <p v-if="pathType !== 2">
        工单编号： <span>{{ ruleForm.ws_code }}</span>
      </p>
      <p @click="togglePanel">
        <i :class="isOpen ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i
        ><span v-text="isOpen ? '折叠全部' : '展开全部'"></span>
      </p>
    </h1>
    <el-form
      :model="ruleForm"
      :inline="false"
      size="small"
      :disabled="isDisabled"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-collapse v-model="collapseName">
        <!-- 客户信息 -->
        <el-collapse-item title="客户信息" :name="1" v-show="isMember">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="姓名：">
                <span>{{ ruleForm.client_name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别：">
                <span>{{ WS.f_sex(ruleForm.sex) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄：">
                <span>{{ ruleForm.age }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="联系电话：">
                <span>{{ ruleForm.phone }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在省市：">
                <span>{{ ruleForm.province }}{{ ruleForm.city }}{{ ruleForm.district }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="详细地址：">
                <span>{{ ruleForm.address }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <!-- 此处时间是客户详情接口返回的，前端没做处理 -->
              <el-form-item label="注册时间：">
                <span>{{ruleForm.register_time}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <!-- 基本信息 -->
        <el-collapse-item title="基本信息" :name="2">
          <el-row :gutter="24">
            <!-- 售前来电信息 -->
            <template v-if="String(sheetForm.source) === '0'">
              <el-col :span="6">
                <el-form-item label="来电号码：" label-width="90px">
                  <span>{{ ruleForm.call_phone }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="来电时间：" label-width="90px">
                  <span>{{ ruleForm.call_time }}</span>
                </el-form-item>
              </el-col>
            </template>
            <!-- 问题分类 -->
            <el-col :span="12">
              <el-form-item label="问题分类：" prop="ws_type1">
                <span v-if="isView || pathType === 3">
                  {{ WS.ws_type1(ruleForm.ws_type1) }}
                  {{ WS.ws_type2(ruleForm.ws_type1, ruleForm.ws_type2) }}
                </span>
                <template v-else>
                  <el-select
                    v-model="ruleForm.ws_type1"
                    placeholder="请选择一级分类"
                    style="width: 45%;margin-right: 10px;"
                    @change="changeIssuseType"
                  >
                    <el-option label="售前" :value="0"></el-option>
                    <el-option label="售后" :value="1"></el-option>
                  </el-select>
                  <el-select v-model="ruleForm.ws_type2" style="width: 45%;" placeholder="请选择二级分类">
                    <template v-if="ruleForm.ws_type1 === 0">
                      <el-option
                        v-for="item in issuesListPre"
                        :key="item.code"
                        :label="item.value"
                        :value="item.code"
                      ></el-option>
                    </template>
                    <template v-if="ruleForm.ws_type1 === 1">
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

          <!-- 匹配手机号功能，用于查询客户、产品使用人、创建工单显示 -->
          <el-row :gutter="24" v-if="!isDialog">
            <template v-if="pathType === 2 && !$route.query.type && !$route.query.call_phone">
              <el-col :span="8">
                <el-form-item label="匹配手机号：">
                  <el-input v-model="ruleForm.match_phone" maxlength="11" placeholder="请输入手机号进行匹配"></el-input>
                </el-form-item>
              </el-col>
            </template>
          </el-row>

          <!-- 匹配产品编码来查询经销商信息 -->
          <el-row :gutter="24" v-if="!isDialog">
            <!-- 带有this.$route.query.type的是从回访跳转过来的 -->
            <template v-if="pathType === 2 && Number(ruleForm.ws_type1 === 1) && !$route.query.type">
              <el-col :span="8">
                <el-form-item label="产品编码：">
                  <el-input v-model="ruleForm.p_code" maxlength="30" placeholder="请输入产品编码进行匹配"></el-input>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="8" v-if="pathType === 1 || pathType === 3 || $route.query.type">
              <el-form-item label="产品编码：" v-if="ruleForm.ws_type1 === 1">
                <span>{{ ruleForm.p_code }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8"  v-if="ruleForm.ws_type1 === 1">
              <el-form-item label="产品类型：" prop="p_type">
                <span v-if="pathType !== 2 || this.$route.query.type === 'jump'">{{productTypeFormat(productUser.p_type)}}</span>
                <el-select v-else style="width: 100%;" v-model="productUser.p_type" placeholder="请选择">
                  <el-option
                    v-for="item in productTypeData"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="isMember && ruleForm.ws_type1 === 1">
              <el-form-item label="归属经销商：">
                <span>{{ ruleForm.agent_name || '无' }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24" v-if="!isDialog && pathType === 2 && !($route.query.call_phone && ruleForm.ws_type1 === 0) && !$route.query.type">
            <el-col :span="6">
              <el-form-item label="">
                <el-button type="primary" @click="matchAllBtn">匹配</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-collapse-item>
        <!-- 历史记录(只有会员才会有历史记录) -->
        <el-collapse-item title="历史记录" :name="3" v-if="!isDialog && isMember && !isView">
          <el-collapse v-model="activeInherint">
            <div class="second-title" v-if="tableSheetData.length">
              <el-collapse-item title="历史工单" name="first">
                <el-row :gutter="24">
                  <el-col :span="24">
                    <el-form-item label="" label-width="20px">
                      <lin-table
                        :tableColumn="tableSheetColumn"
                        :tableData="tableSheetData"
                        :showHeader="false"
                        :pagination="paginationSheet"
                        :showSelectCol="false"
                        :index="false"
                        :showPage="false"
                      ></lin-table>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </div>
            <div class="second-title" v-if="tabList.length">
              <el-collapse-item title="回访记录" name="second">
                <el-row :gutter="24">
                  <el-col :span="20">
                    <el-form-item label="" label-width="20px">
                      <!-- tab选项按钮 -->
                      <div class="tab-wrapper">
                        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
                          <el-tab-pane v-for="item in tabList" :key="item.name" :name="item.name">
                            <span slot="label">
                              <i v-if="item.success" class="completed-visit el-icon-success"></i>
                              {{ item.label }}
                            </span>
                          </el-tab-pane>
                        </el-tabs>
                      </div>

                      <!-- 当存在p_code时候，才可以在回访详情查询客户、使用人信息
                      当visit_status不为0才回去展示回访详情 -->
                      <div
                        class="vist_wrapper"
                        v-if="visitInfo.p_code && visitInfo.visit_status">
                        <vist-content
                          ref="visitContent"
                          :activeName="activeName"
                          :toFixed="false"
                          :isInOrder="true"
                          :isView="true"
                          :editDsiabled="true"
                        />
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </div>
          </el-collapse>
        </el-collapse-item>
        <!-- 来电基础信息（售前咨询）此处的信息会作为客户信息被创建 -->
        <el-collapse-item title="来电基础信息" :name="4" v-if="String(this.ruleForm.ws_type1) === '0'">
          <!-- 此处不防止一个空的el-row就无法校验到来电姓名，原因尚不明确 -->
          <el-row :gutter="24"></el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="来电姓名：" prop="ld_client_name">
                <span v-if="isView">{{ callInfo.client_name }}</span>
                <el-input v-else maxlength="20" v-model="callInfo.client_name" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别：" prop="ld_sex">
                <span v-if="isView">{{ WS.f_sex(callInfo.sex) }}</span>
                <el-radio-group v-else v-model="callInfo.sex">
                  <el-radio :label="0">男</el-radio>
                  <el-radio :label="1">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄：">
                <span v-if="isView">{{ callInfo.age }}</span>
                <number-input v-else :integerOnly="true" v-model="callInfo.age" placeholder="请输入"></number-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="电话：" prop="ld_phone">
                <span v-if="isView">{{ callInfo.phone }}</span>
                <el-input v-else maxlength="11" v-model="callInfo.phone" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="来源：">
                <span v-if="isView">{{ WS.channelType(callInfo.channel_type) }}</span>
                <el-select v-else v-model="callInfo.channel_type" style="width: 100%;" placeholder="请选择">
                  <el-option label="百度" :value="0"></el-option>
                  <el-option label="今日头条" :value="1"></el-option>
                  <el-option label="广告" :value="2"></el-option>
                  <el-option label="其他" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8" v-if="isView">
              <el-form-item label="地域:">
                <span>{{ callInfo.province }}{{ callInfo.city }}{{ callInfo.district }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-else>
              <el-form-item label="地域:">
                <map-select
                  ref="callInfoProvince"
                  @onProvince="onClientProvince"
                  @onCity="onClientCity"
                  @onCounty="onClientCounty" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="16">
              <el-form-item label="详细地址：">
                <span v-if="isView">{{ callInfo.address }}</span>
                <el-input v-else maxlength="100" v-model="callInfo.address" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <!-- 使用人基础信息（售后服务）此处调用添加产品的接口addProduct -->
        <el-collapse-item title="使用人基础信息" :name="5" v-if="Number(this.ruleForm.ws_type1) === 1">
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
                <span v-if="isView">{{ WS.f_relation(productUser.relation) }}</span>
                <el-select
                  v-else
                  :disabled="productUser.is_self === 1"
                  v-model="productUser.relation"
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
              <el-form-item label="使用者姓名：" prop="user_name">
                <span v-if="isView">{{ productUser.name }}</span>
                <el-input v-else maxlength="20" v-model="productUser.name" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="使用者电话：" label-width="110px" prop="user_phone">
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
                <span v-if="isView">{{ WS.f_sex(productUser.sex) }}</span>
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
        <!-- 治疗方案 -->
        <el-collapse-item title="治疗方案" :name="6" v-if="Number(this.ruleForm.ws_type1) === 1">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="购买时间：">
                <span v-if="isView">{{ sheetForm.buy_date}}</span>
                <el-date-picker
                  v-else
                  type="date"
                  v-model="sheetForm.buy_date"
                  style="width: 100%;"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="140px" label="胰岛素名称1：">
                <span v-if="isView">{{ injectForm.insulin1 }}</span>
                <el-input v-else :max="100" v-model="injectForm.insulin1" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="140px" label="胰岛素名称2：">
                <span v-if="isView">{{ injectForm.insulin2 }}</span>
                <el-input v-else :max="30" v-model="injectForm.insulin2" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8" class="second_title">
              <el-form-item label="胰岛素注射方案：" label-width="140px"> </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="早餐计量：" label-width="90px">
                <span v-if="isView">{{ injectForm.breakfast_dose }}</span>
                <number-input
                  v-else
                  :integerOnly="true"
                  v-model="injectForm.breakfast_dose"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="午餐计量：" label-width="90px">
                <span v-if="isView">{{ injectForm.lunch_dose }}</span>
                <number-input
                  v-else
                  :integerOnly="true"
                  v-model="injectForm.lunch_dose"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="晚餐计量：" label-width="90px">
                <span v-if="isView">{{ injectForm.dinner_dose }}</span>
                <number-input
                  v-else
                  :integerOnly="true"
                  v-model="injectForm.dinner_dose"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="睡前计量：" label-width="90px">
                <span v-if="isView">{{ injectForm.sleep_dose }}</span>
                <number-input
                  v-else
                  :integerOnly="true"
                  v-model="injectForm.sleep_dose"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8" class="second_title">
              <el-form-item label="血糖控制情况：" label-width="140px"></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="空腹血糖值：" label-width="120px">
                <span v-if="isView">{{ bloodForm.empty_value }}mmol/l</span>
                <number-input
                  v-else
                  :remain="2"
                  slotName="mmol/l"
                  v-model="bloodForm.empty_value"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="早餐后血糖值：" label-width="120px">
                <span v-if="isView">{{ bloodForm.breakfast_after_value }}mmol/l</span>
                <number-input
                  v-else
                  :remain="2"
                  slotName="mmol/l"
                  v-model="bloodForm.breakfast_after_value"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="午餐前血糖值：" label-width="120px">
                <span v-if="isView">{{ bloodForm.lunch_before_value }}mmol/l</span>
                <number-input
                  v-else
                  :remain="2"
                  slotName="mmol/l"
                  v-model="bloodForm.lunch_before_value"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="午餐后血糖值：" label-width="120px">
                <span v-if="isView">{{ bloodForm.lunch_after_value }}mmol/l</span>
                <number-input
                  v-else
                  :remain="2"
                  slotName="mmol/l"
                  v-model="bloodForm.lunch_after_value"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="晚餐前血糖值：" label-width="120px">
                <span v-if="isView">{{ bloodForm.dinner_before_value }}mmol/l</span>
                <number-input
                  v-else
                  :remain="2"
                  slotName="mmol/l"
                  v-model="bloodForm.dinner_before_value"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="晚餐后血糖值：" label-width="120px">
                <span v-if="isView">{{ bloodForm.dinner_after_value }}mmol/l</span>
                <number-input
                  v-else
                  :remain="2"
                  slotName="mmol/l"
                  v-model="bloodForm.dinner_after_value"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="睡前血糖值：" label-width="120px">
                <span v-if="isView">{{ bloodForm.sleep_before_value }}mmol/l</span>
                <number-input
                  v-else
                  :remain="2"
                  slotName="mmol/l"
                  v-model="bloodForm.sleep_before_value"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="有无口服抗凝药：" label-width="130px">
                <span v-if="isView">{{ complicationForm.has_anticoagulant ? '有' : '无' }}</span>
                <el-radio-group v-else v-model="complicationForm.has_anticoagulant">
                  <el-radio :label="true">有</el-radio>
                  <el-radio :label="false">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="有无口服降糖药：" label-width="130px">
                <span v-if="isView">{{ complicationForm.has_hypoglycemic ? '有' : '无' }}</span>
                <el-radio-group v-else v-model="complicationForm.has_hypoglycemic">
                  <el-radio :label="true">有</el-radio>
                  <el-radio :label="false">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="糖化血红蛋白：" label-width="130px">
                <span v-if="isView">{{ bloodForm.hba1c_value }}%</span>
                <number-input
                  v-else
                  :remain="2"
                  slotName="%"
                  v-model="bloodForm.hba1c_value"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="C肽：">
                <span v-if="isView">{{ bloodForm.c_peptide_value }}nmol/l</span>
                <number-input
                  v-else
                  :remain="2"
                  slotName="nmol/l"
                  v-model="bloodForm.c_peptide_value"
                  placeholder="请输入"
                ></number-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 并发症 -->
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="有无并发症：">
                <span v-if="isView">{{ complicationForm.has_complication ? '有' : '无' }}</span>
                <el-radio-group v-else v-model="complicationForm.has_complication" @change="changeComplac">
                  <el-radio :label="true">有</el-radio>
                  <el-radio :label="false">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-if="complicationForm.has_complication">
            <el-col :span="16">
              <el-form-item label="并发症：">
                <span v-if="isView">{{ WS.disease(disease.checkList) }}</span>
                <el-checkbox-group v-else v-model="disease.checkList" @change="changeCheckList">
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
              <el-form-item label="其他：" label-width="90px">
                <span v-if="isView">{{ disease.otherDisease }}</span>
                <el-input v-else v-model="disease.otherDisease" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="16">
              <el-form-item label="疼痛：" label-width="130px">
                <span v-if="isView">{{ WS.painLevel(productIssueForm.pain_level) }}</span>
                <el-radio-group v-else v-model="productIssueForm.pain_level">
                  <el-radio :label="0">0分</el-radio>
                  <el-radio :label="1">3分</el-radio>
                  <el-radio :label="2">6分</el-radio>
                  <el-radio :label="3">10分</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="有无硬结：" label-width="130px">
                <span v-if="isView">{{ productIssueForm.has_harden ? '有' : '无' }}</span>
                <el-radio-group v-else v-model="productIssueForm.has_harden">
                  <el-radio :label="true">有</el-radio>
                  <el-radio :label="false">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 是否过敏 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="是否过敏：" label-width="130px">
                <span v-if="isView">{{ productIssueForm.is_allergic ? '是' : '否' }}</span>
                <el-radio-group
                  class="inline_group"
                  style="width: 200px;"
                  v-else
                  v-model="productIssueForm.is_allergic"
                >
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
                <p
                  class="inline_group"
                  style="width: 50%;margin-left: 20px;"
                  v-if="isView && productIssueForm.is_allergic"
                >
                  {{ productIssueForm.allergic_desc }}
                </p>
                <el-input
                  class="inline_group"
                  v-if="!isView && productIssueForm.is_allergic"
                  style="width: 50%;"
                  v-model="productIssueForm.allergic_desc"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 是否出血 -->
          <el-row :gutter="24">
            <el-col :span="16">
              <el-form-item label="是否出血：" label-width="130px">
                <span v-if="isView">{{ productIssueForm.is_blood ? '是' : '否' }}</span>
                <el-radio-group class="inline_group" style="width: 200px;" v-else v-model="productIssueForm.is_blood">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
                <p
                  class="inline_group "
                  style="width: 50%;margin-left: 20px;"
                  v-if="isView && productIssueForm.is_blood"
                >
                  {{ productIssueForm.blood_desc }}
                </p>
                <el-input
                  class="inline_group"
                  v-if="!isView && productIssueForm.is_blood"
                  style="width: 50%;"
                  v-model="productIssueForm.blood_desc"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 是否漏夜 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="是否漏液：" label-width="130px">
                <span v-if="isView">{{ productIssueForm.is_escaped ? '是' : '否' }}</span>
                <el-radio-group class="inline_group" style="width: 200px;" v-else v-model="productIssueForm.is_escaped">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
                <p
                  class="inline_group"
                  style="width: 50%;margin-left: 20px;"
                  v-if="isView && productIssueForm.is_escaped"
                >
                  {{ productIssueForm.escaped_desc }}
                </p>
                <el-input
                  class="inline_group"
                  v-if="!isView && productIssueForm.is_escaped"
                  style="width: 50%;"
                  v-model="productIssueForm.escaped_desc"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <!-- 解决问题 -->
        <el-collapse-item title="解决问题" :name="7">
          <!-- 编辑和详情可查看时间线 -->
          <el-row :gutter="24" v-if="pathType !== 2">
            <el-col :span="24">
              <el-form-item label-width="20px" label="">
                <el-timeline>
                  <el-timeline-item
                    v-for="item in timeLine"
                    :key="item.value"
                    :timestamp="dateFormat(item.create_time) + ' ' + item.process_name"
                    placement="top"
                  >
                    <!-- type，0：客服，1:经销商 -->
                    <el-card>
                      <p>问题描述：{{ item.question }}</p>
                      <p>结果描述：{{ item.treatment }}</p>
                      <template v-if="item.type === 1">
                        <p>服务人员：{{ item.seviced_by }}</p>
                        <p>服务时间：{{ dateFormat(item.service_time) }}</p>
                      </template>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 查看工单不显示输入框 -->
          <el-row :gutter="24" v-if="pathType !== 1">
            <el-col :span="16">
              <el-form-item label="问题描述：" prop="ws_question">
                <el-input
                  type="textarea"
                  v-model="sheetForm.question"
                  :maxlength="350"
                  :show-word-limit="true"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-if="pathType !== 1">
            <el-col :span="16">
              <el-form-item label="结果描述：" prop="ws_treatment">
                <el-input
                  type="textarea"
                  v-model="sheetForm.treatment"
                  :maxlength="350"
                  :show-word-limit="true"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <!-- 工单信息 -->
        <el-collapse-item title="工单信息" :name="8">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="工单来源：" prop="ws_source">
                <span v-if="isView">{{ WS.workSource(sheetForm.source) }}</span>
                <el-select v-else v-model="sheetForm.source" clearable style="width: 100%;" placeholder="请选择">
                  <el-option label="400热线" :value="0"></el-option>
                  <el-option label="微信" :value="1"></el-option>
                  <el-option label="公众号" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单状态：" prop="ws_status">
                <span v-if="isView">{{ WS.workStatus(sheetForm.status) }}</span>
                <el-select
                  v-else
                  v-model="sheetForm.status"
                  clearable
                  :disabled="sheetForm.status === 1 || sheetForm.status === 2 || sheetForm.status === 3"
                  style="width: 100%;"
                  @change="workStatusChange"
                  placeholder="请选择">
                  <el-option
                    v-for="item in workStatusData"
                    :key="item.code"
                    :disabled="item.disabled"
                    :label="item.value"
                    :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下次跟进时间：" label-width="130px" prop="ws_follow_time">
                <span v-if="isView">{{ sheetForm.follow_time }}</span>
                <el-date-picker
                  v-else
                  style="width: 100%;"
                  :picker-options="pickerOptions"
                  v-model="sheetForm.follow_time"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="创建人：">
                <span>{{ sheetForm.created_name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="当前处理人：">
                <span v-if="isView">{{ sheetForm.processed_name }}</span>
                <el-select v-else v-model="sheetForm.processed_by" style="width: 100%;" placeholder="请选择">
                  <el-option v-for="item in serviceList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="ruleForm.p_code || ruleForm.ws_type1 === 0">
              <el-form-item label="是否指派经销商：" label-width="130px">
                <span v-if="isView" v-text="sheetForm.is_dispatch === 1 ? '是' : '否'"></span>
                <el-radio-group v-else v-model="sheetForm.is_dispatch" @change="changeDispatch">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-if="sheetForm.is_dispatch === 1">
            <el-col :span="24">
              <el-form-item label="指派经销商：" prop="ws_agent_id">
                <!-- 能够查询到经销商信息的则选定经销商，查询不到的则手动去选择 -->
                <span
                v-if="isView
                || hasAgentMatch
                || sheetForm.status === 2
                || sheetForm.status === 3
              ">{{ agentProvince.province }}{{agentProvince.city}} {{ sheetForm.agent_name }}</span>
                <template v-else>
                  <map-select
                    ref="agentSelectProvince"
                    @onProvince="onAgentProvince"
                    @onCity="onAgentCity"
                    placeProvince="请选择省"
                    placeCity="请选择市"
                    :showCounty="false"
                  />
                  <el-select
                    style="width: 200px; margin-let: 20px;"
                    v-model="sheetForm.agent_id"
                    @change="selectAgent"
                    placeholder="请选择经销商">
                    <el-option
                      v-for="item in agentList"
                      :key="item.agent_id"
                      :label="item.agent_name"
                      :value="item.agent_id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <!-- 指派回录信息9（只有查看、编辑且为指派工单的时候显示） -->
        <!-- 按照聂总要求，这块暂时先隐藏掉 -->
        <template v-if="false">
          <el-collapse-item title="指派回录信息" :name="9">
            <view-renewal-content :dialogForm="dialogFormRenewal" :tableData="tableDataRenewal" :editDsiabled="true" />
          </el-collapse-item>
        </template>
      </el-collapse>
      <!-- 操作换新（只有编辑的时候可以换新） -->
      <template v-if="ruleForm.ws_type1 === 1 && pathType !== 2">
        <el-row :gutter="24">
          <div class="title">
            <h1>操作换新</h1>
          </div>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8" v-if="pathType === 3 && !hasReplaced">
            <el-form-item label="" label-width="10px">
              <el-button size="medium" type="primary" @click="showRenewal"> 换 新 </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-else>
            <el-form-item label="换新状态:" v-if="hasReplaced">
              <span>{{ sheetForm.replace_status === 0 ? '处理中' : sheetForm.replace_status === 1 ? '已完成' : '' }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <div class="form-btn-wrapper">
        <el-button v-if="!isDisabled" class="form-btn" type="primary" @click="submitForm('ruleForm')">{{
          btnName
        }}</el-button>
      </div>
    </el-form>
    <!-- 创建产品换新的弹框 -->
    <template v-if="dialogVisible">
      <add-renewal
        :ws_code="ruleForm.ws_code"
        :p_code="ruleForm.p_code"
        :title="dialogTitle"
        :dialogVisible="dialogVisible"
        @closeDialog="closeDialog"
        @updateWorkSheet="updateWorkSheet"
        :rowData="rowData"
      />
    </template>
    <!-- 查看回录信息弹框 -->
    <template v-if="dialogVisibleView">
      <view-renewal
        title="基础信息"
        :dialogVisible="dialogVisibleView"
        :editDsiabled="true"
        @closeDialog="closeDialogView"
        ref="addDg"
      />
    </template>
    <!-- 工单详情弹框 -->
    <template v-if="dialogDetailView">
      <detail-dialog
      :dialogVisible="dialogDetailView"
      :row="historyOrder"
      @closeDialog="closeDetailView" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getKEY } from 'lin/util/storage'
import Utils, { dateFormat, regEmpty, toRawType } from 'lin/util/util'
import * as WS from 'lin/format/workSheet'
import { productType, productTypeData } from 'lin/format/customer'
import { visitTabList } from 'lin/format/visit'
import { service_id } from 'lin/format/replace-sheet'
import LinTable from '@/component/base/table/lin-table'
import MapSelect from '@/component/base/province-select'
import NumberInput from '@/component/base/number-input'
import AddRenewal from '../../renewal-mg/components/add'
import ViewRenewal from '../../agent-assign/components/add'
import ViewRenewalContent from '../../agent-assign/components/add-content' // 回录详情
import VistContent from '../../visit-mg/components/visit-content'
import DetailDialog from '../detailUnit.vue' // 将工单详情单独作为弹框处理,属于组件自己调用自己
import agentsModel from '@/model/agents' // 经销商相关接口
import modelCustomer from '@/model/customer' // 客户相关接口
import modelSheet from '@/model/work-sheet' // 工单相关接口
// import replaceModel from '@/model/replace-sheets' // 换新单相关接口

const regPhone = /^1\d{10}$/
export default {
  name: 'CreateOrder',
  props: {
    // 为true是客户（会员或普通客户）
    isMember: {
      type: Boolean,
      default: false,
    },
    // 标记组件是否作为弹框
    isDialog: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    // 当触发历史工单弹框的时候
    isDialog(val) {
      if (val && Object.keys(this.row).length) {
        console.log(val)
      }
    },
  },
  data() {
    return {
      dateFormat,
      WS,
      Utils,
      productTypeFormat: productType, // 格式化产品类型
      productTypeData: productTypeData(),
      relationData: WS.relationData(),
      formatServiceId: service_id,
      diseaseData: WS.diseaseData(),
      workStatusData: WS.workStatusData(),
      activeName: 'first',
      isOpen: true,
      collapseName: [1, 2, 3, 4, 5, 6, 7, 8],
      activeInherint: ['first', 'second'],
      visitTabActive: 'first',
      customerServiceList: [],
      hasProductUser: false, // 标记匹配产品时候是否查出了使用人信息
      tabList: [],
      ruleForm: {
        // 客户信息
        match_phone: '',
        ws_code: '',
        client_name: '',
        client_type: '',
        sex: '',
        age: '',
        phone: '',
        provice: '',
        city: '',
        district: '',
        register_time: '',
        // 基本信息
        call_phone: '',
        call_time: '',
        ws_type1: 1,
        ws_type2: '',
        p_code: '',
        p_id: '',
        agent_name: '',
        agent_id: '',
      },
      // 来电基础信息
      callInfo: {
        client_name: '',
        sex: '',
        age: '',
        phone: '',
        source: '',
        channel_type: '',
        provice: '',
        city: '',
        district: '',
        address: '',
      },
      // 使用人信息
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
        user_id: '',
        p_id: '',
        p_type: 1,
      },
      // 工单信息
      sheetForm: {
        source: 1, // 默认工单来源是微信
        status: 0,
        follow_time: '',
        create_time: '',
        created_by: '',
        created_name: '',
        processed_by: '',
        processed_name: '',
        is_dispatch: 0,
        province: '',
        city: '',
        district: '',
        agent_id: null,
        agent_name: '',
        question: '',
        treatment: '',
      },
      // 治疗方案-注射信息
      injectForm: {
        buy_date: '',
        insulin1: '',
        insulin2: '',
        breakfast_dose: '',
        lunch_dose: '',
        dinner_dose: '',
        sleep_dose: '',
      },
      // 治疗方案-血糖值
      bloodForm: {
        empty_value: '',
        breakfast_after_value: '',
        lunch_before_value: '',
        lunch_after_value: '',
        dinner_before_value: '',
        dinner_after_value: '',
        sleep_before_value: '',
        hba1c_value: '', // 糖化血红蛋白值
        c_peptide_value: '', // c肽值
      },
      // 治疗方案-口服药物和并发症
      complicationForm: {
        has_anticoagulant: '', // 是否服用抗凝药
        has_hypoglycemic: '', // 是否服用降糖药,
        has_complication: '', // 有无并发症,
        complication: '', // 并发症
        otherDisease: '', // 其他并发症
      },
      // 产品使用问题
      productIssueForm: {
        pain_level: '', // 疼痛程度 //0--0分 1--3分 2--6分 3--10分
        has_harden: '', // 硬结
        is_allergic: '', // 是否过敏
        allergic_desc: '', // 过敏描述
        is_blood: '', // 是否出血
        blood_desc: '', // 出血描述
        is_escaped: '', // 是否漏液
        escaped_desc: '', // 漏液描述
      },
      agentProvince: {
        province: '',
        city: '',
        county: ''
      },
      // 并发症信息
      disease: {
        checkList: [],
        otherDisease: '',
      },
      timeLine: [], // 解决问题中的时间线
      rules: {
        ws_type1: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (regEmpty(value)) {
                callback(new Error('请选择问题分类一'))
              } else if (regEmpty(this.ruleForm.ws_type2)) {
                callback(new Error('请选择问题分类二'))
              } else {
                callback()
              }
            },
          },
        ],
        // 来电基础信息-姓名
        ld_client_name: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.ruleForm.ws_type1 === 0 && !this.callInfo.client_name) {
                callback(new Error('请输入姓名'))
              } else {
                callback()
              }
            },
          },
        ],
        // 来电基础信息-电话
        ld_phone: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.ruleForm.ws_type1 === 0 && !this.callInfo.phone) {
                callback(new Error('请输入电话'))
              } else {
                callback()
              }
            },
          },
        ],
        ws_source: [
          {
            // 工单信息-来源
            trigger: 'change',
            validator: (rule, value, callback) => {
              console.log()
              if (regEmpty(this.sheetForm.source)) {
                callback(new Error('请选择工单来源'))
              } else {
                callback()
              }
            },
          },
        ],
        ws_status: [
          {
            // 工单信息-来源
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (regEmpty(this.sheetForm.status)) {
                callback(new Error('请选择工单状态'))
              } else {
                callback()
              }
            },
          },
        ],
        user_name: [
          {
            // 工单信息-来源
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.ruleForm.ws_type1 === 1 && regEmpty(this.productUser.name)) {
                callback(new Error('请输入使用者姓名'))
              } else if (this.productUser.name.length < 2 || this.productUser.name.length > 20) {
                callback(new Error('姓名长度在2~20个字符之间'))
              } else {
                callback()
              }
            },
          },
        ],
        user_phone: [
          {
            // 工单信息-来源
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.ruleForm.ws_type1 === 1 && regEmpty(this.productUser.phone)) {
                callback(new Error('请输入使用者电话'))
              } else if (!regPhone.test(this.productUser.phone)) {
                callback(new Error('请输入正确的电话格式'))
              } else {
                callback()
              }
            },
          },
        ],
        p_type: [
          {
            // 工单信息-来源
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.ruleForm.ws_type1 === 1 && regEmpty(this.productUser.p_type)) {
                callback(new Error('请选择产品类型'))
              } else {
                callback()
              }
            },
          },
        ],
        ws_question: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if ((!this.sheetForm.question && this.sheetForm.treatment)
              || (this.sheetForm.question && !this.sheetForm.treatment)
              ) {
                callback(new Error('请同时输入输入问题描述和结果描述'))
              } else {
                callback()
              }
            },
          }
        ],
        ws_treatment: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if ((!this.sheetForm.question && this.sheetForm.treatment)
              || (this.sheetForm.question && !this.sheetForm.treatment)
              ) {
                callback(new Error('请同时输入输入问题描述和结果描述'))
              } else {
                callback()
              }
            },
          }
        ],
        ws_follow_time: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!this.sheetForm.follow_time) {
                callback(new Error('请选择下次跟进日期'))
              } else {
                callback()
              }
            },
          }
        ],
        ws_agent_id: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!this.sheetForm.agent_id && this.sheetForm.is_dispatch === 1) {
                callback(new Error('请选择经销商'))
              } else {
                callback()
              }
            },
          }
        ],
      },
      isDisabled: false,
      title: '创建工单',
      btnName: '保 存',
      ws_id: '', // 当前工单id
      pathType: 1,
      remarkData: [
        {
          id: 1,
          content: '机壳破损',
        },
        { id: 2 },
      ],
      issuesListPre: WS.wsTypeData(0),
      issuesListAfter: WS.wsTypeData(1),
      tableSheetColumn: [
        {
          prop: 'ws_code',
          label: '工单编号',
          width: 140,
          render: (h, { index, row }) => (<span class="table-link-btn" onClick={() => this.showOrderDetail(index, row)}>{ row.ws_code }</span>)
        },
        {
          prop: 'status',
          label: '工单状态',
          render: (h, { row }) => (<span>{WS.workStatus(row.status)}</span>)
        },
        {
          prop: 'update_time',
          label: '最近更新时间',
          width: 135,
          render: (h, { row }) => (<span>{dateFormat(row.update_time)}</span>)
        },
        {
          prop: 'ws_type1',
          label: '问题分类(一级)',
          width: 120,
          render: (h, { row }) => (<span>{ WS.ws_type1(row.ws_type1) }</span>)
        },
        {
          prop: 'ws_type2',
          label: '问题分类(二级)',
          width: 120,
          render: (h, { row }) => (<span>{ WS.ws_type2(row.ws_type1, row.ws_type2) }</span>)
        },
        { prop: 'created_name', label: '创建人' },
        {
          prop: 'create_time',
          label: '创建时间',
          width: 135,
          render: (h, { row }) => (<span>{ dateFormat(row.create_time) }</span>)
        },
      ],
      tableSheetData: [], // 历史工单
      paginationSheet: {
        page: 1,
        page_size: 200,
        pageTotal: 0,
      },
      // 弹框
      dialogTitle: '快舒尔换新',
      rowData: {}, // 用来覆盖子组件的dialogForm
      dialogVisible: false,
      dialogDetailView: false,
      dialogVisibleView: false,
      dialogFormRenewal: {},
      tableDataRenewal: [],
      isView: true, // 标记当前是否为查看详情
      historyOrder: {},
      agentList: [],
      visitInfo: {
        visit_status: 0,
        p_code: '',
        user_id: ''
      },
      hasReplaced: false,
      agentInfo: {},
      hasDispachedAgent: false,
      pickerOptions: {
        disabledDate: time => time.getTime() < Date.now()
      },
      hasAgentMatch: false, // 标记产品是否有匹配的经销商，默认没有
      productList: [], // 客户产品列表
      clickedMatchPhone: false, // 标记是否点击了匹配手机号按钮
      clickedMatchCode: false, // 标记是否点击了匹配产品编码
      hasProduct: false, // 标记客户的产品列表中是否存在输入的产品编码
    }
  },
  computed: {
    ...mapGetters(['user', 'serviceList', 'vistJumpSheetCreateInfo', 'QCallUser']),
  },
  components: {
    MapSelect,
    NumberInput,
    LinTable,
    AddRenewal, // 添加换新
    ViewRenewal,
    ViewRenewalContent,
    DetailDialog, // 工单详情弹框
    VistContent,
  },
  async created() {
    await this.switchRouter()
  },
  methods: {
    // 初始化数据
    switchRouter() {
      const { path } = this.$route
      if (this.isDialog) { // 当前为弹框
        this.isView = true
        this.pathType = 1
        this.isDisabled = true

        const { ws_id, p_code } = this.row
        if (ws_id) {
          this.ws_id = ws_id
        }
        if (p_code) {
          this.visitInfo.p_code = p_code
        }
        this.getSheetInfo()
      } else {
        const { ws_id, p_code } = this.$route.query
        if (ws_id) {
          this.ws_id = ws_id
        }
        if (p_code) {
          this.visitInfo.p_code = p_code
        }
        this.formatPath(path)
      }
    },
    async formatPath(path) {
      if (path === '/worker-order/view' || path === '/agent-mg/worker-order/view') {
        this.title = '查看工单'
        this.isDisabled = true
        this.pathType = 1
        this.isView = true
        this.getSheetInfo()
      } else if (path === '/worker-order/create') {
        this.title = '创建工单'
        this.pathType = 2
        this.btnName = '保存'
        // 初始化工单创建人信息
        if (this.user.name) {
          this.sheetForm.created_name = this.user.name
          this.sheetForm.created_by = this.user.account_id
          this.sheetForm.processed_by = this.user.account_id
          this.sheetForm.processed_name = this.user.name
        }
        this.isView = false
        const { type, user_phone, call_phone } = this.$route.query

        // 判断是否是从回访记录跳转过来的
        if (type) {
          const { p_code } = this.$route.query
          this.clickedMatchPhone = true
          this.clickedMatchCode = true
          this.ruleForm.p_code = p_code
          // 通过p_code查询客户信息、使用人信息
          if (p_code) {
            await this.$emit('matchCode', p_code)
            await this.matchCodeGetUser()
          }
          console.log(user_phone)
        }

        // 判断是否从来电弹窗跳转过来
        if (call_phone) {
          this.clickedMatchPhone = true
          this.clickedMatchCode = true
          this.ruleForm.match_phone = call_phone
          await this.$emit('matchPhone', call_phone)
          const callUserInfo = getKEY('callUserInfo')
          if (callUserInfo) {
            const { p_code } = callUserInfo
            if (p_code) {
              this.ruleForm.p_code = p_code
              await this.matchCodeGetUser()
            }
          }
        }
      } else if (path === '/worker-order/edit') {
        this.title = '编辑工单'
        this.pathType = 3
        this.btnName = '确认编辑'
        this.isView = false
        this.getSheetInfo()
      } else {
        console.log('pathname不正确')
      }
    },
    async updateWorkSheet() {
      this.getSheetInfo()
    },
    // 获取工单详情
    async getSheetInfo() {
      const { code, data } = await modelSheet.getSheetDetail(this.ws_id)
      if (code === 11) {
        const {
          ws_type1,
          ws_type2,
          records,
          is_dispatch,
          processed_name,
          processed_by,
          ws_code,
          user_id,
          p_code,
          replace_status,
          dispatch_info,
          client_id
        } = data
        this.ruleForm.ws_type1 = ws_type1
        this.ruleForm.ws_type2 = ws_type2
        this.ruleForm.ws_code = ws_code
        this.ruleForm.p_code = p_code
        this.timeLine = records
        const pick = [
          'source',
          'status',
          'follow_time',
          'create_time',
          'created_by',
          'created_name',
          'is_dispatch',
          'province',
          'city',
          'district',
          'agent_id',
          'agent_name',
          'question',
          'treatment',
          'buy_date',
          'replace_status'
        ]
        this.sheetForm = Utils.pick(data, pick)
        // 查看工单
        if (this.pathType === 1) {
          this.sheetForm.processed_by = processed_by
          this.sheetForm.processed_name = processed_name
        } else if (this.pathType === 3) { // 编辑工单
          if (this.user.name) {
            this.sheetForm.processed_by = this.user.account_id
            this.sheetForm.processed_name = this.user.name
          }
        }
        this.sheetForm.follow_time = dateFormat(data.follow_time)
        this.sheetForm.buy_date = dateFormat(data.buy_date)
        // 获取指派经销商的信息
        if (dispatch_info.length) {
          const agentInfo = dispatch_info[0]
          this.agentInfo = agentInfo
          this.sheetForm.agent_id = agentInfo.agent_id
          this.sheetForm.agent_name = agentInfo.agent_name
          this.agentProvince.province = agentInfo.province || ''
          this.agentProvince.city = agentInfo.city || ''
          
          // 编辑工单将指派的经销商选框回显
          if (!this.pathType === 3 && is_dispatch === 1) {
            this.$nextTick(() => {
              this.$refs.agentSelectProvince.map = this.agentProvince
            })
          }
          
          // 判断创建的时候是否指派了经销商
          if (is_dispatch === 1 && agentInfo.agent_id) {
            this.hasDispachedAgent = true
            // 请求经销商列表
            this.getAgents()
          }
        }
        // 售后的工单，去获取治疗信息
        if (ws_type1 === 1 && user_id) {
          await this.getInjectInfo(user_id)
          await this.getBloodInfo(user_id)
          await this.getComplication(user_id)
          await this.getProductProblems(user_id)
        }
        // 查询客户信息,售后工单才有p_code
        if (p_code) {
          await this.$emit('matchCode', p_code) // 获取客户信息
          await this.getProductUser(p_code, true) // 获取产品使用人信息
          await this.getIsSelf(p_code)
        }
        // 售前工单，通过client_id查询客户详情
        if (client_id) {
          await this.$emit('matchClientId', client_id)
        }
        // 查询工单的回访信息
        if (user_id) {
          // 通过使用者id去查询对应的回访列表
          await this.getVisitList(user_id)
        }
        // 判断是否有过换新单
        if (replace_status !== undefined) {
          this.hasReplaced = true
        }
        // 获取产品的经销商信息
        if (ws_type1 === 1) {
          await this.getAgentFormPCode()
        }
      }
    },
    changeCheckList(val) {
      console.log(val)
    },
    // 获取客户对应的回访信息
    async getVisitList(user_id) {
      try {
        const { code, data } = await modelSheet.getVisitList({ user_id })
        if (code === 11) {
          const [{ visit_status }] = data
          if (visit_status !== undefined) {
            // 只有当visit_status不为0才会去展示按钮，因为工单只会有查看回访记录
            /* *
             * visit_status字段解释
             * 0：当前处于首次回访，未完成
             * 1：当前处于7天回访，首次回访已完成
             * 以此类推
             * */
            if (visit_status === 0) {
              // 此时没有回访信息，不展示
            } else {
              this.tabList = visitTabList(visit_status, true)
              this.visitInfo.visit_status = visit_status
              /* *
               * 1、2、3 三种情况
               * 去通知回访组件，默认显示首次回访信息
               * */
              this.$nextTick(() => {
                this.visitInfo.user_id = user_id
                this.$refs.visitContent.handleVisitInfo(this.visitInfo)
              })
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    /* *
     * 1、当通过productUser.phone查询客户信息：分为三类，0、普通客户，1、注册会员，没查到则为未识别客户
     * 用户类型定义：注册会员、普通客户 （注册时的身份转换问题）
        * 售前工单：
        * 1. 通过手机号识别用户类型：注册会员、普通客户、未识别客户。 （匹配的时候先找客户信息，找不到再找使用人信息）
        * 2. 如果是注册会员或普通客户直接创建售前工单。如果是未识别客户，创建普通客户，再创建售前工单。
        ***
        * 售后工单：
        * 1. 通过手机号识别用户类型：注册会员、普通客户、未识别客户。（匹配的时候先找客户信息，找不到再找使用人信息）
        * 2. 对于注册会员，检查输入的产品编号是否属于该会员，是则匹配使用人信息，创建售后工单，否则提示产品未注册，创建工单失败。
        * 3. 对于普通客户，检查输入的产品编号是否属于该客户，是则匹配使用人信息，创建售后工单，否则为客户添加产品及使用人信息。
        * 4. 对于未识别客户，创建普通客户。为客户添加产品及使用人。
      * */
    /* *
     * 提交表单逻辑如下：
     * 1、对于售前工单，先创建客户，然后根据客户id去创建工单
     * 2、对于售后工单分两种情况：{
     *    1、未匹配到客户信息的：
     *      ●先去创建客户（此时，使用人就是客户），
     *      ●然后根据客户id创建使用人（为客户添加商品），
     *      ●创建工单，
     *      ●根据使用人id、工单id添加治疗信息
     *    2、已匹配到客户信息的：
     *          直接去创建使用人(如果没有匹配到使用人信息的话，已经匹配到的则是调用编辑使用人接口)、
     *          创建工单
     *          最后添加治疗信息(需要使用人id和工单code)
     * }
     * */
    submitForm: Utils.debounce(
      // eslint-disable-line
      async function() {
        // 匹配手机号和产品编号关系校验
        const pass = await this.checkRelations()
        console.log(pass)
        if (!pass) {
          return
        }
        // return
        // 表单校验
        this.$refs.ruleForm.validate(async valid => {
          if (valid) {
            // 创建工单
            if (this.pathType === 2) {
              if (this.ruleForm.ws_type1 === 0) { // 售前
                if (!this.isMember) {
                  await this.createClient()
                } else {
                  // 售后的工单需要client_id、product_id这两个字段
                  await this.createSheet(this.ruleForm.client_id)
                  await this.editClient(this.ruleForm.client_id)
                }
              } else { // 售后
                if (!this.isMember) { // 不是客户
                  await this.createClient()
                }
                if (this.isMember) { // 是客户（普通客户或者会员）
                  await this.createUser(this.ruleForm.client_id)
                  await this.createSheet(this.ruleForm.client_id)
                }
              }
            } else {
              // 编辑工单
              if (this.ruleForm.ws_type1 === 0) { // 售前
                // 售后的工单需要client_id、product_id这两个字段
                await this.editSheet()
                await this.editClient(this.ruleForm.client_id)
              }
              if (this.ruleForm.ws_type1 === 1) { // 售后
                await this.createUser(this.ruleForm.client_id)
                await this.editSheet()
              }
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      2000,
      { leading: true, trailing: false },
    ),
    // 创建客户
    async createClient() {
      try {
        const type = this.ruleForm.ws_type1
        // 售前
        if (String(type) === '0') {
          const params = Utils.deepClone(this.callInfo)
          params.client_type = 0 // 表示客户类型为普通客户
          params.source = 1 // 客服注册
          const { code, client_id, message } = await modelCustomer.createClient(params)
          if (code === 11) {
            await this.createSheet(client_id)
          } else {
            this.$message.error(message)
          }
        } else {
          // 售后
          const params = Utils.deepClone(this.productUser)
          params.client_name = params.name
          params.client_type = 0 // 表示客户类型为普通客户
          params.source = 1 // 表示客服注册
          const { code, client_id, message } = await modelCustomer.createClient(params)
          if (code === 11) {
            // 创建完客户后，去创、编辑使用人
            await this.createUser(client_id)
            if (!this.isMember) {
              await this.createSheet(client_id)
            }
          } else {
            this.$message.error(message)
          }
        }
      } catch (error) {
        console.log(error)
        const { data } = error
        const { code, message } = data
        const type = this.ruleForm.ws_type1
        if (code === 10306) {
          // 表示该客户已存在
          const phone = message.substring(0, 11)
          const res = await modelCustomer.queryList({ phone })
          const [{ client_id }] = res.data
          this.createSheet(client_id)
          if (String(type) === '1') {
            await this.createUser(client_id)
          }
        }
      }
    },
    // 编辑客户（只有售前的会设计到编辑客户，将来电基础信息作为客户信息进行编辑）
    async editClient() {
      try {
        const params = Utils.deepClone(this.callInfo)
        const { code, message } = await modelCustomer.editClient(params)
        if (code === 11) {
          console.log(message)
        } else {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 创建、或编辑产品使用人（为客户添加产品）
    async createUser(client_id) {
      const params = Utils.deepClone(this.productUser)
      params.p_code = this.ruleForm.p_code
      params.buy_date = this.sheetForm.buy_date
      let response = null
      if (this.pathType === 3) {
        const hasProduct = this.productList.some(item => item.p_code === this.ruleForm.p_code)
        this.hasProduct = hasProduct
      }
      /* *
       * 有p_id并且输入的检查到输入的P_code在使用人的产品列表中
       * 此处不用try catch，这样当添加产品出错就不会继续下去会卡主
       * */
      if (params.p_id && this.hasProduct) {
        response = await modelCustomer.editProduct(params.p_id, params)
      } else { // 创建
        response = await modelCustomer.addProduct(client_id, params)
      }
      const { code, p_id, user_id } = response
      if (code === 11) {
        // 创建产品使用人会返回p_id,编辑时候用原来的p_id
        this.ruleForm.p_id = p_id || params.p_id
        // 创建使用人会返回user_id,编辑时候直接用查询到的user_id
        this.productUser.user_id = user_id || this.productUser.user_id
        await this.productEdit(client_id, this.ruleForm.p_id, { is_self: params.is_self })
      }
      if (code === 10050) {
        this.$message.error('该产品编号已经注册过')
      }
    },
    // 单独修改is_self字段
    async productEdit(clientId, p_id, params) {
      try {
        const { code } = await modelCustomer.productEdit(clientId, p_id, params)
        if (code === 11) {
          console.log('is_self字段修改成功！')
        } else {
          console.error('is_self字段修改失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 创建工单
    async createSheet(client_id) {
      const sheetForm = Utils.deepClone(this.sheetForm)
      const params = Utils.removeEmptyAttr(sheetForm)
      params.client_id = client_id
      params.ws_type1 = this.ruleForm.ws_type1
      params.call_phone = this.callInfo.phone
      params.ws_type2 = this.ruleForm.ws_type2
      params.product_id = this.ruleForm.p_id
      params.addedBy = this.sheetForm.processed_by

      const { code, ws_code, message } = await modelSheet.createSheet(params)
      if (code === 11) {
        this.$message.success(message)
        // 售后的工单，创建完后去创建治疗信息，售前的则直接返回列表页
        if (this.ruleForm.ws_type1 === 1) {
          await this.createTreatment(ws_code)
        } else {
          await this.goList()
        }
      } else {
        this.$message.error(message)
      }
    },
    // 编辑工单
    async editSheet() {
      const sheetForm = Utils.deepClone(this.sheetForm)
      const params = Utils.removeEmptyAttr(sheetForm)
      params.client_id = this.ruleForm.client_id
      params.ws_type1 = this.ruleForm.ws_type1
      params.call_phone = this.callInfo.phone
      params.ws_type2 = this.ruleForm.ws_type2
      params.product_id = this.ruleForm.p_id
      params.ws_id = this.ws_id
      params.addedBy = this.sheetForm.processed_by

      const { code, ws_code, message } = await modelSheet.editSheet(this.ws_id, params)
      if (code === 11) {
        this.$message.success(message)
        if (this.ruleForm.ws_type1 === 1) {
          await this.createTreatment(ws_code)
        }
        if (this.ruleForm.ws_type1 === 0) {
          await this.goList()
        }
      } else {
        this.$message.error(message)
      }
    },
    // 创建治疗方案
    async createTreatment(ws_code) {
      /* *
       * 治疗方案相关接口有四个：注射信息、血糖信息、用药和并发症、产品使用问题
       * * */
      // console.log(ws_code, this.productUser.user_id)
      await this.updateInjectInfo(ws_code, this.productUser.user_id)
      await this.updateBloodInfo(ws_code, this.productUser.user_id)
      await this.updateComplication(ws_code, this.productUser.user_id)
      await this.updateProductProblems(ws_code, this.productUser.user_id)
      await this.goList()
    },
    goList() {
      this.$router.push({ path: '/worker-order/list' })
    },
    // 修改注射信息
    async updateInjectInfo(ws_code, user_id) {
      try {
        const params = {
          user_id,
          ws_code,
          ...this.injectForm,
        }
        const { code } = await modelSheet.updateInjectInfo(params)
        if (code === 11) {
          console.log('修改注射信息成功')
        } else {
          console.error('修改注射信息失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取注射信息
    async getInjectInfo(user_id) {
      try {
        const { code, data, message } = await modelSheet.getInjectInfo(user_id)
        if (code === 11) {
          this.injectForm = data
        } else {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改血糖信息
    async updateBloodInfo(ws_code, user_id) {
      const params = {
        user_id,
        ws_code,
        ...this.bloodForm,
      }
      try {
        const { code } = await modelSheet.updateBloodInfo(params)
        if (code === 11) {
          console.log('修改血糖信息成功')
        } else {
          console.error('修改血糖信息失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取血糖信息
    async getBloodInfo(user_id) {
      try {
        const { code, data, message } = await modelSheet.getBloodInfo(user_id)
        if (code === 11) {
          this.bloodForm = data
        } else {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改使用人用药及并发症信息
    async updateComplication(ws_code, user_id) {
      const params = {
        user_id,
        ws_code,
        ...this.complicationForm,
      }
      if (params.has_complication) {
        const list = Utils.deepClone(this.disease.checkList)
        const { otherDisease } = this.disease
        list.push(otherDisease)
        console.log(list)
        params.complication = list.toString()
      }
      try {
        const { code } = await modelSheet.updateComplication(params)
        if (code === 11) {
          console.log('修改使用人用药及并发症信息成功')
        } else {
          console.error('修改使用人用药及并发症信息失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取使用人用药及并发症信息
    async getComplication(user_id) {
      try {
        const { code, data, message } = await modelSheet.getComplication(user_id)
        if (code === 11) {
          this.complicationForm = data
          if (data.has_complication && data.complication) {
            const list = data.complication.split(',')
            if (list.length) {
              const last = list[list.length - 1]
              if (!last) {
                this.disease.checkList = list.map(item => Number(item))
              } else {
                const checkList = list.slice(0, list.length - 1)
                if (checkList.length) {
                  this.disease.checkList = checkList.map(item => Number(item))
                }
                this.disease.otherDisease = list[list.length - 1]
              }
            }
          }
        } else {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 修改使用人产品使用问题信息
    async updateProductProblems(ws_code, user_id) {
      const params = {
        user_id,
        ws_code,
        ...this.productIssueForm,
      }
      try {
        const { code } = await modelSheet.updateProductProblems(params)
        if (code === 11) {
          console.log('修改产品使用人问题信息成功')
        } else {
          console.error('修改产品使用人问题信息失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取使用人产品使用问题信息
    async getProductProblems(user_id) {
      const { code, data, message } = await modelSheet.getProductProblems(user_id)
      if (code === 11) {
        this.productIssueForm = data
      } else {
        console.log(message)
      }
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    // 产品换新弹框
    showRenewal() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    // 是否指派经销商
    async changeDispatch(val) {
      if (val === 1) {
        this.sheetForm.status = 1
        // 获取经销商列表
        if (!this.agentList.length) {
          await this.getAgents()
        }
        // p_code查询经销商
        if (this.ruleForm.ws_type1 === 1) {
          await this.getAgentFormPCode()
        }
      } else {
        this.sheetForm.status = 0
      }
    },
    // 折叠、展开全部面板
    togglePanel() {
      if (this.collapseName.length) {
        this.collapseName = []
        this.isOpen = false
      } else {
        this.collapseName = [1, 2, 3, 4, 5, 6, 7, 8]
        this.isOpen = true
      }
    },
    handleTabClick(tab) {
      this.tableTitle = tab.label
      this.activeName = tab.name
    },
    // 查看历史工单详情
    showOrderDetail(index, row) {
      this.dialogDetailView = true
      // 这条赋值语句作用为，将row数据传递给弹框组件
      this.historyOrder = row
    },
    // 关闭历史工单详情弹框
    closeDetailView() {
      this.dialogDetailView = false
      this.isDialog = false
      this.historyOrder = {}
      this.switchRouter()
    },
    // 指派经销商的详情页信息
    showVisitInfo() {
      this.dialogVisibleView = true
    },
    closeDialogView() {
      this.dialogVisibleView = false
    },
    // 点击匹配，通过手机号获取客户信息
    async matchPhone() {
      if (!this.ruleForm.match_phone) {
        this.$message.error('请输入匹配手机号')
        return false
      }
      this.clickedMatchPhone = true
      await this.$emit('matchPhone', this.ruleForm.match_phone)
    },
    // 通过p_code获取客户信息
    async matchCode() {
      if (!this.ruleForm.p_code) {
        this.$message.error('请输入产品编码')
        return false
      }
      await this.$emit('matchCode', this.ruleForm.p_code)
      if (this.ruleForm.ws_type1 === 1) {
        await this.getProductUser(this.ruleForm.p_code, true)
      }
    },
    // 点击匹配，通过p_code进行匹配
    async matchCodeGetUser() {
      if (!this.ruleForm.p_code) {
        this.$message.error('请输入产品编码')
        return false
      }
      this.clickedMatchCode = true
      await this.getProductUser(this.ruleForm.p_code, true) // 获取使用人，
      await this.getAgentFormPCode() // 获取经销商
      await this.getIsSelf(this.ruleForm.p_code) // 获取is_self
    },
    /**
     *  一个匹配按钮，匹配客户、使用人、产品列表、is_self等，
     * 查询到接口信息后，并对客户、使用人与产品编码的关系做判断
     * */
    // eslint-disable-line
    matchAllBtn: Utils.debounce(async function() {
      if (!this.ruleForm.match_phone) {
        this.$message.error('请输入匹配手机号')
        return false
      }
      if (!this.ruleForm.p_code && this.ruleForm.ws_type1 === 1) {
        this.$message.error('请输入产品编码')
        return false
      }
      await this.matchPhone()
      if (this.ruleForm.ws_type1 === 1) {
        await this.matchCodeGetUser()
        await this.checkRelations()
      }
    }, 2000, { leading: true, trailing: false }),
    // 校验客户、使用人二者与p_code的关系
    async checkRelations() {
      let obj = {}
      if (this.pathType === 2) {
        if (!this.ruleForm.match_phone) {
          this.$message.error('请输入匹配手机号')
          return false
        }
        if (!this.ruleForm.p_code && this.ruleForm.ws_type1 === 1) {
          this.$message.error('请输入产品编码')
          return false
        }
        // 获取客户类型
        const clientType = await this.judgeClientTypeByPhone(this.ruleForm.match_phone)
        // 获取是否存在产品使用人
        const judgeProductUser = await this.judgeProductUserByPhone(this.ruleForm.match_phone)
        // 通过p_code获取客户信息
        const getClientPhoneByPCode = await this.getClientPhoneByPCode(this.ruleForm.p_code)
        // 校验产品编码获取的客户信息和手机号查询的客户信息是否一致
        if (getClientPhoneByPCode && this.ruleForm.phone && getClientPhoneByPCode !== this.ruleForm.phone) {
          this.$message({
            message: `产品编码${this.ruleForm.p_code}已绑定客户，且与手机号${this.ruleForm.phone}对应的客户不匹配，无法创建工单`,
            type: 'error',
            duration: 10000,
            showClose: true
          })
          return false
        }
        if (getClientPhoneByPCode && !this.ruleForm.phone) {
          this.$message({
            message: `产品编码${this.ruleForm.p_code}已绑定客户，无法与手机号${this.ruleForm.match_phone}绑定，无法创建工单`,
            type: 'error',
            duration: 10000,
            showClose: true
          })
          return false
        }

        obj.clientType = clientType
        obj.judgeProductUser = judgeProductUser
        if (String(clientType)) {
          // 判断输入的p_code是否在客户的产品列表中
          //  this.productList是通过client_id获取的客户产品列表
          const hasProduct = this.productList.some(item => item.p_code === this.ruleForm.p_code)
          this.hasProduct = hasProduct
          obj.hasProduct = hasProduct
          // 售后工单
          if (this.ruleForm.ws_type1 === 1) {
            if (!this.clickedMatchPhone || !this.clickedMatchCode) {
              this.$message.error('售后工单，请先匹配手机号和产品编码')
              return false
            }
            // 当客户为注册会员，且输入的p_code不在客户的产品列表中时候，不允许创建工单
            if (!hasProduct && clientType === 1) {
              this.$message({
                message: '该匹配手机号对应的为注册会员，且产品不在客户产品列表中，无法创建工单',
                type: 'error',
                duration: 5000,
                showClose: true
              })
              return false
            }
          }
        }
      }
      obj.pass = true
      return obj
    },
    // 通过p_code获取经销商信息(只有创建工单时候用到)
    async getAgentFormPCode() {
      const { p_code } = this.ruleForm
      if (!p_code) {
        this.$message.error('请输入产品编码')
        return false
      }
      // 获取经销商详情接口
      try {
        const { code, data } = await modelSheet.getAgentInfo({ p_code })
        if (code === 11) {
          this.hasAgentMatch = true
          this.agentProvince.province = data.province
          this.agentProvince.city = data.city
          this.sheetForm.agent_id = data.agent_id
          this.sheetForm.agent_name = data.agent_name
          this.ruleForm.agent_name = data.agent_name
        } else {
          this.hasAgentMatch = false
          console.log(`产品编码${p_code}，查询不到经销商信息`)
        }
      } catch (error) {
        this.hasAgentMatch = false
        console.log(`产品编码${p_code}，查询不到经销商信息`)
      }
    },
    // 获取产品使用人信息
    async getProductUser(val, type) {
      // 判断是不是从回访记录跳转过来的
      if (this.vistJumpSheetCreateInfo && this.$route.query.type) {
        const { productUser } = this.vistJumpSheetCreateInfo
        if (productUser) {
          await this.handleUserInfo(productUser)
        }
        return
      }

      // 请求接口
      try {
        let params = {}
        // 有type表示用p_code查询
        if (type) {
          params = { p_code: val }
        } else {
          params = { phone: val }
        }
        const { code, data } = await modelCustomer.getProductUser(params)
        if (code === 11) {
          let user = {}
          // 用phone获取的数据返回的是数组，用p_code返回的是object
          if (toRawType(data) === 'Array' && data.length) {
            [user] = data
            this.hasProductUser = true
          } else if (toRawType(data) === 'Object') {
            user = data
            this.hasProductUser = true
          }
          // 当user有数据时
          this.productUser.relation = user.relation
          this.productUser.name = user.name
          this.productUser.phone = user.phone
          this.productUser.age = user.age
          this.productUser.sex = user.sex
          this.productUser.province = user.province
          this.productUser.city = user.city
          this.productUser.district = user.district
          this.productUser.address = user.address
          this.productUser.user_id = user.user_id
          this.productUser.p_id = user.p_id
          this.visitInfo.user_id = this.productUser.user_id
          // console.log( this.productUser)
          if (user.relation === 0) {
            this.productUser.is_self = 1
          } else {
            this.productUser.is_self = 0
          }
          // 将省份数据填入
          const { city, district, province } = user
          const mapData = {
            province: province || '',
            city: city || '',
            county: district || '',
          }
          if (!this.isView) {
            this.$nextTick(() => {
              this.$refs.userMapSelect.map = mapData
            })
          }
        } else {
          this.hasProductUser = false
        }
      } catch (error) {
        this.hasProductUser = false
        // console.log(error)
        const { data: { code } } = error
        // 产品不存在
        if (code === 10501) {
          console.log(`此产品编号${val},查询不到使用人信息`)
          this.productUser.user_id = ''
          this.productUser.p_id = ''
          this.visitInfo.user_id = ''
          await this.clearUserInfo()
        }
      }
    },
    // 将回访记录的数据带过来填入使用人信息
    handleUserInfo(productUser) {
      if (this.$route.query.type && Object.keys(productUser).length) {
        const data = productUser
        this.productUser.relation = data.relation
        this.productUser.name = data.name
        this.productUser.phone = data.phone
        this.productUser.age = data.age
        this.productUser.sex = data.sex
        this.productUser.province = data.province
        this.productUser.city = data.city
        this.productUser.district = data.district
        this.productUser.address = data.address
        this.productUser.user_id = data.user_id
        this.productUser.p_id = data.p_id
        this.hasProductUser = true
        this.ruleForm.p_id = data.p_id
        const { city, district, province } = data
        const mapData = {
          province: province || '',
          city: city || '',
          county: district || '',
        }
        if (!this.isView) {
          this.$nextTick(() => {
            this.$refs.userMapSelect.map = mapData
          })
        }
      }
    },
    /**
     * 根据产品编码查询产品列表的is_self字段
     * 接口为查询客户产品列表的接口
     * */
    async getIsSelf(p_code) {
      if (!this.ruleForm.client_id) {
        console.log('没有client_id，无法查询is_self')
        return
      }
      try {
        const { code, data } = await modelCustomer.getProduct(this.ruleForm.client_id, { p_code })
        if (code === 11 && data.length) {
          const this_product = data.filter(item => item.p_code === this.ruleForm.p_code)
          const product = this_product[0] || data[0]
          this.$nextTick(() => {
            this.productUser.is_self = product.is_self
            this.productUser.p_type = product.p_type
          })
          this.$forceUpdate()
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取客户产品列表
    async getProductsList() {
      try {
        const { data } = await modelCustomer.getProduct(this.ruleForm.client_id)
        this.productList = data || []
      } catch (error) {
        console.log(error)
      }
    },
    // 更新客户信息
    async updateMember(val) {
      this.ruleForm.client_id = val.client_id
      this.ruleForm.client_name = val.client_name
      this.ruleForm.register_time = val.register_time
      this.ruleForm.sex = val.sex
      this.ruleForm.age = val.age
      this.ruleForm.phone = val.phone
      this.ruleForm.provice = val.provice
      this.ruleForm.city = val.city
      this.ruleForm.district = val.district
      this.ruleForm.address = val.address
      if (val.phone) {
        this.ruleForm.match_phone = val.phone
      }
      // 不是查看历史工单、不是查看详情时候、获取历史工单列表
      if (!this.isDialog && !this.isView && val.client_id) {
        await this.getSheetHistory(val.client_id)
      }
      // 售前工单，将客户信息填写到来电人信息处
      if (this.ruleForm.ws_type1 === 0) {
        this.callInfo.client_id = val.client_id
        this.callInfo.client_name = val.client_name
        this.callInfo.sex = val.sex
        this.callInfo.age = val.age
        this.callInfo.phone = val.phone
        this.callInfo.channel_type = val.channel_type
        this.callInfo.provice = val.provice
        this.callInfo.city = val.city
        this.callInfo.district = val.district
        this.callInfo.address = val.address
        const mapData = {
          province: val.province,
          city: val.city,
          county: val.district,
        }
        this.$refs.callInfoProvince.map = mapData
      }
      // 售后工单查询产品列表，在提交表单的时候做校验使用
      if (this.ruleForm.ws_type1 === 1) {
        await this.getProductsList()
      }
    },
    // 获取客户工单列表（历史工单）
    async getSheetHistory(client_id) {
      try {
        const { code, data } = await modelCustomer.getWorkSheet(client_id)
        if (code === 11) {
          if (data && data.length) {
            this.tableSheetData = data.filter(item => item.ws_id !== this.ws_id)
          }
        } else {
          this.tableWorkerData = []
        }
      } catch (error) {
        this.tableWorkerData = []
      }
    },
    changeIssuseType() {
      this.ruleForm.ws_type2 = ''
    },
    // 选择是否本人触发
    changeSelfInject() {
      const val = this.productUser.is_self
      if (val === 1) { // 是本人
        this.relationData = WS.relationData()
        this.productUser.relation = 0
        this.fillClientIntoUser()
      } else {
        this.relationData = WS.relationData(true)
        this.productUser.relation = 1
        this.clearUserInfo()
      }
    },
    // 将客户信息添加到使用人信息
    fillClientIntoUser() {
      const user = Utils.deepClone(this.ruleForm)
      this.productUser.name = user.client_name
      this.productUser.phone = user.phone
      this.productUser.age = user.age
      this.productUser.sex = user.sex
      this.productUser.province = user.province
      this.productUser.city = user.city
      this.productUser.district = user.district
      this.productUser.address = user.address
      const { city, district, province } = user
      const mapData = {
        province,
        city,
        county: district,
      }
      this.$nextTick(() => {
        this.$refs.userMapSelect.map = mapData
      })
    },
    // 清空产品使用人信息
    clearUserInfo() {
      this.productUser.name = ''
      this.productUser.phone = ''
      this.productUser.age = ''
      this.productUser.sex = ''
      this.productUser.province = ''
      this.productUser.district = ''
      this.productUser.address = ''
    },
    onClientProvince(val) {
      this.callInfo.province = val.province
    },
    onClientCity(val) {
      this.callInfo.city = val.city
    },
    onClientCounty(val) {
      this.callInfo.district = val.county
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
    // 经销商选择省份
    onAgentProvince(val) {
      this.agentProvince.province = val.province
      this.agentProvince.city = ''
      this.sheetForm.agent_id = null
      this.getAgents()
    },
    // 经销商选择市
    onAgentCity(val) {
      this.agentProvince.city = val.city
      this.sheetForm.agent_id = null
      this.getAgents()
    },
    selectAgent(val) {
      this.sheetForm.agent_id = val
      this.$forceUpdate()
    },
    // 获取经销商列表
    async getAgents() {
      const params = Utils.removeEmptyAttr(Utils.deepClone(this.agentProvince))
      try {
        const { data } = await agentsModel.queryList(params)
        this.agentList = data || []
      } catch (error) {
        console.log(error)
        this.agentList = []
      }
    },
    // 提交时候-通过电话查询客户类型
    async judgeClientTypeByPhone(phone) {
      if (phone) {
        const { code, data } = await modelCustomer.getInfo({ phone })
        if (code === 11) {
          if (data.client_type === 0 || data.client_type === 1) {
            return data.client_type
          }
        }
        return null
      }
    },
    // 提交时候--通过p_code查询客户信息
    async getClientPhoneByPCode(p_code) {
      try {
        const { code, data } = await modelCustomer.getInfo({ p_code })
        if (code === 11) {
          return data.phone
        }
      } catch (error) {
        console.log(error)
        const { data: { code, message } } = error
        console.log(code)
        if (code === 10501) {
          console.log(message)
        }
      }
    },
    // 提交时候-通过电话查询使用人是否存在
    async judgeProductUserByPhone(phone) {
      if (phone) {
        try {
          const { code } = await modelCustomer.getProductUser({ phone })
          if (code === 11) {
            return true
          }
          return false
        } catch (error) {
          return false
        }
      }
    },
    workStatusChange(val) {
      // 选择了进行中，则设置指派经销商为否
      if (val === 0) {
        this.sheetForm.is_dispatch = 0
      }
    },
    changeComplac(val) {
      console.log(val)
    }
  },
}
</script>

<style lang="scss" scoped>
.lin-container {
  padding: 20px 30px;
  position: relative;
  .first-title {
    width: 100%;
    text-align: center;
    height: 40px;
    font-size: 20px;
    color: #3963bc;
    font-weight: 700;
    cursor: pointer;
  }
  .table-wrapper {
    margin-bottom: 20px;
  }
  /deep/tr {
    height: 40px;
  }
  .form-btn-wrapper {
    text-align: center;
    .form-btn {
      padding: 16px 50px;
      margin: 30px 20px 30px 0;
      font-size: 17px;
    }
  }
  /deep/.el-timeline-item__content {
    .el-card__body {
      h4 {
        font-weight: 400;
        color: #1f2f3d;
      }
      p {
        font-size: 14px;
        color: #5e6d82;
        line-height: 2;
      }
    }
  }
  .second_title {
    /deep/.el-form-item__label {
      color: #4c76af;
    }
  }
  .tab-wrapper {
    margin-bottom: 0px;
  }
  .completed-visit {
    color: #67c23a;
  }
  .order-id {
    position: absolute;
    top: 38px;
    color: #1f2f3d;
    width: calc(100% - 70px);
    box-sizing: border-box;
    p {
      display: inline-block;
      &:last-child {
        float: right;
        font-size: 14px;
        color: #3963bc;
        cursor: pointer;
        i {
          margin-right: 10px;
        }
      }
      span {
        color: #3963bc;
      }
    }
  }
  .inline_group {
    display: inline-block;
  }
  .vist_wrapper {
    position: relative;
  }
}
</style>
