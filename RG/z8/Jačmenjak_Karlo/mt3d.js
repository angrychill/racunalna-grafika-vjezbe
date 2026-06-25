class MT3D {
  constructor() {
    // Model, kamera (view) i projekcija
    this._matrica = MT3D._identitet(4);
    this._kamera = MT3D._identitet(4);
    this._projekcija = MT3D._identitet(4);
  }

  // Vrati kombinaciju P * K * M
  get matrica() {
    const KM = this.mnoziMatrice(this._kamera, this._matrica);
    return this.mnoziMatrice(this._projekcija, KM);
  }

  static _identitet(n) {
    const m = MT3D._nulMatrica(n);
    for (let i = 0; i < n; i++) m[i][i] = 1;
    return m;
  }

  static _nulMatrica(n) {
    return Array.from({ length: n }, () => Array(n).fill(0));
  }

  identitet() {
    this._matrica = MT3D._identitet(4);
  }

  resetirajKameru() {
    this._kamera = MT3D._identitet(4);
  }

  resetirajProjekciju() {
    this._projekcija = MT3D._identitet(4);
  }

  mult(mat) {
    const a = this._matrica;
    const b = mat;
    const n = 4;
    const res = MT3D._nulMatrica(n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let s = 0;
        for (let k = 0; k < n; k++) s += a[i][k] * b[k][j];
        res[i][j] = s;
      }
    }
    this._matrica = res;
  }

  pomakni(px, py, pz) {
    this.mult([
      [1, 0, 0, px],
      [0, 1, 0, py],
      [0, 0, 1, pz],
      [0, 0, 0, 1],
    ]);
  }

  skaliraj(sx, sy, sz) {
    this.mult([
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1],
    ]);
  }

  rotirajX(kut) {
    const r = (kut * Math.PI) / 180;
    const s = Math.sin(r);
    const c = Math.cos(r);
    this.mult([
      [1, 0, 0, 0],
      [0, c, -s, 0],
      [0, s, c, 0],
      [0, 0, 0, 1],
    ]);
  }

  rotirajY(kut) {
    const r = (kut * Math.PI) / 180;
    const s = Math.sin(r);
    const c = Math.cos(r);
    this.mult([
      [c, 0, s, 0],
      [0, 1, 0, 0],
      [-s, 0, c, 0],
      [0, 0, 0, 1],
    ]);
  }

  rotirajZ(kut) {
    const r = (kut * Math.PI) / 180;
    const s = Math.sin(r);
    const c = Math.cos(r);
    this.mult([
      [c, -s, 0, 0],
      [s, c, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }

  rotiraj_oko_osi(x0, y0, z0, u1, u2, u3, kut) {
    const len = Math.hypot(u1, u2, u3);
    if (!isFinite(len) || len === 0) return;
    const ux = u1 / len;
    const uy = u2 / len;
    const uz = u3 / len;
    const r = (kut * Math.PI) / 180;
    const c = Math.cos(r);
    const s = Math.sin(r);
    const ic = 1 - c;

    const R = [
      [c + ux * ux * ic, ux * uy * ic - uz * s, ux * uz * ic + uy * s, 0],
      [uy * ux * ic + uz * s, c + uy * uy * ic, uy * uz * ic - ux * s, 0],
      [uz * ux * ic - uy * s, uz * uy * ic + ux * s, c + uz * uz * ic, 0],
      [0, 0, 0, 1],
    ];

    this.pomakni(x0, y0, z0);
    this.mult(R);
    this.pomakni(-x0, -y0, -z0);
  }

  VP(ax, ay, az, bx, by, bz) {
    return {
      x: ay * bz - az * by,
      y: az * bx - ax * bz,
      z: ax * by - ay * bx,
    };
  }

  mnoziMatrice(mat1, mat2) {
    const a = mat1;
    const b = mat2;
    const n = 4;
    const res = MT3D._nulMatrica(n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let s = 0;
        for (let k = 0; k < n; k++) s += a[i][k] * b[k][j];
        res[i][j] = s;
      }
    }
    return res;
  }

  postaviKameru(x0, y0, z0, x1, y1, z1, Vx, Vy, Vz) {
    // vektor n pokazuje od gledane tocke prema kameri
    let nx = x0 - x1;
    let ny = y0 - y1;
    let nz = z0 - z1;
    const nl = Math.hypot(nx, ny, nz) || 1;
    nx /= nl;
    ny /= nl;
    nz /= nl;

    // u = normalize(V × n)
    const U = this.VP(Vx, Vy, Vz, nx, ny, nz);
    let ux = U.x;
    let uy = U.y;
    let uz = U.z;
    const ul = Math.hypot(ux, uy, uz) || 1;
    ux /= ul;
    uy /= ul;
    uz /= ul;

    // v = n × u
    const V = this.VP(nx, ny, nz, ux, uy, uz);
    const vx = V.x;
    const vy = V.y;
    const vz = V.z;

    // R * T(-eye)
    const tx = -(ux * x0 + uy * y0 + uz * z0);
    const ty = -(vx * x0 + vy * y0 + vz * z0);
    const tz = -(nx * x0 + ny * y0 + nz * z0);

    this._kamera = [
      [ux, uy, uz, tx],
      [vx, vy, vz, ty],
      [nx, ny, nz, tz],
      [0, 0, 0, 1],
    ];
  }

  // Ortogonalna projekcija na zadani raspon u NDC
  ortho(xmin, xmax, ymin, ymax, zpr, zst) {
    const l = xmin;
    const r = xmax;
    const b = ymin;
    const t = ymax;
    const n = zpr;
    const f = zst;

    const rl = r - l;
    const tb = t - b;
    const fn = f - n;

    if (rl === 0 || tb === 0 || fn === 0) {
      this._projekcija = MT3D._identitet(4);
      return;
    }

    this._projekcija = [
      [2 / rl, 0, 0, -(r + l) / rl],
      [0, 2 / tb, 0, -(t + b) / tb],
      [0, 0, -2 / fn, -(f + n) / fn],
      [0, 0, 0, 1],
    ];
  }

  // Perspektivna projekcija – zadatak 8.3
  persp(xmin, xmax, ymin, ymax, zpr, zst) {
    const l = xmin;
    const r = xmax;
    const b = ymin;
    const t = ymax;
    const n = zpr;
    const f = zst;

    const rl = r - l;
    const tb = t - b;
    const fn = f - n;

    if (rl === 0 || tb === 0 || fn === 0 || n <= 0 || f <= 0) {
      this._projekcija = MT3D._identitet(4);
      return;
    }

    this._projekcija = [
      [(2 * n) / rl, 0, (r + l) / rl, 0],
      [0, (2 * n) / tb, (t + b) / tb, 0],
      [0, 0, -(f + n) / fn, (-2 * f * n) / fn],
      [0, 0, -1, 0],
    ];
  }

  // Vrati elemente matrice kao listu (stupac po stupac)
  lista() {
    const out = [];
    const m = this.matrica;
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        out.push(m[i][j]);
      }
    }
    return out;
  }
}

if (typeof window !== "undefined") {
  window.MT3D = MT3D;
}

