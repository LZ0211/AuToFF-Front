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
          <!--  -->
          <canvas :id="domId" style="width: 600px; height: 390px"></canvas>
        </div>

        <div
          style="display: flex; align-items: center; justify-content: center"
          class="page_mol-content-left-btn"
          @click="generate3D"
        >
          <div style="font-size: 12px; margin-right: 3px">生成3d结构视图</div>
          <img src="@/assets/icon/atom/3.png" alt="" />
        </div>

        <my-drag></my-drag>
      </div>

      <div class="page_mol-content-right">
        <!-- 右侧3D模型文件 -->
        <div style="width: 900px; height: 670px; position: relative">
          <molecule-ultimate
            ref="moleculeUltimate"
            :width="900"
            :height="670"
            :needExtra="true"
            tips="该工具不会进行相关结构的优化，如上传请上传优化后的结构"
            :hasOutline="false"
          ></molecule-ultimate>
        </div>

        <div class="page_mol-content-right-btns" v-if="mol2">
          <div class="page_mol_middle_btns">
            <div v-if="waterModelForces.length > 0">
              <span style="color: #222222; font-size: 14px"
                >选择水模型力场：</span
              >
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
              <span style="color: #222222; font-size: 14px">选择CHARGE：</span>
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

import fileDownload from "js-file-download";

import api from "@/api2";
import request from "@/api2/request";

import MoleculeUltimate from "@/components/MoleculeUltimate.vue";
import StepCrystalTitle from "@/components/atom/StepCrystalTitle.vue";
import MyDrag from "@/components/atom/MyDrag.vue";
import FormatDownload from "@/components/FormatDownload.vue";
import ChooseEnd from "@/components/polymers/ChooseEnd.vue";

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
  mounted() {
    this.init();
    this.getWaterModelForcesOptions();
  },
  methods: {
    // 初始化2d 草图
    init() {
      let sketcher = new ChemDoodle.SketcherCanvas(this.domId, 600, 390, {
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
      // console.log(
      //   "sketcher.dialogManager.periodicTableDialog",
      //   sketcher.dialogManager.periodicTableDialog
      // );
      this.mySketcher = sketcher;
      this.mySketcher.repaint();

      // console.log(
      //   "ChemDoodle.PeriodicTableCanvas",
      //   ChemDoodle.PeriodicTableCanvas()
      // );

      // 初始化2D草图，基于store的mol文本
      if (this.originMol) {
        let jsonStruct = ChemDoodle.readMOL(this.originMol);
        this.mySketcher.loadMolecule(jsonStruct);
      }
    },
    TestTable() {
      console.log(
        "this.mySketcher.dialogManager.periodicTableDialog.canvas",
        this.mySketcher.dialogManager.periodicTableDialog.canvas
      );
    },
    // 点击获取当前的json
    getMoleculeJson() {
      // console.log(this.mySketcher);
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
      // alert(molFile);
      // console.log("===molFile", molFile);
    },
    /*=================generate3D==============*/
    generate3D() {
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
          this.$store.commit("setMol2", data.data);
          this.$store.commit("setOriginMol2", data.data);
          this.$refs["moleculeUltimate"].init(data.data, true);

          // 这里重置下charge的options
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
    // 获取水模型力场列表
    getWaterModelForcesOptions() {
      return new Promise((resolve, reject) => {
        request
          .get(api.supportedWatermodels, {})
          .then((data) => {
            this.$store.commit("setWaterModelForces", data.data);
            this.$store.commit("setWaterModel", data.data[0]);
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
      const dropList = document.getElementById("dropList");
      console.log("dropList", dropList.children);
      const arr = Array.from(dropList.children).map((i) => i.innerText);
      if (arr.length === 0) {
        this.$message.error("请至少选择一个力场");
        return;
      }
      this.$store.commit("setForces", arr);

      Spin.show();
      request
        .get(
          api.tip4pwatermodels,
          {},
          { loading: false, mock: false, error: true }
        )
        .then((data) => {
          console.log("====四点水模型");
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
                // 水模型新的mol2拿到
                this.$store.commit("setMol2", data.data);
                Spin.show();
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
    /**
     * 上传mol2文本后更新3D显示
     * @param {} content
     */
    updateUploadedMol2(content) {
      // console.log("first content", content);
      this.$refs["moleculeUltimate"].init(content, true);

      const options =
        this.$refs["moleculeUltimate"].getChargeOptionsByContent(content);
      this.$store.commit("setChargeOptions", options);
      this.$store.commit("setCharge", options[1]);
    },

    gofu1() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.page_mol {
  width: 100%;
  box-sizing: border-box;
  // padding-top: 75px;

  .page_mol-content {
    width: 1550px;
    margin: 0 auto;
    margin-top: 22px;

    display: flex;
    height: 735px;

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
