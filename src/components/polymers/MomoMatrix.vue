<template>
  <!-- 构建重复单元 -->
  <div class="container">
    <div v-if="type === 1" class="probability">
      <!-- 列头 -->
      <a-row>
        <a-col :span="Math.floor(24 / (n + 1))"> 单体 </a-col>
        <a-col
          :span="Math.floor(24 / (n + 1))"
          v-for="(i, index1) in nArray"
          :key="`${index1}`"
        >
          {{ index1 + 1 }}
        </a-col>
      </a-row>
      <!-- 单体数量 n 行 -->
      <a-row v-for="(i, index1) in nArray" :key="index1">
        <a-col :span="Math.floor(24 / (n + 1))"> {{ index1 + 1 }} </a-col>
        <a-col
          :span="Math.floor(24 / (n + 1))"
          v-for="(j, index2) in nArray"
          :key="`${index1}_${index2}`"
          style="display: inline-flex"
        >
          <a-input-number
            size="small"
            :min="0"
            :max="1"
            :precision="3"
            :default-value="1 / n"
          />
        </a-col>
      </a-row>
    </div>
    <div v-if="type === 2" class="compete">
      <!-- 列头 -->
      <a-row>
        <a-col :span="Math.floor(24 / (n + 2))"> 单体 </a-col>
        <a-col :span="Math.floor(24 / (n + 2))"> 浓度 </a-col>
        <a-col
          :span="Math.floor(24 / (n + 2))"
          v-for="(i, index1) in nArray"
          :key="`${index1}`"
        >
          {{ index1 + 1 }}
        </a-col>
      </a-row>
      <!-- 单体数量 n 行 -->
      <a-row v-for="(i, index1) in nArray" :key="index1">
        <a-col :span="Math.floor(24 / (n + 2))"> {{ index1 + 1 }} </a-col>
        <a-col :span="Math.floor(24 / (n + 2))"> 0.500 </a-col>
        <a-col
          :span="Math.floor(24 / (n + 2))"
          v-for="(j, index2) in nArray"
          :key="`${index1}_${index2}`"
          style="display: inline-flex"
        >
          <a-input-number
            size="small"
            :min="0"
            :max="1"
            :precision="3"
            :default-value="1"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import api from "@/api2";
import request from "@/api2/request";

import fileDownload from "js-file-download";

export default {
  name: "MomoMatrix",
  props: {
    n: {
      type: Number,
      default: 3,
    },
    type: {
      type: Number,
      default: 2, // 1是概率，2是竞聚率
    },
  },

  data() {
    return {};
  },

  computed: {
    // 根据n生成的二维数组（矩阵），比如n为三，则数组为 [[1/n, 1/n, 1/n], [], []]
    nArray() {
      let n = this.n;
      let arr = [];
      for (let i = 1; i <= n; i++) {
        let subArr = [];
        for (let j = 1; j <= n; j++) {
          subArr.push(Number((1 / n).toFixed(3)));
        }
        arr.push(subArr);
      }
      return arr;
    },
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.container {
  overflow-x: auto;
  overflow-y: auto;
  height: 200px;
}
</style>
