class MT3D {
  constructor() {
    this._matrica = MT3D._identitet(4);
  }

  get matrica() {
    return this._matrica;
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
}

// Objavi u globalni scope (browser)
if (typeof window !== "undefined") {
  window.MT3D = MT3D;
}
