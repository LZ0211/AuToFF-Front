/**
 * request.js
 * 通过promise对axios做二次封装，针对用户端参数，做灵活配置
 */
import Spin from "./spin";
import instance from "./interceptor";

/**
 * 核心函数，可通过它处理一切请求数据，并做横向扩展
 * @param {url} 请求地址
 * @param {params} 请求参数
 * @param {options} 请求配置，针对当前本次请求；
 * @param loading 是否显示loading
 * @param mock 本次是否请求mock而非线上
 * @param error 本次是否显示错误
 */
function request(
  url,
  params,
  options = { loading: true, mock: false, error: true },
  method
) {
  // 请求前loading
  if (options.loading) Spin.show();
  return new Promise((resolve, reject) => {
    let data = {};
    switch (method) {
      case "get":
        data = { params };
        instance({
          url,
          method,
          ...data,
        })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            options.loading && Spin && Spin.hide();
          });
        break;
      case "post":
        data = { data: params };
        instance({
          url,
          method,
          ...data,
        })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            options.loading && Spin && Spin.hide();
          });
        break;
      case "postFormData":
        data = { data: params };
        instance({
          url,
          method: "post",
          ...data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            options.loading && Spin && Spin.hide();
          });
        break;
      case "postJson":
        data = { data: params };
        instance({
          url,
          method: "post",
          ...data,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            options.loading && Spin && Spin.hide();
          });
        break;
      case "getFile":
        data = { data: params };
        const req = instance({
          url,
          method: "get",
          ...data,
          responseType: "blob",
        });
        req
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            options.loading && Spin && Spin.hide();
          });
        break;
      case "postFile":
        data = { data: params };
        instance({
          url,
          method: "post",
          ...data,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          responseType: "blob",
        })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            options.loading && Spin && Spin.hide();
          });
        break;
      case "put":
        data = { params };
        instance({
          url,
          method,
          ...data,
        })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            options.loading && Spin && Spin.hide();
          });
        break;
      case "delete":
        data = { params };
        instance({
          url,
          method,
          ...data,
        })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            options.loading && Spin && Spin.hide();
          });
        break;
    }
  });
}

// 封装GET请求
function get(url, params, options) {
  return request(url, params, options, "get");
}

// 封装POST请求
function post(url, params, options) {
  return request(url, params, options, "post");
}

// 封装POST请求
function postFormData(url, params, options) {
  return request(url, params, options, "postFormData");
}

// 封装POST JSON请求
function postJson(url, params, options) {
  return request(url, params, options, "postJson");
}

// 封装get File请求 blob的方式
function getFile(url) {
  return request(
    url,
    {},
    { loading: true, mock: false, error: true },
    "getFile"
  );
}

// 封装post File请求 blob的方式
function postFile(url, params, options) {
  return request(url, params, options, "postFile");
}

// 封装PUT请求
function put(url, params, options) {
  return request(url, params, options, "put");
}

// 封装DELETE请求
function del(url, params, options) {
  return request(url, params, options, "delete");
}

export default {
  get,
  post,
  postFormData,
  postJson,
  getFile,
  postFile,
  put,
  del,
};
