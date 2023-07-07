import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 以下是分子力场相关的
    originFileName: "", // 最开始上传的源文件名字
    originFileContent: "", // 最开始上传的源文件文本

    activeIndex: 1,
    fileList: [], // 文件列表
    originMol2: "", // 第一步上传或者generate3D的mol2
    originMol: "",
    mol2: "",
    moleculeJson: "",

    atoms: null,
    force: "GAFF",
    forces: [],
    forceOptions: [],
    backForce: "OPLS-AA/L",
    backForces: [],
    waterModel: "SPCE",
    waterModelForces: [], // 水模型力场

    charge: 0, // 最开始上传
    chargeOptions: [], // 根据mol2文件的结构进行判断，先选择电荷值。

    chargeType: null,
    chargeTypeOptions: [], // 电荷类型，四种或者两种

    chargeResult: [], // 拿到的电荷

    switchValue: "fuzzy",
    atomtypeOriginData: [], // 第二步存下来的原始数据
    atomtypeTableData: null, // 第二步存下来的表格数据

    forceParams: null, // 第三步得到的数据

    mol2Charge: [], // mol2中charge数据

    isCrystalMaterial: false, // 结构是不是晶体，从组件里解析的cell来判断的。

    // 聚合物模块
    polymerNumber: "",

    // 是否使用current_structure
    isUseBondLength: false,
    isUseBondAngle: false,
  },
  mutations: {
    // 以下是分子力场相关的

    // 存下来源文件名称
    setOriginFileName(state, payload) {
      state.originFileName = payload;
    },
    // 存下来源文件内容
    setOriginFileContent(state, payload) {
      state.originFileContent = payload;
    },

    setActiveIndex(state, payload) {
      state.activeIndex = payload;
    },
    setFileList(state, payload) {
      state.fileList = payload;
    },
    setMol2(state, payload) {
      state.mol2 = payload;
    },
    setOriginMol2(state, payload) {
      state.originMol2 = payload;
    },
    setOriginMol(state, payload) {
      state.originMol = payload;
    },
    setMoleculeJson(state, payload) {
      state.moleculeJson = payload;
    },
    setAtoms(state, payload) {
      state.atoms = payload;
    },
    setForce(state, payload) {
      state.force = payload;
    },
    setForces(state, payload) {
      state.forces = payload;
    },
    setForceOptions(state, payload) {
      state.forceOptions = payload;
    },
    setBackForce(state, payload) {
      state.backForce = payload;
    },
    setBackForces(state, payload) {
      state.backForces = payload;
    },
    setWaterModel(state, payload) {
      state.waterModel = payload;
    },
    setWaterModelForces(state, payload) {
      state.waterModelForces = payload;
    },
    setCharge(state, payload) {
      console.log("============触发了setCharge", payload);
      state.charge = payload;
    },
    setChargeOptions(state, payload) {
      state.chargeOptions = payload;
    },
    setChargeType(state, payload) {
      state.chargeType = payload;
    },
    setChargeTypeOptions(state, payload) {
      state.chargeTypeOptions = payload;
    },
    setChargeResult(state, payload) {
      state.chargeResult = payload;
    },
    setSwitchValue(state, payload) {
      state.switchValue = payload;
    },
    setAtomTypeOriginData(state, payload) {
      state.atomtypeOriginData = payload;
    },
    setAtomTypeTableData(state, payload) {
      state.atomtypeTableData = payload;
    },
    setForceParams(state, payload) {
      state.forceParams = payload;
    },
    // 重置到初始状态
    reset(state, payload) {
      console.log("收到的payload", payload);
      Object.keys(payload).forEach((k, index) => {
        state[k] = payload[k];
      });
    },
    // 判断是不是晶体
    setIsCrystalMaterial(state, payload) {
      state.isCrystalMaterial = payload;
    },

    // 聚合物相关的
    // 暂存聚合物的number， 用于请求atomtype
    setPolymerNumber(state, payload) {
      state.polymerNumber = payload;
    },

    // 设置是否使用当前键长和当前键角
    setIsUseBondLength(state, payload) {
      state.isUseBondLength = payload;
    },
    setIsUseBondAngle(state, payload) {
      state.isUseBondAngle = payload;
    },
  },
  actions: {},
  modules: {},
});
