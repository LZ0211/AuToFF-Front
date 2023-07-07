<template>
  <!-- 用户选择不同的格式进行下载文件 -->
  <div class="container">
    <a-button @click="showModal">下载文件</a-button>
    <a-modal
      v-model="visible"
      title="选择格式和填写文件名以下载文件，文件名不用带后缀"
      @ok="handleOk"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit"
      >
        <a-form-item label="文件名">
          <a-input
            v-decorator="[
              'filename',
              {
                initialValue: '示例文件名',
                rules: [{ required: true, message: '请输入文件名!' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="文件格式">
          <a-select
            v-decorator="[
              'format',
              {
                initialValue: 'mol2',
                rules: [{ required: true, message: '请选择文件格式!' }],
              },
            ]"
            placeholder="选择一种文件格式进行下载"
            @change="handleSelectChange"
          >
            <a-select-option value="pdb"> pdb </a-select-option>
            <a-select-option value="mol"> mol </a-select-option>
            <a-select-option value="mol2"> mol2 </a-select-option>
            <a-select-option value="xyz"> xyz </a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit"> 确认下载 </a-button>
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import api from "@/api2";
import request from "@/api2/request";

import fileDownload from "js-file-download";

export default {
  name: "ElBacktop",
  props: {
    mol2: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      visible: false,

      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },

  computed: {
    styleBottom() {
      return `${this.bottom}px`;
    },
    styleRight() {
      return `${this.right}px`;
    },
  },

  mounted() {},

  methods: {
    showModal() {
      this.visible = true;
    },

    handleSubmit(e) {
      e.preventDefault();

      console.log(this.form.data);
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
      //   this.form.setFieldsValue({
      //     format: `Hi, ${value === "male" ? "man" : "lady"}!`,
      //   });
    },

    handleOk() {
      if (!this.mol2) return;

      this.form.validateFields((err, values) => {
        if (!err) {
          //   console.log("Received values of form: ", values);
          const { filename, format } = values;

          if (format === "mol2") {
            fileDownload(this.mol2, `${filename}.${format}`);
            this.visible = false;
          } else {
            request
              .postJson(api.convertFormat, {
                data: this.mol2,
                inp: "mol2",
                out: format,
              })
              .then((data) => {
                fileDownload(data.data, `${filename}.${format}`);
                this.$message.success("下载成功");
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                this.visible = false;
              });
          }
        }
      });
    },
  },
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.container {
  display: inline-flex;
}
</style>
