<template>
  <div class="page_mol-top">
    <div style="display: inline-flex; align-items: center;">
      <img width="24px" height="24px" src="@/assets/icon/atom/2.png" alt="">
      <div style="
                                      height: 18px;
                                      opacity: 1;
                                      font-size: 18px;
                                      font-weight: bold;
                                      line-height: 18px;
                                      letter-spacing: 0em;
                                      margin-left: 14px;
                                      color: #222222;">
        {{ title }}
      </div>
    </div>
    <div style="display: flex; align-items: center;" v-if="showUpload">
      <div style="margin-right: 18px; font-size: 12px; color: #999999">.mol、.pdb、.xyz、.mol2、.cif文件上传文件大小1M以内且原子数小于1000（显示卡顿请使用更好的GPU）
      </div>
      <div style="
                                        width: 101px;
                                        height: 36px;
                                        line-height: 36px;
                                        padding: 0px 6px 0px 6px;
                                        border-radius: 6px;
                                        opacity: 1;
                                        background: #ffffff;
                                        box-sizing: border-box;
                                        border: 1px solid #0a55ff;
                                        color: #0a55ff;
                                      ">
        <a-upload name="file" accept=".mol,.pdb,.mol2,.xyz,.cif" :multiple="false" :showUploadList="false"
          :beforeUpload="beforeUpload">
          <div
            style="height: 36px; line-height: 36px; display: inline-flex; align-items: center; padding: 0 5px; cursor: pointer;">
            <span style="margin-right: 2px; color: #0A55FF;">
              本地上传
            </span>
            <img src="@/assets/icon/atom/1.png" alt="本地上传"></img>
          </div>
        </a-upload>
      </div>

      <div v-if="originFileName && originFileContent" style="font-size: 12px; margin: 0 10px;">
        {{ originFileName.length > 20 ? (originFileName.slice(0, 20) + "...") : originFileName }}
      </div>
      <a-button @click="downloadOriginFile" v-if="originFileName && originFileContent"
        style="height: 36px; margin-left: 10px;" icon="download">
        源文件下载
      </a-button>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import api from "@/api2";
import request from "@/api2/request";
import { ElementAtom, readCIF } from "@/libs/parser.js";
import { parseMOL2File } from "@/libs/parseText";
import fileDownload from "js-file-download";

export default {
  props: {
    showUpload: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState([
      "originFileName",
      "originFileContent",
      "activeIndex",
      "originMol",
      "originMol2",
      "mol2",
      "moleculeJson",
      "force",
      "backForce",
      "backForces",
      "waterModel",
      "waterModelForces",
      "charge",
      "chargeOptions",
    ]),
  },
  methods: {
    beforeUpload(file) {
      console.log("===file", file);

      // 校验文件类型
      const nameArray = file.name.split(".");
      const suffix = nameArray[nameArray.length - 1];
      if (
        suffix !== "mol" &&
        suffix !== "pdb" &&
        suffix !== "xyz" &&
        suffix !== "mol2" &&
        suffix !== "cif"
      ) {
        this.$message.error("目前只支持.mol、.pdb、.xyz、.mol2、.cif文件上传");
        return;
      }
      // 校验文件大小
      if (file.size > 1024 * 1024) {
        this.$message.error("文件大小超出1M限制");
        return;
      }

      let url = api.toMol2;

      const reader = new FileReader();
      reader.onload = (ev) => {
        // 这里进行文件解析原子个数
        const content = ev.target.result;

        // 存储源文件内容
        this.$store.commit("setOriginFileContent", content);
        this.$store.commit("setOriginFileName", file.name);

        let lines = content.split("\n");
        let whitespaceRegex = /\s+/g;
        let num = 0;

        if (suffix === "mol") {
          let numLine = lines[3];
          num = Number(numLine.slice(0, 3).trim());
        } else if (suffix === "pdb") {
          lines.forEach((line) => {
            if (line.slice(0, 6) === "HETATM" || line.slice(0, 4) === "ATOM") {
              num++;
            }
          });
        } else if (suffix === "xyz") {
          let numLine = lines[0];
          let words = numLine.split(whitespaceRegex).map((i) => i.trim());
          num = Number(words[0]);
        } else if (suffix === "mol2") {
          const m = parseMOL2File(content);
          num = m.atoms.length;
        } else if (suffix === "cif") {
          const m = readCIF(content);
          num = m.molecule.atoms.length;
        }
        if (num > 1000) {
          this.$message.error("原子个数不能超过1000个");
          return false;
        }

        // 发送请求
        if (suffix === "cif") {
          request
            .postJson(api.cif2mol2, {
              data: ev.target.result,
            })
            .then((data) => {
              this.$store.commit("setFileList", [file]);
              this.$store.commit("setMol2", data.data);
              this.$store.commit("setOriginMol2", data.data);
              this.$emit("update", data.data);
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (suffix === "mol2") {
          // 本身上传的是mol2文本，就不用再进行转换
          this.$store.commit("setFileList", [file]);
          this.$store.commit("setMol2", ev.target.result);
          this.$store.commit("setOriginMol2", ev.target.result);
          this.$emit("update", ev.target.result);
        } else {
          request
            .postJson(url, {
              data: ev.target.result,
              inp: suffix,
              out: "mol2",
            })
            .then((data) => {
              this.$store.commit("setFileList", [file]);
              this.$store.commit("setMol2", data.data);
              this.$store.commit("setOriginMol2", data.data);
              this.$emit("update", data.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      };
      reader.readAsText(file);
    },
    // 源文件下载
    downloadOriginFile() {
      fileDownload(this.originFileContent, this.originFileName);
    },
  },
};
</script>

<style lang="scss" scoped>
.page_mol-top {
  height: 54px;
  line-height: 54px;
  border-radius: 6px;
  opacity: 1;
  background: #fcfcfc;
  box-sizing: border-box;
  border: 1px solid #efefef;
  width: 1550px;
  margin: 0 auto;
  margin-top: 45px;
  padding: 0 20px;

  display: flex;
  justify-content: space-between;
}
</style>