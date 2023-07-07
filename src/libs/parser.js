let whitespaceRegex = /\s+/g;
let whitespaceAndParenthesisRegex = /\(|\)|\s+/g;
let whitespaceAndQuoteRegex = /\'|\s+/g;
let whitespaceAndQuoteAndCommaRegex = /,|\'|\s+/g;
let leadingWhitespaceRegex = /^\s+/;
let digitsRegex = /[0-9]/g;
let digitsSymbolRegex = /[0-9]|\+|\-/g;
let hallTranslations = {
  "P": [],
  "A": [[0, .5, .5]],
  "B": [[.5, 0, .5]],
  "C": [[.5, .5, 0]],
  "I": [[.5, .5, .5]],
  "R": [[2 / 3, 1 / 3, 1 / 3], [1 / 3, 2 / 3, 2 / 3]],
  "S": [[1 / 3, 1 / 3, 2 / 3], [2 / 3, 2 / 3, 1 / 3]],
  "T": [[1 / 3, 2 / 3, 1 / 3], [2 / 3, 1 / 3, 2 / 3]],
  "F": [[0, .5, .5], [.5, 0, .5], [.5, .5, 0]]
};

let filter = function (s) {
  return s.length !== 0;
};
let Atom = function (label, x, y, z) {
  this.label = label ? label.trim() : "C";
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.z = z ? z : 0;
};

// 元素基本参数数据
export function ElementAtom () {
  let E = [];

  function Element (symbol, name, atomicNumber, addH, color, covalentRadius, vdWRadius, valency, mass, atomicRadius, ionicRadius, vestaVdwRadius) {
    this.symbol = symbol;
    this.name = name;
    this.atomicNumber = atomicNumber;
    this.addH = addH;
    this.jmolColor = this.pymolColor = color;
    this.covalentRadius = covalentRadius;
    this.vdWRadius = vdWRadius;
    this.valency = valency;
    this.mass = mass;
    this.atomicRadius = atomicRadius;
    this.ionicRadius = ionicRadius;
    this.vestaVdwRadius = vestaVdwRadius;
  }

  E.H = new Element("H", "Hydrogen", 1, false, "#D3D3D3", 0.31, 1.1, 1, 1, 0.46, 1.20, 0.200);
  E.He = new Element("He", "Helium", 2, false, "#D9FFFF", 0.28, 1.4, 0, 4, 1.22, 1.40, 1.220);
  E.Li = new Element("Li", "Lithium", 3, false, "#CC80FF", 1.28, 1.82, 1, 7, 1.57, 1.40, 0.590);
  E.Be = new Element("Be", "Beryllium", 4, false, "#C2FF00", 0.96, 1.53, 2, 9, 1.12, 1.40, 0.270);
  E.B = new Element("B", "Boron", 5, true, "#FFB5B5", 0.84, 1.92, 3, 11, 0.81, 1.40, 0.110);
  E.C = new Element("C", "Carbon", 6, true, "#909090", 0.76, 1.7, 4, 12, 0.77, 1.70, 0.150);
  E.N = new Element("N", "Nitrogen", 7, true, "#3050F8", 0.71, 1.55, 3, 14, 0.74, 1.55, 1.460);
  E.O = new Element("O", "Oxygen", 8, true, "#FF0D0D", 0.66, 1.52, 2, 16, 0.74, 1.52, 1.400);
  E.F = new Element("F", "Fluorine", 9, true, "#90E050", 0.57, 1.47, 1, 19, 0.72, 1.47, 1.330);
  E.Ne = new Element("Ne", "Neon", 10, false, "#B3E3F5", 0.58, 1.54, 0, 20, 1.60, 1.54, 1.600);
  E.Na = new Element("Na", "Sodium", 11, false, "#AB5CF2", 1.66, 2.27, 1, 23, 1.91, 1.54, 1.020);
  E.Mg = new Element("Mg", "Magnesium", 12, false, "#8AFF00", 1.41, 1.73, 0, 24, 1.60, 1.54, 0.720);
  E.Al = new Element("Al", "Aluminum", 13, false, "#BFA6A6", 1.21, 1.84, 0, 27, 1.43, 1.54, 0.390);
  E.Si = new Element("Si", "Silicon", 14, true, "#F0C8A0", 1.11, 2.1, 4, 28, 1.18, 2.10, 0.260);
  E.P = new Element("P", "Phosphorus", 15, true, "#FF8000", 1.07, 1.8, 3, 31, 1.10, 1.80, 0.170);
  E.S = new Element("S", "Sulfur", 16, true, "#FFFF30", 1.05, 1.8, 2, 32, 1.04, 1.80, 1.840);
  E.Cl = new Element("Cl", "Chlorine", 17, true, "#1FF01F", 1.02, 1.75, 1, 35, 0.99, 1.75, 1.810);
  E.Ar = new Element("Ar", "Argon", 18, false, "#80D1E3", 1.06, 1.88, 0, 40, 1.92, 1.88, 1.920);
  E.K = new Element("K", "Potassium", 19, false, "#8F40D4", 2.03, 2.75, 0, 39, 2.35, 1.88, 1.510);
  E.Ca = new Element("Ca", "Calcium", 20, false, "#3DFF00", 1.76, 2.31, 0, 40, 1.97, 1.88, 1.120);
  E.Sc = new Element("Sc", "Scandium", 21, false, "#E6E6E6", 1.7, 2.01, 0, 45, 1.64, 1.88, 0.745);
  E.Ti = new Element("Ti", "Titanium", 22, false, "#BFC2C7", 1.6, 1.79, 1, 48, 1.47, 1.88, 0.605);
  E.V = new Element("V", "Vanadium", 23, false, "#A6A6AB", 1.53, 1.69, 1, 51, 1.35, 1.88, 0.580);
  E.Cr = new Element("Cr", "Chromium", 24, false, "#8A99C7", 1.39, 1.65, 2, 52, 1.29, 1.88, 0.615);
  E.Mn = new Element("Mn", "Manganese", 25, false, "#9C7AC7", 1.39, 1.64, 3, 55, 1.37, 1.88, 0.830);
  E.Fe = new Element("Fe", "Iron", 26, false, "#E06633", 1.32, 1.63, 2, 56, 1.26, 1.88, 0.780);
  E.Co = new Element("Co", "Cobalt", 27, false, "#F090A0", 1.26, 1.63, 1, 59, 1.25, 1.88, 0.745);
  E.Ni = new Element("Ni", "Nickel", 28, false, "#50D050", 1.24, 1.63, 1, 58, 1.25, 1.88, 0.690);
  E.Cu = new Element("Cu", "Copper", 29, false, "#C88033", 1.32, 1.4, 0, 63, 1.28, 1.88, 0.730);
  E.Zn = new Element("Zn", "Zinc", 30, false, "#7D80B0", 1.22, 1.39, 0, 64, 1.37, 1.88, 0.740);
  E.Ga = new Element("Ga", "Gallium", 31, false, "#C28F8F", 1.22, 1.87, 0, 69, 1.53, 1.88, 0.620);
  E.Ge = new Element("Ge", "Germanium", 32, false, "#668F8F", 1.2, 2.11, 4, 74, 1.22, 1.88, 0.530);
  E.As = new Element("As", "Arsenic", 33, true, "#BD80E3", 1.19, 1.85, 3, 75, 1.21, 1.85, 0.335);
  E.Se = new Element("Se", "Selenium", 34, true, "#FFA100", 1.2, 1.9, 2, 80, 1.04, 1.90, 1.980);
  E.Br = new Element("Br", "Bromine", 35, true, "#A62929", 1.2, 1.85, 1, 79, 1.14, 1.85, 1.960);
  E.Kr = new Element("Kr", "Krypton", 36, false, "#5CB8D1", 1.16, 2.02, 0, 84, 1.98, 2.02, 1.980);
  E.Rb = new Element("Rb", "Rubidium", 37, false, "#702EB0", 2.2, 3.03, 0, 85, 2.50, 2.02, 1.610);
  E.Sr = new Element("Sr", "Strontium", 38, false, "#00FF00", 1.95, 2.49, 0, 88, 2.15, 2.02, 1.260);
  E.Y = new Element("Y", "Yttrium", 39, false, "#94FFFF", 1.9, 2.20, 0, 89, 1.82, 2.02, 1.019);
  E.Zr = new Element("Zr", "Zirconium", 40, false, "#94E0E0", 1.75, 2.05, 0, 90, 1.60, 2.02, 0.720);
  E.Nb = new Element("Nb", "Niobium", 41, false, "#73C2C9", 1.64, 2.10, 1, 93, 1.47, 2.02, 0.640);
  E.Mo = new Element("Mo", "Molybdenum", 42, false, "#54B5B5", 1.54, 2.08, 2, 98, 1.40, 2.02, 0.590);
  E.Tc = new Element("Tc", "Technetium", 43, false, "#3B9E9E", 1.47, 2.00, 3, 0, 1.35, 2.02, 0.560);
  E.Ru = new Element("Ru", "Ruthenium", 44, false, "#248F8F", 1.46, 2.00, 2, 102, 1.34, 2.02, 0.620);
  E.Rh = new Element("Rh", "Rhodium", 45, false, "#0A7D8C", 1.42, 2.00, 1, 103, 1.34, 2.02, 0.665);
  E.Pd = new Element("Pd", "Palladium", 46, false, "#006985", 1.39, 1.63, 0, 106, 1.37, 2.02, 0.860);
  E.Ag = new Element("Ag", "Silver", 47, false, "#C0C0C0", 1.45, 1.72, 0, 107, 1.44, 2.02, 1.150);
  E.Cd = new Element("Cd", "Cadmium", 48, false, "#FFD98F", 1.44, 1.58, 0, 114, 1.52, 2.02, 0.950);
  E.In = new Element("In", "Indium", 49, false, "#A67573", 1.42, 1.93, 0, 115, 1.67, 2.02, 0.800);
  E.Sn = new Element("Sn", "Tin", 50, false, "#668080", 1.39, 2.17, 4, 120, 1.58, 2.02, 0.690);
  E.Sb = new Element("Sb", "Antimony", 51, false, "#9E63B5", 1.39, 2.06, 3, 121, 1.41, 2.00, 0.760);
  E.Te = new Element("Te", "Tellurium", 52, true, "#D47A00", 1.38, 2.06, 2, 130, 1.37, 2.06, 2.210);
  E.I = new Element("I", "Iodine", 53, true, "#940094", 1.39, 1.98, 1, 127, 1.33, 1.98, 2.200);
  E.Xe = new Element("Xe", "Xenon", 54, false, "#429EB0", 1.4, 2.16, 0, 132, 2.18, 2.16, 0.480);
  E.Cs = new Element("Cs", "Cesium", 55, false, "#57178F", 2.44, 3.43, 0, 133, 2.72, 2.16, 1.740);
  E.Ba = new Element("Ba", "Barium", 56, false, "#00C900", 2.15, 2.68, 0, 138, 2.24, 2.16, 1.420);
  E.La = new Element("La", "Lanthanum", 57, false, "#70D4FF", 2.07, 2.00, 0, 139, 1.88, 2.16, 1.160);
  E.Ce = new Element("Ce", "Cerium", 58, false, "#FFFFC7", 2.04, 2.00, 0, 140, 1.82, 2.16, 0.970);
  E.Pr = new Element("Pr", "Praseodymium", 59, false, "#D9FFC7", 2.03, 2.00, 0, 141, 1.82, 2.16, 1.126);
  E.Nd = new Element("Nd", "Neodymium", 60, false, "#C7FFC7", 2.01, 2.00, 0, 142, 1.82, 2.16, 1.109);
  E.Pm = new Element("Pm", "Promethium", 61, false, "#A3FFC7", 1.99, 2.00, 0, 0, 1.81, 2.16, 1.093);
  E.Sm = new Element("Sm", "Samarium", 62, false, "#8FFFC7", 1.98, 2.00, 0, 152, 1.81, 2.16, 1.270);
  E.Eu = new Element("Eu", "Europium", 63, false, "#61FFC7", 1.98, 2.00, 0, 153, 2.06, 2.16, 1.066);
  E.Gd = new Element("Gd", "Gadolinium", 64, false, "#45FFC7", 1.96, 2.00, 0, 158, 1.79, 2.16, 1.053);
  E.Tb = new Element("Tb", "Terbium", 65, false, "#30FFC7", 1.94, 2.00, 0, 159, 1.77, 2.16, 1.040);
  E.Dy = new Element("Dy", "Dysprosium", 66, false, "#1FFFC7", 1.92, 2.00, 0, 164, 1.77, 2.16, 1.027);
  E.Ho = new Element("Ho", "Holmium", 67, false, "#00FF9C", 1.92, 2.00, 0, 165, 1.76, 2.16, 1.015);
  E.Er = new Element("Er", "Erbium", 68, false, "#00E675", 1.89, 2.00, 0, 166, 1.75, 2.16, 1.004);
  E.Tm = new Element("Tm", "Thulium", 69, false, "#00D452", 1.9, 2.00, 0, 169, 1.00, 2.16, 0.994);
  E.Yb = new Element("Yb", "Ytterbium", 70, false, "#00BF38", 1.87, 2.00, 0, 174, 1.94, 2.16, 0.985);
  E.Lu = new Element("Lu", "Lutetium", 71, false, "#00AB24", 1.87, 2.00, 0, 175, 1.72, 2.16, 0.977);
  E.Hf = new Element("Hf", "Hafnium", 72, false, "#4DC2FF", 1.75, 2.00, 0, 180, 1.59, 2.16, 0.710);
  E.Ta = new Element("Ta", "Tantalum", 73, false, "#4DA6FF", 1.7, 2.00, 1, 181, 1.47, 2.16, 0.640);
  E.W = new Element("W", "Tungsten", 74, false, "#2194D6", 1.62, 2.00, 2, 184, 1.41, 2.16, 0.600);
  E.Re = new Element("Re", "Rhenium", 75, false, "#267DAB", 1.51, 2.00, 3, 187, 1.37, 2.16, 0.530);
  E.Os = new Element("Os", "Osmium", 76, false, "#266696", 1.44, 2.00, 2, 192, 1.35, 2.16, 0.630);
  E.Ir = new Element("Ir", "Iridium", 77, false, "#175487", 1.41, 2.00, 3, 193, 1.36, 2.16, 0.625);
  E.Pt = new Element("Pt", "Platinum", 78, false, "#D0D0E0", 1.36, 1.75, 0, 195, 1.39, 2.16, 0.625);
  E.Au = new Element("Au", "Gold", 79, false, "#FFD123", 1.36, 1.66, 1, 197, 1.44, 2.16, 1.370);
  E.Hg = new Element("Hg", "Mercury", 80, false, "#B8B8D0", 1.32, 1.55, 0, 202, 1.55, 2.16, 1.020);
  E.Tl = new Element("Tl", "Thallium", 81, false, "#A6544D", 1.45, 1.96, 0, 205, 1.71, 2.16, 0.885);
  E.Pb = new Element("Pb", "Lead", 82, false, "#575961", 1.46, 2.02, 4, 208, 1.75, 2.16, 1.190);
  E.Bi = new Element("Bi", "Bismuth", 83, false, "#9E4FB5", 1.48, 2.07, 3, 209, 1.82, 2.16, 1.030);
  E.Po = new Element("Po", "Polonium", 84, false, "#AB5C00", 1.4, 1.97, 2, 0, 1.77, 2.16, 0.940);
  E.At = new Element("At", "Astatine", 85, true, "#754F45", 1.5, 2.02, 1, 0, 0.62, 2.16, 0.620);
  E.Rn = new Element("Rn", "Radon", 86, false, "#428296", 1.5, 2.2, 0, 0, 0.80, 2.16, 0.800);
  E.Fr = new Element("Fr", "Francium", 87, false, "#420066", 2.6, 3.48, 0, 0, 1.00, 2.16, 1.800);
  E.Ra = new Element("Ra", "Radium", 88, false, "#007D00", 2.21, 2.83, 0, 0, 2.35, 2.16, 1.480);
  E.Ac = new Element("Ac", "Actinium", 89, false, "#70ABFA", 2.15, 2.00, 0, 0, 2.03, 2.16, 1.120);
  E.Th = new Element("Th", "Thorium", 90, false, "#00BAFF", 2.06, 2.00, 0, 232, 1.80, 2.16, 1.050);
  E.Pa = new Element("Pa", "Protactinium", 91, false, "#00A1FF", 2, 2.00, 0, 231, 1.63, 2.16, 0.780);
  E.U = new Element("U", "Uranium", 92, false, "#008FFF", 1.96, 1.86, 0, 238, 1.56, 2.16, 0.730);
  E.Np = new Element("Np", "Neptunium", 93, false, "#0080FF", 1.9, 2.00, 0, 0, 1.56, 2.16, 0.750);
  E.Pu = new Element("Pu", "Plutonium", 94, false, "#006BFF", 1.87, 2.00, 0, 0, 1.64, 2.16, 0.860);
  E.Am = new Element("Am", "Americium", 95, false, "#545CF2", 1.8, 2.00, 0, 0, 1.73, 2.16, 0.975);
  E.Cm = new Element("Cm", "Curium", 96, false, "#785CE3", 1.69, 2.00, 0, 0, 0.80, 1.00, 0.800);
  E.Bk = new Element("Bk", "Berkelium", 97, false, "#8A4FE3", 0, 2.00, 0, 0, 0, 0, 0);
  E.Cf = new Element("Cf", "Californium", 98, false, "#A136D4", 0, 2.00, 0, 0, 0, 0, 0);
  E.Es = new Element("Es", "Einsteinium", 99, false, "#B31FD4", 0, 2.00, 0, 0, 0, 0, 0);
  E.Fm = new Element("Fm", "Fermium", 100, false, "#B31FBA", 0, 2.00, 0, 0, 0, 0, 0);
  E.Md = new Element("Md", "Mendelevium", 101, false, "#B30DA6", 0, 2.00, 0, 0, 0, 0, 0);
  E.No = new Element("No", "Nobelium", 102, false, "#BD0D87", 0, 2.00, 0, 0, 0, 0, 0);
  E.Lr = new Element("Lr", "Lawrencium", 103, false, "#C70066", 0, 2.00, 0, 0, 0, 0, 0);
  E.Rf = new Element("Rf", "Rutherfordium", 104, false, "#CC0059", 0, 2.00, 0, 0, 0, 0, 0);
  E.Db = new Element("Db", "Dubnium", 105, false, "#D1004F", 0, 2.00, 0, 0, 0, 0, 0);
  E.Sg = new Element("Sg", "Seaborgium", 106, false, "#D90045", 0, 2.00, 0, 0, 0, 0, 0);
  E.Bh = new Element("Bh", "Bohrium", 107, false, "#E00038", 0, 2.00, 0, 0, 0, 0, 0);
  E.Hs = new Element("Hs", "Hassium", 108, false, "#E6002E", 0, 2.00, 0, 0, 0, 0, 0);
  E.Mt = new Element("Mt", "Meitnerium", 109, false, "#EB0026", 0, 2.00, 0, 0, 0, 0, 0);
  E.Ds = new Element("Ds", "Darmstadtium", 110, false, "#000000", 0, 2.00, 0, 0, 0, 0, 0);
  E.Rg = new Element("Rg", "Roentgenium", 111, false, "#000000", 0, 2.00, 0, 0, 0, 0, 0);
  E.Cn = new Element("Cn", "Copernicium", 112, false, "#000000", 0, 2.00, 0, 0, 0, 0, 0);
  E.Nh = new Element("Nh", "Nihonium", 113, false, "#000000", 0, 2.00, 0, 0, 0, 0, 0);
  E.Fl = new Element("Fl", "Flerovium", 114, false, "#000000", 0, 2.00, 0, 0, 0, 0, 0);
  E.Mc = new Element("Mc", "Moscovium", 115, false, "#000000", 0, 2.00, 0, 0, 0, 0, 0);
  E.Lv = new Element("Lv", "Livermorium", 116, false, "#000000", 0, 2.00, 0, 0, 0, 0, 0);
  E.Ts = new Element("Ts", "Tennessine", 117, false, "#000000", 0, 2.00, 0, 0, 0, 0, 0);
  E.Og = new Element("Og", "Oganesson", 118, false, "#000000", 0, 2.00, 0, 0, 0, 0, 0);
  E.LP = new Element("LP", "LP", 119, false, "#24DBFA", 0.155, 0.82, 0.5, 0.5, 0.23, 0.6, 0.1); // 自己加的水分子

  E.H.pymolColor = "#E6E6E6";
  E.C.pymolColor = "#33FF33";
  E.N.pymolColor = "#3333FF";
  E.O.pymolColor = "#FF4D4D";
  E.F.pymolColor = "#B3FFFF";
  E.S.pymolColor = "#E6C640";

  return E;
}

let distance3D = function (p, q) {
  let dx = p.x - q.x;
  let dy = p.y - q.y;
  let dz = p.z - q.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

function Bond (a1, a2, bondOrder) {
  this.a1 = a1;
  this.a2 = a2;
  // bondOrder can be 0, so need to check against undefined
  this.bondOrder = bondOrder !== undefined ? bondOrder : 1;
}

function generateABC2XYZ (a, b, c, alpha, beta, gamma) {
  let d = (Math.cos(alpha) - Math.cos(gamma) * Math.cos(beta)) / Math.sin(gamma);
  return [a, 0, 0, 0, b * Math.cos(gamma), b * Math.sin(gamma), 0, 0, c * Math.cos(beta), c * d, c * Math.sqrt(1 - Math.pow(Math.cos(beta), 2) - d * d), 0, 0, 0, 0, 1];
}

function parseTransform (s) {
  let displacement = 0;
  let x = 0, y = 0, z = 0;
  let indexx = s.indexOf("x");
  let indexy = s.indexOf("y");
  let indexz = s.indexOf("z");
  if (indexx !== -1) {
    x++;
    if (indexx > 0 && s.charAt(indexx - 1) !== "+") {
      x *= -1;
    }
  }
  if (indexy !== -1) {
    y++;
    if (indexy > 0 && s.charAt(indexy - 1) !== "+") {
      y *= -1;
    }
  }
  if (indexz !== -1) {
    z++;
    if (indexz > 0 && s.charAt(indexz - 1) !== "+") {
      z *= -1;
    }
  }
  if (s.length > 2) {
    let op = "+";
    for (let i = 0, ii = s.length; i < ii; i++) {
      let l = s.charAt(i);
      if ((l === "-" || l === "/") && (i === s.length - 1 || s.charAt(i + 1).match(digitsRegex))) {
        op = l;
      }
      if (l.match(digitsRegex)) {
        if (op === "+") {
          displacement += parseInt(l);
        } else if (op === "-") {
          displacement -= parseInt(l);
        } else if (op === "/") {
          displacement /= parseInt(l);
        }
      }
    }
  }
  return [displacement, x, y, z];
}

function isInUnitCell (atom) {
  return atom.x >= 0.0 && atom.x <= 1.0 && atom.y >= 0.0 && atom.y <= 1.0 && atom.z >= 0.0 && atom.z <= 1.0;
}

function isInnerUnitCell (atom) {
  return atom.x > 0.0 && atom.x < 1.0 && atom.y > 0.0 && atom.y < 1.0 && atom.z > 0.0 && atom.z < 1.0;
}

function multiplyVec3InM4 (mat, vec, dest) {
  if (!dest) {
    dest = vec;
  }

  var x = vec[0], y = vec[1], z = vec[2];

  dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
  dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
  dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];

  return dest;
}

function getPointsPerAngstrom () {
  return 1;
}

function deduceCovalentBonds (molecule, customPointsPerAngstrom) {
  let ELEMENT = ElementAtom();

  let pointsPerAngstrom = getPointsPerAngstrom();
  if (customPointsPerAngstrom) {
    pointsPerAngstrom = customPointsPerAngstrom;
  }
  let nums = 0;
  // 算键
  for (let i = 0, ii = molecule.atoms.length; i < ii; i++) {
    for (let j = i + 1; j < ii; j++) {
      let first = molecule.atoms[i];
      let second = molecule.atoms[j];
      // 二者不都为金属，成键
      if (isMetal(ELEMENT[first.label]) && isMetal(ELEMENT[second.label])) {
        continue;
      }
      if (distance3D(first, second) < (ELEMENT[first.label].covalentRadius + ELEMENT[second.label].covalentRadius) * pointsPerAngstrom * 1.15) {
        molecule.bonds.push(new Bond(first, second, nums++));
      }
    }
  }
}

function UnitCell (lengths, angles, offset) {
  // store data
  this.lengths = lengths;
  this.angles = angles;
  this.offset = offset;

  let abc2xyz = generateABC2XYZ(lengths[0], lengths[1], lengths[2], angles[0], angles[1], angles[2]);

  if (!offset) {
    this.offset = [0, 0, 0];
  }

  this.unitCellVectors = {
    o: multiplyVec3InM4(abc2xyz, this.offset, []),
    x: multiplyVec3InM4(abc2xyz, [this.offset[0] + 1, this.offset[1], this.offset[2]]),
    y: multiplyVec3InM4(abc2xyz, [this.offset[0], this.offset[1] + 1, this.offset[2]]),
    z: multiplyVec3InM4(abc2xyz, [this.offset[0], this.offset[1], this.offset[2] + 1]),
    xy: multiplyVec3InM4(abc2xyz, [this.offset[0] + 1, this.offset[1] + 1, this.offset[2]]),
    xz: multiplyVec3InM4(abc2xyz, [this.offset[0] + 1, this.offset[1], this.offset[2] + 1]),
    yz: multiplyVec3InM4(abc2xyz, [this.offset[0], this.offset[1] + 1, this.offset[2] + 1]),
    xyz: multiplyVec3InM4(abc2xyz, [this.offset[0] + 1, this.offset[1] + 1, this.offset[2] + 1])
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
  pushSide(this.unitCellVectors.o, this.unitCellVectors.x, this.unitCellVectors.xy, this.unitCellVectors.y);
  pushSide(this.unitCellVectors.o, this.unitCellVectors.y, this.unitCellVectors.yz, this.unitCellVectors.z);
  pushSide(this.unitCellVectors.o, this.unitCellVectors.z, this.unitCellVectors.xz, this.unitCellVectors.x);
  pushSide(this.unitCellVectors.yz, this.unitCellVectors.y, this.unitCellVectors.xy, this.unitCellVectors.xyz);
  pushSide(this.unitCellVectors.xyz, this.unitCellVectors.xz, this.unitCellVectors.z, this.unitCellVectors.yz);
  pushSide(this.unitCellVectors.xy, this.unitCellVectors.x, this.unitCellVectors.xz, this.unitCellVectors.xyz);

  // build mesh connectivity
  let indexData = [];
  for (let i = 0; i < 6; i++) {
    let start = i * 4;
    // sides
    indexData.push(start, start + 1, start + 1, start + 2, start + 2, start + 3, start + 3, start);
  }

  return { unitCellParameters: this.unitCellVectors, lengths, angles, positionData, normalData, indexData };
}

// 判断是不是金属元素
function isMetal (Element) {
  let metalNumbers1 = [3, 4, 11, 12, 13, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
  let metalNumbers2 = [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84];
  let metalNumbers3 = [87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116];
  return metalNumbers1.includes(Element.atomicNumber) || metalNumbers2.includes(Element.atomicNumber) || metalNumbers3.includes(Element.atomicNumber);
}

// shortcuts
export function readCIF (content, xSuper, ySuper, zSuper) {
  console.log("content cif");
  xSuper = xSuper ? xSuper : 1;
  ySuper = ySuper ? ySuper : 1;
  zSuper = zSuper ? zSuper : 1;

  // 默认返回内容
  function Molecule () {
    this.atoms = [];
    this.bonds = [];
    this.rings = [];
  }

  let molecule = new Molecule();
  if (!content) {
    return molecule;
  }

  // 解析cif文件
  let lines = content.split("\n");
  let aLength = 0, bLength = 0, cLength = 0, alphaAngle = 0, betaAngle = 0, gammaAngle = 0;
  let hallClass = "P";
  let transformLoop;
  let atomLoop;
  let bondLoop;

  let line;
  let shift = true;
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
        alphaAngle = Math.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
      } else if (line.startsWith("_cell_angle_beta")) {
        betaAngle = Math.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
      } else if (line.startsWith("_cell_angle_gamma")) {
        gammaAngle = Math.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
      } else if (line.startsWith("_symmetry_space_group_name_H-M")) {
        hallClass = line.split(whitespaceAndQuoteRegex)[1];
      } else if (line.startsWith("loop_")) {
        let loop = {
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
        if (loop.fields.indexOf("_symmetry_equiv_pos_as_xyz") !== -1 || loop.fields.indexOf("_space_group_symop_operation_xyz") !== -1) {
          transformLoop = loop;
        } else if (loop.fields.indexOf("_atom_site_label") !== -1) {
          atomLoop = loop;
        } else if (loop.fields.indexOf("_geom_bond_atom_site_label_1") !== -1) {
          bondLoop = loop;
        }
      }
    }
  }
  // console.log("transformLoop, atomLoop", transformLoop, atomLoop);
  let abc2xyz = generateABC2XYZ(aLength, bLength, cLength, alphaAngle, betaAngle, gammaAngle);
  // internal atom coordinates 内部原子坐标
  if (atomLoop) {
    let labelIndex = -1, altLabelIndex = -1, xIndex = -1, yIndex = -1, zIndex = -1;
    for (let i = 0, ii = atomLoop.fields.length; i < ii; i++) {
      let field = atomLoop.fields[i];
      if (field === "_atom_site_type_symbol") {
        labelIndex = i;
      } else if (field === "_atom_site_label") {
        altLabelIndex = i;
      } else if (field === "_atom_site_fract_x") {
        xIndex = i;
      } else if (field === "_atom_site_fract_y") {
        yIndex = i;
      } else if (field === "_atom_site_fract_z") {
        zIndex = i;
      }
    }
    for (let i = 0, ii = atomLoop.lines.length; i < ii; i++) {
      line = atomLoop.lines[i];
      let tokens = line.split(whitespaceRegex).filter(filter);
      let a = new Atom(tokens[labelIndex === -1 ? altLabelIndex : labelIndex].split(digitsSymbolRegex)[0], parseFloat(tokens[xIndex]), parseFloat(tokens[yIndex]), parseFloat(tokens[zIndex]));
      molecule.atoms.push(a);
      if (altLabelIndex !== -1) {
        a.cifId = tokens[altLabelIndex];
        a.cifPart = 0;
      }
    }
  }

  // 记录包含哪些elements
  molecule.elements = [...new Set(molecule.atoms.map(e => e.label))];

  // transforms, unless bonds are specified
  if (transformLoop && !bondLoop) {
    // assume the index is 0, just incase a different identifier is
    // used
    let symIndex = 0;
    for (let i = 0, ii = transformLoop.fields.length; i < ii; i++) {
      let field = transformLoop.fields[i];
      if (field === "_symmetry_equiv_pos_as_xyz" || field === "_space_group_symop_operation_xyz") {
        symIndex = i;
      }
    }
    let impliedTranslations = hallTranslations[hallClass];
    let add = [];
    for (let i = 0, ii = transformLoop.lines.length; i < ii; i++) {
      let parts = transformLoop.lines[i].split(whitespaceAndQuoteAndCommaRegex).filter(filter);
      let multx = parseTransform(parts[symIndex]);
      let multy = parseTransform(parts[symIndex + 1]);
      let multz = parseTransform(parts[symIndex + 2]);
      for (let j = 0, jj = molecule.atoms.length; j < jj; j++) {
        let a = molecule.atoms[j];
        let x = a.x * multx[1] + a.y * multx[2] + a.z * multx[3] + multx[0];
        let y = a.x * multy[1] + a.y * multy[2] + a.z * multy[3] + multy[0];
        let z = a.x * multz[1] + a.y * multz[2] + a.z * multz[3] + multz[0];
        let copy1 = new Atom(a.label, x, y, z);
        add.push(copy1);
        // cifID could be 0, so check for undefined
        if (a.cifId !== undefined) {
          copy1.cifId = a.cifId;
          copy1.cifPart = i + 1;
        }
        if (impliedTranslations) {
          for (let k = 0, kk = impliedTranslations.length; k < kk; k++) {
            let trans = impliedTranslations[k];
            let copy2 = new Atom(a.label, x + trans[0], y + trans[1], z + trans[2]);
            add.push(copy2);
            // cifID could be 0, so check for undefined
            if (a.cifId !== undefined) {
              copy2.cifId = a.cifId;
              copy2.cifPart = i + 1;
            }
          }
        }
      }
    }
    // make sure all atoms are within the unit cell
    for (let i = 0, ii = add.length; i < ii; i++) {
      let a = add[i];
      while (a.x >= 1) {
        a.x--;
      }
      while (a.x < 0) {
        a.x++;
      }
      while (a.y >= 1) {
        a.y--;
      }
      while (a.y < 0) {
        a.y++;
      }
      while (a.z >= 1) {
        a.z--;
      }
      while (a.z < 0) {
        a.z++;
      }
    }
    // remove overlaps
    let noOverlaps = [];
    for (let i = 0, ii = add.length; i < ii; i++) {
      let overlap = false;
      let a = add[i];
      for (let j = 0, jj = molecule.atoms.length; j < jj; j++) {
        if (distance3D(a, molecule.atoms[j]) < .0001) {
          overlap = true;
          break;
        }
      }
      if (!overlap) {
        for (let j = 0, jj = noOverlaps.length; j < jj; j++) {
          if (distance3D(a, noOverlaps[j]) < .0001) {
            overlap = true;
            break;
          }
        }
        if (!overlap) {
          noOverlaps.push(a);
        }
      }
    }
    console.log("noOverlaps", noOverlaps);
    // concat arrays
    molecule.atoms = molecule.atoms.concat(noOverlaps);
  }
  // build super cell
  let extras = [];
  for (let i = 0; i < xSuper; i++) {
    for (let j = 0; j < ySuper; j++) {
      for (let k = 0; k < zSuper; k++) {
        if (!(i === 0 && j === 0 && k === 0)) {
          for (let l = 0, ll = molecule.atoms.length; l < ll; l++) {
            let a = molecule.atoms[l];
            let copy = new Atom(a.label, a.x + i, a.y + j, a.z + k);
            extras.push(copy);
            // cifID could be 0, so check for undefined
            if (a.cifId !== undefined) {
              copy.cifId = a.cifId;
              copy.cifPart = a.cifPart + (transformLoop ? transformLoop.lines.length : 0) + i + j * 10 + k * 100;
            }
          }
        }
      }
    }
  }
  // console.log("extras", extras);
  // molecule.atoms = molecule.atoms.concat(extras);

  let extraMolecule = new Molecule();
  extraMolecule.atoms = JSON.parse(JSON.stringify(molecule.atoms.concat(extras)));

  // inside cell atoms (include boundary)
  let cellMolecule = new Molecule();
  cellMolecule.atoms = [...(molecule.atoms)]; // 这里的原子不需要在下面再次进行坐标矩阵变换，因为原子都包含在扩展的所有原子中，矩阵变换是引用操作

  // inner cell atoms (exclude boundary)
  let cellInnerMolecule = new Molecule();
  cellInnerMolecule.atoms = cellMolecule.atoms.filter(item => isInnerUnitCell(item)); //

  // 正负方向扩展
  let extraAtoms = [...(molecule.atoms)];

  // const unitCellAtoms = [...(molecule.atoms)];
  let extraOrders = 0;
  for (let k = -1; k <= 1; k++) { // z方向正负扩展
    for (let j = -1; j <= 1; j++) { // y方向正负扩展
      for (let i = -1; i <= 1; i++) { // x方向正负扩展
        if (!(i === 0 && j === 0 && k === 0)) {
          for (let l = 0, ll = molecule.atoms.length; l < ll; l++) {
            let a = molecule.atoms[l];
            let copy = new Atom(a.label, a.x + i, a.y + j, a.z + k);
            // 判断下是否已存在该位置的原子, 已存在的不加入
            const sameAtomId = extraAtoms.findIndex(item => ((item.x === copy.x) && (item.y === copy.y) && (item.z === copy.z)));
            if (sameAtomId === -1) {
              // cifID could be 0, so check for undefined
              if (a.cifId !== undefined) {
                copy.cifId = a.cifId + `_${extraOrders++}`; // cifId为唯一标识
                copy.cifPart = a.cifPart + (transformLoop ? transformLoop.lines.length : 0) + i + j * 10 + k * 100;
              }
              extraAtoms.push(copy);
            }
          }
        }
      }
    }
  }
  // 获取晶胞内外原子，用于扩包时简化计算
  let ELEMENT = ElementAtom();
  // 根据条件加入成键原子组
  let pointsPerAngstrom = getPointsPerAngstrom();
  let inAtoms = extraAtoms.filter(item => isInUnitCell(item));
  // 设置阈值来剔除部分不可能连键的outAtoms
  let maxCvlLength = 0;
  const covalentRadiusArray = molecule.elements.map(i => ELEMENT[i].covalentRadius);
  for (let i = 0; i < covalentRadiusArray.length - 1; i++) {
    const prev = covalentRadiusArray[i];
    const curr = covalentRadiusArray[i + 1];
    if (maxCvlLength <= (prev + curr)) {
      maxCvlLength = prev + curr;
    }
  }
  const aCvlLengthScale = [0 - (maxCvlLength / aLength), 1.0 + (maxCvlLength / aLength)];
  const bCvlLengthScale = [0 - (maxCvlLength / bLength), 1.0 + (maxCvlLength / bLength)];
  const cCvlLengthScale = [0 - (maxCvlLength / cLength), 1.0 + (maxCvlLength / cLength)];
  const isInScale = (item) => {
    return item.x >= aCvlLengthScale[0] && item.x <= aCvlLengthScale[1] && item.y >= bCvlLengthScale[0] && item.y <= bCvlLengthScale[1] && item.z >= cCvlLengthScale[0] && item.z <= cCvlLengthScale[1];
  };
  let outAtoms = extraAtoms.filter(item => (!isInUnitCell(item))).filter(i => isInScale(i));

  // convert to xyz
  for (let i = 0, ii = inAtoms.length; i < ii; i++) {
    let a = inAtoms[i];
    let xyz = multiplyVec3InM4(abc2xyz, [a.x, a.y, a.z]);
    a.x = xyz[0];
    a.y = xyz[1];
    a.z = xyz[2];
  }
  for (let j = 0; j < outAtoms.length; j++) {
    let a = outAtoms[j];
    let xyz = multiplyVec3InM4(abc2xyz, [a.x, a.y, a.z]);
    a.x = xyz[0];
    a.y = xyz[1];
    a.z = xyz[2];
  }
  for (let j = 0; j < extraMolecule.atoms.length; j++) {
    let a = extraMolecule['atoms'][j];
    let xyz = multiplyVec3InM4(abc2xyz, [a.x, a.y, a.z]);
    a.x = xyz[0];
    a.y = xyz[1];
    a.z = xyz[2];
  }
  let bandSuperAtoms = [...inAtoms];

  // 判断成键原子
  for (let i = 0; i < inAtoms.length; i++) {
    for (let j = 0; j < outAtoms.length; j++) {
      let first = inAtoms[i];
      let second = outAtoms[j];
      if (distance3D(first, second) < (ELEMENT[first.label].covalentRadius + ELEMENT[second.label].covalentRadius) * pointsPerAngstrom * 1.15) {
        // 如果都是金属
        if (!(isMetal(ELEMENT[first.label]) && isMetal(ELEMENT[second.label]))) {
          const existAtom = bandSuperAtoms.findIndex(i => i.cifId === second.cifId);
          existAtom === -1 && bandSuperAtoms.push(second);
        }
      }
    }
  }

  // 需要成键的原子
  molecule.atoms = bandSuperAtoms;

  // handle bonds
  if (bondLoop) {
    let atom1 = -1, atom2 = -1;
    for (let i = 0, ii = bondLoop.fields.length; i < ii; i++) {
      let field = bondLoop.fields[i];
      if (field === "_geom_bond_atom_site_label_1") {
        atom1 = i;
      } else if (field === "_geom_bond_atom_site_label_2") {
        atom2 = i;
      }
    }
    for (let k = 0, kk = bondLoop.lines.length; k < kk; k++) {
      let tokens = bondLoop.lines[k].split(whitespaceRegex).filter(filter);
      let id1 = tokens[atom1];
      let id2 = tokens[atom2];
      for (let i = 0, ii = molecule.atoms.length; i < ii; i++) {
        for (let j = i + 1; j < ii; j++) {
          let ai = molecule.atoms[i];
          let aj = molecule.atoms[j];
          if (ai.cifPart !== aj.cifPart) {
            break;
          }
          if (ai.cifId === id1 && aj.cifId === id2 || ai.cifId === id2 && aj.cifId === id1) {
            molecule.bonds.push(new Bond(ai, aj));
          }
        }
      }
    }
  } else {
    console.log("no bondLoop");
    new deduceCovalentBonds(molecule, 1);
  }

  // handle bonds for cell atoms
  // new deduceCovalentBonds(cellMolecule, 1);

  // handle bonds for cell inner atoms
  // new deduceCovalentBonds(cellInnerMolecule, 1);

  // handle bonds for extraMolecule
  new deduceCovalentBonds(extraMolecule, 1);

  // here we also generate the unit cell
  return {
    extraMolecule: extraMolecule,
    cellInnerMolecule: cellInnerMolecule,
    cellMolecule: cellMolecule,
    molecule: molecule,
    unitCell: new UnitCell([aLength, bLength, cLength], [alphaAngle, betaAngle, gammaAngle], [0, 0, 0])
  };
}
