<template>
  <div class="third-wrapper">
    <step-title title="生成拓扑文件" :showUpload="false"></step-title>

    <div class="third-wrapper-content">
      <div>
        <div class="third-wrapper-molecule-container">
          <molecule-ultimate
            v-if="showMolecule"
            ref="moleculeUltimate"
            :width="600"
            :height="600"
            :needExtra="true"
            tips="可通过下方按钮切换显示标签"
            :hasOutline="false"
          ></molecule-ultimate>
        </div>

        <div class="third-wrapper-tags">
          显示标签:
          <a-radio-group
            button-style="solid"
            style="margin-top: 10px; margin-left: 14px"
            v-model="labelLayer"
            @change="switchLabel"
          >
            <a-radio-button :value="0"> 无 </a-radio-button>
            <a-radio-button :value="1"> atom </a-radio-button>
            <a-radio-button :value="2"> id </a-radio-button>
            <a-radio-button :value="3"> charge </a-radio-button>
          </a-radio-group>
        </div>
      </div>

      <!-- 右侧 -->
      <div style="display: flex; flex: 1; flex-flow: column; margin-left: 24px">
        <div class="list-wrapper">
          <div class="list-wrapper-navs">
            <div
              v-for="item in tableNavs"
              @click="activeNavId = item.id"
              :key="item.id"
              :style="{
                width: '128px',
                height: '36px',
                borderRadius: '3px',
                background: activeNavId === item.id ? '#0a55ff' : '#E1E4F0',
                color: '#ffffff',
                'text-align': 'center',
                'line-height': '36px',
                display: 'inline-block',
                marginRight: '4px',
                cursor: 'pointer',
              }"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="list-wrapper-tables">
            <!-- ATOMS -->
            <edit-table-with-no-edit
              v-show="activeNavId === 1"
              ref="chargeTable"
              :columns="chargeColumn"
              :originData="chargeResult"
              :selectedAtoms="selectedAtoms"
            ></edit-table-with-no-edit>
            <!-- BONDSs -->
            <div v-show="activeNavId === 2">
              <edit-table
                v-for="(currTableColumn, index) in bondsColumns"
                style="margin-bottom: 5px"
                ref="bondsGroup"
                :key="index"
                :columns="currTableColumn"
                :originData="bondsDatas[index]"
                :selectedAtoms="selectedAtoms"
              ></edit-table>
            </div>
            <!-- ANGLES -->
            <div v-show="activeNavId === 3">
              <edit-table
                v-for="(currTableColumn, index) in anglesColumns"
                style="margin-bottom: 5px"
                ref="anglesGroup"
                :key="index"
                :columns="currTableColumn"
                :originData="anglesDatas[index]"
                :selectedAtoms="selectedAtoms"
              ></edit-table>
            </div>
            <!-- DIHEDRALS -->
            <div v-show="activeNavId === 4">
              <edit-table
                v-for="(currTableColumn, index) in dihedralsColumns"
                style="margin-bottom: 5px"
                ref="dihedralsGroup"
                :key="index"
                :columns="currTableColumn"
                :originData="dihedralsDatas[index]"
                :selectedAtoms="selectedAtoms"
              ></edit-table>
            </div>
            <!-- IMPROPER -->
            <div v-show="activeNavId === 5">
              <edit-table
                v-for="(currTableColumn, index) in impropersColumns"
                style="margin-bottom: 5px"
                ref="impropersGroup"
                :key="index"
                :columns="currTableColumn"
                :originData="impropersDatas[index]"
                :selectedAtoms="selectedAtoms"
              ></edit-table>
            </div>
            <!-- PAIRS -->
            <div v-show="activeNavId === 7">
              <edit-table
                ref="pairsGroup"
                :columns="pairsColumns"
                :originData="pairsData"
                :selectedAtoms="selectedAtoms"
              ></edit-table>
            </div>
          </div>
        </div>
        <div class="list-wrapper-btns">
          <div style="margin-right: 17px; color: #222222">选择计算软件:</div>
          <el-select
            ref="select"
            size="small"
            @change="handleComputerChange"
            :value="computer"
            placeholder="请选择"
            style="width: 120px; margin-right: 20px"
          >
            <el-option value="gromacs">gromacs</el-option>
            <el-option value="lammps">lammps</el-option>
            <el-option value="amber">amber</el-option>
            <el-option value="moltemplate">moltemplate</el-option>
            <el-option value="openmm">openmm</el-option>
            <el-option value="tinker">tinker</el-option>
            <el-option value="charmm">charmm</el-option>
          </el-select>
          <a-button
            style="margin-left: auto; margin-right: 10px"
            @click="goBack"
            >上一步</a-button
          >
          <download-modal
            :hasXYZ="isCrystalMaterial"
            :btnText="`下载`"
            @download="downloadFile"
          ></download-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import MoleculeUltimate from "@/components/MoleculeUltimate.vue";
import EditTable from "@/components/EditTable.vue";
import EditTableWithNoEdit from "@/components/EditTableWithNoEdit.vue";
import MyTable from "@/components/MyTable.vue";
import StepTitle from "@/components/atom/StepTitle.vue";
import DownloadModal from "@/components/DownloadModal.vue";

import api from "@/api2/index";
import request from "@/api2/request";

import { parseMOL2File } from "@/libs/parseText";

import Spin from "@/api2/spin";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "ELEMENT",
    dataIndex: "element",
    key: "element",
  },
  {
    title: "ATOMTYPE",
    dataIndex: "atomtype",
    key: "atomtype",
  },
];

const data = [
  {
    id: "1",
    element: "John Brown",
    atomtype: 32,
  },
  {
    id: "2",
    element: "John Brown",
    atomtype: 32,
  },
];

export default {
  name: "Third",
  data() {
    return {
      activeKeys: ["1", "2", "3", "4", "5", "6"],
      activeNavId: 1,
      tableNavs: [
        { id: 1, name: "ATOMS" },
        { id: 2, name: "BONDS" },
        { id: 3, name: "ANGLES" },
        { id: 4, name: "DIHEDRALS" },
        { id: 5, name: "IMPROPER" },
        // { id: 6, name: "PAIRS" },
      ],

      data,
      columns,
      editingKey: "",

      // atom params
      data4: null,
      labelLayer: 0,

      whichLable: "charge",
      // charge
      chargeColumn: [
        {
          title: "序号",
          dataIndex: "id",
          width: "7%",
          scopedSlots: { customRender: "id" },
        },
        {
          title: "基团",
          dataIndex: "atom",
          width: "7%",
          scopedSlots: { customRender: "atom" },
        },
        {
          title: "电荷",
          dataIndex: "charge",
          scopedSlots: { customRender: "charge" },
        },
        {
          title: "质量",
          dataIndex: "mass",
          scopedSlots: { customRender: "mass" },
        },
        {
          title: "范德华半径 (nm)",
          dataIndex: "alpha",
          scopedSlots: { customRender: "alpha" },
        },
        {
          title: "势阱深度 (kJ·mol-1)",
          dataIndex: "beta",
          scopedSlots: { customRender: "beta" },
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "12%",
          scopedSlots: { customRender: "operation" },
        },
      ],

      // atomtype
      typeColumn: columns,
      typeData: data,

      // atomParams
      // angles
      anglesColumns: [],
      anglesDatas: [],
      anglesColumn: [
        {
          title: "原子1",
          dataIndex: "atom1",
          width: "8%",
          scopedSlots: { customRender: "atom1" },
        },
        {
          title: "原子2",
          dataIndex: "atom2",
          width: "8%",
          scopedSlots: { customRender: "atom2" },
        },
        {
          title: "原子3",
          dataIndex: "atom3",
          width: "8%",
          scopedSlots: { customRender: "atom3" },
        },
        {
          title: "函数类型",
          dataIndex: "pos1",
          scopedSlots: { customRender: "pos1" },
        },
        {
          title: "键角(°)",
          dataIndex: "pos2",
          scopedSlots: { customRender: "pos2" },
        },
        {
          title: "力常数(kJ·mol-1·rad-2)",
          dataIndex: "pos3",
          scopedSlots: { customRender: "pos3" },
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "12%",
          scopedSlots: { customRender: "operation" },
        },
      ],
      anglesData: [],

      // bonds
      bondsColumns: [],
      bondsDatas: [],
      bondsColumn: [
        {
          title: "原子1",
          dataIndex: "atom1",
          width: "8%",
          scopedSlots: { customRender: "atom1" },
        },
        {
          title: "原子2",
          dataIndex: "atom2",
          width: "8%",
          scopedSlots: { customRender: "atom2" },
        },
        {
          title: "函数类型",
          dataIndex: "pos1",
          scopedSlots: { customRender: "pos1" },
        },
        {
          title: "键长(nm）",
          dataIndex: "pos2",
          scopedSlots: { customRender: "pos2" },
        },
        {
          title: "力常数(kJ·mol-1·nm-2)",
          dataIndex: "pos3",
          scopedSlots: { customRender: "pos3" },
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "12%",
          scopedSlots: { customRender: "operation" },
        },
      ],
      bondsData: [],

      // dihedrals
      dihedralsColumns: [],
      dihedralsDatas: [],
      dihedralsColumn: [
        {
          title: "原子1",
          width: "6%",
          dataIndex: "atom1",
          scopedSlots: { customRender: "atom1" },
        },
        {
          title: "原子2",
          width: "6%",
          dataIndex: "atom2",
          scopedSlots: { customRender: "atom2" },
        },
        {
          title: "原子3",
          width: "6%",
          dataIndex: "atom3",
          scopedSlots: { customRender: "atom3" },
        },
        {
          title: "原子4",
          width: "6%",
          dataIndex: "atom4",
          scopedSlots: { customRender: "atom4" },
        },
        {
          title: "参数1",
          dataIndex: "pos1",
          scopedSlots: { customRender: "pos1" },
        },
        {
          title: "参数2",
          dataIndex: "pos2",
          scopedSlots: { customRender: "pos2" },
        },
        {
          title: "参数3",
          dataIndex: "pos3",
          scopedSlots: { customRender: "pos3" },
        },
        {
          title: "参数4",
          dataIndex: "pos4",
          scopedSlots: { customRender: "pos4" },
        },
        {
          title: "参数5",
          dataIndex: "pos5",
          scopedSlots: { customRender: "pos5" },
        },
        {
          title: "参数6",
          dataIndex: "pos6",
          scopedSlots: { customRender: "pos6" },
        },
        {
          title: "参数7",
          dataIndex: "pos7",
          scopedSlots: { customRender: "pos7" },
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "12%",
          scopedSlots: { customRender: "operation" },
        },
      ],
      dihedralsData: [],

      // improper
      impropersColumns: [],
      impropersDatas: [],
      improperColumn: [
        {
          width: "8%",
          title: "原子1",
          dataIndex: "atom1",
          scopedSlots: { customRender: "atom1" },
        },
        {
          width: "8%",
          title: "原子2",
          dataIndex: "atom2",
          scopedSlots: { customRender: "atom2" },
        },
        {
          width: "8%",
          title: "原子3",
          dataIndex: "atom3",
          scopedSlots: { customRender: "atom3" },
        },
        {
          width: "8%",
          title: "原子4",
          dataIndex: "atom4",
          scopedSlots: { customRender: "atom4" },
        },
        {
          title: "参数1",
          dataIndex: "pos1",
          scopedSlots: { customRender: "pos1" },
        },
        {
          title: "参数2",
          dataIndex: "pos2",
          scopedSlots: { customRender: "pos2" },
        },
        {
          title: "参数3",
          dataIndex: "pos3",
          scopedSlots: { customRender: "pos3" },
        },
        {
          title: "操作",
          width: "12%",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      improperData: [],

      // 记录下pairs
      pairsColumns: [
        {
          title: "原子1",
          dataIndex: "first",
        },
        {
          title: "原子4",
          dataIndex: "second",
        },
        {
          title: "函数类型",
          dataIndex: "third",
        },
      ],
      pairsData: [],

      selectedAtoms: [],

      // 提交计算
      computer: "gromacs",
      visible: false,
      checkNick: false,
      resname: "",

      showMolecule: false,

      ruleForm: {
        resname: "NUK",
        x: 1,
        y: 1,
        z: 1,
      },
      rules: {
        resname: [
          { required: true, message: "请输入resname", trigger: "change" },
        ],
        x: [{ required: true, message: "请输入x方向扩展", trigger: "change" }],
        y: [{ required: true, message: "请输入y方向扩展", trigger: "change" }],
        z: [{ required: true, message: "请输入z方向扩展", trigger: "change" }],
      },
    };
  },
  components: {
    MoleculeUltimate,
    EditTable,
    MyTable,
    EditTableWithNoEdit,
    StepTitle,
    DownloadModal,
  },
  computed: {
    ...mapState([
      "activeIndex",
      "mol2",
      "atoms",
      "chargeResult",
      "force",
      "backForce",
      "waterModel",
      "charge",
      "chargeType",
      "forceParams",
      "atomtypeTableData",
      "atomtypeOriginData",
      "switchValue",
      "waterModelForces",
      "isCrystalMaterial",
      "isUseBondLength",
      "isUseBondAngle",
    ]),
  },
  created() {
    console.log("this.charge", this.charge);

    const p1 = this.initChargeParams();
    const p4 = this.initParams();

    Spin.show();
    Promise.all([p1, p4])
      .then(([data1, data4]) => {
        let chargeData;

        if (data1) {
          chargeData = data1.map((item, index) => {
            return {
              key: index.toString(),
              id: (index + 1).toString(),
              atom: this.atoms[index].label,
              mass: data4.atoms[index][7],
              alpha: data4.atoms[index][8],
              beta: data4.atoms[index][9],
              charge: this.waterModelForces.includes(data4.atoms[index][2])
                ? data4.atoms[index][6]
                : item,
              noEdit: this.waterModelForces.includes(data4.atoms[index][2]),
            };
          });
        } else {
          // 如果选择的chargetype为空 chargeData不进行覆盖
          chargeData = data4.atoms.map((item, index) => {
            return {
              key: index.toString(),
              id: (index + 1).toString(),
              atom: this.atoms[index].label,
              mass: item[7],
              alpha: item[8],
              beta: item[9],
              charge: item[6],
              noEdit: this.waterModelForces.includes(item[2]),
            };
          });
        }
        this.$store.commit("setChargeResult", chargeData);

        if (
          data4 &&
          data4.angles &&
          data4.bonds &&
          data4.dihedrals &&
          data4.impropers &&
          data4.pairs
        ) {
          this.data4 = data4;
          // 针对anglesData进行分类
          this.formatTableData(2, data4.bonds, "bondsColumns", "bondsDatas");
          this.formatTableData(3, data4.angles, "anglesColumns", "anglesDatas");
          this.formatTableData(
            4,
            data4.dihedrals,
            "dihedralsColumns",
            "dihedralsDatas"
          );
          this.formatTableData(
            4,
            data4.impropers,
            "impropersColumns",
            "impropersDatas"
          );
          this.pairsData = data4.pairs.map((item, index) => {
            return {
              key: index.toString(),
              id: (index + 1).toString(),
              first: item[0],
              second: item[1],
              third: parseInt(item[2]),
            };
          });

          this.showMolecule = true;

          //
          Spin.hide();
        }
      })
      .finally(() => {});
  },

  methods: {
    initChargeTable1() {
      return new Promise((resolve, reject) => {
        request
          .postJson(api.atom, {
            atomtype: this.atomtypeTableData.map((item) => {
              return {
                name: item.atomtype,
                type: item.type,
              };
            }),
          })
          .then((data) => {
            // this.$store.commit("setForceParams", data.data);
            resolve(data.data);
          });
      });
    },
    initChargeTable2() {
      return new Promise((resolve, reject) => {
        request
          .postJson(api.lj, {
            atomtype: this.atomtypeTableData.map((item) => {
              return {
                name: item.atomtype,
                type: item.type,
              };
            }),
          })
          .then((data) => {
            // this.$store.commit("setForceParams", data.data);
            resolve(data.data);
          });
      });
    },
    initParams() {
      return new Promise((resolve, reject) => {
        // 精确搜索 or 模糊搜索，传过去所有的
        const reqAtomData = this.atomtypeOriginData.map((item, index) => {
          let ans = [];
          let selectItem = this.atomtypeTableData[index];
          ans.push({
            name: selectItem.atomtype,
            type: selectItem.type,
          });
          if (this.switchValue === "fuzzy") {
            item.forEach((item, index) => {
              if (
                selectItem.atomtype !== item.name ||
                selectItem.type !== item.type
              ) {
                ans.push(item);
              }
            });
          }
          return ans;
        });
        // 处理下是否使用结构的键长和键角传参
        let use_current_structure = 0;
        console.log(this.isUseBondLength);
        console.log(this.isUseBondAngle);
        if (this.isUseBondLength && this.isUseBondAngle) {
          use_current_structure = 3;
        } else if (!this.isUseBondLength && this.isUseBondAngle) {
          use_current_structure = 2;
        } else if (this.isUseBondLength && !this.isUseBondAngle) {
          use_current_structure = 1;
        } else {
          use_current_structure = 0;
        }
        request
          .postJson(
            api.atomParam,
            {
              data: this.mol2,
              atomtype: reqAtomData,
              backup: this.backForce,
              watermodel: this.waterModel,
              use_current_structure,
            },
            { loading: false, mock: false, error: true }
          )
          .then((data) => {
            this.$store.commit("setForceParams", data.data);
            resolve(data.data);
          });
      });
    },
    // 拿到电荷参数
    initChargeParams() {
      console.log("this.charge", this.charge);

      let url = api.resp;
      switch (this.chargeType) {
        case "GNN-RESP":
          url = api.GNN;
          break;
        case "resp":
          url = api.resp;
          break;
        case "cm5":
          url = api.cm5;
          break;
        case "1.2xcm5":
          url = api.cm5_2;
          break;
        case "qeq":
          url = api.qeq;
          break;
        case "am1bcc":
          url = api.am1bcc;
          break;
        case "mmff94":
          url = api.mmff94;
          break;
        case "oplsaa":
          url = api.oplsaa;
          break;
        case "cm1a":
          url = api.cm1a;
          break;
        case "1.14xcm1a":
          url = api.cm1a_2;
          break;
        case "--":
          url = "";
        default:
          break;
      }
      if (url) {
        return new Promise((resolve, reject) => {
          request
            .postJson(
              url,
              {
                data: this.mol2,
                charge: this.charge,
              },
              { loading: false, mock: false, error: true }
            )
            .then((data) => {
              resolve(data.data);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve("");
        });
      }
    },
    updateSelectedAtom(atoms) {
      console.log("====atoms", atoms);
      this.selectedAtoms = atoms.map((a) => a.name);
    },

    // 最终生成拓扑文件
    handleComputerChange(value) {
      this.computer = value;
    },
    // 返回上一步
    goBack() {
      //
      Spin.show();

      this.$store.commit("setActiveIndex", this.activeIndex - 1);
    },

    // 表格的分类汇总 根据某一列数据进行分类汇总
    formatTableData(cIndex, tData, columnProp, dataProp) {
      const ans = this.classifyTable(cIndex, tData);
      console.log("====分类汇总后的====", ans);

      Object.keys(ans)
        .sort(Number)
        .forEach((k, index) => {
          let arr = ans[k];
          let l = arr.length === 0 ? 0 : arr[0].length; // 每一行的length

          // 针对没有参数的table进行特殊处理
          if (!k) {
            switch (columnProp) {
              case "anglesColumns":
                l = l + 1 + 6;
                break;
              case "bondsColumns":
                l = l + 1 + 3;
                break;
              case "dihedralsColumns":
                l = l + 1 + 6;
                break;
              case "impropersColumns":
                l = l + 1 + 6;
                break;
              default:
                break;
            }
          }

          // 计算有多少列头
          let ansColumn = [];
          for (let i = 0; i < cIndex; i++) {
            ansColumn.push({
              title: `原子${i + 1}`,
              dataIndex: `atom${i + 1}`,
              width: "8%",
              scopedSlots: { customRender: `atom${i + 1}` },
            });
          }
          for (let i = cIndex; i < l; i++) {
            ansColumn.push({
              title: i === cIndex ? `函数类型` : `参数${i - cIndex}`,
              dataIndex: `pos${i - cIndex + 1}`,
              scopedSlots: { customRender: `pos${i - cIndex + 1}` },
            });
          }
          ansColumn.push({
            title: "操作",
            dataIndex: "operation",
            width: "12%",
            scopedSlots: { customRender: "operation" },
          });
          this[columnProp].push(ansColumn);

          // 处理数据
          let ansData = arr.map((row, index) => {
            let obj = {
              key: index.toString(),
            };
            for (let i = 0; i < cIndex; i++) {
              obj[`atom${i + 1}`] = row[i];
            }
            for (let i = cIndex; i < l; i++) {
              if (row[i] === undefined || row[i] === null) {
                // 如果是无参数的
                obj[`pos${i - cIndex + 1}`] = "";
              } else {
                obj[`pos${i - cIndex + 1}`] =
                  i === cIndex ? row[i] : Number(row[i]).toFixed(3);
              }
            }
            return obj;
          });
          this[dataProp].push(ansData);
        });
    },
    // 分类汇总
    classifyTable(columnIndex, data) {
      const obj = {};

      data.forEach((arr, index) => {
        if (!obj[arr[columnIndex]]) {
          obj[arr[columnIndex]] = [];
        }
        obj[arr[columnIndex]].push(arr.slice());
      });

      return obj;
    },
    // 组成参数
    generateParams(prop, refProp, cIndex) {
      let ans = [];

      this[prop].forEach((item, index) => {
        let originData = this.$refs[refProp][index].data;
        if (originData.length !== 0) {
          let l = Object.keys(originData[0]).length;
          console.log("l", l);
          let posNum = l - cIndex - 1;
          let ks = []; // 需要提出来的属性
          for (let i = 0; i < cIndex; i++) {
            ks.push(`atom${i + 1}`);
          }
          for (let i = 0; i < posNum; i++) {
            ks.push(`pos${i + 1}`);
          }
          console.log("ks---------------", ks);
          originData = originData.map((item, index) => {
            let ans = ks.map((k) => {
              // console.log(item[k]);
              return isNaN(Number(item[k])) ? item[k] : Number(item[k]);
            });
            return ans;
          });
        }
        ans = ans.concat(originData);
      });

      return ans;
    },
    // 下载文件
    downloadFile(formData) {
      const chargeData = this.$refs["chargeTable"].data;

      const m = parseMOL2File(this.mol2);
      const bondsData = this.generateParams("bondsColumns", "bondsGroup", 2);
      const anglesData = this.generateParams("anglesColumns", "anglesGroup", 3);
      const dihedralsData = this.generateParams(
        "dihedralsColumns",
        "dihedralsGroup",
        4
      );
      const impropersData = this.generateParams(
        "impropersColumns",
        "impropersGroup",
        4
      );
      // console.log("impropersData", impropersData);

      const pairsData = this.$refs["pairsGroup"].data.map((item, index) => {
        return [item.first, item.second, item.third];
      });

      // 生成请求参数中的atoms参数部分 聚合atoms的table内容
      const atomsParams = chargeData.map((item, index) => {
        // let element = this.data4.atoms.slice()[index];
        // element[6] = Number(item["charge"]);
        // return element;
        return [
          item["atom"],
          this.atomtypeTableData[index]["atomtype"],
          this.atomtypeTableData[index]["type"],
          Number(m.atoms[index].x),
          Number(m.atoms[index].y),
          Number(m.atoms[index].z),
          Number(item["charge"]),
          Number(item["mass"]),
          Number(item["alpha"]),
          Number(item["beta"]),
        ];
      });

      let params = {
        ...this.data4,
        atoms: atomsParams,
        bonds: bondsData,
        angles: anglesData,
        dihedrals: dihedralsData,
        impropers: impropersData,
        pairs: pairsData,
        resname: formData.resname,
      };

      const { x, y, z } = formData;
      if (this.isCrystalMaterial) {
        params.supercell = [x, y, z];
      }

      return new Promise((resolve, reject) => {
        request
          .postFile(api[this.computer], params)
          .then((res) => {
            const blob = new Blob([res], {
              // type值如后台设置，前端可省略，具体type值可参考https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
              type: "application/octet-stream",
            });
            const downloadElement = document.createElement("a"); //创建a标签
            const href = window.URL.createObjectURL(blob); //创建DOMString
            const filename = `${this.computer}_${formData.resname}.zip`; //设置文件名字
            downloadElement.style.display = "none"; //隐藏a标签
            downloadElement.href = href; //赋值a标签的href
            downloadElement.download = filename; //下载后文件名
            document.body.appendChild(downloadElement); //插入a标签
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
          })
          .catch(() => {
            this.$message.error("下载错误");
          });
      });
    },
    // 选择那一个label
    switchLabel(e) {
      this.$refs["moleculeUltimate"].switchLabel(e.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.third-wrapper {
  // padding-top: 75px;
  margin: 0 auto;
  width: 1550px;

  .third-wrapper-top {
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

  .third-wrapper-content {
    display: flex;
    margin-top: 32px;

    .third-wrapper-molecule-container {
      position: relative;
      height: 600px;
    }

    .third-wrapper-tags {
      height: 52px;
      margin-top: 32px;
      color: #222222;
      border-radius: 6px;
      opacity: 1;
      background: #ffffff;
      box-sizing: border-box;
      border: 1px solid #f3f3f3;
      padding: 0 17px;

      .ant-radio-group-solid
        .ant-radio-button-wrapper-checked:not(
          .ant-radio-button-wrapper-disabled
        ) {
        color: #fff;
        background: #0a55ff;
        border-color: #0a55ff;
      }

      .ant-radio-button-wrapper {
        border-color: #0a55ff;
        color: #0a55ff;
        border: 1px solid #0a55ff;
      }
    }
  }

  .list-wrapper {
    flex: 1;
    height: 600px;
    border-radius: 6px;
    opacity: 1;
    background: #fcfcfc;
    box-sizing: border-box;
    border: 1px solid #efefef;
    padding: 13px;

    .list-wrapper-navs {
      height: 36px;
      width: 100%;
    }

    .list-wrapper-tables {
      margin-top: 7px;
      height: 533px;
      overflow-x: hidden;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 8px;
        height: 16px;
        background-color: #f5f5f5;
      }

      &::-webkit-scrollbar-track {
        // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        // border-radius: 10px;
        background-color: #fff;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #d8d8d8;
      }
    }
  }

  .list-wrapper-btns {
    // width: 100%;
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
    // justify-content: space-between;

    .ant-radio-group-solid
      .ant-radio-button-wrapper-checked:not(
        .ant-radio-button-wrapper-disabled
      ) {
      color: #ffffff;
      background: #0a55ff;
      border-color: #0a55ff;
    }

    // 下拉框内置样式类
    ::v-deep .ant-select-selection--single {
      // height: 36px;
      // line-height: 36px;
    }
  }
}
</style>
