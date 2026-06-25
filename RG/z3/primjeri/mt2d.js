// MT2D (Matrične Transformacije u 2D)
// Jednostavna globalna klasa – radi i s file:// otvaranjem bez servera.
// Korištenje:
//   <script src="mt2d.js"></script>
//   const m = new MT2D();

class MT2D {
  constructor() {
    this._matrica = MT2D._identitet(3);
  }

  // Javni pristup matrici (za GKS.trans)
  get matrica() {
    return this._matrica;
  }

  static _identitet(n) {
    const m = MT2D._nulMatrica(3);
    for (let i = 0; i < n; i++) m[i][i] = 1;
    return m;
  }

  static _nulMatrica(n) {
    return Array.from({ length: n }, () => Array(n).fill(0));
  }

  pomakni(px, py) {
    this.mult([
      [1, 0, px],
      [0, 1, py],
      [0, 0, 1],
    ]);
  }

  skaliraj(sx, sy) {
    this.mult([
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1],
    ]);
  }

  rotiraj(kut) {
    let radijan = (kut * Math.PI) / 180;
    let sin = Math.sin(radijan);
    let cos = Math.cos(radijan);
    this.mult([
      [cos, sin, 0],
      [-sin, cos, 0],
      [0, 0, 1],
    ]);
  }

  rotiraj_oko_tocke(x0, y0, kut) {
    this.mult([
      [1, 0, x0],
      [0, 1, y0],
      [0, 0, 1],
    ]);
    this.rotiraj(kut);
    this.mult([
      [1, 0, -x0],
      [0, 1, -y0],
      [0, 0, 1],
    ]);
  }

  zrcaliNaX() {
    this.mult([
      [1, 0, 0],
      [0, -1, 0],
      [0, 0, 1],
    ]);
  }

  zrcaliNaY() {
    this.mult([
      [-1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
  }

  zrcaliNa(k, l) {
    const thetaDeg = (Math.atan(k) * 180) / Math.PI;
    this.mult([
      [1, 0, 0],
      [0, 1, l],
      [0, 0, 1],
    ]);
    this.rotiraj(-thetaDeg);
    this.zrcaliNaX();
    this.rotiraj(thetaDeg);
    this.mult([
      [1, 0, 0],
      [0, 1, -l],
      [0, 0, 1],
    ]);
  }

  identitet() {
    this._matrica = MT2D._identitet(3);
  }

  mult(mat) {
    let N = 3;
    let i, j, k;
    let res = MT2D._nulMatrica(3);
    for (i = 0; i < N; i++) {
      for (j = 0; j < N; j++) {
        for (k = 0; k < N; k++) res[i][j] += this._matrica[i][k] * mat[k][j];
      }
    }
    this._matrica = res;
  }
}

// Objavi u globalni scope (browser)
if (typeof window !== "undefined") {
  window.MT2D = MT2D;
}
