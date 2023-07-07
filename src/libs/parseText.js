import { ElementAtom } from "@/libs/parser.js";

const elements = ElementAtom();

// 解析mol2文件
export function parseMOL2File(content) {
  // 去除前2行
  let whitespaceRegex = /\s+/g;
  let lines = content.split("\n");
  // lines = lines.slice(2);

  // 过滤@<TRIPOS>MOLECULE前的垃圾注释行
  while (lines.length > 0) {
    let row = lines.shift();
    if (row.includes(`@<TRIPOS>MOLECULE`)) {
      break;
    }
  }
  lines.shift(); //此时删掉第一行的Molecule from后，lines[0]就对头了
  // console.log("lines", lines);

  // 第三行为原子和键的数量
  let countLine = lines[0];
  let words = countLine
    .split(whitespaceRegex)
    .map((item) => item.trim())
    .filter((i) => i.length !== 0);
  let atomsLength = Number(words[0]);
  let bondsLength = Number(words[1]);
  lines.shift();

  console.log("words", words);

  // 找到原子起始行后启动
  while (lines.length > 0) {
    let row = lines.shift();
    if (row.includes(`@<TRIPOS>ATOM`)) {
      break;
    }
  }
  const atomLines = lines.slice(0, atomsLength);
  let i = 0;
  let atoms = [];
  while (i < atomsLength) {
    let currLine = atomLines[i];
    atoms.push(parseAtomLine(currLine));
    i++;
  }

  // 找到键起始行后启动
  while (lines.length > 0) {
    let row = lines.shift();
    if (row.includes(`@<TRIPOS>BOND`)) {
      break;
    }
  }
  const bondLines = lines.slice(0, bondsLength);
  let j = 0;
  let bonds = [];
  while (j < bondsLength) {
    let currLine = bondLines[j];
    bonds.push(parseBondLine(currLine));
    j++;
  }

  // 找到晶格起始行后启动
  while (lines.length > 0) {
    let row = lines.shift();
    if (row.includes(`@<TRIPOS>CRYSTAL`)) {
      console.log("找到了晶格关键字");
      break;
    }
  }

  // 如果有cell的数据
  let cell = [];
  if (lines.length > 0) {
    const cellLines = lines.slice(0, 3);
    let k = 0;
    while (k < 3) {
      let currLine = cellLines[k];
      let words = currLine
        .split(whitespaceRegex)
        .map((item) => item.trim())
        .filter((i) => i.length !== 0);
      cell.push([Number(words[0]), Number(words[1]), Number(words[2])]);
      k++;
    }
  }

  // 找到晶格起始行后启动
  while (lines.length > 0) {
    let row = lines.shift();
    if (row.includes(`@<TRIPOS>IMG-ATOM`)) {
      break;
    }
  }
  // 以下是将扩展的原子和键放入不同的数组中
  let extraAtomLines = [],
    extraAtoms = [];
  let extraBondLines = [],
    extraBonds = [];
  while (lines.length > 0) {
    let row = lines.shift();
    if (row.includes(`@<TRIPOS>IMG-BOND`)) {
      break;
    } else {
      extraAtomLines.push(row);
    }
  }
  while (lines.length > 0) {
    let row = lines.shift();
    if (row.includes(`@<TRIPOS>CROSS-BOND`)) {
      break;
    } else {
      extraBondLines.push(row);
    }
  }
  extraAtomLines.forEach((atomLine) => {
    // console.log(atomLine);
    extraAtoms.push(parseAtomLine(atomLine));
  });
  extraBondLines.forEach((bondLine) => {
    extraBonds.push(parseBondLine(bondLine));
  });

  console.log({
    atoms,
    bonds,
    cell,
    extraAtoms, // 扩展的atoms和bonds
    extraBonds,
  });

  return {
    atoms,
    bonds,
    cell,
    extraAtoms, // 扩展的atoms和bonds
    extraBonds,
  };
}

// 解析Atom的line
export function parseAtomLine(lineString) {
  let whitespaceRegex = /\s+/g;
  let words = lineString
    .split(whitespaceRegex)
    .map((item) => item.trim())
    .filter((i) => i.length !== 0);
  // 取第六列的首元素
  let element = words[5].split(".")[0];
  if (!elements[element]) {
    element = words[1];
  }

  if (element === "CL") {
    element = "Cl"; // Cl元素chembood会显示label为'CL'，这里转化下
  }
  return {
    x: words[2],
    y: words[3],
    z: words[4],
    label: element,
    id: words[0], // atom标个序号
    charge: words[8],
  };
}

// 解析Bond的line
export function parseBondLine(lineString) {
  let whitespaceRegex = /\s+/g;
  let words = lineString
    .split(whitespaceRegex)
    .map((item) => item.trim())
    .filter((i) => i.length !== 0);
  return {
    s: words[1],
    e: words[2],
    type: words[3],
  };
}
