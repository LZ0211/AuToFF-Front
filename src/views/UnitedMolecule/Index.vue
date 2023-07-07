<template>
  <div class="home">
    <!-- <KeepAlive include="First"> -->
    <component :is="activeComp" />
    <self-back-top :right="-4" :bottom="80"></self-back-top>
    <!-- </KeepAlive> -->
  </div>
</template>

<script>
import First from "./First.vue";
import Second from "./Second.vue";
import Third from "./Third.vue";
import { mapState } from "vuex";

import SelfBackTop from "../../components/SelfBackTop.vue";

// 分三步
const steps = ["First", "Second", "Third"];

export default {
  name: "Home",
  components: { First, Second, Third, SelfBackTop },
  data() {
    return {
    };
  },
  created() {},
  computed: {
    ...mapState(["mol2", "activeIndex"]),
    activeComp() {
      return steps[this.activeIndex - 1];
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.home {
  .btns {
    display: inline-block;
    width: 1600px;
    margin: 0 auto;
    margin-top: 10px;
    text-align: left;
  }

  .back {
    position: fixed;
    left: 0;
    bottom: 100px;
    margin-left: -4px;

    background-color: #2369e6;
    width: 25px;
    color: #ffffff;
    border-radius: 4px;
    padding: 8px;
    padding-right: 4px;

    cursor: pointer;
    &:hover {
      transform: scale(1.1);
      transition-duration: 0.2s;
      -moz-transition-duration: 0.2s;
      -o-transition-duration: 0.2s;
    }
  }
}
</style>
