<template>
  <div class="page_mol">
    <step-crystal-title
      title="选取晶体文件"
      :showUpload="true"
      @update="updateUploadedMol2"
    ></step-crystal-title>

    <div class="page_mol-content">
      <div class="page_mol-content-left">
        <div class="page_mol-content-left-content">
          <div class="page_mol-content-left-content-container">
            <!-- 树形文件夹 -->
            <div>
              <div v-if="dirKeys.length > 0" class="page_mol-content-top-btn">
                <div @click="clickBack" class="page_mol-content-top-btn-left">
                  返回上一级
                </div>
                <div class="page_mol-content-top-btn-right">
                  Tips: 选中.cif文件，生成结构视图
                </div>
              </div>
              <div v-if="dirData.length > 0">
                <div class="page_mol-content-left-content-container-wrapper">
                  <div
                    @dblclick="dbclickDirectory(name)"
                    @click="clickItem(name)"
                    v-for="(name, index) in dirData"
                    :key="index"
                    class="page_mol-content-left-content-container-item"
                    :style="{
                      'background-color':
                        currDir === name ? '#e8e8e8' : '#FFFFFF',
                    }"
                  >
                    <i
                      v-if="name.includes('.cif')"
                      class="el-icon-document"
                      style="font-size: 46px"
                    ></i>
                    <img
                      v-else
                      src="@/assets/icon/carbon/dir.svg"
                      width="125px"
                      height="100px"
                      alt=""
                    />
                    <!-- </el-tooltip> -->

                    <div class="page_mol-content-left-text-bottom" :alt="name">
                      {{ name || "--" }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <el-empty description="空空如也"></el-empty>
              </div>
            </div>
          </div>

          <div
            style="display: flex; align-items: center; justify-content: center"
            class="page_mol-content-left-btn"
            @click="generate"
          >
            <div style="font-size: 12px; margin-right: 3px">生成3d结构视图</div>
            <img src="@/assets/icon/atom/3.png" alt="" />
          </div>
        </div>
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

        <div class="page_mol-content-right-btns" v-if="mol2">
          <div class="page_mol_middle_btns">
            <div v-if="forceOptions.length > 0">
              <span style="color: #222222; font-size: 14px">选择力场：</span>
              <el-select
                size="small"
                @change="onForceChange"
                :value="force"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in forceOptions"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
            <div style="margin-left: auto">
              <!-- <a-button
                  @click="downloadMol2"
                >
                  下载mol2
                </a-button> -->
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

import fileDownload from "js-file-download";

import api from "@/api2";
import request from "@/api2/request";

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
      currForce: "",

      activeNav: 2, // 1,2,3,4
      // 文件夹目录
      dirOriginData: {
        20: { Ih: [] },
        24: { D6d: [] },
        26: { D3h: [] },
        28: { D2: [], Td: [] },
        30: { C1: [1, 2, 3] },
        32: { C2: [1, 2], D2: [], D3: [], D3d: [], D3h: [] },
        34: { C2: [1, 2, 3], C3v: [], Cs: [1, 2] },
        36: {
          C1: [1, 2],
          C2v: [],
          C2: [1, 2, 3, 4],
          Cs: [1, 2],
          D2d: [1, 2],
          D2: [1, 2],
          D3h: [],
          D6h: [],
        },
        38: {
          C1: [1, 2, 3, 4, 5, 6, 7],
          C2v: [1, 2],
          C2: [1, 2, 3, 4, 5],
          C3v: [],
          D3: [],
          D3h: [],
        },
        40: {
          C1: [1, 2, 3, 4, 5, 6, 7, 8],
          C2v: [1, 2],
          C2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          C3: [],
          C3v: [],
          Cs: [1, 2, 3, 4, 5, 6, 7],
          D2h: [],
          D2: [1, 2, 3],
          D5d: [1, 2],
          Td: [],
        },
        42: {
          C1: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23,
          ],
          C2v: [1, 2, 3, 4],
          C2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          Cs: [1, 2, 3, 4, 5, 6],
          D3: [],
        },
        44: {
          C1: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42,
          ],
          C2v: [1, 2, 3],
          C2: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22,
          ],
          Cs: [1, 2, 3, 4, 5, 6, 7],
          D2: [1, 2, 3, 4, 5, 6],
          D3d: [1, 2, 3],
          D3h: [1, 2],
          D3: [1, 2],
          S4: [],
          T: [],
        },
        46: {
          C1: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
            54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
          ],
          C2v: [1, 2, 3, 4],
          C2: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22,
          ],
          C3: [1, 2],
          Cs: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          ],
        },
        48: {
          C1: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
            54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
            71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87,
            88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
            104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
            117,
          ],
          C2h: [],
          C2v: [1, 2, 3],
          C2: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
          ],
          Cs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          D2h: [1, 2],
          D2: [1, 2, 3, 4, 5],
          D3: [],
          D6d: [1, 2],
        },
        50: {
          C1: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
            54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
            71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87,
            88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
            104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
            117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129,
            130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
            143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
            156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168,
            169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181,
            182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194,
            195,
          ],
          C2v: [1, 2, 3, 4, 5, 6],
          C2: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37,
          ],
          C3v: [],
          C3: [1, 2],
          Cs: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25,
          ],
          D3h: [],
          D3: [1, 2],
          D5h: [1, 2],
        },
        52: {
          C1: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
            54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
            71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87,
            88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
            104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
            117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129,
            130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
            143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
            156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168,
            169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181,
            182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194,
            195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207,
            208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220,
            221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233,
            234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246,
            247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259,
            260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272,
            273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285,
            286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298,
            299, 300, 301, 302, 303, 304, 305, 306, 307,
          ],
          C2h: [],
          C2v: [1, 2, 3],
          C2: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
            54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
            71, 72, 73, 74, 75, 76, 77, 78,
          ],
          C3v: [1, 2],
          C3: [1, 2, 3],
          Cs: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26,
          ],
          D2d: [1, 2, 3, 4, 5],
          D2h: [1, 2],
          D2: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          T: [],
        },
        60: { Ih: [] },
        70: { D5h: [] },
        72: { D6d: [] },
        74: { D3h: [] },
        76: { D2: [], Td: [] },
        180: {},
        240: {},
        260: {},
        320: {},
        500: {},
        540: {},
        720: {},
      },
      dirKeys: [], // 记录当前树的路径
      dirData: [],
      currDir: "",
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
  },
  created() {
    this.getCurrentFileList().then((res) => {
      this.dirKeys = [];
      this.dirData = [...res];
    });
  },
  mounted() {
    this.getForcesOptions();
  },
  methods: {
    /**
     * 获取力场备选项
     */
    getForcesOptions() {
      return new Promise((resolve, reject) => {
        request
          .get(api.inorganicForcefield, {})
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
    /**
     * 力场切换更改回调
     * @param {*} val
     */
    onForceChange(val) {
      this.$store.commit("setForce", val);
    },

    /**
     * 点击文件夹
     */
    dbclickDirectory(name) {
      // 判断要打开的是不是非文件夹，非文件夹不执行操作
      if (name.includes(`.cif`)) {
        return false;
      }
      this.dirKeys.push(name);
      const path = `${this.dirKeys.join("/")}`;
      this.getCurrentFileList(path).then((res) => {
        this.dirData = [...res];
      });
    },
    // 选中
    clickItem(name) {
      this.currDir = name;
    },
    /**
     * 点击回到上一级
     */
    clickBack() {
      this.dirKeys.pop();
      const path = `${this.dirKeys.join("/")}`;
      this.getCurrentFileList(path).then((res) => {
        this.dirData = [...res];
      });
    },
    /**
     * 请求当前目录列表
     */
    getCurrentFileList(path) {
      const url = `${api.mineralsDatabase}/` + (path ? path : "");
      return new Promise((resolve, reject) => {
        request.get(url).then((res) => {
          if (res) {
            resolve(res.data);
          }
        });
      });
    },

    /**
     * 根据选项拿到mol2文本，生成3D结构
     */
    generate() {
      // 如果选中的不是cif文件，return
      if (!this.currDir || !this.currDir.includes(`.cif`)) {
        this.$message.warning("没有选中的cif文件");
        return;
      }

      const path = `${this.dirKeys.join("/")}`;
      let url = `${api.mineralsDatabase}`;
      if (path) {
        url = url + `/${path}`;
      }
      if (this.currDir) {
        url = url + `/${this.currDir}`;
      }

      request
        .get(`${url}`, {}, { loading: false, mock: false, error: true })
        .then((res = {}) => {
          if (res) {
            setTimeout(() => {
              Spin.show();
            }, 0);
            request
              .postJson(api.cif2mol2, {
                data: res.data,
              })
              .then((res1) => {
                this.$store.commit("setMol2", res1.data);
                this.$store.commit("setOriginMol2", res1.data);

                Spin.hide();
                this.$refs["moleculeUltimate"].init(res1.data, true);
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {});
          }
        });
    },
    /**
     * 上传mol2文本后更新3D显示
     * @param {} content
     */
    updateUploadedMol2(content) {
      this.$refs["moleculeUltimate"].init(content, true);
    },
    /**
     * 前往第二步
     */
    goSecond() {
      Spin.show();
      this.$store.commit("setActiveIndex", this.activeIndex + 1);
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

  .page_mol-content {
    width: 1550px;
    margin: 0 auto;
    margin-top: 22px;

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
          padding: 2px 44px;
          cursor: pointer;
        }
      }

      .page_mol-content-left-content {
        height: 670px;
        border-radius: 6px;
        opacity: 1;

        background: #ffffff;

        box-sizing: border-box;
        border: 1px solid #efefef;

        // margin-top: 7px;
        padding: 11px 10px;
        display: flex;
        flex-flow: column;

        .page_mol-content-left-content-container {
          flex: 1;
          padding: 20px 30px;

          .page_mol-content-top-btn {
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;

            .page_mol-content-top-btn-left {
              cursor: pointer;

              &:hover {
                opacity: 0.7;
              }
            }

            .page_mol-content-top-btn-right {
              font-size: 12px;
            }
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
            padding: 4px;

            // &:hover {
            //   background-color: #f7f8fa;
            // }

            .page_mol-content-left-text-bottom {
              margin: 5px 0;
              font-size: 12px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 120px;
            }
          }

          .page_mol-content-left-content-container-wrapper {
            width: 100%;
            height: 540px;
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
