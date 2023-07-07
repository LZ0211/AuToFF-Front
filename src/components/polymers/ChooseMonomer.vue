<template>
  <!-- 选择单体 -->
  <div class="container">
    <a-button
      :style="{ height: `${btnHeight}px`, padding: '2px' }"
      :type="btnType"
      @click="showModal"
      >选择单体</a-button
    >
    <a-modal
      :closable="false"
      v-model="visible"
      title="请选择单体（注：名词可切换中英文）"
    >
      <a-row class="list-row" style="font-size: 14px; margin-bottom: 20px">
        <a-col :span="8" style="font-size: 18px; font-weight: 600">
          单体库名
        </a-col>
        <a-col :span="8" style="font-size: 18px; font-weight: 600">
          单体名
        </a-col>
        <!-- <a-col :span="8"> 结构图 </a-col> -->
      </a-row>
      <a-row class="list-row">
        <a-col :span="8">
          <a-select
            size="large"
            v-model="currGroup"
            style="width: 120px"
            @change="handleGroupChange"
          >
            <a-select-option
              v-for="(item, index) in groups"
              :key="index"
              :value="lang === '中文' ? item.zh : item.en"
            >
              {{ lang === "中文" ? item.zh : item.en }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <a-select
            v-if="currGroup"
            size="large"
            v-model="selectedMomo"
            style="width: 120px"
            @change="handleMomoChange"
          >
            <a-select-option
              v-for="(item, index) in momos"
              :key="index"
              :value="lang === '中文' ? item.zh : item.en"
            >
              {{ lang === "中文" ? item.zh : item.en }}
            </a-select-option>
          </a-select>
          <span v-else>
            {{ "--" }}
          </span>
        </a-col>
        <!-- <a-col :span="8">
          <img
            width="120px"
            height="120px"
            v-if="selectedMomo"
            :src="
              `https://api-autoff-dev.mp.iresearch.net.cn/static/monomer/` +
              `${selectedMomoImg}`
            "
            alt=""
          />
          <span v-else>
            {{ "--" }}
          </span>
        </a-col> -->
      </a-row>
      <a-row>
        <img
          style="width: 350px; max-height: 500px;"
          v-if="selectedMomo"
          :src="
            `https://api-autoff-dev.mp.iresearch.net.cn/static/monomer/` +
            `${selectedMomoImg}`
          "
          alt=""
        />
      </a-row>
      <template slot="footer">
        <div style="display: flex; justify-content: space-between">
          <div>
            <a-select
              v-model="lang"
              style="width: 90px"
              @change="handleLangChange"
            >
              <a-select-option value="中文"> 中文 </a-select-option>
              <a-select-option value="English"> English </a-select-option>
            </a-select>
          </div>
          <div>
            <a-button @click="onClickCancel"> 取消 </a-button>
            <a-button type="primary" @click="onClickOk"> 确定 </a-button>
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import api from "@/api2";
import request from "@/api2/request";
import { timingSafeEqual } from "crypto";

import fileDownload from "js-file-download";

export default {
  name: "ElBacktop",
  props: {
    btnType: {
      type: String,
      default: "",
    },
    // 单体库的数据也可以通过props传进来，这样就不用在组件内请求数据了
    data: {
      type: Array,
      default: () => [],
    },
    // 按钮的高度
    btnHeight: {
      type: Number,
      default: 32,
    },
  },

  data() {
    return {
      visible: false,

      originData: [],

      lang: "中文",
      groups: [], // 单体库列表
      currGroup: "",
      momos: [], // 选完单体库，显示单体列表
      selectedMomo: "", // 最终选择的momo
      selectedMomoImg: "",
    };
  },

  computed: {
    styleBottom() {
      return `${this.bottom}px`;
    },
    styleRight() {
      return `${this.right}px`;
    },
  },

  created() {
    this.currGroup = null;
    this.selectedMomo = "";
    this.selectedMomoImg = "";
    this.groups = [...this.data];
    this.originData = [...this.data];
  },

  mounted() {},

  methods: {
    // 获取单体库
    getMonos() {
      return new Promise((resolve, reject) => {
        request
          .get(api.monomer, {})
          .then((data) => {
            console.log("===================返回数据", data);
            resolve(data.data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    // 打开弹框
    showModal() {
      this.currGroup = null;
      this.selectedMomo = "";
      this.selectedMomoImg = "";
      this.groups = [...this.data];
      this.originData = [...this.data];
      this.visible = true;
    },
    // 切换不同的group的时候
    handleGroupChange(value) {
      let obj = null;
      if (this.lang === "中文") {
        obj = this.groups.find((item) => {
          return item["zh"] === value;
        });
      } else {
        obj = this.groups.find((item) => {
          return item["en"] === value;
        });
      }
      this.momos = JSON.parse(JSON.stringify(obj["subgroup"]));

      setTimeout(() => {
        this.selectedMomo = null;
      }, 0);
    },
    // 切换不同的单体的时候
    handleMomoChange(value) {
      if (value) {
        this.selectedMomo = value;
        let obj = null;
        if (this.lang === "中文") {
          obj = this.momos.find((item) => {
            return item["zh"] === value;
          });
        } else {
          obj = this.momos.find((item) => {
            return item["en"] === value;
          });
        }
        this.selectedMomoImg = obj["2d-structure"];
      }
      // console.log(this.selectedMomo);
    },

    // 切换语言时，重置
    handleLangChange(value) {
      this.currGroup = null;
      this.selectedMomo = "";
      this.selectedMomoImg = "";
    },
    // 点击取消
    onClickCancel() {
      this.visible = false;
    },
    // 点击OK
    onClickOk() {
      if (!this.selectedMomo) {
        this.visible = false;
        return;
      }
      // 需要找到选中的单体的id
      let prop = this.lang === "中文" ? "zh" : "en";
      const obj = this.momos.find(
        (item, index) => item[prop] === this.selectedMomo
      );
      const ans = obj ? { value: obj[prop], id: obj.id } : null;
      console.log("ans", ans);
      this.$emit("select-memo", ans);
      this.$message.success("已选择单体");
      this.visible = false;
    },
  },
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.container {
  display: inline-flex;
}
</style>
