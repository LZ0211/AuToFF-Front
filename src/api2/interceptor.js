/**
 * 生成基础axios对象，并对请求和响应做处理
 * 前后端约定接口返回解构规范
 * {
 *    code:0,
 *    data:"成功"
 * }
 */
import axios from "axios";
import Vue from "vue";

console.log("");
// 创建一个独立的axios实例
const service = axios.create({
  // 设置baseUr地址,如果通过proxy跨域可直接填写base地址
  baseURL: "https://api-autoff-dev.mp.iresearch.net.cn",
  // baseURL: window.location.protocol + "//" + "api-" + window.location.host,
  // baseURL: "/",
  // 定义统一的请求头部
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  // 配置请求超时时间
  timeout: 120000,
});

// 请求拦截
service.interceptors.request.use((config) => {
  let IsOnline = window.sessionStorage.getItem("IsOnline");
  if (IsOnline == "offline") {
    Vue.$message.error("网络已断开连接！");
  }
  // 拦截器  请求头带上bearer token
  // const Authorization = window.localStorage.getItem("Authorization");
  // if (Authorization && config.url.includes("/inner")) {
  //   config.headers.Authorization = "Bearer " + Authorization;
  // }
  return config;
});

// 返回拦截
service.interceptors.response.use(
  (response) => {
    // console.log("=====返回拦截", response);
    if (response.status === 200 || response.status === 201) {
      window.sessionStorage.setItem("IsOnline", "online");

      // 针对报错进行弹出弹框
      if (response.data && response.data.error) {
        Vue.$message.error(response.data.error);
      }
      return response.data;
    }
  },
  (err) => {
    if (err.response.status === 401) {
    } else if (err.response.status === 418) {
    } else if (err.response.status === 400) {
      Vue.$message.error(err.response.data);
    } else if (err.response.status === 423) {
    }
    return Promise.reject(err);
  }
);

export default service;
