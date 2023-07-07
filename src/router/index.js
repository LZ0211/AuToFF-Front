import Vue from "vue";
import VueRouter from "vue-router";
import Atom from "../views/Atom.vue";

// 全原子力场
import WholeMolecule from "../views/WholeMolecule/Index";
// 联合原子力场
import UnitedMolecule from "../views/UnitedMolecule/Index";
// 离子液体
import IonLiquid from "../views/IonLiquid/Index";
// 碳材料
import CarbonMaterial from "../views/CarbonMaterial/Index";
// 无机晶体
import InorganicCrystals from "../views/InorganicCrystals/Index";
// mof or cof
import MofCof from "../views/MofCof/Index";
// 聚合物建模
import Polymers from "../views/Polymers/Index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Atom",
    component: Atom,
  },
  {
    path: "/all-atom",
    name: "WholeMolecule",
    component: WholeMolecule,
  },
  {
    path: "/united-atom",
    name: "UnitedMolecule",
    component: UnitedMolecule,
  },
  {
    path: "/ion-liquid",
    component: IonLiquid,
  },
  {
    path: "/carbon-material",
    name: "CarbonMaterial",
    component: CarbonMaterial,
  },
  {
    path: "/mof-cof",
    name: "MofCof",
    component: MofCof,
  },
  {
    path: "/inorganic-crystals",
    name: "InorganicCrystals",
    component: InorganicCrystals,
  },
  {
    path: "/polymers",
    name: "polymers",
    component: Polymers,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  routes,
});

export default router;
