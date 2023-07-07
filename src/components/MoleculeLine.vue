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
      v-if="elementsArray && elementsArray.length > 0"
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

import _ from "lodash";

import { ElementAtom, readCIF } from "@/libs/parser.js";
import { classify, convertUnitcell } from "@/libs/utils";
import { parseMOL2File } from "@/libs/parseText";

import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Line
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

// label
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

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
  },
  data() {
    return {
      cif: this.cifContent,
      container: null,
      scene: null,
      renderer: null,
      camera: null,
      light1: null,
      controls: null,
      labelRenderer: null,

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
    // if (this.mol2) {
    //   this.init(this.mol2, true);
    // }
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
    /**
     * 建模入口
     * @param {*} content
     * @param {*} isMol2
     */
    init(content, isMol2 = false) {
      // init gui
      this.container = document.getElementById("drawer");
      this.scene = new THREE.Scene();

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
      }

      // 判断是不是晶体，保存在store中
      this.$store.commit(
        "setIsCrystalMaterial",
        cell.length > 0 ? true : false
      );

      this.initRoot(atoms, bonds, cell);
      this.switchLabel(this.defaultLayer); // 根据props切换不同的标签显示
      this.scene.add(this.root);

      this.addLight();
      this.addCamera();
      this.initRender(this.width, this.height);
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
      let chargeTypeOptions = ["resp", "cm5", "1.2xcm5", "qeq", "--"];

      if (mAtoms.map((i) => i.label).every((i) => AIElements.includes(i))) {
        let arr = ["GNN-RESP", "am1bcc", "mmff94", "cm1a", "1.14xcm1a"];
        chargeTypeOptions = arr.concat(chargeTypeOptions);
      } else if (
        mAtoms.map((i) => i.label).every((i) => mmff94Elements.includes(i))
      ) {
        let arr = ["mmff94", "cm1a", "1.14xcm1a"];
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
        let polymersChargeTypeOptions = ["resp", "cm5", "cm5x", "qeq", "--"];
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
        let mofChargeTypeOptions = ["--"];
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

      // 判断需不需要晶格外的原子和键
      let innerAtomLen = mAtoms.length;
      if (this.needExtra) {
        mAtoms = mAtoms.concat(this.extraAtoms);
        mBonds = [...mBonds, ...this.extraBonds];
      }

      // 添加原子
      const pointsForLine = [];
      for (let i = 0; i < mAtoms.length; i++) {
        let atom = mAtoms[i];
        const atomColor = elements[atom.label].jmolColor;
        const position = new THREE.Vector3();
        position.x = atom.x;
        position.y = atom.y;
        position.z = atom.z;

        pointsForLine.push(position);

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

      this.calcOffset(pointsForLine);

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
      this.addLineBonds(mAtoms, mBonds);

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

      const boxSize = new THREE.Vector3();
      aabb.getSize(boxSize);
      this.maxSideLength = Math.max(boxSize.x, boxSize.y, boxSize.z);
      aabb.getCenter(this.offset).multiplyScalar(-1);
    },
    // 光照
    addLight() {
      this.light1 = new THREE.DirectionalLight(0xffffff, 0.3);
      this.light1.position.set(0, 0, 10);
      this.scene.add(this.light1);
      const light = new THREE.AmbientLight(0xffffff, 0.4); // soft white light
      this.scene.add(light);
    },
    // 相机
    addCamera() {
      const width = this.width;
      const height = this.height;
      const k = width / height; // 窗口宽高比
      const s = 1.0 * this.maxSideLength; // 三维场景显示范围控制系数，系数越大，显示的范围越大，针对OrthographicCamera可调节大小
      this.camera = new THREE.OrthographicCamera(
        -s * k,
        s * k,
        s,
        -s,
        0,
        10000
      );
      this.camera.position.set(0, 0, 1000);
      this.camera.lookAt(this.scene.position); // 设置相机方向指向的场景对象
    },
    // 线段成键
    addLineBonds(mAtoms, mBonds) {
      // generate bonds
      const bondsGroup = new THREE.Group();
      bondsGroup.name = "bonds";
      const start = new THREE.Vector3();
      const end = new THREE.Vector3();

      // 创建材质
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      // 创建空几何体
      const geometry = new THREE.BufferGeometry();
      const points = [];

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

        points.push(start.clone());
        points.push(end.clone());
      }
      // 绑定顶点到空几何体
      geometry.setFromPoints(points);

      const bondLines = new THREE.LineSegments(geometry, material);
      bondsGroup.add(bondLines);

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
        // add cell line to this.scene
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
      if (!this.renderer) {
        this.renderer = new THREE.WebGLRenderer({
          // alpha: true,
          antialias: true,
          // preserveDrawingBuffer: true,
        });
      }
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(width, height); // 设置渲染区域尺寸
      this.renderer.setClearColor(0x000000, 1); // 设置背景颜色
      this.container.appendChild(this.renderer.domElement); // body元素中插入canvas对象

      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.setSize(width, height);
      this.labelRenderer.domElement.style.position = "absolute";
      this.labelRenderer.domElement.style.top = "0px";
      this.labelRenderer.domElement.style.pointerEvents = "none";
      this.container.appendChild(this.labelRenderer.domElement);

      this.controls = new TrackballControls(this.camera, this.renderer.domElement);
      // this.controls.minDistance = 100;
      // this.controls.maxDistance = 200;
      this.controls.rotateSpeed = 5.0;
      this.controls.zoomSpeed = 1.0;
      this.controls.noPan = true;
      // this.controls.panSpeed = 8.0;
      // this.controls.keys = ["KeyA", "KeyS", "KeyD"];
      this.controls.addEventListener("change", this.changeControls, false);
    },
    // 渲染函数
    render() {
      requestAnimationFrame(this.render); // 请求再次执行渲染函数render

      // 渲染this.renderer
      this.renderer.render(this.scene, this.camera); // 执行渲染操作
      this.labelRenderer.render(this.scene, this.camera);
      // if (this.getImageData == true) {
      //   this.imgData = this.renderer.domElement.toDataURL("image/jpeg", 1.0);
      //   this.getImageData = false;
      // }
      // update this.controls
      this.controls.update();
      if (this.camera.zoom >= 8) {
        this.camera.zoom = 8;
      }
      if (this.camera.zoom <= 0.125) {
        this.camera.zoom = 0.125;
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
      this.light1.position.copy(this.camera.position);
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
      // remove
      if (this.root) {
        this.root.removeFromParent();
        this.disposeGroup(this.root);
        this.root = null;
      }
      try {
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
        this.renderer && this.renderer.forceContextLoss();
        this.renderer = null;
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
