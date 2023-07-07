<template>
  <div class="page_mol">
    <step-crystal-title
      title="创建分子结构"
      :showUpload="true"
      @update="updateUploadedMol2"
    ></step-crystal-title>

    <div class="page_mol-content">
      <div class="page_mol-content-left">
        <!-- 注意： 这个接口一定要有个带id的canvas，以及该canvas有个父元素wrapper，布局的时候布局该父元素即可 -->
        <div style="display: inline-block; text-align: center">
          <canvas :id="domId" style="width: 600px; height: 608px"></canvas>
        </div>

        <div
          style="display: flex; align-items: center; justify-content: center"
          class="page_mol-content-left-btn"
          @click="generate3D"
        >
          <div style="font-size: 12px; margin-right: 3px">生成3d结构视图</div>
          <img src="@/assets/icon/atom/3.png" alt="" />
        </div>

        <!-- <my-drag></my-drag> -->
      </div>

      <div class="page_mol-content-right">
        <!-- 右侧3D模型文件 -->
        <div style="width: 900px; height: 670px; position: relative">
          <molecule-ultimate
            ref="moleculeUltimate"
            :width="900"
            :height="670"
            :needExtra="true"
            :hasOutline="false"
            tips="该工具不会进行相关结构的优化，如上传请上传优化后的结构"
          ></molecule-ultimate>
        </div>
      </div>
    </div>

    <div class="page_mol-bottom" v-if="mol2">
      <div class="page_mol_middle_btns">
        <div v-if="forces && forces.length > 0">
          <span style="color: #222222"> 选择力场 </span>
          <el-select
            size="small"
            @change="onForceChange"
            :value="force"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in forces"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div v-if="forces && forces.length > 0" style="margin-left: 20px">
          <span style="color: #222222"> 选择备选力场 </span>
          <el-select
            size="small"
            @change="onBackForceChange"
            :value="backForce"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in backForces"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div
          v-if="waterModelForces && waterModelForces.length > 0"
          style="margin-left: 20px"
        >
          <span style="color: #222222"> 选择水模型力场 </span>
          <el-select
            size="small"
            @change="onWaterModelChange"
            :value="waterModel"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in waterModelForces"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div style="margin-left: 20px">
          <span style="color: #222222"> 选择CHARGE </span>
          <el-select
            size="small"
            @change="onChargeChange"
            :value="charge"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in chargeOptions"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>

        <div style="margin-left: auto">
          <Format-download :mol2="originMol2"></Format-download>
          <a-button
            style="
              width: 100px;
              background-color: #0a55ff;
              color: #ffffff;
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
</template>

<script>
import { mapState } from "vuex";

import MoleculeUltimate from "@/components/MoleculeUltimate.vue";
import StepCrystalTitle from "@/components/atom/StepCrystalTitle.vue";
import MyDrag from "@/components/atom/MyDrag.vue";
import FormatDownload from "@/components/FormatDownload.vue";

import Sortable from "sortablejs";
import fileDownload from "js-file-download";

import api from "@/api2";
import request from "@/api2/request";

import { parseMOL2File } from "@/libs/parseText";

import Spin from "@/api2/spin";

export default {
  name: "First",
  data() {
    return {
      mySketcher: null,

      mpId: "hp-1",
      cifContent: "",

      atoms: [],

      // 可选项，维护在后端
      forces: [],
      waterModels: [],

      domId: new Date().getTime(),
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
      "backForce",
      "backForces",
      "waterModel",
      "waterModelForces",
      "charge",
      "chargeOptions",
      "isCrystalMaterial",
    ]),
  },
  components: {
    MoleculeUltimate,
    StepCrystalTitle,
    MyDrag,
    FormatDownload,
  },
  beforeDestroy() {
    console.log("beforeDestroy");
    // 记录一下当前的周期表dialog
    window.periodicTableDialog =
      this.mySketcher.dialogManager.periodicTableDialog;
    window.periodicTableDialogSelected =
      this.mySketcher.dialogManager.periodicTableDialog.canvas.selected;
  },
  mounted() {
    this.init();
    const p1 = this.getForcesOptions();
    const p2 = this.getBackupOptions();
    Promise.all([p1, p2]).then(([data1, data2]) => {
      this.$store.commit("setForce", this.forces[0]);
      // 将列表初始化为可拖动排序的
      const dragList = document.getElementById("dragList");
      const dropList = document.getElementById("dropList");

      if (dragList && dropList) {
        console.log(dragList);
        console.log(dropList);

        Sortable.create(dragList, {
          group: {
            name: "dragList",
            put: "dropList",
            pull: function (to, from) {
              return from.el.children.length > 2 || "clone";
            },
          },
          animation: 100,
        });

        Sortable.create(dropList, {
          group: {
            name: "dropList",
            put: function (to) {
              return to.el.children.length < 4;
            },
          },
          animation: 100,
        });
      }
    });

    this.getWaterModelForcesOptions(); // this.getWaterModelForcesOptions(); 注意这个接口会报跨域错误, 经查看好像是api的url有问题 TODO::
  },
  methods: {
    // 初始化2d 草图
    originInit() {
      let sketcher = new ChemDoodle.SketcherCanvas("my-sketcher", 600, 608, {
        useServices: false,
        oneMolecule: true,
        isMobile: false,
        //requireStartingAtom:false,
      });
      sketcher.toolbarManager.buttonCalculate.disable();
      sketcher.toolbarManager.buttonSearch.disable();
      sketcher.paidToHideTrademark = true;
      sketcher.hideHelp = true;
      sketcher.styles.atoms_displayTerminalCarbonLabels_2D = false;
      sketcher.styles.atoms_useJMOLColors = true;
      sketcher.styles.bonds_clearOverlaps_2D = true;
      sketcher.styles.bonds_overlapClearWidth_2D = 2;
      sketcher.styles.bonds_width_2D = 1.5;
      sketcher.styles.scale = 1;
      sketcher.styles.backgroundColor = "rgba(255,255,255,0)";
      //sketcher.styles.bonds_splitColor = true;
      sketcher.repaint();
    },
    // 初始化2d 草图
    init() {
      let sketcher = new ChemDoodle.SketcherCanvas(this.domId, 600, 608, {
        useServices: false,
        oneMolecule: true,
        isMobile: false,
        //requireStartingAtom:false,
      });
      sketcher.toolbarManager.buttonCalculate.disable();
      sketcher.toolbarManager.buttonSearch.disable();
      sketcher.paidToHideTrademark = true;
      sketcher.hideHelp = true;
      sketcher.styles.atoms_displayTerminalCarbonLabels_2D = false;
      sketcher.styles.atoms_useJMOLColors = true;
      sketcher.styles.bonds_clearOverlaps_2D = true;
      sketcher.styles.bonds_overlapClearWidth_2D = 2;
      sketcher.styles.bonds_width_2D = 1.5;
      sketcher.styles.scale = 1;
      sketcher.styles.backgroundColor = "rgba(255,255,255,0)";
      //sketcher.styles.bonds_splitColor = true;
      this.mySketcher = sketcher;
      this.mySketcher.repaint();

      // 初始化2D草图，基于store的mol文本
      if (this.originMol) {
        let jsonStruct = ChemDoodle.readMOL(this.originMol);
        this.mySketcher.loadMolecule(jsonStruct);
      }
      // 初始化3D模型，基于store
    },
    // 点击获取当前的json
    getMoleculeJson() {
      console.log(this.mySketcher);
      let mol = this.mySketcher.getMolecule();
      // this line converts the Molecule data structure to the JSON protocol Javascript object
      let dummy = new ChemDoodle.io.JSONInterpreter().molTo(mol);
      console.log("===dummy", dummy);
      // this line reconstructs the Molecule data structure from the JSON object
      let reconstructed = new ChemDoodle.io.JSONInterpreter().molFrom(dummy);
      console.log("===reconstructed", reconstructed);
    },
    // 点击获取mol文本
    getMolFile() {
      let mol = this.mySketcher.getMolecule();
      let molFile = ChemDoodle.writeMOL(mol);
      console.log("===molFile", molFile);
    },
    /*=================generate3D==============*/
    generate3D() {
      // init
      let mol = this.mySketcher.getMolecule();
      let molFile = ChemDoodle.writeMOL(mol);
      this.$store.commit("setOriginMol", molFile);

      // 这里进行文件解析原子个数
      let content = molFile;
      let lines = content.split("\n");
      let whitespaceRegex = /\s+/g;

      let numLine = lines[3];
      let num = Number(numLine.slice(0, 3).trim());

      if (num > 1000) {
        this.$message.error("原子个数不能超过1000个");
        return false;
      }

      request
        .postJson(api.toMol2, {
          data: molFile,
          inp: "mol",
          out: "mol2",
          other: "--gen3d",
        })
        .then((data) => {
          // 判断如果大于200个原子，停止转换
          const { atoms, bonds } = parseMOL2File(data.data);
          this.$store.commit("setMol2", data.data);
          this.$store.commit("setOriginMol2", data.data);
          this.$refs["moleculeUltimate"].init(data.data, true);

          const options = this.$refs[
            "moleculeUltimate"
          ].getChargeOptionsByContent(data.data);
          this.$store.commit("setChargeOptions", options);
          this.$store.commit("setCharge", options[1]);
          return;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    updateUploadedMol2(content) {
      this.$refs["moleculeUltimate"].init(content, true);

      const options =
        this.$refs["moleculeUltimate"].getChargeOptionsByContent(content);
      this.$store.commit("setChargeOptions", options);
      this.$store.commit("setCharge", options[1]);
    },

    setMolecule() {
      // console.log(this.moleculeJson);
      // this.mySketcher.setMolecule(this.moleculeJson)
      let str =
        "molFile Molecule from ChemDoodle Web Components\n" +
        "\n" +
        "http://www.ichemlabs.com\n" +
        "  9  9  0  0  0  0            999 V2000\n" +
        "   -2.1651   -1.0000    0.0000 C   0  0  0  0  0  0\n" +
        "   -1.2990   -0.5000    0.0000 C   0  0  0  0  0  0\n" +
        "   -0.4330   -1.0000    0.0000 C   0  0  0  0  0  0\n" +
        "    0.4330   -0.5000    0.0000 C   0  0  0  0  0  0\n" +
        "    0.4330    0.5000    0.0000 C   0  0  0  0  0  0\n" +
        "    1.2990    1.0000    0.0000 O   0  0  0  0  0  0\n" +
        "    2.1651    0.5000    0.0000 N   0  0  0  0  0  0\n" +
        "    2.1651   -0.5000    0.0000 N   0  0  0  0  0  0\n" +
        "    1.2990   -1.0000    0.0000 N   0  0  0  0  0  0\n" +
        "  1  2  1  0  0  0  0\n" +
        "  2  3  1  0  0  0  0\n" +
        "  3  4  1  0  0  0  0\n" +
        "  4  5  1  0  0  0  0\n" +
        "  5  6  1  0  0  0  0\n" +
        "  6  7  1  0  0  0  0\n" +
        "  7  8  1  0  0  0  0\n" +
        "  8  9  1  0  0  0  0\n" +
        "  9  4  1  0  0  0  0\n" +
        "M  END";
      let jsonStruct = ChemDoodle.readMOL(str);
      this.mySketcher.loadMolecule(jsonStruct);
      // this.mySketcher.repaint();
    },
    // 获取力场列表
    getForcesOptions() {
      return new Promise((resolve, reject) => {
        request
          .get(api.ilForce, {})
          .then((data) => {
            console.log("===================返回数据", data);
            this.forces = data.data;
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    // 获取备用力场列表
    getBackupOptions() {
      return new Promise((resolve, reject) => {
        request
          .get(api.aaForce, {})
          .then((data) => {
            this.$store.commit("setBackForces", data.data);
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    // 获取水模型力场列表
    getWaterModelForcesOptions() {
      return new Promise((resolve, reject) => {
        request
          .get(api.supportedWatermodels, {})
          .then((data) => {
            this.$store.commit("setWaterModelForces", data.data);
            resolve(data);
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
    // 选择备选力场
    onBackForceChange(val) {
      this.$store.commit("setBackForce", val);
    },
    // 选择水模型力场
    onWaterModelChange(val) {
      this.$store.commit("setWaterModel", val);
    },
    // 先根据mol2文件选择电荷
    onChargeChange(val) {
      this.$store.commit("setCharge", val);
    },
    // 前往到下一步
    goSecond() {
      Spin.show();

      request
        .get(
          api.tip4pwatermodels,
          {},
          { loading: false, mock: false, error: true }
        )
        .then((data) => {
          const specialWaterModel = data.data || [];
          if (specialWaterModel.includes(this.waterModel)) {
            // 这里请求水分子力场接口, 拿到新的mol2后再进行跳转到下一页，因为下一页会直接进行渲染。
            request
              .postJson(
                api.tip4p,
                {
                  data: this.mol2,
                },
                { loading: false, mock: false, error: true }
              )
              .then((data) => {
                console.log("====水模型新的mol2拿到", data.data);
                this.$store.commit("setMol2", data.data);

                this.$store.commit("setActiveIndex", this.activeIndex + 1);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.$store.commit("setActiveIndex", this.activeIndex + 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 下载mol2文本
    downloadMol2() {
      if (this.mol2) {
        fileDownload(this.mol2, `molecule.mol2`);
      } else {
        this.$message.warning("没有要下载的mol2文本");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page_mol {
  width: 100%;
  box-sizing: border-box;
  // padding-top: 75px;

  .page_mol-top {
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

  .page_mol-content {
    width: 1550px;
    margin: 0 auto;
    margin-top: 22px;

    display: flex;
    height: 670px;

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
      margin-top: -5px;

      &:hover {
        opacity: 0.7;
      }
    }

    .page_mol-content-right {
      margin-left: 50px;
    }
  }

  .page_mol-bottom {
    height: 52px;
    line-height: 52px;

    margin: 0 auto;
    margin-top: 13px;
    width: 1550px;
    background: #ffffff;
    box-sizing: border-box;
    border: 1px solid #f3f3f3;
    border-radius: 6px;

    padding: 0 20px;
    display: flex;

    .page_mol_middle_btns {
      display: inline-flex;
      flex: 1;
    }
  }

  .btns {
    margin: 10px 20px;
  }
}
</style>
