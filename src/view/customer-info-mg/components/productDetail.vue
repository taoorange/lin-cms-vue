<template>
  <div class="lin-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :show-close="false"
      size="small"
      width="1200px"
      :visible.sync="dialogVisible"
    >
      <button type="button" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="closeDialog"></i>
      </button>
      <el-form :model="dto" :inline="false" size="small" label-width="140px" class="demo-ruleForm">
        <!-- 基本信息 -->
        <template>
          <el-row :gutter="24">
            <div class="title">
              <h1>基本信息</h1>
            </div>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="产品编码：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="回访：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="换新：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="归属经销商：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- 使用人基础信息 -->
        <template>
          <el-row :gutter="24">
            <div class="title">
              <h1>使用人基础信息</h1>
            </div>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="使用者姓名：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="使用者电话：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="使用者所在地：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="使用者详细地址：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="使用者年龄：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="糖尿病病龄：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- 治疗方案 -->
        <template>
          <el-row :gutter="24">
            <div class="title">
              <h1>治疗方案</h1>
            </div>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="糖尿病类型：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="胰岛素注射年限：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="无针使用年限：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="胰岛素名称：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="胰岛素注射次数：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="第一次注射计量：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="空腹血糖值：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="餐后血糖值：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="夜间血糖值：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="有无服用抗凝药：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="有无口服降糖药：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="糖化血红蛋白：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="C肽：">
                <span>{{ dto.name }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="有无并发症：">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="硬结"></el-checkbox>
                  <el-checkbox label="糖尿病足"></el-checkbox>
                  <el-checkbox label="视物模糊"></el-checkbox>
                  <el-checkbox label="脂肪增生或凹陷"></el-checkbox>
                  <el-checkbox label="注射部位色素沉着"></el-checkbox>
                  <el-checkbox label="心血管病变"></el-checkbox>
                  <el-checkbox label="肾病"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '产品详情',
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dto: {},
      visable: false,
      checkList: ['硬结', '注射部位色素沉着'],
    }
  },
  computed: {},
  watch: {},
  components: {},
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>

<style lang="scss" scoped>
.lin-container {
  padding: 20px 30px;
  position: relative;
  /deep/.el-form-item__content {
    margin-bottom: 0;
  }
}
</style>
