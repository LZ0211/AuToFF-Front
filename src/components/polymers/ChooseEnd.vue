<template>
  <!-- 选择单体 -->
  <div class="container">
    <a-button @click="showModal">{{ btnText }}</a-button>
    <a-modal :closable="false" v-model="visible" :title="title" @ok="handleOk">
      <a-row class="list-row" style="font-size: 14px; margin-bottom: 20px">
        <a-col :span="12" style="font-size: 18px; font-weight: 600">
          端基名
        </a-col>
      </a-row>
      <a-row class="list-row">
        <a-col :span="12">
          <a-select
            size="large"
            v-model="selectedId"
            style="width: 120px"
            @change="handleEndChange"
          >
            <a-select-option
              v-for="(item, index) in data"
              :key="item.id"
              :value="item.id"
              :title="lang === '中文' ? item.zh : item.en"
            >
              {{ lang === "中文" ? item.zh : item.en }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row>
        <img
          style="width: 350px; max-height: 500px;"
          v-if="selectedImg"
          :src="
            `https://api-autoff-dev.mp.iresearch.net.cn/static/monomer/` +
            `${selectedImg}`
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
            <a-button @click="visible = false"> 取消 </a-button>
            <a-button type="primary" @click="handleOk"> 确定 </a-button>
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import api from "@/api2";
import request from "@/api2/request";

import fileDownload from "js-file-download";

export default {
  name: "ElBacktop",
  props: {
    title: {
      type: String,
      default: "",
    },
    btnText: {
      type: String,
      default: "",
    },
    data: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      visible: false,
      lang: "中文",
      selectedId: "",
      selectedImg: "",
    };
  },

  computed: {},

  mounted() {},

  methods: {
    showModal() {
      this.visible = true;
      this.selectedId = "";
      this.selectedImg = "";
    },
    handleOk() {
      if (!this.selectedId) {
        this.visible = false;
        return;
      }
      const obj = this.data.find((item, index) => {
        return item.id === this.selectedId;
      });
      const ans = {
        value: this.lang === "中文" ? obj["zh"] : obj["en"],
        id: obj.id,
      };
      this.$emit("select-end", ans);
      this.$message.success("已选择端基");
      this.visible = false;
    },
    handleLangChange(value) {
      this.selectedId = "";
      this.selectedImg = "";
    },
    handleEndChange(id) {
      const obj = this.data.find((item, index) => {
        return item.id === id;
      });
      this.selectedImg = obj["2d-structure"];
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
