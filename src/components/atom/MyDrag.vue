<template>
  <div
    class="page_mol-content-left-drag"
    style="
      height: 270px;
      border-radius: 6px;
      opacity: 1;
      background: #ffffff;
      box-sizing: border-box;
    "
  >
    <div style="display: inline-flex; padding-top: 13px">
      <div
        style="
          border-radius: 6px;
          opacity: 1;
          background: #ffffff;
          box-sizing: border-box;
          border: 1px solid #f3f3f3;
        "
      >
        <div
          style="
            height: 36px;
            line-height: 36px;
            text-align: center;
            color: #3d3d3d;
            font-size: 14px;
            font-weight: bold;
          "
        >
          待选项（拖拽至右边）
        </div>
        <ul
          id="dragList"
          style="
            width: 280px;
            height: 232px;
            overflow-y: auto;
            overflow-x: hidden;
            list-style: none;
            padding: 0;
            cursor: grab;
          "
        >
          <li
            v-for="(item, index) in forces"
            :key="index"
            style="
              margin-bottom: 5px;
              border-radius: 3px;
              opacity: 1;
              box-sizing: border-box;
              border: 1px solid #efefef;
              height: 36px;
              line-height: 36px;
              padding: 0 24px;
            "
          >
            {{ item }}
          </li>
        </ul>
      </div>

      <div
        class="page_mol_top_btns"
        style="
          width: 40px;
          display: inline-flex;
          align-items: center;
          flex-flow: column;
          justify-content: center;
        "
      >
        <img src="@/assets/icon/atom/4.png" alt="" />
        <img style="margin-top: 6px" src="@/assets/icon/atom/5.png" alt="" />
      </div>

      <div
        style="
          border-radius: 6px;
          opacity: 1;
          background: #ffffff;
          box-sizing: border-box;
          border: 1px solid #aaaaaa;
        "
      >
        <div
          style="
            height: 36px;
            line-height: 36px;
            text-align: center;
            color: #3d3d3d;
            font-size: 14px;
            font-weight: bold;
          "
        >
          已选项（可拖拽排序）
        </div>
        <ul
          id="dropList"
          style="
            width: 280px;
            height: 232px;
            overflow-y: auto;
            overflow-x: hidden;
            list-style: none;
            padding: 0;
            color: #222222;
          "
        ></ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api2";
import request from "@/api2/request";
import Sortable from "sortablejs";

export default {
  props: {
    url: {
      type: String,
      default: api.aaForce,
    },
  },
  data() {
    return {
      forces: [],
    };
  },
  mounted() {
    this.getForcesOptions().then(() => {
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
            put: (to) => {
              console.log(to.el.children);
              return true;
            },
          },
          animation: 100,
        });
      }
    });
  },
  methods: {
    // 获取力场列表
    getForcesOptions() {
      return new Promise((resolve, reject) => {
        request
          .get(this.url, {})
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
  },
};
</script>

<style lang="scss" scoped>
#dragList,
#dropList {
  &::-webkit-scrollbar {
    width: 8px;
    height: 16px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-track {
    // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    // border-radius: 10px;
    background-color: #eeeeee;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #fafafa;
  }
}

#dragList li {
  background-color: #efefef;
  color: #222222;
}

#dropList li {
  background-color: #0a55ff;
  color: #ffffff;
}
</style>
