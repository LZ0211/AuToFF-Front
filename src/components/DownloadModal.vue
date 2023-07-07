<template>
  <!-- 选择单体 -->
  <div class="container">
    <a-button type="primary" @click="openModal">{{ btnText }}</a-button>
    <a-modal
      v-model="visible"
      title="请输入分子名称后生成文件下载"
      @ok="handleOk"
      @cancel="visible = false"
      :width="600"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 8 }"
          label="分子名称"
        >
          <a-input
            :maxLength="4"
            v-decorator="[
              'resname',
              {
                initialValue: 'NUK',
                rules: [
                  {
                    required: true,
                    message: '此项为必填项',
                  },
                  {
                    pattern: /^[0-9a-zA-Z]*$/g,
                    message: '只支持字母或数字组合',
                  },
                ],
              },
            ]"
            @change="(e) => handleInputChange('resname', e)"
            placeholder="请输入resname"
          />
        </a-form-item>
        <a-form-item
          v-if="hasXYZ"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 8 }"
          label="X"
        >
          <a-input-number
            v-decorator="[
              'x',
              {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    message: '此项为必填项',
                  },
                ],
              },
            ]"
            :min="1"
            :max="10"
            @change="(value) => handleNumberChange('x', value)"
          />
        </a-form-item>
        <a-form-item
          v-if="hasXYZ"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 8 }"
          label="Y"
        >
          <a-input-number
            v-decorator="[
              'y',
              {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    message: '此项为必填项',
                  },
                ],
              },
            ]"
            :min="1"
            :max="10"
            @change="(value) => handleNumberChange('y', value)"
          />
        </a-form-item>
        <a-form-item
          v-if="hasXYZ"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 8 }"
          label="Z"
        >
          <a-input-number
            v-decorator="[
              'z',
              {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    message: '此项为必填项',
                  },
                ],
              },
            ]"
            :min="1"
            :max="10"
            @change="(value) => handleNumberChange('z', value)"
          />
        </a-form-item>
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
    btnText: {
      type: String,
      default: "",
    },
    hasXYZ: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      visible: false,
      form: this.$form.createForm(this, { name: "resname_form" }),
    };
  },

  computed: {},

  mounted() {},

  methods: {
    // 打开弹窗
    openModal() {
      this.form.resetFields();
      this.visible = true;
    },
    // 表单更新
    handleInputChange(prop, e) {
      // this.resname = e.target.value;
      this.$nextTick(() => {
        this.form.setFieldsValue({
          prop: e.target.value,
        });
        this.form.validateFields([prop], { force: true });
      });
    },
    handleNumberChange(prop, value) {
      // this.resname = e.target.value;
      this.$nextTick(() => {
        this.form.setFieldsValue({
          prop: value,
        });
        this.form.validateFields([prop], { force: true });
      });
    },
    // 弹窗点击ok
    handleOk() {
      console.log("this.form", this.form.getFieldsValue());
      const formData = this.form.getFieldsValue();
      this.form.validateFields((err) => {
        if (!err) {
          // 这里发送请求
          //   this.downloadFile(resname);
          this.$emit("download", formData);
          this.visible = false;
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
