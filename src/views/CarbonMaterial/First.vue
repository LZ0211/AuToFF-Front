<template>
  <div class="page_mol">
    <step-title
      title="创建分子结构"
      :showUpload="false"
      @update="update3D"
    ></step-title>

    <div class="page_mol-content">
      <div class="page_mol-content-left">
        <div class="page_mol-content-left-top">
          <div
            class="page_mol-content-left-top-nav"
            :style="{
              'border-right': '1px solid #d8d8d8',
              color: activeNav === 1 ? '#0A55FF' : '#3D3D3D',
            }"
            @click="activeNav = 1"
          >
            富勒烯
          </div>
          <div
            class="page_mol-content-left-top-nav"
            :style="{
              'border-right': '1px solid #d8d8d8',
              color: activeNav === 2 ? '#0A55FF' : '#3D3D3D',
            }"
            @click="activeNav = 2"
          >
            石墨烯
          </div>
          <div
            class="page_mol-content-left-top-nav"
            :style="{
              'border-right': '1px solid #d8d8d8',
              color: activeNav === 3 ? '#0A55FF' : '#3D3D3D',
            }"
            @click="activeNav = 3"
          >
            单壁碳纳米管
          </div>
          <div
            class="page_mol-content-left-top-nav"
            :style="{
              color: activeNav === 4 ? '#0A55FF' : '#3D3D3D',
            }"
            @click="activeNav = 4"
          >
            多壁碳纳米管
          </div>
        </div>

        <div class="page_mol-content-left-content">
          <div class="page_mol-content-left-content-container">
            <div
              style="
                height: 520px;
                width: 100%;
                overflow-x: hidden;
                overflow-y: auto;
              "
              v-if="activeNav === 1"
            >
              <div
                style="
                  padding: 10px;
                  font-size: 15px;
                  font-weight: bold;
                  padding-top: 0;
                "
              >
                原子数目/分子点群/序号
              </div>
              <div style="padding: 10px; font-size: 13px; padding-top: 0">
                从下方目录中选取材料，请选取最深层次节点，当前选取节点为：{{
                  currNodeIds.length > 0 ? `${currNodeIds.join("/")}` : "--"
                }}
              </div>
              <el-tree
                ref="treeDom"
                :highlight-current="true"
                class="tree"
                :data="cascaderOptions"
                :props="treeProps"
                :default-expand-all="false"
                node-key="id"
                @node-click="handleNodeClick"
              ></el-tree>
            </div>

            <el-form v-if="activeNav === 2" ref="form2" label-width="100px">
              <el-form-item label="X">
                <div style="display: flex">
                  <el-input-number
                    style="margin-left: auto; width: 200px"
                    v-model="form2.x"
                    :min="1"
                    :max="20"
                    :step="1"
                  ></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="Y">
                <div style="display: flex">
                  <el-input-number
                    style="margin-left: auto; width: 200px"
                    v-model="form2.y"
                    :min="1"
                    :max="20"
                    :step="1"
                  ></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="碳碳键长">
                <div style="display: flex">
                  <el-input-number
                    style="margin-left: auto; width: 200px"
                    v-model="form2.Rcc"
                    :precision="2"
                    :step="0.01"
                  ></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="边缘饱和氢">
                <div style="display: flex; align-items: center; height: 40px">
                  <el-switch
                    style="margin-left: auto; width: 130px"
                    v-model="form2.terminal_H"
                    active-color="#0A55FF"
                    active-text="TRUE"
                    inactive-text="FALSE"
                  >
                  </el-switch>
                </div>
              </el-form-item>
            </el-form>

            <el-form v-if="activeNav === 3" ref="form3" label-width="100px">
              <el-form-item label="类别">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    height: 40px;
                    flex-flow: row-reverse;
                  "
                >
                  <el-radio-group v-model="form3.type" size="medium">
                    <el-radio-button label="锯齿式"></el-radio-button>
                    <el-radio-button label="椅式"></el-radio-button>
                  </el-radio-group>
                </div>
              </el-form-item>
              <el-form-item label="纳米管管径">
                <div style="display: flex">
                  <el-input-number
                    style="margin-left: auto; width: 200px"
                    v-model="form3.circle"
                    :min="1"
                    :max="20"
                    :step="1"
                  ></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="纳米管长度">
                <div style="display: flex">
                  <el-input-number
                    style="margin-left: auto; width: 200px"
                    v-model="form3.period"
                    :min="1"
                    :max="10"
                    :step="1"
                  ></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="碳碳键长">
                <div style="display: flex">
                  <el-input-number
                    style="margin-left: auto; width: 200px"
                    v-model="form3.Rcc"
                    :precision="2"
                    :step="0.01"
                  ></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="边缘饱和氢">
                <div style="display: flex; align-items: center; height: 40px">
                  <el-switch
                    style="margin-left: auto; width: 130px"
                    v-model="form3.terminal_H"
                    active-color="#0A55FF"
                    active-text="TRUE"
                    inactive-text="FALSE"
                  >
                  </el-switch>
                </div>
              </el-form-item>
            </el-form>
            <el-form v-if="activeNav === 4" ref="form3" label-width="100px">
              <el-form-item label="类别">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    height: 40px;
                    flex-flow: row-reverse;
                  "
                >
                  <el-radio-group v-model="form4.type" size="medium">
                    <el-radio-button label="锯齿式"></el-radio-button>
                    <el-radio-button label="椅式"></el-radio-button>
                  </el-radio-group>
                </div>
              </el-form-item>
              <el-form-item label="纳米管管径">
                <div style="display: flex">
                  <el-input-number
                    style="margin-left: auto; width: 200px"
                    v-model="form4.circle"
                    :min="1"
                    :max="20"
                    :step="1"
                  ></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="纳米管长度">
                <div style="display: flex">
                  <el-input-number
                    style="margin-left: auto; width: 200px"
                    v-model="form4.period"
                    :min="1"
                    :max="10"
                    :step="1"
                  ></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="碳碳键长">
                <div style="display: flex">
                  <el-input-number
                    style="margin-left: auto; width: 200px"
                    v-model="form4.Rcc"
                    :precision="2"
                    :step="0.01"
                  ></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="碳纳米管层数">
                <div style="display: flex">
                  <el-input-number
                    style="margin-left: auto; width: 200px"
                    v-model="form4.walls"
                    :min="1"
                    :max="3"
                    :step="1"
                  ></el-input-number>
                </div>
              </el-form-item>
              <el-form-item label="边缘饱和氢">
                <div style="display: flex; align-items: center; height: 40px">
                  <el-switch
                    style="margin-left: auto; width: 130px"
                    v-model="form4.terminal_H"
                    active-color="#0A55FF"
                    active-text="TRUE"
                    inactive-text="FALSE"
                  >
                  </el-switch>
                </div>
              </el-form-item>
            </el-form>
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
import StepTitle from "@/components/atom/StepTitle.vue";
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
      treeData: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      treeProps: {
        children: "children",
        label: "label",
      },
      currNodeKey: "",
      currNodeIds: [],
      cascaderValue: [],
      cascaderOptions: [
        {
          value: 20,
          label: 20,
          children: [
            {
              value: "Ih",
              label: "Ih",
            },
          ],
        },
        {
          value: 24,
          label: 24,
          children: [
            {
              value: "D6d",
              label: "D6d",
            },
          ],
        },
        {
          value: 26,
          label: 26,
          children: [
            {
              value: "D3h",
              label: "D3h",
            },
          ],
        },
        {
          value: 28,
          label: 28,
          children: [
            {
              value: "D2",
              label: "D2",
            },
            {
              value: "Td",
              label: "Td",
            },
          ],
        },
        {
          value: 30,
          label: 30,
          children: [
            {
              value: "C1",
              label: "C1",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
                {
                  value: 3,
                  label: 3,
                },
              ],
            },
          ],
        },
        {
          value: 32,
          label: 32,
          children: [
            {
              value: "C2",
              label: "C2",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
              ],
            },
            {
              value: "D2",
              label: "D2",
            },
            {
              value: "D3",
              label: "D3",
            },
            {
              value: "D3d",
              label: "D3d",
            },
            {
              value: "D3h",
              label: "D3h",
            },
          ],
        },
        {
          value: 34,
          label: 34,
          children: [
            {
              value: "C2",
              label: "C2",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
                {
                  value: 3,
                  label: 3,
                },
              ],
            },
            {
              value: "C3v",
              label: "C3v",
            },
            {
              value: "Cs",
              label: "Cs",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
              ],
            },
          ],
        },
        {
          value: 36,
          label: 36,
          children: [
            {
              value: "C1",
              label: "C1",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
              ],
            },
            {
              value: "C2v",
              label: "C2v",
            },
            {
              value: "C2",
              label: "C2",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
                {
                  value: 3,
                  label: 3,
                },
                {
                  value: 4,
                  label: 4,
                },
              ],
            },
            {
              value: "Cs",
              label: "Cs",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
              ],
            },
            {
              value: "D2d",
              label: "D2d",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
              ],
            },
            {
              value: "D2",
              label: "D2",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
              ],
            },
            {
              value: "D3h",
              label: "D3h",
            },
            {
              value: "D6h",
              label: "D6h",
            },
          ],
        },
        {
          value: 38,
          label: 38,
          children: [
            {
              value: "C1",
              label: "C1",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
                {
                  value: 3,
                  label: 3,
                },
                {
                  value: 4,
                  label: 4,
                },
                {
                  value: 5,
                  label: 5,
                },
                {
                  value: 6,
                  label: 6,
                },
                {
                  value: 7,
                  label: 7,
                },
              ],
            },
            {
              value: "C2v",
              label: "C2v",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
              ],
            },
            {
              value: "C2",
              label: "C2",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
                {
                  value: 3,
                  label: 3,
                },
                {
                  value: 4,
                  label: 4,
                },
                {
                  value: 5,
                  label: 5,
                },
              ],
            },
            {
              value: "C3v",
              label: "C3v",
            },
            {
              value: "D3",
              label: "D3",
            },
            {
              value: "D3h",
              label: "D3h",
            },
          ],
        },
        {
          value: 40,
          label: 40,
          children: [
            {
              value: "C1",
              label: "C1",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
                {
                  value: 3,
                  label: 3,
                },
                {
                  value: 4,
                  label: 4,
                },
                {
                  value: 5,
                  label: 5,
                },
                {
                  value: 6,
                  label: 6,
                },
                {
                  value: 7,
                  label: 7,
                },
                {
                  value: 8,
                  label: 8,
                },
              ],
            },
            {
              value: "C2v",
              label: "C2v",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
              ],
            },
            {
              value: "C2",
              label: "C2",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
                {
                  value: 3,
                  label: 3,
                },
                {
                  value: 4,
                  label: 4,
                },
                {
                  value: 5,
                  label: 5,
                },
                {
                  value: 6,
                  label: 6,
                },
                {
                  value: 7,
                  label: 7,
                },
                {
                  value: 8,
                  label: 8,
                },
                {
                  value: 9,
                  label: 9,
                },
                {
                  value: 10,
                  label: 10,
                },
                {
                  value: 11,
                  label: 11,
                },
                {
                  value: 12,
                  label: 12,
                },
                {
                  value: 13,
                  label: 13,
                },
                {
                  value: 14,
                  label: 14,
                },
              ],
            },
            {
              value: "C3",
              label: "C3",
            },
            {
              value: "C3v",
              label: "C3v",
            },
            {
              value: "Cs",
              label: "Cs",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
                {
                  value: 3,
                  label: 3,
                },
                {
                  value: 4,
                  label: 4,
                },
                {
                  value: 5,
                  label: 5,
                },
                {
                  value: 6,
                  label: 6,
                },
                {
                  value: 7,
                  label: 7,
                },
              ],
            },
            {
              value: "D2h",
              label: "D2h",
            },
            {
              value: "D2",
              label: "D2",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
                {
                  value: 3,
                  label: 3,
                },
              ],
            },
            {
              value: "D5d",
              label: "D5d",
              children: [
                {
                  value: 1,
                  label: 1,
                },
                {
                  value: 2,
                  label: 2,
                },
              ],
            },
            {
              value: "Td",
              label: "Td",
            },
          ],
        },
        {
          value: 42,
          label: 42,
          children: [
            {
              value: "C1",
              label: "C1",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
                { label: 23, value: 23 },
              ],
            },
            {
              value: "C2v",
              label: "C2v",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
              ],
            },
            {
              value: "C2",
              label: "C2",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
              ],
            },
            {
              value: "Cs",
              label: "Cs",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
              ],
            },
            {
              value: "D3",
              label: "D3",
              children: [],
            },
          ],
        },
        {
          value: 44,
          label: 44,
          children: [
            {
              value: "C1",
              label: "C1",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
                { label: 23, value: 23 },
                { label: 24, value: 24 },
                { label: 25, value: 25 },
                { label: 26, value: 26 },
                { label: 27, value: 27 },
                { label: 28, value: 28 },
                { label: 29, value: 29 },
                { label: 30, value: 30 },
                { label: 31, value: 31 },
                { label: 32, value: 32 },
                { label: 33, value: 33 },
                { label: 34, value: 34 },
                { label: 35, value: 35 },
                { label: 36, value: 36 },
                { label: 37, value: 37 },
                { label: 38, value: 38 },
                { label: 39, value: 39 },
                { label: 40, value: 40 },
                { label: 41, value: 41 },
                { label: 42, value: 42 },
              ],
            },
            {
              value: "C2v",
              label: "C2v",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
              ],
            },
            {
              value: "C2",
              label: "C2",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
              ],
            },
            {
              value: "Cs",
              label: "Cs",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
              ],
            },
            {
              value: "D2",
              label: "D2",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
              ],
            },
            {
              value: "D3d",
              label: "D3d",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
              ],
            },
            {
              value: "D3h",
              label: "D3h",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
              ],
            },
            {
              value: "D3",
              label: "D3",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
              ],
            },
            {
              value: "S4",
              label: "S4",
            },
            {
              value: "T",
              label: "T",
            },
          ],
        },
        {
          value: 46,
          label: 46,
          children: [
            {
              value: "C1",
              label: "C1",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
                { label: 23, value: 23 },
                { label: 24, value: 24 },
                { label: 25, value: 25 },
                { label: 26, value: 26 },
                { label: 27, value: 27 },
                { label: 28, value: 28 },
                { label: 29, value: 29 },
                { label: 30, value: 30 },
                { label: 31, value: 31 },
                { label: 32, value: 32 },
                { label: 33, value: 33 },
                { label: 34, value: 34 },
                { label: 35, value: 35 },
                { label: 36, value: 36 },
                { label: 37, value: 37 },
                { label: 38, value: 38 },
                { label: 39, value: 39 },
                { label: 40, value: 40 },
                { label: 41, value: 41 },
                { label: 42, value: 42 },
                { label: 43, value: 43 },
                { label: 44, value: 44 },
                { label: 45, value: 45 },
                { label: 46, value: 46 },
                { label: 47, value: 47 },
                { label: 48, value: 48 },
                { label: 49, value: 49 },
                { label: 50, value: 50 },
                { label: 51, value: 51 },
                { label: 52, value: 52 },
                { label: 53, value: 53 },
                { label: 54, value: 54 },
                { label: 55, value: 55 },
                { label: 56, value: 56 },
                { label: 57, value: 57 },
                { label: 58, value: 58 },
                { label: 59, value: 59 },
                { label: 60, value: 60 },
                { label: 61, value: 61 },
                { label: 62, value: 62 },
                { label: 63, value: 63 },
                { label: 64, value: 64 },
                { label: 65, value: 65 },
                { label: 66, value: 66 },
                { label: 67, value: 67 },
                { label: 68, value: 68 },
                { label: 69, value: 69 },
              ],
            },
            {
              value: "C2v",
              label: "C2v",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
              ],
            },
            {
              value: "C2",
              label: "C2",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
              ],
            },
            {
              value: "C3",
              label: "C3",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
              ],
            },
            {
              value: "Cs",
              label: "Cs",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
              ],
            },
          ],
        },
        {
          value: 48,
          label: 48,
          children: [
            {
              value: "C1",
              label: "C1",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
                { label: 23, value: 23 },
                { label: 24, value: 24 },
                { label: 25, value: 25 },
                { label: 26, value: 26 },
                { label: 27, value: 27 },
                { label: 28, value: 28 },
                { label: 29, value: 29 },
                { label: 30, value: 30 },
                { label: 31, value: 31 },
                { label: 32, value: 32 },
                { label: 33, value: 33 },
                { label: 34, value: 34 },
                { label: 35, value: 35 },
                { label: 36, value: 36 },
                { label: 37, value: 37 },
                { label: 38, value: 38 },
                { label: 39, value: 39 },
                { label: 40, value: 40 },
                { label: 41, value: 41 },
                { label: 42, value: 42 },
                { label: 43, value: 43 },
                { label: 44, value: 44 },
                { label: 45, value: 45 },
                { label: 46, value: 46 },
                { label: 47, value: 47 },
                { label: 48, value: 48 },
                { label: 49, value: 49 },
                { label: 50, value: 50 },
                { label: 51, value: 51 },
                { label: 52, value: 52 },
                { label: 53, value: 53 },
                { label: 54, value: 54 },
                { label: 55, value: 55 },
                { label: 56, value: 56 },
                { label: 57, value: 57 },
                { label: 58, value: 58 },
                { label: 59, value: 59 },
                { label: 60, value: 60 },
                { label: 61, value: 61 },
                { label: 62, value: 62 },
                { label: 63, value: 63 },
                { label: 64, value: 64 },
                { label: 65, value: 65 },
                { label: 66, value: 66 },
                { label: 67, value: 67 },
                { label: 68, value: 68 },
                { label: 69, value: 69 },
              ],
            },
            {
              value: "C2h",
              label: "C2h",
            },
            {
              value: "C2v",
              label: "C2v",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
              ],
            },
            {
              value: "C2",
              label: "C2",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
                { label: 23, value: 23 },
                { label: 24, value: 24 },
                { label: 25, value: 25 },
                { label: 26, value: 26 },
                { label: 27, value: 27 },
                { label: 28, value: 28 },
                { label: 29, value: 29 },
                { label: 30, value: 30 },
                { label: 31, value: 31 },
                { label: 32, value: 32 },
                { label: 33, value: 33 },
                { label: 34, value: 34 },
                { label: 35, value: 35 },
                { label: 36, value: 36 },
                { label: 37, value: 37 },
                { label: 38, value: 38 },
                { label: 39, value: 39 },
                { label: 40, value: 40 },
                { label: 41, value: 41 },
                { label: 42, value: 42 },
                { label: 43, value: 43 },
                { label: 44, value: 44 },
                { label: 45, value: 45 },
                { label: 46, value: 46 },
                { label: 47, value: 47 },
                { label: 48, value: 48 },
                { label: 49, value: 49 },
                { label: 50, value: 50 },
                { label: 51, value: 51 },
                { label: 52, value: 52 },
              ],
            },
            {
              value: "Cs",
              label: "Cs",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
              ],
            },
            {
              value: "D2h",
              label: "D2h",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
              ],
            },
            {
              value: "D2",
              label: "D2",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
              ],
            },
            {
              value: "D3",
              label: "D3",
            },
            {
              value: "D6d",
              label: "D6d",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
              ],
            },
          ],
        },
        {
          value: 50,
          label: 50,
          children: [
            {
              value: "C1",
              label: "C1",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
                { label: 23, value: 23 },
                { label: 24, value: 24 },
                { label: 25, value: 25 },
                { label: 26, value: 26 },
                { label: 27, value: 27 },
                { label: 28, value: 28 },
                { label: 29, value: 29 },
                { label: 30, value: 30 },
                { label: 31, value: 31 },
                { label: 32, value: 32 },
                { label: 33, value: 33 },
                { label: 34, value: 34 },
                { label: 35, value: 35 },
                { label: 36, value: 36 },
                { label: 37, value: 37 },
                { label: 38, value: 38 },
                { label: 39, value: 39 },
                { label: 40, value: 40 },
                { label: 41, value: 41 },
                { label: 42, value: 42 },
                { label: 43, value: 43 },
                { label: 44, value: 44 },
                { label: 45, value: 45 },
                { label: 46, value: 46 },
                { label: 47, value: 47 },
                { label: 48, value: 48 },
                { label: 49, value: 49 },
                { label: 50, value: 50 },
                { label: 51, value: 51 },
                { label: 52, value: 52 },
                { label: 53, value: 53 },
                { label: 54, value: 54 },
                { label: 55, value: 55 },
                { label: 56, value: 56 },
                { label: 57, value: 57 },
                { label: 58, value: 58 },
                { label: 59, value: 59 },
                { label: 60, value: 60 },
                { label: 61, value: 61 },
                { label: 62, value: 62 },
                { label: 63, value: 63 },
                { label: 64, value: 64 },
                { label: 65, value: 65 },
                { label: 66, value: 66 },
                { label: 67, value: 67 },
                { label: 68, value: 68 },
                { label: 69, value: 69 },
              ],
            },
            {
              value: "C2v",
              label: "C2v",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
              ],
            },
            {
              value: "C2",
              label: "C2",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
                { label: 23, value: 23 },
                { label: 24, value: 24 },
                { label: 25, value: 25 },
                { label: 26, value: 26 },
                { label: 27, value: 27 },
                { label: 28, value: 28 },
                { label: 29, value: 29 },
                { label: 30, value: 30 },
                { label: 31, value: 31 },
                { label: 32, value: 32 },
                { label: 33, value: 33 },
                { label: 34, value: 34 },
                { label: 35, value: 35 },
                { label: 36, value: 36 },
                { label: 37, value: 37 },
              ],
            },
            {
              value: "C3v",
              label: "C3v",
            },
            {
              value: "C3",
              label: "C3",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
              ],
            },
            {
              value: "Cs",
              label: "Cs",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
                { label: 23, value: 23 },
                { label: 24, value: 24 },
                { label: 25, value: 25 },
              ],
            },
            {
              value: "D3h",
              label: "D3h",
            },
            {
              value: "D3",
              label: "D3",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
              ],
            },
            {
              value: "D5h",
              label: "D5h",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
              ],
            },
          ],
        },
        {
          value: 52,
          label: 52,
          children: [
            {
              value: "C1",
              label: "C1",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
                { label: 23, value: 23 },
                { label: 24, value: 24 },
                { label: 25, value: 25 },
                { label: 26, value: 26 },
                { label: 27, value: 27 },
                { label: 28, value: 28 },
                { label: 29, value: 29 },
                { label: 30, value: 30 },
                { label: 31, value: 31 },
                { label: 32, value: 32 },
                { label: 33, value: 33 },
                { label: 34, value: 34 },
                { label: 35, value: 35 },
                { label: 36, value: 36 },
                { label: 37, value: 37 },
                { label: 38, value: 38 },
                { label: 39, value: 39 },
                { label: 40, value: 40 },
                { label: 41, value: 41 },
                { label: 42, value: 42 },
                { label: 43, value: 43 },
                { label: 44, value: 44 },
                { label: 45, value: 45 },
                { label: 46, value: 46 },
                { label: 47, value: 47 },
                { label: 48, value: 48 },
                { label: 49, value: 49 },
                { label: 50, value: 50 },
                { label: 51, value: 51 },
                { label: 52, value: 52 },
                { label: 53, value: 53 },
                { label: 54, value: 54 },
                { label: 55, value: 55 },
                { label: 56, value: 56 },
                { label: 57, value: 57 },
                { label: 58, value: 58 },
                { label: 59, value: 59 },
                { label: 60, value: 60 },
                { label: 61, value: 61 },
                { label: 62, value: 62 },
                { label: 63, value: 63 },
                { label: 64, value: 64 },
                { label: 65, value: 65 },
                { label: 66, value: 66 },
                { label: 67, value: 67 },
                { label: 68, value: 68 },
                { label: 69, value: 69 },
              ],
            },
            {
              value: "C2h",
              label: "C2h",
            },
            {
              value: "C2v",
              label: "C2v",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
              ],
            },
            {
              value: "C2",
              label: "C2",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
                { label: 23, value: 23 },
                { label: 24, value: 24 },
                { label: 25, value: 25 },
                { label: 26, value: 26 },
                { label: 27, value: 27 },
                { label: 28, value: 28 },
                { label: 29, value: 29 },
                { label: 30, value: 30 },
                { label: 31, value: 31 },
                { label: 32, value: 32 },
                { label: 33, value: 33 },
                { label: 34, value: 34 },
                { label: 35, value: 35 },
                { label: 36, value: 36 },
                { label: 37, value: 37 },
                { label: 38, value: 38 },
                { label: 39, value: 39 },
                { label: 40, value: 40 },
                { label: 41, value: 41 },
                { label: 42, value: 42 },
                { label: 43, value: 43 },
                { label: 44, value: 44 },
                { label: 45, value: 45 },
                { label: 46, value: 46 },
                { label: 47, value: 47 },
                { label: 48, value: 48 },
                { label: 49, value: 49 },
                { label: 50, value: 50 },
                { label: 51, value: 51 },
                { label: 52, value: 52 },
                { label: 53, value: 53 },
                { label: 54, value: 54 },
                { label: 55, value: 55 },
                { label: 56, value: 56 },
                { label: 57, value: 57 },
                { label: 58, value: 58 },
                { label: 59, value: 59 },
                { label: 60, value: 60 },
                { label: 61, value: 61 },
                { label: 62, value: 62 },
                { label: 63, value: 63 },
                { label: 64, value: 64 },
                { label: 65, value: 65 },
                { label: 66, value: 66 },
                { label: 67, value: 67 },
                { label: 68, value: 68 },
                { label: 69, value: 69 },
                { label: 70, value: 70 },
                { label: 71, value: 71 },
                { label: 72, value: 72 },
                { label: 73, value: 73 },
                { label: 74, value: 74 },
                { label: 75, value: 75 },
                { label: 76, value: 72 },
                { label: 77, value: 77 },
                { label: 78, value: 78 },
              ],
            },
            {
              value: "C3v",
              label: "C3v",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
              ],
            },
            {
              value: "C3",
              label: "C3",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
              ],
            },
            {
              value: "Cs",
              label: "Cs",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
                { label: 10, value: 10 },
                { label: 11, value: 11 },
                { label: 12, value: 12 },
                { label: 13, value: 13 },
                { label: 14, value: 14 },
                { label: 15, value: 15 },
                { label: 16, value: 16 },
                { label: 17, value: 17 },
                { label: 18, value: 18 },
                { label: 19, value: 19 },
                { label: 20, value: 20 },
                { label: 21, value: 21 },
                { label: 22, value: 22 },
                { label: 23, value: 23 },
                { label: 24, value: 24 },
                { label: 25, value: 25 },
                { label: 26, value: 26 },
              ],
            },
            {
              value: "D2d",
              label: "D2d",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
              ],
            },
            {
              value: "D2h",
              label: "D2h",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
              ],
            },
            {
              value: "D2",
              label: "D2",
              children: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
                { label: 8, value: 8 },
                { label: 9, value: 9 },
              ],
            },
            {
              value: "T",
              label: "T",
            },
          ],
        },
        {
          value: 60,
          label: 60,
          children: [{ label: "Ih", value: "Ih" }],
        },
        {
          value: 70,
          label: 70,
          children: [{ label: "D5h", value: "D5h" }],
        },
        {
          value: 72,
          label: 72,
          children: [{ label: "D6d", value: "D6d" }],
        },
        {
          value: 74,
          label: 74,
          children: [{ label: "D3h", value: "D3h" }],
        },
        {
          value: 76,
          label: 76,
          children: [
            { label: "D2", value: "D2" },
            { label: "Td", value: "Td" },
          ],
        },
        {
          value: 180,
          label: 180,
        },
        {
          value: 240,
          label: 240,
        },
        {
          value: 260,
          label: 260,
        },
        {
          value: 320,
          label: 320,
        },
        {
          value: 500,
          label: 500,
        },
        {
          value: 540,
          label: 540,
        },
        {
          value: 720,
          label: 720,
        },
      ],
      form2: {
        x: 1,
        y: 1,
        Rcc: 1.42,
        terminal_H: false,
      },
      form3: {
        type: "椅式",
        circle: 6,
        period: 2,
        Rcc: 1.42,
        terminal_H: false,
      },
      form4: {
        type: "椅式",
        circle: 6,
        period: 2,
        Rcc: 1.42,
        walls: 1,
        terminal_H: false,
      },
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
    StepTitle,
    MyDrag,
    FormatDownload,
  },
  created() {
    this.dirKeys = [];
    this.dirData = Object.keys(this.dirOriginData);
  },
  mounted() {
    this.getForcesOptions();
  },
  methods: {
    // 点击树形节点
    handleNodeClick(obj, node, nodeComp) {
      // console.log("-----------this is obj", obj);
      console.log("-----------this is node", node);
      // console.log("-----------this is nodeComp", nodeComp);
      // this.currNodeId = node.id;
      if (node.isLeaf) {
        let curr = node;
        this.currNodeIds = [];
        this.currNodeIds.push(curr.data.value);
        while (curr.parent) {
          curr = curr.parent;
          this.currNodeIds.push(curr.data.value);
        }
        this.currNodeIds.reverse();
        this.currNodeIds = this.currNodeIds.filter((i) => Boolean(i));
        console.log("this.currNodeIds", this.currNodeIds);
      } else {
        // this.$message.warning("注意：当前选中的节点不是最深层次节点");
        this.currNodeIds = [];
      }
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
      // alert(molFile);
      console.log("===molFile", molFile);
    },

    // 获取mol2文本
    getMol2() {
      let reqParams = {};
      switch (this.activeNav) {
        case 1:
          if (this.currNodeIds.length === 0) {
            this.$message.error("未选择节点或选择的节点不是最深层次节点");
            return;
          }

          let str = `C`;
          if (this.currNodeIds.length === 1) {
            str = `C${this.currNodeIds[0]}`;
          } else if (this.currNodeIds.length === 2) {
            str = `C${this.currNodeIds[0]}-${this.currNodeIds[1]}`;
          } else {
            str = `C${this.currNodeIds[0]}-${this.currNodeIds[1]}_${this.currNodeIds[2]}`;
          }
          request.get(`${api.fullerene}/${str}`).then((res = {}) => {
            if (res) {
              console.log("resmol2", res);
              this.$store.commit("setMol2", res.data);
              this.$store.commit("setOriginMol2", res.data);
              this.$refs["moleculeUltimate"].init(res.data, true);
            }
          });
          break;
        case 2:
          reqParams = {
            ...this.form2,
          };
          request.postJson(api.graphene_square, reqParams).then((res) => {
            if (res) {
              console.log(
                "----------------------石墨烯返回结果-----------------"
              );
              console.log("resmol2", res);
              this.$store.commit("setMol2", res.data);
              this.$store.commit("setOriginMol2", res.data);
              this.$refs["moleculeUltimate"].init(res.data, true);
            }
          });
          break;
        case 3:
          reqParams = {
            ...this.form3,
          };
          const url1 =
            this.form3.type === "椅式"
              ? api.armchair_nanocube_single_wall
              : api.zigzag_nanocube_single_wall;
          request
            .postJson(url1, {
              circle: this.form3.circle,
              period: this.form3.period,
              Rcc: this.form3.Rcc,
              terminal_H: this.form3.terminal_H,
            })
            .then((res) => {
              if (res) {
                console.log("resmol2", res);
                this.$store.commit("setMol2", res.data);
                this.$store.commit("setOriginMol2", res.data);
                this.$refs["moleculeUltimate"].init(res.data, true);
              }
            });
          break;
        case 4:
          reqParams = {
            ...this.form4,
          };
          const url2 =
            this.form4.type === "椅式"
              ? api.armchair_nanocube_multi_walls
              : api.zigzag_nanocube_multi_walls;
          request
            .postJson(url2, {
              circle: this.form4.circle,
              period: this.form4.period,
              Rcc: this.form4.Rcc,
              walls: this.form4.walls,
              terminal_H: this.form4.terminal_H,
            })
            .then((res) => {
              if (res) {
                console.log("resmol2", res);
                this.$store.commit("setMol2", res.data);
                this.$store.commit("setOriginMol2", res.data);
                this.$refs["moleculeUltimate"].init(res.data, true);
              }
            });
          break;
      }
    },

    // 点击某个文件夹或文件
    clickItem(name) {
      if (this.dirKeys.length === 0) {
        // 第一层跳到第二层，点击某个文件夹
        this.dirData = Object.keys(this.dirOriginData[name]);
        this.dirKeys.push(name);
      } else if (this.dirKeys.length === 1) {
        // 第二层跳到第三层，点击某个文件夹
        this.dirData = [...this.dirOriginData[this.dirKeys[0]][name]];
        this.dirKeys.push(name);
      }
    },

    // 返回上一级
    backLevel() {
      if (this.dirKeys.length === 2) {
        // 第三层回退到第二层
        this.dirKeys.pop();
        this.dirData = Object.keys(this.dirOriginData[this.dirKeys[0]]);
      } else if (this.dirKeys.length === 1) {
        // 第二层回退到第一层
        this.dirKeys.pop();
        this.dirData = Object.keys(this.dirOriginData);
      }
    },
    update3D(content) {
      this.$refs["moleculeUltimate"].init(content, true);
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
    getForcesOptions() {
      return new Promise((resolve, reject) => {
        request
          .get(api.carbonForce, {})
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
          padding: 2px 40px;
          cursor: pointer;
        }
      }

      .page_mol-content-left-content {
        height: 621px;
        border-radius: 6px;
        opacity: 1;

        background: #ffffff;

        box-sizing: border-box;
        border: 1px solid #efefef;

        margin-top: 7px;
        padding: 11px 10px;
        display: flex;
        flex-flow: column;

        .page_mol-content-left-content-container {
          flex: 1;
          padding: 20px 30px;

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
