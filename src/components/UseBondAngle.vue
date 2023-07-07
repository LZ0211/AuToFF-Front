<template>
  <div class="container">
    使用当前结构的键长：
    <a-radio-group
      @change="onChangeIsUseBondLength"
      :value="isUseBondLength"
      button-style="solid"
    >
      <a-radio-button :value="true"> True </a-radio-button>
      <a-radio-button :value="false"> False </a-radio-button>
    </a-radio-group>
    使用当前结构的键角：
    <a-radio-group
      @change="onChangeIsUseBondAngle"
      :value="isUseBondAngle"
      button-style="solid"
    >
      <a-radio-button :value="true"> True </a-radio-button>
      <a-radio-button :value="false"> False </a-radio-button>
    </a-radio-group>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "UseBondAngle",
  props: {},

  data() {
    return {};
  },

  computed: {
    ...mapState(["isUseBondLength", "isUseBondAngle"]),
  },

  mounted() {},

  methods: {
    onChangeIsUseBondLength(e) {
      this.$store.commit("setIsUseBondLength", e.target.value);
    },
    onChangeIsUseBondAngle(e) {
      this.$store.commit("setIsUseBondAngle", e.target.value);
    },
  },
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.container {
}
</style>
