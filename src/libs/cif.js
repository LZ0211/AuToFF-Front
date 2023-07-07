export function getUnitCellFromCif (content) {
  const m = Math;

  const generateABC2XYZ = function (a, b, c, alpha, beta, gamma) {
    const d = (m.cos(alpha) - m.cos(gamma) * m.cos(beta)) / m.sin(gamma);
    return [a, 0, 0, 0, b * m.cos(gamma), b * m.sin(gamma), 0, 0, c * m.cos(beta), c * d, c * m.sqrt(1 - m.pow(m.cos(beta), 2) - d * d), 0, 0, 0, 0, 1];
  };

  const multiplyVec3 = function (mat, vec, dest) {
    if (!dest) {
      dest = vec;
    }

    const x = vec[0];
    const y = vec[1];
    const z = vec[2];

    dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
    dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
    dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];

    return dest;
  };

  const UnitCell = function (lengths, angles, offset) {
    // store data
    // lengths = lengths;
    // angles = angles;
    // offset = offset;

    const abc2xyz = generateABC2XYZ(lengths[0], lengths[1], lengths[2], angles[0], angles[1], angles[2]);

    if (!offset) {
      offset = [0, 0, 0];
    }

    const unitCellVectors = {
      o: multiplyVec3(abc2xyz, offset, []),
      x: multiplyVec3(abc2xyz, [offset[0] + 1, offset[1], offset[2]]),
      y: multiplyVec3(abc2xyz, [offset[0], offset[1] + 1, offset[2]]),
      z: multiplyVec3(abc2xyz, [offset[0], offset[1], offset[2] + 1]),
      xy: multiplyVec3(abc2xyz, [offset[0] + 1, offset[1] + 1, offset[2]]),
      xz: multiplyVec3(abc2xyz, [offset[0] + 1, offset[1], offset[2] + 1]),
      yz: multiplyVec3(abc2xyz, [offset[0], offset[1] + 1, offset[2] + 1]),
      xyz: multiplyVec3(abc2xyz, [offset[0] + 1, offset[1] + 1, offset[2] + 1])
    };

    const positionData = [];
    const normalData = [];
    // calculate vertex and normal points

    const pushSide = function (p1, p2, p3, p4) {
      positionData.push(p1[0], p1[1], p1[2]);
      positionData.push(p2[0], p2[1], p2[2]);
      positionData.push(p3[0], p3[1], p3[2]);
      positionData.push(p4[0], p4[1], p4[2]);
      // push 0s for normals so shader gives them full color
      for (let i = 0; i < 4; i++) {
        normalData.push(0, 0, 0);
      }
    };
    pushSide(unitCellVectors.o, unitCellVectors.x, unitCellVectors.xy, unitCellVectors.y);
    pushSide(unitCellVectors.o, unitCellVectors.y, unitCellVectors.yz, unitCellVectors.z);
    pushSide(unitCellVectors.o, unitCellVectors.z, unitCellVectors.xz, unitCellVectors.x);
    pushSide(unitCellVectors.yz, unitCellVectors.y, unitCellVectors.xy, unitCellVectors.xyz);
    pushSide(unitCellVectors.xyz, unitCellVectors.xz, unitCellVectors.z, unitCellVectors.yz);
    pushSide(unitCellVectors.xy, unitCellVectors.x, unitCellVectors.xz, unitCellVectors.xyz);

    // build mesh connectivity
    const indexData = [];
    for (let i = 0; i < 6; i++) {
      const start = i * 4;
      // sides
      indexData.push(start, start + 1, start + 1, start + 2, start + 2, start + 3, start + 3, start);
    }
    // storeData(positionData, normalData, indexData);
    return { positionData, normalData, indexData };
  };

  const whitespaceRegex = /\s+/g;
  const whitespaceAndParenthesisRegex = /\(|\)|\s+/g;
  const whitespaceAndQuoteRegex = /'|\s+/g;
  const whitespaceAndQuoteAndCommaRegex = /,|'|\s+/g;
  const leadingWhitespaceRegex = /^\s+/;
  const digitsRegex = /[0-9]/g;
  const digitsSymbolRegex = /[0-9]|\+|-/g;
  const lines = content.split("\n");

  let aLength = 0;
  let bLength = 0;
  let cLength = 0;
  let alphaAngle = 0;
  let betaAngle = 0;
  let gammaAngle = 0;

  let hallClass = "P";
  let transformLoop;
  let atomLoop;
  let bondLoop;
  let line;
  let shift = true;

  const filter = function (s) {
    return s.length !== 0;
  };

  while (lines.length > 0) {
    if (shift) {
      line = lines.shift();
    } else {
      shift = true;
    }
    if (line.length > 0) {
      if (line.startsWith("_cell_length_a")) {
        aLength = parseFloat(line.split(whitespaceAndParenthesisRegex)[1]);
      } else if (line.startsWith("_cell_length_b")) {
        bLength = parseFloat(line.split(whitespaceAndParenthesisRegex)[1]);
      } else if (line.startsWith("_cell_length_c")) {
        cLength = parseFloat(line.split(whitespaceAndParenthesisRegex)[1]);
      } else if (line.startsWith("_cell_angle_alpha")) {
        alphaAngle = m.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
      } else if (line.startsWith("_cell_angle_beta")) {
        betaAngle = m.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
      } else if (line.startsWith("_cell_angle_gamma")) {
        gammaAngle = m.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
      } else if (line.startsWith("_symmetry_space_group_name_H-M")) {
        hallClass = line.split(whitespaceAndQuoteRegex)[1];
      } else if (line.startsWith("loop_")) {
        const loop = {
          fields: [],
          lines: []
        };
        let pushingLines = false;
        // keep undefined check here because the line may be an
        // empty string
        while ((line = lines.shift()) !== undefined && !(line = line.replace(leadingWhitespaceRegex, "")).startsWith("loop_") && line.length > 0) {
          // remove leading whitespace that may appear in
          // subloop lines ^
          if (line.startsWith("_")) {
            if (pushingLines) {
              break;
            }
            loop.fields = loop.fields.concat(line.split(whitespaceRegex).filter(filter));
          } else {
            pushingLines = true;
            loop.lines.push(line);
          }
        }
        if (lines.length !== 0 && (line.startsWith("loop_") || line.startsWith("_"))) {
          shift = false;
        }
        if (loop.fields.includes("_symmetry_equiv_pos_as_xyz") || loop.fields.includes("_space_group_symop_operation_xyz")) {
          transformLoop = loop;
        } else if (loop.fields.includes("_atom_site_label")) {
          atomLoop = loop;
        } else if (loop.fields.includes("_geom_bond_atom_site_label_1")) {
          bondLoop = loop;
        }
      }
    }
  }
  // console.log();
  return { unitCell: UnitCell([aLength, bLength, cLength], [alphaAngle, betaAngle, gammaAngle], [0, 0, 0]) };
}

// export default { parseCIF };
