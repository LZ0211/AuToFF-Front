// unicode下标数字映射
const miniNumberStr = "₀₁₂₃₄₅₆₇₈₉";
const replaceMiniNumber = str => {
  if (!str) return "";
  let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  str = str.split("").map(item => {
    return arr.includes(item) ? miniNumberStr[Number(item)] : item;
  }).join("");
  return str;
};



export { replaceMiniNumber };