<template>
  <div class="second-wrapper">
    <step-title title="根据力场选择原子类型" :showUpload="false"></step-title>

    <div class="second-wrapper-content">
      <div class="second-wrapper-molecule-container">
        <molecule-ultimate
          ref="moleculeUltimate"
          :width="600"
          :height="600"
          :needExtra="true"
          @updateSelectedAtom="updateSelectedAtom"
          tips="点击原子可配置atomtype，因遮罩显示变暗不影响结构"
        ></molecule-ultimate>
      </div>

      <div class="list-wrapper">
        <div class="list-wrapper-table-container">
          <my-table
            :columns="tableColumn"
            :data="atomtypeTableData"
            :selectedAtoms="selectedAtoms"
          ></my-table>
        </div>

        <div class="list-wrapper-btns">
          <div></div>
          <div style="margin-left: 10px">
            <a-button
              style="
                margin-right: auto;
                width: 80px;
                border-color: #0a55ff;
                color: #0a55ff;
              "
              @click="goBack"
            >
              上一步
            </a-button>
            <a-button
              v-if="allHasAtomType && !hasDU"
              style="
                margin-left: 10px;
                background-color: #0a55ff;
                color: #ffffff;
              "
              @click="goThird"
              type="primary"
            >
              下一步
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 下拉框区域 -->
    <div style="margin: 20px 0; display: flex; align-items: center"></div>

    <a-modal
      v-model="modalVisible"
      title="配置该原子的原子类型"
      @ok="handleOk"
      :width="600"
    >
      <div v-if="currAtom">
        <div
          v-for="(item, index) in currAtom.atomtypeOptions"
          :key="index"
          :value="item"
          :style="{
            display: 'flex',
            height: '65px',
            lineHeight: '65px',
            justifyContent: 'space-between',
            alignItems: 'center',
          }"
        >
          <a-radio
            @click="onAtomtypeChange(item)"
            :checked="currAtom.atomtype === `${item.name}|${item.type}`"
          >
            {{ item.name }}&nbsp;&nbsp;(type:{{ item.type }})
          </a-radio>
          <img
            height="65px"
            :src="
              `https://api-autoff-dev.mp.iresearch.net.cn/static/atomtype/` +
              `${item.type.replace('*', '_')}/` +
              `${item.name.replace('*', '_')}.svg`
            "
            alt=""
          />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";

import MoleculeUltimate from "@/components/MoleculeUltimate.vue";
import EditTable from "@/components/EditTable.vue";
import MyTable from "@/components/MyTable.vue";
import StepTitle from "@/components/atom/StepTitle.vue";

import api from "@/api2";
import request from "@/api2/request";

import Spin from "@/api2/spin";

const columns = [
  {
    title: "序号",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "元素",
    dataIndex: "element",
    key: "element",
  },
  {
    title: "力场类型",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "原子类型",
    dataIndex: "atomtype",
    key: "atomtype",
  },
];

const data = [
  {
    id: "1",
    key: "1",
    element: "John Brown",
    atomtype: 32,
  },
  {
    id: "2",
    key: "2",
    element: "John Brown",
    atomtype: 32,
  },
];

export default {
  name: "Second",
  data() {
    return {
      data,
      columns,
      editingKey: "",

      // atomtype list
      tableColumn: columns,
      selectedAtoms: [],
      typesData: [],

      // atomtype modal
      modalVisible: false,
      currAtom: null,

      // 是否都包含atomtype  是的话可以下一步
      allHasAtomType: false,
      hasDU: false,
    };
  },
  components: {
    MoleculeUltimate,
    EditTable,
    MyTable,
    StepTitle,
  },
  computed: {
    ...mapState([
      "activeIndex",
      "mol2",
      "atoms",
      "force",
      "forces",
      "backForce",
      "waterModel",
      "waterModelForces",
      "forceParams",
      "charge",
      "chargeType",
      "chargeOptions",
      "switchValue",
      "atomtypeTableData",
      "chargeTypeOptions",
    ]),
  },
  created() {
    Spin.show();
    this.initAtomType().then((data) => {
      console.log("=============this.atoms", data);
      this.typesData = data.slice();
      const d = this.atoms.map((item, index) => {
        return {
          id: index + 1,
          key: index + 1,
          element: item.label,
          atomtype: data[index] && data[index][0].name,
          type: data[index] && data[index][0].type,
        };
      });
      this.$store.commit("setAtomTypeTableData", d);
      this.$store.commit("setAtomTypeOriginData", data);

      // 如果force只选了一个，进行下判断数据是否齐全，齐全才显示下一步
      this.allHasAtomType = data.every((i) => {
        return i.length > 0 && i[0]["name"] && i[0]["type"];
      });
      this.hasDU = data.some((i) => {
        return i.map((item) => item["name"]).includes("DU");
      });

      Spin.hide();
    });
  },
  methods: {
    updateSelectedAtom(atoms) {
      this.selectedAtoms = atoms.map((a) => a.name);
      // 选中了单个原子就show modal
      if (this.selectedAtoms.length > 0) {
        const currId = this.selectedAtoms[0];
        const types = this.typesData[Number(currId) - 1];

        // console.log("---types---", types);
        const currRow = this.atomtypeTableData.find(
          (item) => item.id.toString() === currId
        );
        this.currAtom = {
          id: currId,
          atomtype: `${currRow.atomtype}|${currRow.type}`,
          atomtypeOptions: types,
        };
        this.$nextTick(() => {
          this.modalVisible = true;
        });
        // setTimeout(() => {
        //   this.modalVisible = true;
        // }, 0);
      }
    },
    // 对象数据根据某个属性去重
    uniqueArray(d, prop) {
      const rr = new Map();
      const ans = d.filter((a) => !rr.has(a[prop]) && rr.set(a[prop], 1));
      return ans;
    },
    // 切换选择的时候
    onAtomtypeChange(item) {
      this.currAtom["atomtype"] = `${item.name}|${item.type}`;
    },
    // 选好atom type后
    handleOk() {
      const arr = JSON.parse(JSON.stringify(this.atomtypeTableData));
      const obj = arr.find(
        (item, index) => item.id === Number(this.currAtom.id)
      );
      obj.atomtype = this.currAtom.atomtype.split("|")[0];
      obj.type = this.currAtom.atomtype.split("|")[1];
      this.$store.commit("setAtomTypeTableData", arr);
      this.modalVisible = false;
    },
    // 初始化atom type
    initAtomType() {
      return new Promise((resolve, reject) => {
        request
          .postJson(
            api.atomType,
            {
              data: this.mol2,
              forcefield: this.force,
            },
            { loading: false, mock: false, error: true }
          )
          .then((data) => {
            console.log("------------atomtype data-------------", data.data);
            resolve(data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    // 切换原子类型的精确模糊
    onSwitchChange(e) {
      this.$store.commit("setSwitchValue", e.target.value);
    },
    // 选择电荷类型
    onChargeTypeChange(val) {
      this.$store.commit("setChargeType", val);
    },
    // 前往到下一步
    goThird() {
      // 如果是精确方式校验下，是否存在不是水力场的异同力场
      // if (this.switchValue === "accurate") {
      //   console.log("水模型力场", this.waterModelForces);
      //   console.log("水模型力场", this.atomtypeTableData);

      //   let types = [];
      //   this.atomtypeTableData.forEach((item, index) => {
      //     if (!this.waterModelForces.includes(item.type)) {
      //       types.push(item.type);
      //     }
      //   });
      //   types = [...new Set(types)];
      //   if (types.length > 1) {
      //     this.$message.error("精确模式下水力场外原子间请选择相同的力场");
      //     return;
      //   }
      // }
      Spin.show();
      this.$store.commit("setActiveIndex", this.activeIndex + 1);
    },
    // 返回上一步
    goBack() {
      Spin.show();
      this.$store.commit("setActiveIndex", this.activeIndex - 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.second-wrapper {
  margin: 0 auto;
  width: 1550px;

  .second-wrapper-top {
    height: 54px;
    line-height: 54px;
    border-radius: 6px;
    opacity: 1;
    background: #fcfcfc;
    box-sizing: border-box;
    border: 1px solid #efefef;
    width: 1550px;
    margin: 0 auto;
    margin-top: 45px;
    padding: 0 20px;

    display: flex;
    justify-content: space-between;
  }

  .second-wrapper-content {
    display: flex;
    margin-top: 32px;
    height: 684px;

    .second-wrapper-molecule-container {
      position: relative;
      height: 600px;
    }

    .list-wrapper {
      flex: 1;
      margin-left: 24px;

      .list-wrapper-table-container {
        height: 600px;
        overflow-x: hidden;
        overflow-y: auto;
      }

      .list-wrapper-btns {
        margin-top: 32px;
        height: 52px;
        border-radius: 6px;
        opacity: 1;
        background: #ffffff;
        box-sizing: border-box;
        border: 1px solid #f3f3f3;
        padding: 0 19px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        .ant-radio-group-solid
          .ant-radio-button-wrapper-checked:not(
            .ant-radio-button-wrapper-disabled
          ) {
          color: #ffffff;
          background: #0a55ff;
          border-color: #0a55ff;
        }
      }
    }

    .list-row {
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      line-height: 80px;
    }
  }
}
</style>
