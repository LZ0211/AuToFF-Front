<template>
  <a-table
    :columns="columns"
    :data-source="data"
    bordered
    :pagination="false"
    :rowClassName="rowClassName"
  >
    <template
      v-for="col in getDataIndex()"
      :slot="col"
      slot-scope="text, record, index"
    >
      <div :key="col">
        <a-input
          v-if="record.editable && !(col.includes('id') || col.includes('atom'))"
          style="margin: -5px 0"
          :value="text"
          @change="(e) => handleChange(e.target.value, record.key, col)"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>

    <template slot="operation" slot-scope="text, record, index">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">保存</a>
          <a-popconfirm
            title="Sure to cancel?"
            @confirm="() => cancel(record.key)"
          >
            <a>取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)"
            >编辑</a
          >
        </span>
      </div>
    </template>
  </a-table>
</template>
<script>
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
export default {
  props: ["columns", "originData", "selectedAtoms"],
  data() {
    this.cacheData = this.originData.map((item) => ({ ...item })); // 备份数据
    return {
      data: this.originData,
      cacheData: this.originData,
      editingKey: "",
    };
  },
  watch: {
    originData(newVal, oldVal) {
      if (newVal) {
        this.data = newVal;
        this.cacheData = newVal.map((item) => ({ ...item }));
      }
    },
  },
  mounted() {
    this.cacheData = this.originData.map((item) => ({ ...item })); // 备份数据
    this.data = this.originData.slice();
  },
  methods: {
    handleChange(value, key, column) {
      console.log("column", column);

      const newData = [...this.data];
      const target = newData.find((item) => key === item.key);
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.find((item) => key === item.key);

      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.find((item) => key === item.key);
      const targetCache = newCacheData.find((item) => key === item.key);

      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";

      console.log("this.data");
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.find((item) => key === item.key);
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.find((item) => key === item.key)
        );
        delete target.editable;
        this.data = newData;
      }
    },
    getDataIndex() {
      const arr = this.columns.map((i) => i.dataIndex);
      arr.pop();
      return arr;
    },
    rowClassName(record, index) {
      if (
        this.selectedAtoms.includes(record["atom1"]) ||
        this.selectedAtoms.includes(record["atom2"])
      ) {
        return "highlight";
      } else {
        return "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.editable-row-operations a {
  margin-right: 8px;
}

::v-deep .ant-table-tbody {
  .highlight {
    background-color: #c2cad2;
  }
}
</style>
