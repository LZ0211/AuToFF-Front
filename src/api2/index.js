/**
 * index.js
 * api地址管理
 */
export default {
  // mol文件转3d结构mol格式
  toMol2: "/api/obabel/convert", //openbabel mol文件转mol2格式
  convertFormat: "/api/obabel/convert", //openbabel convert

  supportedForce: "/api/forcefield/supported", // 力场列表
  aaForce: "/api/forcefield/aa", // 全原子力场
  uaForce: "/api/forcefield/ua", // 联合原子力场
  ilForce: "/api/forcefield/il", // 离子液体
  carbonForce: "/api/forcefield/carbon", // 碳材料的力场

  supportedWatermodels: "/api/forcefield/watermodels", // 水模型力场列表
  atomType: "/api/forcefield/atomtype", // 识别立场原子类型
  atomParam: "/api/forcefield/param", //生成对应力场下分子的参数

  am1bcc: "/api/charge/am1bcc", // 生成电荷
  mmff94: "/api/charge/mmff94",
  cm1a: "/api/charge/cm1a",
  cm1a_2: "/api/charge/1.14xcm1a",
  resp: "/api/charge/resp",
  cm5: "/api/charge/cm5",
  cm5_2: "/api/charge/1.2xcm5",
  qeq: "/api/charge/qeq",
  oplsaa: "/api/charge/oplsaa",

  atom: "/api/forcefield/atom", // atomtype除去ID和operation外总共5列，分别是atom  atomtype /forcefield/atom的返回一列，以及/forcefield/lj的返回两列
  lj: "/api/forcefield/lj",
  tip4pwatermodels: "/api/forcefield/tip4pwatermodels",

  gromacs: "/api/topfile/gromacs", // 下载gromacs的拓扑文件
  lammps: "/api/topfile/lammps", // 下载lammps的拓扑文件
  amber: "/api/topfile/amber", // 下载amber的拓扑文件
  moltemplate: "/api/topfile/moltemplate", // 下载moltemplate的拓扑文件
  openmm: "/api/topfile/openmm", // 下载moltemplate的拓扑文件
  tinker: "/api/topfile/tinker", // 下载moltemplate的拓扑文件
  charmm: "/api/topfile/charmm", // 下载moltemplate的拓扑文件

  tip4p: "/api/model/tip4p", // 得到一个填充水分子的结构(会自动根据mol结构进行判断，只传.mol文本即可)

  reduct: "/api/model/reduct", // 生成无虚原子的mol2文本

  fullerene: "/api/model/fullerene", // 富勒烯
  graphene_square: "/api/model/graphene_square", // 石墨烯
  armchair_nanocube_single_wall: "/api/model/armchair_nanocube_single_wall", // 椅式单壁碳纳米管模型
  armchair_nanocube_multi_walls: "/api/model/armchair_nanocube_multi_walls", // 椅式多壁碳纳米管模型
  zigzag_nanocube_single_wall: "/api/model/zigzag_nanocube_single_wall", // 锯齿单壁碳纳米管模型
  zigzag_nanocube_multi_walls: "/api/model/zigzag_nanocube_multi_walls", // 生成锯齿多壁碳纳米管模型
  carbon_atomtype: "/api/forcefield/carbon_atomtype", // 获取碳材料的atomtype

  cif2mol2: "/api/cell/cif2mol2", // cif转mol2
  mineralsDatabase: "/api/model/database/minerals", // 无机物数据库
  mofsDatabase: "/api/model/database/MOFs+COFs", // MOFs和COFs 结构数据库
  mofForcefield: "/api/forcefield/mof", // mof力场
  inorganicForcefield: "/api/forcefield/inorganic", // 无机晶体力场

  // 聚合物建模
  monomer: "/api/polymer/monomer", // 聚合物单体数据库
  endgroup: "/api/polymer/endgroup", // 端基数据库

  buildHomopolymer: "/api/polymer/build-homopolymer", // 均聚物生成mol2
  buildBlockCopolymer: "/api/polymer/build-block-copolymer", // 嵌段共聚物生成mol2
  buildRandomCopolymer: "/api/polymer/build-random-copolymer", // 无规共聚物生成mol2

  polymerAtomtype: "/api/polymer/atomtype", // 根据力场识别原子类型
  polymerCharge: "/api/polymer/charge", // 生成电荷
  GNN: "/api/ai/GNN", // 生成电荷

  // ai mof charge
  pacmof: "/api/ai/pacmof",
  ffp4mof: "/api/ai/ffp4mof",

  // mof的qeq接口改为两个
  GMPqeq: "/api/mof/mof-GMP-qeq",
  MEPOqeq: "/api/mof/mof-MEPO-qeq",

  // 无机晶体的computer list
  computerList: "/api/forcefield/classII"
};
