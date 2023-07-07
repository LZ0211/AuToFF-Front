<template>
  <div class="page">
    <div class="top">
      <div class="top-content">
        <div
          style="
            display: flex;
            width: 100%;
            font-size: 30px;
            font-weight: bold;
            color: #222222;
          "
          class="top-text"
        >
          分子力场辅助工具
        </div>
        <div
          style="display: flex; width: 100%; color: #999999; font-size: 20px"
          class="top-tip"
        >
          Auxiliary Tools of Force Field
        </div>
      </div>
    </div>

    <div class="middle">
      <div class="nav">
        <div
          :style="{ opacity: item.isDev ? '.5' : '1' }"
          class="nav-item"
          v-for="(item, index) in list"
          :key="index"
          @click="goToModule(item)"
        >
          <div class="nav-item-img">
            <img
              style="width: 178px; height: 178px"
              :src="
                require(`@/assets/imgs/Index/nav-${index + 1}${
                  index + 1 > 8 ? '.jpg' : '.png'
                }`)
              "
              alt=""
              srcset=""
            />
          </div>
          <div>
            <div class="nav-item-chi" :style="{ color: item.color }">
              {{ item.chi }}
            </div>
            <div class="nav-item-eng">{{ item.eng }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Index",
  data() {
    return {
      list: [
        {
          chi: "全原子力场",
          eng: "all-atom force field",
          path: "/all-atom",
          color: "#E57506",
          isDev: false,
        },
        {
          chi: "联合原子力场",
          eng: "united-atom force field",
          path: "/united-atom",
          color: "#BFBFBF",
          isDev: false,
        },
        {
          chi: "离子液体",
          eng: "ionic liquid",
          path: "/ion-liquid",
          color: "#99C5C6",
          isDev: false,
        },
        {
          chi: "碳材料",
          eng: "carbon materials",
          color: "#97896E",
          path: "/carbon-material",
          isDev: false,
        },
        {
          chi: "金属/共轭有机框架",
          eng: "MOFs/COFs",
          color: "#201EEA",
          path: "/mof-cof",
          isDev: false,
        },
        {
          chi: "晶体材料",
          eng: "crystal",
          color: "#DB8B46",
          path: "/inorganic-crystals",
          isDev: false,
        },
        {
          chi: "聚合物建模",
          eng: "polymers",
          color: "#696BCC",
          path: "/polymers",
          isDev: false,
        },
        {
          chi: "生物大分子",
          eng: "biomacromolecule",
          color: "#88573C",
          isDev: true,
        },
        {
          chi: "多体势",
          eng: "multi-body potential",
          color: "#9AADBF",
          isDev: true,
        },
        {
          chi: "反应力场",
          eng: "reactive force field",
          color: "#6D98BA",
          isDev: true,
        },
        {
          chi: "粗粒化",
          eng: "coarse-graining",
          color: "#C17767",
          isDev: true,
        },
        {
          chi: "QM/MM建模",
          eng: "QM/MM modeling",
          color: "#210203",
          isDev: true,
        },
      ],
    };
  },
  computed: {},
  components: {},
  created() {},
  mounted() {
    // this.$message.success("进入首页成功")
    // 重置下store的状态
    console.log("重置store到初始状态");
    const initStore = {
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
      backForce: "OPLS-AA/L",
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

      isUseBondLength: false,
      isUseBondAngle: false,
    };
    this.$store.commit("reset", initStore);
  },
  methods: {
    goToModule(item) {
      if (item.path) {
        this.$router.push(item.path);
      } else {
        this.$message.warning("功能开发中");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding: 45px;

  .title {
    font-size: 40px;
    line-height: 40px;
    font-weight: bold;
    padding: 40px 0 30px 0;
    box-sizing: border-box;
    display: flex;
    justify-content: center;

    .title-red {
      color: red;
    }
  }

  .top {
    display: flex;
    justify-content: center;

    .top-content {
      width: 1120px;
      display: flex;
      flex-wrap: wrap;
    }
  }

  .middle {
    display: flex;
    justify-content: center;
    padding-top: 50px;

    .middle-title {
      display: flex;
    }

    .nav {
      // margin-top: 20px;
      // border: 1px solid #eeeeee;
      //   background-color: #eeeeee;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      // padding: 20px 0;
      width: 1120px;

      .nav-item {
        text-align: center;
        display: inline-block;
        border-radius: 10px;
        opacity: 1;
        background: #ffffff;
        box-shadow: 0px 1px 15px 0px rgba(39, 65, 90, 0.08);
        // border: 1px dashed #eeeeee;
        // margin-right: 20px;
        // margin: 10px;
        // width: 240px;
        // height: 100px;
        width: 24%;
        box-sizing: border-box;
        margin-bottom: 20px;

        &:hover {
          opacity: 0.7;
          cursor: pointer;
        }

        // &:nth-child(n + 4) {
        //   opacity: 0.4;
        //   pointer-events: none;
        // }
        .nav-item-img {
          // background-color: #efefef;
          padding-top: 27px;
          padding-bottom: 20px;
        }

        .nav-item-eng {
          // padding: 5px 0 15px 0;
          font-size: 14px;
          padding: 8px 12px 14px 0;
          text-align: right;
        }

        .nav-item-chi {
          // padding: 15px 0 5px 0;
          font-weight: bold;
          // font-size: 15px;
          text-align: right;
          font-size: 14px;
          padding: 0 12px;
        }
      }

      .nav-item:not(:nth-child(4n)) {
        margin-right: calc(4% / 3);
      }
    }
  }
}
</style>
