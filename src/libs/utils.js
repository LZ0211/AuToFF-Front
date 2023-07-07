"use strict";

/* Utility functions */

/**
 *  Deep clone an object
 *  @param  {Object}    obj     Object to clone
 *  @return {Object}            Clone
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
module.exports.deepClone = deepClone;

/**
 *  Cross product of two vectors of 3 elements
 *  @param  {Array} v1
 *  @param  {Array} v2
 *  @return {Array}     v1 X v2
 */
function cross(v1, v2) {
  return [
    v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0],
  ];
}
module.exports.cross = cross;

/** Norm of a vector v
 *  @param  {Array}  v
 *  @return {Number}    Norm of v
 */
function norm(v) {
  return Math.sqrt(
    v.reduce(function (s, x) {
      return s + x * x;
    }, 0)
  );
}
module.exports.norm = norm;

/**
 *  Returns the unit vector version of v
 *  @param  {Array} v
 *  @return {Array}     Unit vector
 */
function unit(v) {
  var n = norm(v);
  return v.map(function (x) {
    return x / n;
  });
}
module.exports.unit = unit;

/**
 * Reduce a vector to modulo 1 (interval [0,1]). Meant for fractional
 * coordinates
 * @param  {Array} v
 * @return {Array}      Reduced vector
 */
function mod1(v) {
  return v.map(function (x) {
    x = x % 1;
    return x >= 0 ? x : x + 1;
  });
}
module.exports.mod1 = mod1;

var _deg2rad = Math.PI / 180.0;

/**
 *  Convert degrees to radians
 *  @param  {number}    deg     Angle in degrees
 *  @return {number}            Angle in radians
 */
function degToRad(deg) {
  return deg * _deg2rad;
}
module.exports.degToRad = degToRad;

/**
 *  Convert radians to degrees
 *  @param  {number}    rad     Angle in radians
 *  @return {number}            Angle in degrees
 */
function radToDeg(rad) {
  return rad / _deg2rad;
}
module.exports.radToDeg = radToDeg;

/**
 *  Check if an array includes multiple elements
 *  @param  {Array}     arr     Array to check
 *  @param  {Array}     elems   Elements to search in arr
 *  @return {bool}              Whether the check was successful
 */
function includesAll(arr, elems) {
  var ans = true;
  for (var i = 0; i < elems.length; ++i) {
    ans = ans && arr.includes(elems[i]);
  }
  return ans;
}
module.exports.includesAll = includesAll;

/**
 * Shortest periodic length of a distance in fractional coordinates
 * @param  {Array} fx Fractional coordinates vector (p2-p1)
 * @return {Number}   Shortest length including periodic boundary conditions
 */
function shortestPeriodicLength(fx) {
  var r = norm(fx);

  for (var dx = -1; dx < 2; ++dx) {
    for (var dy = -1; dy < 2; ++dy) {
      for (var dz = -1; dz < 2; ++dz) {
        if (dx == 0 && dy == 0 && dz == 0) continue;
        var df = [fx[0] + dx, fx[1] + dy, fx[2] + dz];
        r = Math.min(r, norm(df));
      }
    }
  }

  return r;
}

module.exports.shortestPeriodicLength = shortestPeriodicLength;

// 将数组按照某个属性分组
function classify(arr, key) {
  let kind = []; // 存放属性标识
  let newArr = []; // 返回的数据
  arr.forEach((item) => {
    // 判断key是否存在，不存在则添加
    if (!kind.includes(item[key])) {
      kind.push(item[key]); // kind添加新标识
      newArr.push([]); // 添加数组
    }
    let index = kind.indexOf(item[key]); // 返回带有标识在kind内的下标，判断加入哪个数组
    newArr[index].push(item); // 将对象存入数组
  });
  return { kind, newArr };
}

module.exports.classify = classify;

// 转换晶格数据
function convertUnitcell(
  cell = [
    [18.0, 0.0, 0.0],
    [-9.0, 15.58845727, 0.0],
    [6.0, 3.46410162, 9.79795897],
  ]
) {
  let o = [0, 0, 0];
  let x = cell[0];
  let y = cell[1];
  let z = cell[2];
  let xy = [x[0] + y[0], x[1] + y[1], x[2] + y[2]];
  let xz = [x[0] + z[0], x[1] + z[1], x[2] + z[2]];
  let yz = [y[0] + z[0], y[1] + z[1], y[2] + z[2]];
  let xyz = [x[0] + y[0] + z[0], x[1] + y[1] + z[1], x[2] + y[2] + z[2]];

  let unitCellVectors = {
    o,
    x,
    y,
    z,
    xy,
    xz,
    yz,
    xyz,
  };

  let positionData = [];
  let normalData = [];
  // calculate vertex and normal points

  let pushSide = function (p1, p2, p3, p4) {
    positionData.push(p1[0], p1[1], p1[2]);
    positionData.push(p2[0], p2[1], p2[2]);
    positionData.push(p3[0], p3[1], p3[2]);
    positionData.push(p4[0], p4[1], p4[2]);
    // push 0s for normals so shader gives them full color
    for (let i = 0; i < 4; i++) {
      normalData.push(0, 0, 0);
    }
  };
  pushSide(
    unitCellVectors.o,
    unitCellVectors.x,
    unitCellVectors.xy,
    unitCellVectors.y
  );
  pushSide(
    unitCellVectors.o,
    unitCellVectors.y,
    unitCellVectors.yz,
    unitCellVectors.z
  );
  pushSide(
    unitCellVectors.o,
    unitCellVectors.z,
    unitCellVectors.xz,
    unitCellVectors.x
  );
  pushSide(
    unitCellVectors.yz,
    unitCellVectors.y,
    unitCellVectors.xy,
    unitCellVectors.xyz
  );
  pushSide(
    unitCellVectors.xyz,
    unitCellVectors.xz,
    unitCellVectors.z,
    unitCellVectors.yz
  );
  pushSide(
    unitCellVectors.xy,
    unitCellVectors.x,
    unitCellVectors.xz,
    unitCellVectors.xyz
  );

  // build mesh connectivity
  let indexData = [];
  for (let i = 0; i < 6; i++) {
    let start = i * 4;
    // sides
    indexData.push(
      start,
      start + 1,
      start + 1,
      start + 2,
      start + 2,
      start + 3,
      start + 3,
      start
    );
  }

  return {
    unitCellParameters: unitCellVectors,
    positionData,
    normalData,
    indexData,
  };
}

module.exports.convertUnitcell = convertUnitcell;

// 数组按照尺寸分块
function chunk(arr, size) {
  let ans = [];
  for (let i = 0; i < arr.length; i = i + size) {
    ans.push(arr.slice(i, i + size));
  }
  return ans;
}

module.exports.chunk = chunk;

function download(href, filename = "", suffix) {
  const stamp = new Date().getTime();
  const a = document.createElement("a");
  const finalName = filename + "_" + stamp.toString() + suffix;
  a.download = finalName;
  a.href = href;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function downloadFileByBlob(content, filename = "") {
  const blob = new Blob([content], { type: "text/cif;charset=UTF-8" }); // 转成blob二进制
  const blobUrl = window.URL.createObjectURL(blob);
  download(blobUrl, filename, ".cif");
  window.URL.revokeObjectURL(blobUrl);
}

module.exports.downloadFileByBlob = downloadFileByBlob;

function downloadFileByLink(content) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(content)
  );
  element.setAttribute("download", "demo.cif");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

module.exports.downloadFileByLink = downloadFileByLink;

function getUrlParams(url, name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); // 定义正则表达式
  const r = url.substr(1).match(reg);
  if (r !== null) return unescape(r[2]);
  return null;
}
module.exports.getUrlParams = getUrlParams;

function formatDate(date, format) {
  var o = {
    "M+": date.getMonth() + 1, // month
    "d+": date.getDate(), // day
    "h+": date.getHours(), // hour
    "m+": date.getMinutes(), // minute
    "s+": date.getSeconds(), // second
    "q+": Math.floor((date.getMonth() + 3) / 3), // quarter
    S: date.getMilliseconds(), // millisecond
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return format;
}
module.exports.formatDate = formatDate;

/**
 * 修改url参数
 * @param {*} key 参数名
 * @param {*} value 参数值
 */
function resetURLParam(key, value) {
  let oUrl = window.location.href.toString();
  let re = eval("/(" + key + "=)([^&]*)/gi");
  let nUrl = oUrl.replace(re, key + "=" + value);
  window.history.replaceState(null, null, nUrl);
}
module.exports.resetURLParam = resetURLParam;
