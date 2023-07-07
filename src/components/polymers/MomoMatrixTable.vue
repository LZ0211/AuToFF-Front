<template>
  <!-- 构建重复单元 -->
  <div class="container" style="border: 1px solid #eee; padding: 5px;">
    <div>
      构建重复单元(PS：新增和删除单体会重置数值矩阵)
      <a-button @click="onClickAddRow" type="link">
        + 新增一行
      </a-button>
    </div>
    <div v-if="type === 1" class="probability">
      <table v-if="probMatrix.length > 0">
        <th style="display: flex;">
          <td style="width: 200px;">单体</td>
          <td style="width: 60px;" v-for="(i, index1) in probMatrix" :key="`${index1}`">{{ index1 + 1 }}</td>
        </th>
        <tr style="display: flex;" v-for="(row, index1) in probMatrix" :key="index1">
          <td style="width: 200px;display: inline-flex;">
            {{ index1 + 1 }}
            <a-button @click="deleteProbRow(index1)" style="margin-right: 2px;" shape="circle" icon="delete" size="small">
            </a-button>
            <a-input
            :value="probMomos[index1].value"
            size="small"
            style="width: 80px;"
              disabled
              placeholder="右侧选择单体"
            />
            <choose-monomer
              v-if="momoData.length > 0"
              :data="momoData"
              btn-type="link"
              :btn-height="22"
              @select-memo="(obj) => onProbSelectMemo(index1, obj)"
            ></choose-monomer>
          </td>
          <td 
            :key="`${index1}_${index2}`"
            v-for="(j, index2) in row"
            style="display: inline-flex; width: 60px;">
            <a-input-number
                :value="row[index2]"
                @change="val => onMatrixNumberChange(index1, index2, val)"
                size="small"
                :min="0"
                :max="1"
                :precision="3"
            />
          </td>
        </tr>
      </table>
      <a-empty v-else />
    </div>


    <div v-if="type === 2" class="compete">
      <table v-if="compMatrix.length > 0">
        <th style="display: flex;">
          <td style="width: 200px">单体</td>
          <td style="width: 60px;">浓度</td>
          <td style="width: 60px;" v-for="(i, index1) in compMatrix" :key="`${index1}`">{{ index1 + 1 }}</td>
        </th>
        <tr style="display: flex;" v-for="(row, index1) in compMatrix" :key="index1">
          <td style="width: 200px;display: inline-flex;">{{ index1 + 1 }}
            <a-button @click="deleteOneCompMomo(index1)" style="margin-right: 2px;" shape="circle" icon="delete" size="small">
            </a-button>
            <a-input
            :value="compMomos[index1] && compMomos[index1].value"
            size="small"
            style="width: 80px;"
              disabled
              placeholder="右侧选择单体"
            />
            <choose-monomer
              v-if="momoData.length > 0"
              :data="momoData"
              btn-type="link"
              :btn-height="22"
              @select-memo="(obj) => onCompSelectMemo(index1, obj)"
            ></choose-monomer>
          </td>
          <td style="width: 60px;">
            <a-input-number
                style="width: 60px;"
                size="small"
                :min="0"
                :max="1"
                :precision="3"
                :value="compMomos[index1] && compMomos[index1].potency"
                @change="value => onPotencyChange(value, index1)"

            />
            </td>
          <td 
            :key="`${index1}_${index2}`"
            v-for="(j, index2) in row"
            style="display: inline-flex; width: 60px;">
            <a-input-number
                :disabled="index1 === index2"
                :value="row[index2]"
                @change="val => onMatrixNumberChange(index1, index2, val)"
                style="width: 60px;"
                    size="small"
                    :min="0"
                    :max="1"
                    :precision="3"
            />
          </td>
        </tr>
      </table>
      <a-empty v-else />
      <!-- 列头 -->
      <!-- <a-row>
        <a-col :span="Math.floor(24 / (n + 2))"> 单体 </a-col>
        <a-col :span="Math.floor(24 / (n + 2))"> 浓度 </a-col>
        <a-col
          :span="Math.floor(24 / (n + 2))"
          v-for="(i, index1) in nArray"
          :key="`${index1}`"
        >
          {{ index1 + 1 }}
        </a-col>
      </a-row> -->
      <!-- 单体数量 n 行 -->
      <!-- <a-row v-for="(i, index1) in nArray" :key="index1">
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
      </a-row> -->
    </div>

  </div>
</template>

<script>
import api from "@/api2";
import request from "@/api2/request";

import fileDownload from "js-file-download";
import ChooseMonomer from "@/components/polymers/ChooseMonomer.vue";

export default {
  name: "MomoMatrixTable",
  props: {
    n: {
      type: Number,
      default: 3,
    },
    type: {
      type: Number,
      default: 1, // 1是概率，2是竞聚率
    },
    momoData: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      // 概率情况下的momos [[], []]
      probMomos: [],
      probMatrix: [], // n*n的矩阵

      // 竞聚率
      compMomos: [],
      compMatrix: [], // n*n的矩阵
    };
  },

  components: {
    ChooseMonomer,
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

  watch: {
    // type: function (newValue, oldValue) {
    //     this.resetData();
    // }
  },

  mounted() {},

  methods: {
    // 清空数据
    resetData() {
      this.probMomos = [];
      this.probMatrix = [];
      this.compMomos = [];
      this.compMatrix = [];
    },
    // 点击新增
    onClickAddRow() {
      if (this.type === 1) {
        this.addOneProbMomo();
      } else {
        this.addOneCompMomo();
      }
    },
    // 根据输入的n生成n*n的二维矩阵
    getNArr(n) {
      let arr = [];
      for (let i = 1; i <= n; i++) {
        let subArr = [];
        let subSum = 0;
        for (let j = 1; j <= n; j++) {
          if (j === n) {
            // 最后一位，确保下总和为1
            subArr.push(Number((1 - subSum).toFixed(3)));
            subSum = 1;
          } else {
            subArr.push(Number((1 / n).toFixed(3)));
            subSum += Number((1 / n).toFixed(3));
          }
        }
        arr.push(subArr);
      }
      return arr;
    },
    // 竞聚率 根据输入的n生成n*n的二维矩阵
    getCompNArr(n) {
      let arr = [];
      let num = 1; // 默认值
      for (let i = 1; i <= n; i++) {
        let subArr = [];
        for (let j = 1; j <= n; j++) {
          subArr.push(Number(num.toFixed(3)));
        }
        arr.push(subArr);
      }
      return arr;
    },
    // 矩阵中
    onMatrixNumberChange(index1, index2, val) {
      console.log("val", val);
      if (this.type === 1) {
        const arr = JSON.parse(JSON.stringify(this.probMatrix));
        arr[index1][index2] = val;
        this.probMatrix = arr;
      } else if (this.type === 2) {
        const arr = JSON.parse(JSON.stringify(this.compMatrix));
        arr[index1][index2] = val;
        this.compMatrix = arr;
      }
    },
    /**
     * prob相关的
     */
    // 概率中，选择单体的回调
    onProbSelectMemo(index1, obj) {
      console.log("index1", index1);
      console.log("obj", obj);

      this.$set(this.probMomos, index1, { ...obj });
    },
    // prob新增一个momo
    addOneProbMomo() {
      // let =  this.probMomos.length;
      let len = this.probMatrix.length;

      // 最大为9个单体
      if (len === 9) {
        this.$message.error("最大可选9个单体");
        return;
      }
      let n = len + 1;
      // this.probMomos = new Array(n).fill("");
      let arr = JSON.parse(JSON.stringify(this.probMomos));
      arr.push({
        id: "",
        value: "",
      });
      this.probMomos = arr;

      let nArr = this.getNArr(n);
      this.probMatrix = nArr;
    },
    // prob删除某行
    deleteProbRow(index) {
      this.probMomos.splice(index, 1);
      let len = this.probMatrix.length;
      let n = len - 1;
      // this.compMomos = new Array(n).fill({
      //   potency: null,
      //   id: "",
      //   value: ""
      // });
      this.probMatrix.splice(index, 1);
      let nArr = this.getNArr(n);

      this.probMatrix = nArr;
    },
    /**
     * compete相关的
     */
    // 新增一个comp momo
    addOneCompMomo() {
      let len = this.compMatrix.length;
      // 最大为9个单体
      if (len === 9) {
        this.$message.error("最大可选9个单体");
        return;
      }
      let n = len + 1;

      let arr = JSON.parse(JSON.stringify(this.compMomos));
      arr.push({
        potency: 0.5,
        id: "",
        value: "",
      });
      this.compMomos = arr;

      let nArr = this.getCompNArr(n);
      this.compMatrix = nArr;
    },
    // 删除一个comp momo
    deleteOneCompMomo(index) {
      let len = this.compMatrix.length;
      let n = len - 1;
      // this.compMomos = new Array(n).fill({
      //   potency: null,
      //   id: "",
      //   value: ""
      // });
      this.compMomos.splice(index, 1);
      let nArr = this.getCompNArr(n);

      this.compMatrix = nArr;
    },
    // 概率中，选择单体的回调
    onCompSelectMemo(index1, obj) {
      console.log("index1", index1);
      console.log("obj", obj);
      this.$set(this.compMomos, index1, {
        ...this.compMomos[index1],
        id: obj.id,
        value: obj.value,
      });
    },
    // 改变浓度
    onPotencyChange(value, index1) {
      console.log(value);
      this.$set(this.compMomos, index1, {
        ...this.compMomos[index1],
        potency: value,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  border-spacing: 0px;
}

.container {
  width: 542px;
  overflow-x: auto;
  overflow-y: auto;
  // border: 1px solid #eee;

  .probability {
    max-width: 720px;
    // table td {
    //     text-align: center;
    // }
  }
}
</style>
