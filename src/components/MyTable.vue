<template>
  <a-table
    bordered
    :pagination="false"
    :columns="columns"
    :data-source="data"
    :rowClassName="rowClassName"
  >
    <a slot="name" slot-scope="text">{{ text }}</a>
    <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
    <span slot="tags" slot-scope="tags"> </span>
    <span slot="action" slot-scope="text, record"> </span>
  </a-table>
</template>
<script>
export default {
  props: ["data", "columns", "selectedAtoms"],
  data() {
    return {};
  },
  methods: {
    rowClassName(record, index) {
      if (this.selectedAtoms.includes(record["id"].toString())) {
        return "highlight";
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .ant-table-tbody {
  .highlight {
    background-color: #c2cad2;
  }
}
</style>
