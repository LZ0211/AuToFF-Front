<template>
  <div class="page_mol">
    <step-crystal-title
      title="创建分子结构"
      :showUpload="false"
      @update="update3D"
    ></step-crystal-title>
    <div class="page_mol-content">
      <div class="page_mol-content-left">
        <div class="page_mol-content-left-top">
          <div
            class="page_mol-content-left-top-nav"
            :style="{
              'border-right': '1px solid #d8d8d8',
              color: activeNav === 1 ? '#0A55FF' : '#3D3D3D',
            }"
            @click="changeNav(1)"
          >
            均聚物
          </div>
          <div
            class="page_mol-content-left-top-nav"
            :style="{
              'border-right': '1px solid #d8d8d8',
              color: activeNav === 2 ? '#0A55FF' : '#3D3D3D',
            }"
            @click="changeNav(2)"
          >
            嵌段共聚物
          </div>
          <div
            class="page_mol-content-left-top-nav"
            :style="{
              'border-right': '1px solid #d8d8d8',
              color: activeNav === 3 ? '#0A55FF' : '#3D3D3D',
            }"
            @click="changeNav(3)"
          >
            无规共聚物
          </div>
        </div>

        <div class="page_mol-content-left-content">
          <div class="page_mol-content-left-content-container">
            <!-- 均聚物 -->
            <div
              style="margin-top: 10px"
              class="homopolymer"
              v-if="activeNav === 1"
            >
              <a-row class="list-row">
                <a-col :span="4"> 单体 </a-col>
                <a-col :span="10">
                  <a-input
                    disabled
                    :value="homoForm.momo"
                    placeholder="请点击右侧按钮选择单体"
                  />
                </a-col>
                <a-col :span="2">
                  <a-button
                    @click="
                      () => {
                        homoForm.momo = null;
                        homoForm.momoId = null;
                      }
                    "
                    type="link"
                  >
                    清空
                  </a-button>
                </a-col>
                <a-col :span="6" :offset="1">
                  <choose-monomer
                    v-if="momoData.length > 0"
                    :data="momoData"
                    @select-memo="onSelectMemo"
                  ></choose-monomer>
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 头部端基 </a-col>
                <a-col :span="10">
                  <a-input
                    disabled
                    :value="homoForm.headEnd"
                    placeholder="请点击右侧按钮选择头部端基"
                  />
                </a-col>
                <a-col :span="2">
                  <a-button
                    @click="
                      () => {
                        homoForm.headEnd = null;
                        homoForm.headEndId = null;
                      }
                    "
                    type="link"
                  >
                    清空
                  </a-button>
                </a-col>
                <a-col :span="6" :offset="1">
                  <choose-end
                    v-if="headEndData && headEndData.length > 0"
                    :data="headEndData"
                    title="请选择头部端基（注：名词可切换中英文）"
                    btn-text="选择头部端基"
                    @select-end="onHeadSelectEnd"
                  ></choose-end>
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 尾部端基 </a-col>
                <a-col :span="10">
                  <a-input
                    disabled
                    :value="homoForm.tailEnd"
                    placeholder="请点击右侧按钮选择尾部端基"
                  />
                </a-col>
                <a-col :span="2">
                  <a-button
                    @click="
                      () => {
                        homoForm.tailEnd = null;
                        homoForm.tailEndId = null;
                      }
                    "
                    type="link"
                  >
                    清空
                  </a-button>
                </a-col>
                <a-col :span="6" :offset="1">
                  <choose-end
                    v-if="headEndData && headEndData.length > 0"
                    :data="tailEndData"
                    btn-text="选择尾部端基"
                    title="请选择尾部端基（注：名词可切换中英文）"
                    @select-end="onTailSelectEnd"
                  ></choose-end>
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 聚合方式 </a-col>
                <a-col :span="12">
                  <a-select v-model="homoForm.converge" style="width: 120px">
                    <a-select-option value="hh"> 首首连接 </a-select-option>
                    <a-select-option value="rd"> 随机连接 </a-select-option>
                    <a-select-option value="ht"> 首尾连接 </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="6" :offset="2"> </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 聚合度 </a-col>
                <a-col :span="12">
                  <a-input-number
                    v-model="homoForm.convergeDegree"
                    :precision="0"
                    :min="1"
                    :max="500"
                  />
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 角度 </a-col>
                <a-col :span="6">
                  <a-input-number
                    v-model="homoForm.degree"
                    :precision="0"
                    :min="-180"
                    :max="180"
                  />
                </a-col>
                <a-col :span="8">
                  随机角度
                  <a-switch v-model="homoForm.degreeRandom" />
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 随机数种子 </a-col>
                <a-col :span="4">
                  <a-switch v-model="homoForm.hasRandomSeed" />
                </a-col>
                <a-col v-if="homoForm.hasRandomSeed" :span="16">
                  <a-input-number
                    v-model="homoForm.randomSeed"
                    :min="1"
                    :max="10"
                  />
                </a-col>
              </a-row>
            </div>
            <!-- 嵌段共聚物 -->
            <div class="blockpolymer" v-if="activeNav === 2">
              <div
                style="
                  padding: 5px;
                  border: 1px solid #eeeeee;
                  margin-bottom: 10px;
                "
              >
                <a-row style="display: flex; align-items: center">
                  <a-col :span="4" style="font-weight: 600">
                    构建重复单元
                  </a-col>
                  <a-col :span="4" :offset="16">
                    <a-button type="link" @click="addTableRow">
                      + 新增一行</a-button
                    >
                  </a-col>
                </a-row>
                <a-table
                  :pagination="false"
                  :columns="tableColumns"
                  :data-source="tableData"
                  :scroll="{ y: 167 }"
                  size="small"
                >
                  <a slot="name" slot-scope="text">{{ text }}</a>

                  <!-- <span slot="customTitle"><a-icon type="smile-o" /> Name</span> -->
                  <span slot="momo" slot-scope="momo, record">
                    <div style="display: flex">
                      <a-input
                        :value="record.momo"
                        disabled
                        placeholder="点右侧选择单体"
                      />
                      <choose-monomer
                        v-if="momoData.length > 0"
                        :data="momoData"
                        btn-type="link"
                        @select-memo="(obj) => onSelectMemo(obj, record)"
                      ></choose-monomer>
                    </div>
                  </span>
                  <span slot="num" slot-scope="num, record">
                    <a-input-number
                      @change="(value) => onChangeNum(value, record)"
                      :value="record.num"
                      :precision="0"
                      :min="1"
                      :max="5"
                    />
                  </span>
                  <span slot="action" slot-scope="action, record">
                    <a-button
                      @click="() => onDeleteRow(record)"
                      shape="circle"
                      icon="delete"
                    />
                  </span>
                </a-table>
              </div>

              <a-row class="list-row">
                <a-col :span="4"> 头部端基 </a-col>
                <a-col :span="10">
                  <a-input
                    disabled
                    :value="blockForm.headEnd"
                    placeholder="请点击右侧按钮选择头部端基"
                  />
                </a-col>
                <a-col :span="2">
                  <a-button
                    @click="
                      () => {
                        blockForm.headEnd = null;
                        blockForm.headEndId = null;
                      }
                    "
                    type="link"
                  >
                    清空
                  </a-button>
                </a-col>
                <a-col :span="6" :offset="1">
                  <choose-end
                    v-if="headEndData && headEndData.length > 0"
                    :data="headEndData"
                    title="请选择头部端基（注：名词可切换中英文）"
                    btn-text="选择头部端基"
                    @select-end="onHeadSelectEnd"
                  ></choose-end>
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 尾部端基 </a-col>
                <a-col :span="10">
                  <a-input
                    disabled
                    :value="blockForm.tailEnd"
                    placeholder="请点击右侧按钮选择尾部端基"
                  />
                </a-col>
                <a-col :span="2">
                  <a-button
                    @click="
                      () => {
                        blockForm.tailEnd = null;
                        blockForm.tailEndId = null;
                      }
                    "
                    type="link"
                  >
                    清空
                  </a-button>
                </a-col>
                <a-col :span="6" :offset="1">
                  <choose-end
                    v-if="headEndData && headEndData.length > 0"
                    :data="tailEndData"
                    btn-text="选择尾部端基"
                    title="请选择尾部端基（注：名词可切换中英文）"
                    @select-end="onTailSelectEnd"
                  ></choose-end>
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 聚合方式 </a-col>
                <a-col :span="12">
                  <a-select v-model="blockForm.converge" style="width: 120px">
                    <a-select-option value="hh"> 首首连接 </a-select-option>
                    <a-select-option value="rd"> 随机连接 </a-select-option>
                    <a-select-option value="ht"> 首尾连接 </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="6" :offset="2"> </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 聚合度 </a-col>
                <a-col :span="12">
                  <a-input-number
                    v-model="blockForm.convergeDegree"
                    :min="1"
                    :max="500"
                  />
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 角度 </a-col>
                <a-col :span="6">
                  <a-input-number
                    v-model="blockForm.degree"
                    :min="-180"
                    :max="180"
                  />
                </a-col>
                <a-col :span="8">
                  随机角度
                  <a-switch v-model="blockForm.degreeRandom" />
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 随机数种子 </a-col>
                <a-col :span="4">
                  <a-switch v-model="blockForm.hasRandomSeed" />
                </a-col>
                <a-col v-if="blockForm.hasRandomSeed" :span="16">
                  <a-input-number
                    v-model="blockForm.randomSeed"
                    :min="1"
                    :max="10"
                  />
                </a-col>
              </a-row>
            </div>
            <div v-if="activeNav === 3">
              <div style="display: flex; align-items: center">
                构建方式：
                <a-select
                  :value="noRuleForm.buildType"
                  style="width: 120px"
                  @change="onBuildTypeChange"
                >
                  <a-select-option value="prob"> 概率 </a-select-option>
                  <a-select-option value="comp"> 竞聚率 </a-select-option>
                </a-select>

                <span style="margin-left: 10px">强制浓度：</span>
                <a-switch
                  :checked="noRuleForm.densityFlag"
                  @change="noRuleForm.densityFlag = !noRuleForm.densityFlag"
                />
              </div>
              <momo-matrix-table
                style="height: 220px"
                ref="myMomoMatrixTable"
                :momoData="momoData"
                :n="8"
                :type="noRuleForm.buildType === 'prob' ? 1 : 2"
              ></momo-matrix-table>

              <a-row class="list-row">
                <a-col :span="4"> 头部端基 </a-col>
                <a-col :span="10">
                  <a-input
                    disabled
                    :value="noRuleForm.headEnd"
                    placeholder="请点击右侧按钮选择头部端基"
                  />
                </a-col>
                <a-col :span="2">
                  <a-button
                    @click="
                      () => {
                        noRuleForm.headEnd = null;
                        noRuleForm.headEndId = null;
                      }
                    "
                    type="link"
                  >
                    清空
                  </a-button>
                </a-col>
                <a-col :span="6" :offset="1">
                  <choose-end
                    v-if="headEndData && headEndData.length > 0"
                    :data="headEndData"
                    title="请选择头部端基（注：名词可切换中英文）"
                    btn-text="选择头部端基"
                    @select-end="onHeadSelectEnd"
                  ></choose-end>
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 尾部端基 </a-col>
                <a-col :span="10">
                  <a-input
                    disabled
                    :value="noRuleForm.tailEnd"
                    placeholder="请点击右侧按钮选择尾部端基"
                  />
                </a-col>
                <a-col :span="2">
                  <a-button
                    @click="
                      () => {
                        noRuleForm.tailEnd = null;
                        noRuleForm.tailEndId = null;
                      }
                    "
                    type="link"
                  >
                    清空
                  </a-button>
                </a-col>
                <a-col :span="6" :offset="1">
                  <choose-end
                    v-if="headEndData && headEndData.length > 0"
                    :data="tailEndData"
                    btn-text="选择尾部端基"
                    title="请选择尾部端基（注：名词可切换中英文）"
                    @select-end="onTailSelectEnd"
                  ></choose-end>
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 聚合方式 </a-col>
                <a-col :span="8">
                  <a-select v-model="noRuleForm.converge" style="width: 120px">
                    <a-select-option value="hh"> 首首连接 </a-select-option>
                    <a-select-option value="rd"> 随机连接 </a-select-option>
                    <a-select-option value="ht"> 首尾连接 </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="4"> 聚合度 </a-col>
                <a-col :span="8">
                  <a-input-number
                    v-model="noRuleForm.convergeDegree"
                    :min="1"
                    :max="100"
                  />
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 角度 </a-col>
                <a-col :span="6">
                  <a-input-number
                    v-model="noRuleForm.degree"
                    :min="-180"
                    :max="180"
                  />
                </a-col>
                <a-col :span="8">
                  随机角度
                  <a-switch v-model="noRuleForm.degreeRandom" />
                </a-col>
              </a-row>
              <a-row class="list-row">
                <a-col :span="4"> 随机数种子 </a-col>
                <a-col :span="4">
                  <a-switch v-model="noRuleForm.hasRandomSeed" />
                </a-col>
                <a-col v-if="noRuleForm.hasRandomSeed" :span="16">
                  <a-input-number
                    v-model="noRuleForm.randomSeed"
                    :min="1"
                    :max="10"
                  />
                </a-col>
              </a-row>
            </div>
          </div>

          <div
            style="display: flex; align-items: center; justify-content: center"
            class="page_mol-content-left-btn"
            @click="getMol2"
          >
            <div style="font-size: 12px; margin-right: 3px">生成3d结构视图</div>
            <img src="@/assets/icon/atom/3.png" alt="" />
          </div>
        </div>

        <my-drag style="margin-top: -13px"></my-drag>
      </div>

      <div class="page_mol-content-right">
        <!-- 右侧3D模型文件 -->
        <div style="width: 900px; height: 670px; position: relative">
          <molecule-ultimate
            :atoms="atoms"
            ref="moleculeUltimate"
            :width="900"
            :height="670"
            :hasOutline="false"
            :isLine="true"
          ></molecule-ultimate>
        </div>

        <div class="page_mol-content-right-btns" v-if="mol2">
          <div class="page_mol_middle_btns">
            <div style="margin-left: auto">
              <Format-download :mol2="originMol2"></Format-download>
              <a-button
                style="
                  width: 100px;
                  background-color: #0a55ff;
                  margin-left: 10px;
                "
                @click="goSecond"
                type="primary"
              >
                下一步
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import MoleculeUltimate from "@/components/MoleculeUltimate.vue";
import StepCrystalTitle from "@/components/atom/StepCrystalTitle.vue";
import MyDrag from "@/components/atom/MyDrag.vue";
import FormatDownload from "@/components/FormatDownload.vue";
import ChooseMonomer from "@/components/polymers/ChooseMonomer.vue";
import ChooseEnd from "@/components/polymers/ChooseEnd.vue";
import MomoMatrix from "@/components/polymers/MomoMatrix.vue";
import MomoMatrixTable from "@/components/polymers/MomoMatrixTable.vue";

import fileDownload from "js-file-download";

import api from "@/api2";
import request from "@/api2/request";

import Spin from "@/api2/spin";

const tableColumns = [
  {
    dataIndex: "name",
    key: "name",
    slots: { title: "customTitle" }, // 这里是列头的slot
    scopedSlots: { customRender: "name" }, // 这里是每行里面的slot
    width: "20px",
  },
  {
    dataIndex: "momo",
    key: "momo",
    title: "单体",
    scopedSlots: { customRender: "momo" },
    width: "300px",
  },
  {
    key: "num",
    title: "个数",
    scopedSlots: { customRender: "num" },
    width: "120px",
  },
  {
    key: "action",
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

const tableData = [
  // {
  //   key: "1",
  //   name: "1",
  //   num: 1,
  //   momo: "",
  //   momoId: "",
  // },
];

export default {
  name: "First",
  data() {
    return {
      mySketcher: null,

      mpId: "hp-1",
      cifContent: "",

      atoms: [],

      // 均聚物表单
      momoData: [],
      headEndData: [],
      tailEndData: [],

      homoForm: {
        momo: "",
        momoId: "",
        headEnd: "",
        headEndId: "",
        tailEnd: "",
        tailEndId: "",
        converge: "ht",
        convergeDegree: 1,
        degree: 180,
        degreeRandom: false,
        hasRandomSeed: false,
        randomSeed: 1,
      },
      // 嵌聚物表单
      blockForm: {
        headEnd: "",
        headEndId: "",
        tailEnd: "",
        tailEndId: "",
        converge: "ht",
        convergeDegree: 1,
        degree: 180,
        degreeRandom: false,
        hasRandomSeed: false,
        randomSeed: 1,
      },
      tableData: tableData,
      tableColumns,

      // 无规共聚物表单
      noRuleForm: {
        buildType: "prob",
        densityFlag: false,

        headEnd: "",
        headEndId: "",
        tailEnd: "",
        tailEndId: "",

        converge: "ht",
        convergeDegree: 1,

        degree: 180,
        degreeRandom: false,

        hasRandomSeed: false,
        randomSeed: 1,
      },

      // 可选项，维护在后端
      activeNav: 1, // 1,2,3
    };
  },
  computed: {
    ...mapState([
      "activeIndex",
      "originMol",
      "originMol2",
      "mol2",
      "moleculeJson",
      "force",
      "forces",
      "forceOptions",
      "backForce",
      "waterModel",
      "waterModelForces",
      "charge",
      "chargeOptions",
    ]),
  },
  components: {
    MoleculeUltimate,
    StepCrystalTitle,
    MyDrag,
    FormatDownload,
    ChooseMonomer,
    ChooseEnd,
    MyDrag,
    MomoMatrix,
    MomoMatrixTable,
  },
  created() {
    Spin.show();
    const p1 = this.getMonos();
    const p2 = this.getEnds("head");
    const p3 = this.getEnds("tail");
    Promise.all([p1, p2, p3]).then(([data1, data2, data3]) => {
      console.log([data1, data2, data3]);
      this.momoData = data1;
      this.headEndData = data2;
      this.tailEndData = data3;

      Spin.hide();
    });
  },
  mounted() {
    this.getForcesOptions();
  },
  methods: {
    // 切换不同的type共聚物
    changeNav(nav) {
      // 重置数据
      this.homoForm = {
        momo: "",
        momoId: "",
        headEnd: "",
        headEndId: "",
        tailEnd: "",
        tailEndId: "",
        converge: "ht",
        convergeDegree: 1,
        degree: 180,
        degreeRandom: false,
        hasRandomSeed: false,
        randomSeed: 1,
      };

      this.tableData = [];
      this.blockForm = {
        headEnd: "",
        headEndId: "",
        tailEnd: "",
        tailEndId: "",
        converge: "ht",
        convergeDegree: 1,
        degree: 180,
        degreeRandom: false,
        hasRandomSeed: false,
        randomSeed: 1,
      };

      // 不用管matrixtable数据是因为其切换的时候会重新created
      this.noRuleForm = {
        buildType: "prob",
        densityFlag: false,

        headEnd: "",
        headEndId: "",
        tailEnd: "",
        tailEndId: "",
        converge: "ht",
        convergeDegree: 1,
        degree: 180,
        degreeRandom: false,
        hasRandomSeed: false,
        randomSeed: 1,
      };

      this.activeNav = nav;
    },
    // 获取单体库
    getMonos() {
      return new Promise((resolve, reject) => {
        request
          .get(api.monomer, {}, { loading: false, mock: false, error: true })
          .then((data) => {
            resolve(data.data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    // 获取端基库
    getEnds(type) {
      return new Promise((resolve, reject) => {
        request
          .get(
            api.endgroup,
            {
              type,
            },
            { loading: false, mock: false, error: true }
          )
          .then((data) => {
            resolve(data.data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    /** 嵌段共聚物的Table */
    // 选择单体的回调
    onSelectMemo(ans, record) {
      console.log("ans", ans);
      if (!ans) {
        return;
      }
      switch (this.activeNav) {
        case 1:
          this.homoForm.momo = ans.value;
          this.homoForm.momoId = ans.id;
          break;
        case 2:
          const o = this.tableData.find((item) => item.key === record.key);
          // console.log(o);
          o.momo = ans.value;
          o.momoId = ans.id;
          break;
        case 3:
          break;
      }
    },
    // 头部端基选择后的回调
    onHeadSelectEnd(obj) {
      switch (this.activeNav) {
        case 1:
          this.homoForm.headEnd = obj.value;
          this.homoForm.headEndId = obj.id;
          break;
        case 2:
          this.blockForm.headEnd = obj.value;
          this.blockForm.headEndId = obj.id;
          break;
        case 3:
          this.noRuleForm.headEnd = obj.value;
          this.noRuleForm.headEndId = obj.id;
          break;
      }
    },
    // 尾部端基选择后的回调
    onTailSelectEnd(obj) {
      switch (this.activeNav) {
        case 1:
          this.homoForm.tailEnd = obj.value;
          this.homoForm.tailEndId = obj.id;
          break;
        case 2:
          this.blockForm.tailEnd = obj.value;
          this.blockForm.tailEndId = obj.id;
          break;
        case 3:
          this.noRuleForm.tailEnd = obj.value;
          this.noRuleForm.tailEndId = obj.id;
          break;
      }
    },
    // 无规共聚物的构建方式回调
    onBuildTypeChange(value) {
      console.log("onBuildTypeChange");
      this.noRuleForm.buildType = value;
      this.$refs["myMomoMatrixTable"].resetData();

      // 重置一波表单
      this.noRuleForm = {
        ...this.noRuleForm,
        densityFlag: false,
        headEnd: "",
        headEndId: "",
        tailEnd: "",
        tailEndId: "",
        converge: "ht",
        convergeDegree: 1,
        degree: 180,
        degreeRandom: false,
        hasRandomSeed: false,
        randomSeed: 1,
      };
    },
    // 更改表格中某一行的num
    onChangeNum(value, record) {
      const obj = this.tableData.find((item) => item.key === record.key);
      // console.log(obj);
      obj.num = value;
    },
    // 删除某一行
    onDeleteRow(record) {
      console.log("record", record);
      let arr = [];
      this.tableData.forEach((item, index) => {
        console.log(item);
        if (item.key !== record.key) arr.push(item);
      });
      arr = arr.map((item, index) => {
        return {
          ...item,
          key: (index + 1).toString(),
          name: (index + 1).toString(),
        };
      });
      // arr.splice(
      //   this.tableData.findIndex((item, index) => {
      //     item.key === record.key;
      //   }),
      //   1
      // );
      this.tableData = arr;
    },
    // Table添加一行
    addTableRow() {
      const len = this.tableData.length;
      if (len === 9) {
        this.$message.error("目前最多支持9个单体");
        return;
      }

      this.tableData.push({
        key: (len + 1).toString(),
        name: (len + 1).toString(),
        num: 1,
        momo: "",
        momoId: "",
      });
    },
    // 获取mol2文本
    getMol2() {
      let reqParams = {};

      // 无规共聚物用到
      let matrixMomoData = [];
      let matrixData = [];
      switch (this.activeNav) {
        case 1:
          if (!this.homoForm.momoId) {
            this.$message.error("请选择单体");
            return;
          }
          if (!this.homoForm.convergeDegree) {
            this.$message.error("请填写聚合度");
            return;
          }
          if (
            !this.homoForm.hasRandomSeed &&
            (this.homoForm.degree === null ||
              this.homoForm.degree === undefined ||
              this.homoForm.degree === "")
          ) {
            this.$message.error("请填写角度或者勾选随机角度");
            return;
          }
          reqParams = {
            monomerlist: [this.homoForm.momoId],
            degree: this.homoForm.convergeDegree,
            torsion: this.homoForm.degreeRandom
              ? "random"
              : this.homoForm.degree,
            probability: [],
            polytype: this.homoForm.converge,
            seed: this.homoForm.hasRandomSeed ? this.homoForm.randomSeed : -1,
          };
          if (this.homoForm.headEndId) {
            reqParams["init"] = this.homoForm.headEndId;
          }
          if (this.homoForm.tailEndId) {
            reqParams["end"] = this.homoForm.tailEndId;
          }

          request.postJson(api.buildHomopolymer, reqParams).then((res) => {
            if (res) {
              this.$store.commit("setMol2", res.data);
              this.$store.commit("setOriginMol2", res.data);
              this.$refs["moleculeUltimate"].init(res.data, true);
              this.$store.commit("setPolymerNumber", res.number);
            }
          });
          break;
        case 2:
          if (this.tableData.length === 0) {
            this.$message.error("请先新增单体");
            return;
          }
          if (!this.tableData.every((item, index) => item.momoId)) {
            this.$message.error("单体列表信息不全, 请填写完整");
            return;
          }
          if (!this.blockForm.convergeDegree) {
            this.$message.error("请填写聚合度");
            return;
          }
          if (
            !this.blockForm.hasRandomSeed &&
            (this.blockForm.degree === null ||
              this.blockForm.degree === undefined ||
              this.blockForm.degree === "")
          ) {
            this.$message.error("请填写角度或者勾选随机角度");
            return;
          }
          reqParams = {
            monomerlist: this.tableData.map((item) => item.momoId),
            numberlist: this.tableData.map((item) => item.num),
            degree: this.blockForm.convergeDegree,
            torsion: this.blockForm.degreeRandom
              ? "random"
              : this.blockForm.degree,
            probability: [],
            polytype: this.blockForm.converge,
            seed: this.blockForm.hasRandomSeed ? this.blockForm.randomSeed : -1,
          };
          if (this.blockForm.headEndId) {
            reqParams["init"] = this.blockForm.headEndId;
          }
          if (this.blockForm.tailEndId) {
            reqParams["end"] = this.blockForm.tailEndId;
          }

          request.postJson(api.buildBlockCopolymer, reqParams).then((res) => {
            if (res) {
              this.$store.commit("setMol2", res.data);
              this.$store.commit("setOriginMol2", res.data);
              this.$refs["moleculeUltimate"].init(res.data, true);
              this.$store.commit("setPolymerNumber", res.number);
            }
          });
          break;
        case 3:
          if (this.noRuleForm.buildType === "prob") {
            // 概率
            matrixMomoData = this.$refs["myMomoMatrixTable"]["probMomos"].map(
              (i) => i.id
            );
            matrixData = this.$refs["myMomoMatrixTable"]["probMatrix"]
              ? JSON.parse(
                  JSON.stringify(this.$refs["myMomoMatrixTable"]["probMatrix"])
                )
              : [];
          } else {
            // 竞聚率
            matrixMomoData = this.$refs["myMomoMatrixTable"]["compMomos"].map(
              (i) => i.id
            );
            matrixData = this.$refs["myMomoMatrixTable"]["compMatrix"]
              ? JSON.parse(
                  JSON.stringify(this.$refs["myMomoMatrixTable"]["compMatrix"])
                )
              : [];
            matrixData = matrixData.map((item, index) => {
              return [
                this.$refs["myMomoMatrixTable"]["compMomos"][index]["potency"],
                ...item,
              ];
            });
          }
          if (matrixMomoData.length === 0) {
            this.$message.error("请先新增单体");
            return;
          }
          if (!matrixMomoData.every((item, index) => item)) {
            this.$message.error("单体数据列表信息不全, 请填写完整");
            return;
          }
          if (
            matrixData.some((subArr, index) => {
              return subArr.some(
                (item) => item === null || item === undefined || item === ""
              );
            })
          ) {
            this.$message.error("单体数据列表信息不全, 请填写完整");
            return;
          }
          // 概率下每一行的数字加起来要为1
          if (this.noRuleForm.buildType === "prob") {
            let flag = matrixData.every(
              (subArr) => subArr.reduce((total, curr) => total + curr, 0) === 1
            );
            if (!flag) {
              this.$message.error("概率构建下，单体数据每行相加之和需要为1");
              return;
            }
          }
          if (!this.noRuleForm.convergeDegree) {
            this.$message.error("请填写聚合度");
            return;
          }
          if (
            !this.noRuleForm.hasRandomSeed &&
            (this.noRuleForm.degree === null ||
              this.noRuleForm.degree === undefined ||
              this.noRuleForm.degree === "")
          ) {
            this.$message.error("请填写角度或者勾选随机角度");
            return;
          }
          reqParams = {
            type:
              this.noRuleForm.buildType === "prob" ? "probability" : "reactive", // 分为概率和竞聚率
            monomerlist: matrixMomoData,
            degree: this.noRuleForm.convergeDegree,
            torsion: this.noRuleForm.degreeRandom
              ? "random"
              : this.noRuleForm.degree,
            probability: matrixData,
            polytype: this.noRuleForm.converge,
            forceconcentration: this.noRuleForm.densityFlag ? 1 : 0,
            seed: this.noRuleForm.hasRandomSeed
              ? this.noRuleForm.randomSeed
              : -1,
          };
          if (this.noRuleForm.headEndId) {
            reqParams["init"] = this.noRuleForm.headEndId;
          }
          if (this.noRuleForm.tailEndId) {
            reqParams["end"] = this.noRuleForm.tailEndId;
          }

          request.postJson(api.buildRandomCopolymer, reqParams).then((res) => {
            if (res) {
              this.$store.commit("setMol2", res.data);
              this.$store.commit("setOriginMol2", res.data);
              this.$refs["moleculeUltimate"].init(res.data, true);
              this.$store.commit("setPolymerNumber", res.number);
            }
          });
          break;
      }
    },

    update3D(content) {
      this.$refs["moleculeUltimate"].init(content, true);
    },
    getForcesOptions() {
      return new Promise((resolve, reject) => {
        request
          .get(api.aaForce, {}, { loading: false, mock: false, error: true })
          .then((data) => {
            this.$store.commit("setForceOptions", data.data);
            this.$store.commit("setForce", data.data[0]);
            resolve(data.data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    // 选择力场
    onForceChange(val) {
      this.$store.commit("setForce", val);
    },
    // 前往到下一步
    goSecond() {
      const dropList = document.getElementById("dropList");
      const arr = Array.from(dropList.children).map((i) => i.innerText);
      if (arr.length === 0) {
        this.$message.error("请至少选择一个力场");
        return;
      }

      this.$store.commit("setForces", arr);

      Spin.show(); // 到第二步获取atomtype后会hide
      this.$store.commit("setActiveIndex", this.activeIndex + 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.page_mol {
  width: 100%;
  box-sizing: border-box;

  .page_mol-content {
    width: 1550px;
    margin: 0 auto;
    margin-top: 10px;

    display: flex;

    .page_mol-content-left {
      .page_mol-content-left-top {
        width: 608px;
        height: 42px;
        border-radius: 3px;
        opacity: 1;

        box-sizing: border-box;
        border: 1px solid #efefef;

        display: flex;
        align-items: center;

        .page_mol-content-left-top-nav {
          display: inline-block;
          padding: 2px 40px;
          cursor: pointer;
        }
      }

      .page_mol-content-left-content {
        height: 500px;
        border-radius: 6px;
        opacity: 1;

        background: #ffffff;

        box-sizing: border-box;
        border: 1px solid #efefef;

        // padding: 11px 10px;
        display: flex;
        flex-flow: column;

        .page_mol-content-left-content-container {
          flex: 1;
          padding: 0 30px;

          .list-row {
            display: flex;
            align-items: center;
            margin-bottom: 3px;
          }

          .homopolymer {
            // height: 520px;
            width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
          }

          ::v-deep .el-form-item__label {
            font-size: 14px;
            font-weight: bold;
            color: #3d3d3d;
          }

          .page_mol-content-left-content-container-item {
            display: inline-block;
            color: #9b9b9b;
            cursor: pointer;
            text-align: center;

            &:hover {
              background-color: #f7f8fa;
            }
          }
        }

        .page_mol-content-left-btn {
          width: 602px;
          height: 33px;
          line-height: 33px;
          text-align: center;
          transform: rotate(0deg);
          border-radius: 5px;
          opacity: 1;
          background: #63bb97;
          color: #ffffff;
          cursor: pointer;
          margin-top: auto;

          &:hover {
            opacity: 0.7;
          }
        }
      }
    }

    .page_mol-content-right {
      margin-left: 50px;

      .page_mol-content-right-btns {
        height: 52px;
        line-height: 52px;

        margin-top: 13px;
        width: 900px;
        background: #ffffff;
        box-sizing: border-box;
        border: 1px solid #f3f3f3;
        border-radius: 6px;

        padding: 0 20px;
        display: flex;
      }
    }
  }

  .page_mol_top {
    display: flex;
    box-sizing: border-box;
    padding-top: 80px;
    align-items: center;

    .page_mol_top_btns {
      width: 100px;
      cursor: pointer;
      border-radius: 8px;

      &:hover {
        background-color: #2369e6;
        color: #ffffff;
      }
    }
  }

  .page_mol_middle_btns {
    display: inline-flex;
    flex: 1;
  }

  .btns {
    margin: 10px 20px;
  }
}
</style>
