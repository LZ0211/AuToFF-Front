<template>
  <div
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative',
    }"
  >
    <div
      @mousewheel.prevent="handleScroll"
      id="drawer"
      :style="{
        width: `${width}px`,
        height: `${height}px`,
        background: '#000000',
      }"
    ></div>
    <div
      v-if="tips"
      style="position: absolute; left: 14px; top: 14px; color: #ffffff"
    >
      TIPS：{{ tips }}
    </div>
    <div
      style="
        position: absolute;
        right: 0;
        top: 0;
        width: 167px;
        height: 80px;
        border-radius: 6px;
        background: #333333;
        padding: 18px;
      "
    >
      <div
        style="
          height: 12px;
          font-size: 12px;
          line-height: 12px;
          display: flex;
          justify-content: space-between;
          color: #ffffff;
        "
      >
        <div>放大/缩小</div>
        <div style="opacity: 0.5">滑动滚轮</div>
      </div>
      <div
        style="
          height: 12px;
          font-size: 12px;
          line-height: 12px;
          display: flex;
          justify-content: space-between;
          color: #ffffff;
          margin-top: 18px;
        "
      >
        <div>沿中心轴旋转</div>
        <div style="opacity: 0.5">拖动光标</div>
      </div>
    </div>
    <div
      style="
        position: absolute;
        right: 5px;
        bottom: 5px;
        background-color: #ffffff;
        border-radius: 3px;
        padding: 0 8px;
        height: 36px;
        display: inline-flex;
        align-items: center;
      "
      v-if="showElementLabel && elementsArray && elementsArray.length > 0"
    >
      <span style="color: #222222"> 包含元素 </span>
      <span
        :style="{
          'border-radius': '6px',
          opacity: 1,
          background: item.color,
          'box-shadow': '0px 1px 3px 0px rgba(0, 0, 0, 0.1)',
          padding: '3px 10px',
          color: '#ffffff',
          'margin-left': '9px',
        }"
        v-for="(item, index) in elementsArray"
        :key="index"
      >
        {{ item.val }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import { ElementAtom, readCIF } from "@/libs/parser.js";
import { classify, convertUnitcell } from "@/libs/utils";
import { parseMOL2File } from "@/libs/parseText";

import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// outline
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

// Line
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

// label
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

let renderer = null;
let container = null;
let camera = null;
let scene = null;
let light1 = null;
let controls = null;

let composer, effectFXAA, outlinePass;
let selectedObjects = [];
let labelRenderer = null;

// 优化FPS
let clock = new THREE.Clock();
let FPS = 30;
let renderT = 1 / FPS; // 单位秒，间隔多长时间渲染一次
let timeS = 0;

export default {
  name: "Demo1",
  props: {
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: 600,
    },
    needExtra: {
      type: Boolean,
      default: true,
    },
    defaultLayer: {
      type: Number,
      default: 0,
    },
    tips: {
      type: String,
      default: "",
    },
    // 线段展示
    isLine: {
      type: Boolean,
      default: false,
    },
    // 是否添加可选中遮罩outline
    hasOutline: {
      type: Boolean,
      default: true,
    },
    // 是否显示元素标识
    showElementLabel: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      cif: this.cifContent,

      pause: false,
      publicPath: process.env.BASE_URL,
      atomsChecked: true,
      bondsChecked: true,
      linesChecked: true,
      hasBond: false,
      backColorsArray: [{ color: "#ffffff" }, { color: "#000000" }],
      moleculeBackColor: "#ffffff",
      viewType: "2", // view type
      elementsArray: [], // elements
      angle: 10,

      maxSideLength: 0,
      unitCell: null, // 晶胞参数
      root: null, // 模型组
      bondsGroup: null,
      linesGroup: null,
      atomsGroup: null,
      insetGroup: null, // inset

      // label group
      atomLabelsGroup: null,
      idLabelsGroup: null,
      chargeLabelsGroup: null,

      offset: null,
      rotateActiveId: "-1",

      getImageData: true,
      fileInputElement: null,

      // upload
      headers: {
        authorization: "authorization-text",
      },
      fileList: [],

      // 记录一下id和label等信息
      atomsInfo: [],
      bondsInfo: [],

      // 如果是晶体的话可能需要扩展的atoms和bonds, 不是晶体的话忽略即可
      extraAtoms: [],
      extraBonds: [],

      // 射线和鼠标
      activedObjects: [],
      raycaster: null,
      mouse: null,
    };
  },
  computed: {
    ...mapState(["mol2", "chargeResult"]),
  },
  components: {},
  watch: {},
  created() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  },
  mounted() {
    if (this.mol2) {
      this.init(this.mol2, true);
    }
  },
  beforeDestroy() {
    this.clearAll();
  },
  methods: {
    /*===========防止默认行为===========*/
    handleMouseMove(e) {
      e.preventDefault();
    },
    handleScroll() {},

    /*===========建模过程===========*/
    initGUI() {
      // init gui
      const params = {
        edgeStrength: 4,
        edgeGlow: 0.0,
        edgeThickness: 1.0,
        pulsePeriod: 0,
        rotate: false,
        usePatternTexture: false,
      };
      const gui = new GUI({ width: 280 });
      gui.add(params, "edgeStrength", 0.01, 10).onChange(function (value) {
        outlinePass.edgeStrength = Number(value);
      });
      gui.add(params, "edgeGlow", 0.0, 1).onChange(function (value) {
        outlinePass.edgeGlow = Number(value);
      });
      gui.add(params, "edgeThickness", 1, 4).onChange(function (value) {
        outlinePass.edgeThickness = Number(value);
      });
      gui.add(params, "pulsePeriod", 0.0, 5).onChange(function (value) {
        outlinePass.pulsePeriod = Number(value);
      });
      gui.add(params, "rotate");
      gui.add(params, "usePatternTexture").onChange(function (value) {
        outlinePass.usePatternTexture = value;
      });
      function Configuration() {
        this.visibleEdgeColor = "#ffffff";
        this.hiddenEdgeColor = "#190a05";
      }
      const conf = new Configuration();
      gui.addColor(conf, "visibleEdgeColor").onChange(function (value) {
        outlinePass.visibleEdgeColor.set(value);
      });
      gui.addColor(conf, "hiddenEdgeColor").onChange(function (value) {
        outlinePass.hiddenEdgeColor.set(value);
      });
    },
    /**
     * 建模入口
     * @param {*} content
     * @param {*} isMol2
     */
    init(content, isMol2 = false) {
      // console.log("当前的mol2文本", content);
      // init gui
      // this.initGUI();
      container = document.getElementById("drawer");
      scene = new THREE.Scene();

      let atoms, bonds, cell;
      if (isMol2) {
        const m = parseMOL2File(content);
        // 记录下atoms
        this.$store.commit("setAtoms", m.atoms);
        this.extraAtoms = m.extraAtoms;
        this.extraBonds = m.extraBonds;
        atoms = m.atoms;
        bonds = m.bonds;
        cell = m.cell;
      } else {
        atoms = content.atoms;
        bonds = content.bonds;
        cell = content.cell;
      }

      // 判断是不是晶体，保存在store中
      this.$store.commit(
        "setIsCrystalMaterial",
        cell.length > 0 ? true : false
      );

      this.initRoot(atoms, bonds, cell);
      this.switchLabel(this.defaultLayer); // 根据props切换不同的标签显示
      scene.add(this.root);

      this.addLight();
      this.addCamera();
      // const axesHelper = new THREE.AxesHelper(5);
      // scene.add(axesHelper);
      this.initRender(this.width, this.height);

      if (this.hasOutline) {
        this.initOutline();
      }

      this.render();
    },
    // 根据content判断charge的options
    getChargeOptionsByContent(content) {
      const m = parseMOL2File(content);
      const elements = ElementAtom();
      let mAtoms = [...m.atoms];

      // 判断应该是哪种options
      let num = 0;
      let options = [];
      mAtoms.forEach((item) => {
        num += elements[item.label].atomicNumber;
      });
      options = num % 2 === 0 ? [-2, 0, 2] : [-1, 1];

      return options;
      // 排查了半天，原来是这里进行了setCharge。
      // this.$store.commit("setChargeOptions", options);
      // this.$store.commit("setCharge", options[1]);
    },
    // 判断am1bcc是否显示
    judgeElements(elements, mAtoms) {
      // 判断应该是哪种options
      let num = 0;
      let options = [];
      mAtoms.forEach((item) => {
        num += elements[item.label].atomicNumber;
      });
      options = num % 2 === 0 ? [-2, 0, 2] : [-1, 1];

      // 排查了半天，原来是这里进行了setCharge。
      // this.$store.commit("setChargeOptions", options);
      // this.$store.commit("setCharge", options[1]);

      const am1bccElements = [
        "H",
        "Li",
        "Be",
        "C",
        "N",
        "O",
        "F",
        "Na",
        "Mg",
        "Al",
        "Si",
        "P",
        "S",
        "Cl",
        "K",
        "Ca",
        "Zn",
        "Ga",
        "Ge",
        "As",
        "Se",
        "Br",
        "Rb",
        "Sr",
        "Mo",
        "Cd",
        "In",
        "Sn",
        "Sb",
        "Te",
        "I",
        "Cs",
        "Ba",
        "Hg",
        "Tl",
        "Pb",
        "Bi",
      ];
      const mmff94Elements = [
        "H",
        "C",
        "N",
        "O",
        "F",
        "Si",
        "P",
        "S",
        "Cl",
        "Br",
        "I",
      ];
      const AIElements = ["H", "C", "N", "O", "F", "Cl", "S"];
      let chargeTypeOptions = ["XTB-RESP", "cm5", "1.2xcm5", "qeq", "--"];

      if (mAtoms.map((i) => i.label).every((i) => AIElements.includes(i))) {
        let arr = ["GNN-RESP", "am1bcc", "mmff94"];
        chargeTypeOptions = arr.concat(chargeTypeOptions);
      } else if (
        mAtoms.map((i) => i.label).every((i) => mmff94Elements.includes(i))
      ) {
        let arr = ["mmff94"];
        chargeTypeOptions = arr.concat(chargeTypeOptions);
      } else if (
        mAtoms.map((i) => i.label).every((i) => am1bccElements.includes(i))
      ) {
        let arr = ["am1bcc"];
        chargeTypeOptions = arr.concat(chargeTypeOptions);
      }

      // 这里对polymers聚合物进行单独处理
      if (this.$route.path.includes("polymer")) {
        // console.log("this.$route.path", this.$route.path);
        let polymersChargeTypeOptions = [
          "XTB-RESP",
          "cm5",
          "cm5x",
          "qeq",
          "--",
        ];
        if (chargeTypeOptions.includes("am1bcc")) {
          polymersChargeTypeOptions.unshift("am1bcc");
        }
        if (chargeTypeOptions.includes("mmff94")) {
          polymersChargeTypeOptions.unshift("mmff94");
        }
        if (chargeTypeOptions.includes("GNN-RESP")) {
          polymersChargeTypeOptions.unshift("GNN-RESP");
        }
        this.$store.commit("setChargeTypeOptions", polymersChargeTypeOptions);
        this.$store.commit("setChargeType", "--");
        return;
      }

      // 这里对mof-cof进行单独处理
      if (this.$route.path.includes("mof-cof")) {
        // let mofChargeTypeOptions = ["AI", "--"];
        let mofChargeTypeOptions = ["mof-GMP-qeq", "mof-MEPO-qeq", "ffp4mof", "pacmof", "--"];
        this.$store.commit("setChargeTypeOptions", mofChargeTypeOptions);
        this.$store.commit("setChargeType", "--");
        return;
      }

      if (mAtoms.length > 250) {
        let finalChargeTypeOptions = [];
        let externals = ["cm5", "1.2xcm5", "cm1a", "1.14xcm1a", "resp"];
        chargeTypeOptions.forEach((item, index) => {
          if (!externals.includes(item)) {
            finalChargeTypeOptions.push(item);
          }
        });
        this.$store.commit("setChargeTypeOptions", finalChargeTypeOptions);
      } else {
        this.$store.commit("setChargeTypeOptions", chargeTypeOptions);
      }
      this.$store.commit("setChargeType", "--");
    },
    /**
     * 建模过程
     * @param {*} atoms
     * @param {*} bonds
     * @param {*} cell
     */
    initRoot(atoms, bonds, cell) {
      const elements = ElementAtom();
      let mAtoms = [...atoms];
      let mBonds = [...bonds];

      // 获取到包含的元素
      this.getInnerElements(mAtoms, elements);

      // 判断是否显示charge options
      this.judgeElements(elements, mAtoms);

      // atoms group
      this.root = new THREE.Group();
      const atomsGroup = new THREE.Group();
      atomsGroup.name = "atoms";

      this.atomLabelsGroup = new THREE.Group();
      this.atomLabelsGroup.name = "atomLabels";

      this.idLabelsGroup = new THREE.Group();
      this.idLabelsGroup.name = "idLabels";

      this.chargeLabelsGroup = new THREE.Group();
      this.chargeLabelsGroup.name = "chargeLabels";

      // atoms bonds segments
      let widthSegments = 8;
      let heightSegments = 8;
      let bondCircleSegments = 8;
      let bondHeightSegments = 8;

      // 根据原子数，指定精度
      if (mAtoms.length > 300) {
        widthSegments = 2;
        heightSegments = 2;
        bondCircleSegments = 2;
        bondHeightSegments = 2;
      } else if (mAtoms.length > 200) {
        widthSegments = 4;
        heightSegments = 4;
        bondCircleSegments = 4;
        bondHeightSegments = 4;
      } else if (mAtoms.length > 100) {
        widthSegments = 6;
        heightSegments = 6;
        bondCircleSegments = 6;
        bondHeightSegments = 6;
      } else if (mAtoms.length > 50) {
        widthSegments = 8;
        heightSegments = 8;
        bondCircleSegments = 8;
        bondHeightSegments = 8;
      } else {
        widthSegments = 16;
        heightSegments = 16;
        bondCircleSegments = 16;
        bondHeightSegments = 16;
      }

      // 判断需不需要晶格外的原子和键
      let innerAtomLen = mAtoms.length;
      if (this.needExtra) {
        mAtoms = mAtoms.concat(this.extraAtoms);
        mBonds = [...mBonds, ...this.extraBonds];
      }

      // 添加原子
      const pointsForLine = [];
      // create mesh add to atomsGroup
      for (let i = 0; i < mAtoms.length; i++) {
        let atom = mAtoms[i];
        const atomColor = elements[atom.label].jmolColor;
        const position = new THREE.Vector3();
        position.x = atom.x;
        position.y = atom.y;
        position.z = atom.z;

        if (!this.isLine) {
          const material = new THREE.MeshPhongMaterial({
            color: atomColor,
            specular: 0x111111,
            shininess: 1000,
            wireframe: false,
          });
          const atomRadius = elements[atom.label].vdWRadius * 0.2; // 原子半径
          // console.log("===atomRadius,currLabelAtoms[0].label", atomRadius);
          const sphereGeometry = new THREE.SphereGeometry(
            atomRadius,
            widthSegments,
            heightSegments
          ); // atom radius
          const sphereMesh = new THREE.Mesh(sphereGeometry, material);
          sphereMesh.name = atom.id; // atom里的id用来给mesh记录在name里面。
          sphereMesh.position.copy(position);
          sphereMesh.updateMatrix();
          atomsGroup.add(sphereMesh);
          if (i < innerAtomLen) {
            this.atomsInfo.push({ id: sphereMesh.uuid, label: atom.label });
          }
        } else {
          pointsForLine.push(position);
        }

        // 记录一下内部的原子，内部的是可以点击高亮的。
        if (i < innerAtomLen) {
          // atom label
          const atomLabelObject = this.createLabelObject(
            position,
            atom.label,
            1
          );
          this.atomLabelsGroup.add(atomLabelObject);

          // id label
          const idLabelText = (i + 1).toString();
          // console.log("-------------------------idLabelText", idLabelText);
          const idLabelObject = this.createLabelObject(
            position,
            idLabelText,
            2
          );
          this.idLabelsGroup.add(idLabelObject);

          // charge label
          const chargeLabelText =
            this.chargeResult && this.chargeResult[i] !== undefined
              ? Number(this.chargeResult[i]["charge"]).toFixed(2).toString()
              : "--";
          const chargeLabelObject = this.createLabelObject(
            position,
            chargeLabelText,
            3
          );
          this.chargeLabelsGroup.add(chargeLabelObject);
        }
      }

      if (this.isLine) {
        this.calcOffset(pointsForLine);
      } else {
        this.calcOffset(atomsGroup);
      }
      this.atomsGroup = atomsGroup;

      this.atomsGroup.translateX(this.offset.x);
      this.atomsGroup.translateY(this.offset.y);
      this.atomsGroup.translateZ(this.offset.z);

      this.atomLabelsGroup.translateX(this.offset.x);
      this.atomLabelsGroup.translateY(this.offset.y);
      this.atomLabelsGroup.translateZ(this.offset.z);
      this.idLabelsGroup.translateX(this.offset.x);
      this.idLabelsGroup.translateY(this.offset.y);
      this.idLabelsGroup.translateZ(this.offset.z);
      this.chargeLabelsGroup.translateX(this.offset.x);
      this.chargeLabelsGroup.translateY(this.offset.y);
      this.chargeLabelsGroup.translateZ(this.offset.z);

      // 添加成键
      if (this.isLine) {
        this.addLineBonds(
          mAtoms,
          mBonds,
          bondCircleSegments,
          bondHeightSegments,
          elements
        );
      } else {
        this.root.add(atomsGroup); // 非line下添加球体
        this.addBonds(
          mAtoms,
          mBonds,
          bondCircleSegments,
          bondHeightSegments,
          elements
        );
      }

      // 添加标签
      this.root.add(this.atomLabelsGroup);
      this.root.add(this.idLabelsGroup);
      this.root.add(this.chargeLabelsGroup);

      // 添加晶格
      this.addCell(cell);
    },
    // 计算偏移量
    calcOffset(group) {
      // make root center
      this.offset = new THREE.Vector3();
      let aabb = this.isLine
        ? new THREE.Box3().setFromPoints(group)
        : new THREE.Box3().setFromObject(group);
      // get container box diagonal length
      const boxSize = new THREE.Vector3();
      aabb.getSize(boxSize);
      this.maxSideLength = Math.max(boxSize.x, boxSize.y, boxSize.z);
      aabb.getCenter(this.offset).multiplyScalar(-1);
    },
    // 光照
    addLight() {
      light1 = new THREE.DirectionalLight(0xffffff, 0.3);
      light1.position.set(0, 0, 10);
      scene.add(light1);
      const light = new THREE.AmbientLight(0xffffff, 0.4); // soft white light
      scene.add(light);
    },
    // 相机
    addCamera() {
      const width = this.width;
      const height = this.height;
      const k = width / height; // 窗口宽高比
      const s = 1.0 * this.maxSideLength; // 三维场景显示范围控制系数，系数越大，显示的范围越大，针对OrthographicCamera可调节大小
      camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 0, 10000);
      camera.position.set(0, 0, 1000);
      camera.lookAt(scene.position); // 设置相机方向指向的场景对象
    },
    // 柱体成键
    addBonds(mAtoms, mBonds, bondCircleSegments, bondHeightSegments, elements) {
      // generate bonds
      const bondsGroup = new THREE.Group();
      bondsGroup.name = "bonds";
      const start = new THREE.Vector3();
      const end = new THREE.Vector3();
      let dir = new THREE.Vector3();

      // create mesh add to bondsGroup
      for (let i = 0; i < mBonds.length; i += 1) {
        let sIndex = Number(mBonds[i].s);
        let eIndex = Number(mBonds[i].e);
        let sAtom = mAtoms[sIndex - 1];
        let eAtom = mAtoms[eIndex - 1];

        start.x = Number(sAtom.x);
        start.y = Number(sAtom.y);
        start.z = Number(sAtom.z);
        end.x = Number(eAtom.x);
        end.y = Number(eAtom.y);
        end.z = Number(eAtom.z);

        const l = start.distanceTo(end);

        // const bondRadius =
        //   Math.min(
        //     elements[sAtom.label].atomicRadius,
        //     elements[eAtom.label].atomicRadius
        //   ) / 6;
        const bondRadius = 0.11;
        const { sBond, eBond } = this.calcBondProportion(
          sAtom,
          eAtom,
          bondRadius,
          elements,
          l
        );
        let bondStartGeometry = new THREE.CylinderGeometry(
          bondRadius,
          bondRadius,
          sBond,
          bondCircleSegments,
          bondHeightSegments
        );
        let bondStartMaterial = new THREE.MeshPhongMaterial({
          color: elements[sAtom.label].jmolColor,
          specular: 0x111111,
          shininess: 0,
          wireframe: false,
        });
        let startMesh = new THREE.Mesh(bondStartGeometry, bondStartMaterial);

        startMesh.position.copy(start);
        startMesh.position.lerp(end, sBond / l / 2);
        dir.subVectors(end, start).normalize();
        startMesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );
        startMesh.updateMatrix();
        // end mesh
        let bondEndGeometry = new THREE.CylinderGeometry(
          bondRadius,
          bondRadius,
          l - sBond,
          bondCircleSegments,
          bondHeightSegments
        );
        let bondEndMaterial = new THREE.MeshPhongMaterial({
          color: elements[eAtom.label].jmolColor,
          specular: 0x111111,
          shininess: 0,
          wireframe: false,
        });
        let endMesh = new THREE.Mesh(bondEndGeometry, bondEndMaterial);
        endMesh.position.copy(start);
        endMesh.position.lerp(end, ((l - sBond) * 0.5 + sBond) / l); // Linearly interpolate between this vector and v, 0 will be this vector, and alpha = 1 will be v.
        dir.subVectors(end, start).normalize();
        endMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        endMesh.updateMatrix();

        //合并两个mesh为一个
        let bufferGeometry1 = startMesh.geometry
          .clone()
          .applyMatrix4(startMesh.matrix);
        let bufferGeometry2 = endMesh.geometry
          .clone()
          .applyMatrix4(endMesh.matrix);
        const mergedGeometries = mergeBufferGeometries(
          [bufferGeometry1, bufferGeometry2],
          true
        );
        const finalMesh = new THREE.Mesh(mergedGeometries, [
          bondStartMaterial,
          bondEndMaterial,
        ]);

        this.bondsInfo.push({ id: finalMesh.uuid });
        // bondsGroup.add(startMesh);
        // bondsGroup.add(endMesh);
        bondsGroup.add(finalMesh);
      }

      bondsGroup.translateX(this.offset.x);
      bondsGroup.translateY(this.offset.y);
      bondsGroup.translateZ(this.offset.z);
      this.bondsGroup = bondsGroup;
      this.root.add(bondsGroup);
    },
    // 线段成键
    addLineBonds(
      mAtoms,
      mBonds,
      bondCircleSegments,
      bondHeightSegments,
      elements
    ) {
      // console.log("=====================>mAtoms", mAtoms);
      // console.log("=====================>mBonds", mBonds);

      // generate bonds
      const bondsGroup = new THREE.Group();
      bondsGroup.name = "bonds";
      const start = new THREE.Vector3();
      const end = new THREE.Vector3();
      let dir = new THREE.Vector3();

      // 线段，不带颜色的
      // const points = [];
      // console.log("points", points);

      // for (let i = 0; i < mBonds.length; i += 1) {
      //   let sIndex = Number(mBonds[i].s);
      //   let sAtom = mAtoms[sIndex - 1];
      //   let eIndex = Number(mBonds[i].e);
      //   let eAtom = mAtoms[eIndex - 1];

      //   start.x = Number(sAtom.x);
      //   start.y = Number(sAtom.y);
      //   start.z = Number(sAtom.z);

      //   end.x = Number(eAtom.x);
      //   end.y = Number(eAtom.y);
      //   end.z = Number(eAtom.z);

      //   points.push(start.clone());
      //   points.push(end.clone());
      // }

      // let lineMaterial = new THREE.LineBasicMaterial({
      //   color: 0xffffff,
      // });
      // const geometry = new THREE.BufferGeometry();
      // geometry.setFromPoints(points);
      // const bondLines = new THREE.LineSegments(geometry, lineMaterial);
      // bondsGroup.add(bondLines);

      // 王博让改成带颜色的
      const colorsLine = {};

      // create mesh add to bondsGroup
      console.log("mBonds.length", mBonds.length);
      for (let i = 0; i < mBonds.length; i += 1) {
        let sIndex = Number(mBonds[i].s);
        let sAtom = mAtoms[sIndex - 1];
        let eIndex = Number(mBonds[i].e);
        let eAtom = mAtoms[eIndex - 1];

        start.x = Number(sAtom.x);
        start.y = Number(sAtom.y);
        start.z = Number(sAtom.z);

        end.x = Number(eAtom.x);
        end.y = Number(eAtom.y);
        end.z = Number(eAtom.z);

        let midPoint = new THREE.Vector3(
          (end.x + start.x) / 2,
          (end.y + start.y) / 2,
          (end.z + start.z) / 2
        );

        if (colorsLine[sAtom.label]) {
          colorsLine[sAtom.label].push(
            new THREE.Vector3(start.x, start.y, start.z)
          );
          colorsLine[sAtom.label].push(midPoint);
        } else {
          colorsLine[sAtom.label] = [
            new THREE.Vector3(start.x, start.y, start.z),
            midPoint,
          ];
        }

        if (colorsLine[eAtom.label]) {
          colorsLine[eAtom.label].push(new THREE.Vector3(end.x, end.y, end.z));
          colorsLine[eAtom.label].push(midPoint);
        } else {
          colorsLine[eAtom.label] = [
            new THREE.Vector3(end.x, end.y, end.z),
            midPoint,
          ];
        }
        // elements[sAtom.label].jmolColor
      }

      Object.keys(colorsLine).forEach((k, i) => {
        console.log(elements[k].jmolColor);
        let lineMaterial = new THREE.LineBasicMaterial({
          color: elements[k].jmolColor,
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints(colorsLine[k]);
        const bondLines = new THREE.LineSegments(geometry, lineMaterial);
        bondsGroup.add(bondLines);
      });

      console.log("colorsLine", colorsLine);

      bondsGroup.translateX(this.offset.x);
      bondsGroup.translateY(this.offset.y);
      bondsGroup.translateZ(this.offset.z);
      this.bondsGroup = bondsGroup;
      this.root.add(bondsGroup);
    },
    // 添加line2 bonds
    addLine2Bonds(
      mAtoms,
      mBonds,
      bondCircleSegments,
      bondHeightSegments,
      elements
    ) {
      // generate bonds
      const bondsGroup = new THREE.Group();
      bondsGroup.name = "bonds";
      const start = new THREE.Vector3();
      const end = new THREE.Vector3();
      let dir = new THREE.Vector3();

      let positions = [];
      let colors = [];

      // 创建材质
      const material = new LineMaterial({
        linewidth: 1,
        vertexColors: true,
        resolution: new THREE.Vector2(900, 670),
      });

      // create mesh add to bondsGroup
      for (let i = 0; i < mBonds.length; i += 1) {
        let sIndex = Number(mBonds[i].s);
        let eIndex = Number(mBonds[i].e);
        let sAtom = mAtoms[sIndex - 1];
        let eAtom = mAtoms[eIndex - 1];

        start.x = Number(sAtom.x);
        start.y = Number(sAtom.y);
        start.z = Number(sAtom.z);
        end.x = Number(eAtom.x);
        end.y = Number(eAtom.y);
        end.z = Number(eAtom.z);

        positions = [start.x, start.y, start.z, end.x, end.y, end.z];
        colors = [1, 0, 0, 1, 0, 0];

        const geometry = new LineGeometry();
        geometry.setPositions(positions); // 设置顶点颜色
        geometry.setColors(colors);

        const line = new Line2(geometry, material);
        line.computeLineDistances();

        bondsGroup.add(line);

        // points.push(start.clone());
        // points.push(end.clone());
      }

      // this.root.add(line);

      // bondsGroup.add(bondLine);

      bondsGroup.translateX(this.offset.x);
      bondsGroup.translateY(this.offset.y);
      bondsGroup.translateZ(this.offset.z);
      this.bondsGroup = bondsGroup;
      this.root.add(bondsGroup);
    },
    // 网格
    addCell(cell) {
      // 判断有没有晶格，有就加入模型
      if (cell && cell.length > 0) {
        // add cell line to scene
        const linesGroup = new THREE.Group();
        linesGroup.name = "lines";
        // 将晶胞通过bufferGeometry变成一个Mesh
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x2c3c54,
          linewidth: 5.0,
          linecap: "round", // ignored by WebGLRenderer
          linejoin: "round", // ignored by WebGLRenderer
        });
        const { positionData, indexData, unitCellParameters } =
          convertUnitcell(cell);
        this.unitCell = { ...unitCellParameters };
        const vertices = new Float32Array(positionData);
        const arr = [];
        for (let i = 0; i < indexData.length; i += 2) {
          let curr = [indexData[i], indexData[i + 1]];
          arr.push(curr);
        }
        // three for one
        const vectorArray = [];
        for (let i = 0; i < vertices.length; i += 3) {
          vectorArray.push(
            new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2])
          );
        }
        // 4. 设置材质分辨率
        // lineMaterial.resolution.set(window.innerWidth, window.innerHeight);
        let backColor = "#000000";
        if (backColor && backColor === "#000000") {
          lineMaterial.setValues({
            color: 0xffffff,
          });
        } else if (backColor && backColor === "#ffffff") {
          lineMaterial.setValues({
            color: 0x000000,
          });
        } else {
          lineMaterial.setValues({
            color: 0x2c3c54,
          });
        }
        for (let i = 0; i < arr.length; i++) {
          // geometry.vertices.push(vectorArray[arr[i][0]]);
          // geometry.vertices.push(vectorArray[arr[i][1]]);
          const geometry = new THREE.BufferGeometry().setFromPoints([
            vectorArray[arr[i][0]],
            vectorArray[arr[i][1]],
          ]);
          // geometry.colors.push(0xffffff, 0xffffff);
          const line = new THREE.Line(geometry, lineMaterial);
          linesGroup.add(line);
        }

        linesGroup.translateX(this.offset.x);
        linesGroup.translateY(this.offset.y);
        linesGroup.translateZ(this.offset.z);

        this.root.add(linesGroup);
      }
    },
    // 添加标签
    createLabelObject(position, text, layer) {
      const textObject = document.createElement("div");
      textObject.className = "label";
      textObject.style.color = "rgb(" + "255" + "," + "255" + "," + "255" + ")";
      textObject.textContent = text;
      const idLabelObject = new CSS2DObject(textObject);
      idLabelObject.layers.set(layer);
      idLabelObject.position.copy(position);
      return idLabelObject;
    },
    // 初始化render
    initRender(width, height) {
      if (!renderer) {
        renderer = new THREE.WebGLRenderer({
          // alpha: true,
          antialias: true,
          // preserveDrawingBuffer: true,
        });
      }
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height); // 设置渲染区域尺寸
      renderer.setClearColor(0x000000, 1); // 设置背景颜色
      container.appendChild(renderer.domElement); // body元素中插入canvas对象

      // this.raycaster
      renderer.domElement.addEventListener("pointerdown", this.onPointerDown);
      labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(width, height);
      labelRenderer.domElement.style.position = "absolute";
      labelRenderer.domElement.style.top = "0px";
      labelRenderer.domElement.style.pointerEvents = "none";
      container.appendChild(labelRenderer.domElement);

      controls = new TrackballControls(camera, renderer.domElement);
      // controls.minDistance = 100;
      // controls.maxDistance = 200;
      controls.rotateSpeed = 5.0;
      controls.zoomSpeed = 1.0;
      controls.noPan = true;
      // controls.panSpeed = 8.0;
      // controls.keys = ["KeyA", "KeyS", "KeyD"];
      controls.addEventListener("change", this.changeControls, false);
    },
    // 备份渲染
    renderBak() {
      // if (this.pause) {
      //   return;
      // }
      requestAnimationFrame(this.render); // 请求再次执行渲染函数render

      let T = clock.getDelta(); // 获得两针的时间间隔
      timeS = timeS + T;

      if (timeS > renderT) {
        // 渲染renderer
        renderer.render(scene, camera); // 执行渲染操作
        labelRenderer.render(scene, camera);
        // if (this.getImageData == true) {
        //   this.imgData = renderer.domElement.toDataURL("image/jpeg", 1.0);
        //   this.getImageData = false;
        // }
        // update controls
        controls.update();
        this.hasOutline && composer.render();
        if (camera.zoom >= 8) {
          camera.zoom = 8;
        }
        if (camera.zoom <= 0.125) {
          camera.zoom = 0.125;
        }
        timeS = 0;
      }
    },
    // 渲染函数
    render() {
      requestAnimationFrame(this.render); // 请求再次执行渲染函数render

      // 渲染renderer
      renderer.render(scene, camera); // 执行渲染操作
      labelRenderer.render(scene, camera);
      // if (this.getImageData == true) {
      //   this.imgData = renderer.domElement.toDataURL("image/jpeg", 1.0);
      //   this.getImageData = false;
      // }
      // update controls
      controls.update();
      this.hasOutline && composer.render();
      if (camera.zoom >= 8) {
        camera.zoom = 8;
      }
      if (camera.zoom <= 0.125) {
        camera.zoom = 0.125;
      }
    },
    // 切换到某个layser label的显示
    switchLabel(layer) {
      this.atomLabelsGroup.children.forEach((item) => item.layers.set(1));
      this.idLabelsGroup.children.forEach((item) => item.layers.set(2));
      this.chargeLabelsGroup.children.forEach((item) => item.layers.set(3));
      if (layer === 1) {
        this.atomLabelsGroup.children.forEach((item) => item.layers.set(0));
      } else if (layer === 2) {
        this.idLabelsGroup.children.forEach((item) => item.layers.set(0));
      } else if (layer === 3) {
        this.chargeLabelsGroup.children.forEach((item) => item.layers.set(0));
      }
    },
    // get bounding length
    getBoundingLength(atoms, elementTable, cell) {
      const atomsVectorArray = atoms.map(
        (i) => new THREE.Vector3(i.x, i.y, i.z)
      );
      let maxRadius = -Infinity;
      // console.log(this.elementsArray);
      this.elementsArray.forEach((i) => {
        const ele = i["val"];
        // console.log("ele", ele);
        maxRadius =
          elementTable[ele]["atomicRadius"] > maxRadius
            ? elementTable[ele]["atomicRadius"]
            : maxRadius;
      });
      // atom boundary ball
      const atomBoundarySphere = new THREE.Sphere();
      atomBoundarySphere.setFromPoints(atomsVectorArray);
      // console.log("boundarySphere.radius", atomBoundarySphere.radius + maxRadius);

      // cell boundary ball
      const cellBoundarySphere = new THREE.Sphere();
      cellBoundarySphere.setFromPoints(cell);
      // console.log("cellBoundarySphere.radius", cellBoundarySphere.radius);

      let ans = Math.max(
        atomBoundarySphere.radius + maxRadius,
        cellBoundarySphere.radius
      );
      return ans;
    },
    // light focus
    changeControls() {
      // refresh light
      light1.position.copy(camera.position);
    },
    // 显示包含的元素
    getInnerElements(mAtoms, elements) {
      const { kind, newArr } = classify(mAtoms, "label");
      const ans = kind.map((k) => ({
        val: k,
        color: elements[k].jmolColor,
      }));
      this.elementsArray = ans;
      return ans;
    }, // 更改object是否高亮，这里的高亮为wireframe切换，以及放大一定比例，达到高亮的效果
    /*===========高亮和描边模型===========*/
    switchObjectActive(obj, flag) {
      if (flag) {
        obj.scale.set(1.5, 1.5, 1.5);
        obj.material.wireframe = true;
      } else {
        obj.scale.set(1, 1, 1);
        obj.material.wireframe = false; // obj.material.wireframe.set(false); // obj.scale.set(1, 1, 1); // obj.material.color.set(0, 0, 0);
      }
    },
    // 判断是否已经高亮
    getObjectActive(obj) {
      console.log(obj.material.wireframe);
      return obj.material.wireframe;
    },
    // 点击回调
    onPointerDown(ev) {
      if (!this.mouse) {
        return;
      }

      let rect = renderer.domElement.getBoundingClientRect();
      // 归一化
      this.mouse.x = ((ev.clientX - rect.left) * 2) / rect.width - 1;
      this.mouse.y = 1 - ((ev.clientY - rect.top) * 2) / rect.height;
      // update the picking ray with the camera and this.mouse position
      this.raycaster.setFromCamera(this.mouse, camera);
      // calculate objects intersecting the picking ray
      const intersects = this.raycaster.intersectObjects(scene.children, true);
      // console.log("intersects", intersects);
      if (intersects.length > 0) {
        const res = intersects.filter(function (res) {
          return (
            res &&
            res.object &&
            res.object.type === "Mesh" &&
            res.object.parent.name === "atoms"
          );
        })[0];

        // 取到点击中的原子object
        if (res) {
          // ==> 这部分是进行wireframe化的代码
          // let atomsUUIDs = this.atomsInfo.map((i) => i.id);
          // // 判断是atomsInfo中的原子再进行可以高亮
          // if (atomsUUIDs.includes(res.object.uuid)) {
          //   const curr = res.object;
          //   if (this.getObjectActive(curr)) {
          //     this.switchObjectActive(curr, false);
          //     this.activedObjects = [];
          //   } else {
          //     // 判断activeOjects是否为空
          //     if (this.activedObjects.length === 0) {
          //       console.log("curr", curr);
          //       this.switchObjectActive(curr, true);
          //       this.activedObjects.push(curr);
          //     } else {
          //       this.activedObjects.forEach((o) =>
          //         this.switchObjectActive(o, false)
          //       ); // 遍历数组置为非高亮
          //       this.activedObjects = [];
          //       this.switchObjectActive(curr, true);
          //       this.activedObjects.push(curr);
          //     }
          //   }
          //   this.$emit("updateSelectedAtom", this.activedObjects);
          // }

          // ==> 这部分是高亮遮罩的代码
          let atomsUUIDs = this.atomsInfo.map((i) => i.id);
          // 只有点击了atom才高亮
          if (atomsUUIDs.includes(res.object.uuid)) {
            const ids = selectedObjects.map((item) => item.id);
            if (ids.includes(res.object.id)) {
              // 已描边的进行过滤掉
              selectedObjects = selectedObjects.filter(
                (item) => item.id !== res.object.id
              );
            } else {
              // 改动，只能单选
              selectedObjects = [res.object];
            }
            // 更新一下
            if (outlinePass && outlinePass.selectedObjects)
              outlinePass.selectedObjects = selectedObjects;

            // 选中的原子
            // console.log("selectedObjects", selectedObjects);
            this.$emit("updateSelectedAtom", selectedObjects);
          }
        }

        // if (res.object.type === "Mesh") {
        // res.object.material.color.set("#000000");
        // 下面这种会报warning 因threejs的自身机制问题
        // if (newObjects.findIndex(item => item.uuid === res.object.uuid) === -1) {
        //   newObjects.push(res.object);
        // } else {
        //   newObjects.splice(newObjects.findIndex(item => item.uuid === res.object.uuid), 1);
        // }
        // outlinePass.selectedObjects = newObjects;
        // }
      }
    },
    // 高亮选中的Objects
    outlineObjects(selectedObjects) {
      // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
      composer = new EffectComposer(renderer); // 特效组件

      // 新建一个场景通道  为了覆盖到原理来的场景上
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass); // 特效渲染

      outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        scene,
        camera
      );
      outlinePass.selectedObjects = selectedObjects; // 需要高光的obj
      outlinePass.edgeStrength = 5; // 高光边缘强度
      outlinePass.edgeGlow = 1; // 边缘微光强度
      outlinePass.usePatternTexture = false; // 使用纹理覆盖？
      outlinePass.edgeThickness = 5.0; // 高光厚度
      outlinePass.downSampleRatio = 0.1; // 边框弯曲度
      outlinePass.pulsePeriod = 5; // 呼吸闪烁的速度

      outlinePass.visibleEdgeColor.set(0xff0000); // 呼吸显示的颜色
      outlinePass.hiddenEdgeColor.set(0xffffff); // 呼吸消失的颜色

      outlinePass.clear = true;
      composer.addPass(outlinePass); // 加入高光特效
    },
    // 初始化描边
    initOutline() {
      composer = new EffectComposer(renderer);

      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      outlinePass = new OutlinePass(
        new THREE.Vector2(container.innerWidth, container.innerHeight),
        scene,
        camera
      );
      outlinePass.visibleEdgeColor.set("#8ce605");
      outlinePass.edgeStrength = 6.0; // 描边厚度
      outlinePass.edgeThickness = 1.5;
      composer.addPass(outlinePass);

      effectFXAA = new ShaderPass(FXAAShader);
      effectFXAA.uniforms["resolution"].value.set(
        1 / container.innerWidth,
        1 / container.innerHeight
      );
      composer.addPass(effectFXAA);
    },
    // 清空所有描边
    clearSelectedObjects() {
      selectedObjects = [];
      outlinePass.selectedObjects = [];
    },
    // 计算Bond的比例
    calcBondProportion(sAtom, eAtom, bondRadius, elements, distance) {
      let sr = elements[sAtom.label].vdWRadius * 0.3;
      let sl = Math.sqrt(sr * sr - bondRadius * bondRadius);
      let er = elements[eAtom.label].vdWRadius * 0.3;
      let el = Math.sqrt(er * er - bondRadius * bondRadius);

      // console.log("===sr", sr);
      // console.log("===sl", sl);
      // console.log("===er", er);
      // console.log("===el", el);
      let x = (distance - sl - el) / 2;
      let ans = (sl + x) / distance;

      // console.log("====sl", sl)
      // console.log("====el", el)
      // console.log("====distance", distance)
      // console.log("====x", x)
      // console.log("====ans", ans)
      // console.log("====other ans", (el + x) / distance)
      return { sBond: sl + x, eBond: x + el };
    },

    /*===========清空、释放模型===========*/
    resetRoot() {
      this.fileList = [];
      this.elementsArray = [];
      // remove
      if (this.root) {
        this.root.removeFromParent();
        this.disposeGroup(this.root);
      }
    },
    // dispose 模型 remove  and clear all
    clearAll() {
      // this.pause = true;
      // remove
      if (this.root) {
        this.root.removeFromParent();
        this.disposeGroup(this.root);
        this.root = null;
      }
      try {
        selectedObjects = [];

        // dispose
        this.disposeGroup(this.atomsGroup);
        this.disposeGroup(this.bondsGroup);
        this.disposeGroup(this.linesGroup);

        // release
        this.raycaster = null;
        this.mouse = null;
        this.light1 = null;
        this.light = null;
        this.camera = null;
        this.controls = null;
        this.scene = null;
        this.container = null;

        // console.log("====================");
        // console.log(this.renderer.forceContextLoss);
        this.renderer && this.renderer.forceContextLoss();
        this.renderer = null;
        // gl context release
        // const dom = document.getElementById(`root_container_${this.hpId}`);
        // const gl = dom.getContext("webgl");
        // dom.addEventListener("webglcontextlost", (event) => {
        //   console.log("===============gl context event===============");
        //   console.log(event);
        // });
        // gl.getExtension("WEBGL_lose_context").loseContext();
      } catch (error) {
        console.log(
          "===============dispose release context console==============="
        );
        console.log(error);
      }
    },
    // dipose
    disposeGroup(group) {
      if (!group) return;
      // 删除掉所有的模型组内的mesh
      group.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          try {
            item.geometry.dispose(); // 删除几何体
            item.material.dispose(); // 删除材质
          } catch (error) {}
        }
      });
    },
    // 处理xyz文件
    parseXYZFile(content) {
      let whitespaceRegex = /\s+/g;
      let lines = content.split("\n");
      const totalCount = Number(lines[0].trim()); // 原子总数
      lines.shift();
      lines.shift(); // 去除前两行
      let line;
      let ans = [];
      while (lines.length > 0) {
        line = lines.shift();
        if (line.length > 0) {
          let words = line
            .split(whitespaceRegex)
            .map((item) => item.trim())
            .filter((i) => i.length !== 0);
          console.log(words);
          ans.push({
            label: words[0],
            x: Number(words[1]),
            y: Number(words[2]),
            z: Number(words[3]),
          });
        }
      }
      return ans;
    },

    /*===========下载图片===========*/
    downloadImage() {
      const d = new Date().getTime();
      this.getImageData = true;
      this.render();
      let link = document.createElement("a");
      link.setAttribute("href", this.imgData);
      link.setAttribute("target", "_blank");
      link.setAttribute("download", `${d}.jpg`);
      link.click();
    },
  },
};
</script>

<style lang="scss">
.label {
  text-shadow: -1px 1px 1px rgb(0, 0, 0);
  font-size: 18px;
  background-color: transparent !important;
}
</style>
