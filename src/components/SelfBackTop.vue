<template>
  <div @click.stop="handleClick" :style="{
    'right': styleRight,
    'bottom': styleBottom
  }" class="self_backtop">
    <slot>
      {{ "回到菜单" }}
    </slot>
  </div>
</template>

<script>
export default {
  name: "ElBacktop",
  props: {
    right: {
      type: Number,
      default: 40
    },
    bottom: {
      type: Number,
      default: 40
    }
  },

  data() {
    return {
      el: null,
      container: null,
      visible: false
    };
  },

  computed: {
    styleBottom() {
      return `${this.bottom}px`;
    },
    styleRight() {
      return `${this.right}px`;
    }
  },

  mounted() {
  },

  methods: {
    init() {
    },
    handleClick(e) {
      this.$router.push({ path: "/" })
    }
  },
  beforeDestroy() {
  }
};
</script>

<style lang="scss" scoped>
.self_backtop {
  position: fixed;
  background-color: #2369E6;
  width: 35px;
  color: #FFFFFF;
  border-radius: 4px;
  padding: 8px;
  padding-right: 4px;

  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  font-size: 14px;
  -webkit-box-shadow: 0 0 6px rgba(0, 0, 0, .12);
  box-shadow: 0 0 6px rgba(0, 0, 0, .12);
  cursor: pointer;
  z-index: 1003;

  &:hover {
    transform: scale(1.1);
    transition-duration: .2s;
    -moz-transition-duration: .2s;
    -o-transition-duration: .2s;
  }
}
</style>
