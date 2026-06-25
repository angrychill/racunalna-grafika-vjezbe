// Persp – Perspektivna projekcija 3D linija na xy-ravninu

class Persp {
  constructor(platno, xmin, xmax, ymin, ymax, distance) {
    if (!platno || !platno.getContext) {
      throw new Error("Neispravno platno predano u Persp konstruktor.");
    }
    if (xmax === xmin) {
      throw new Error("xmax i xmin ne smiju biti jednaki.");
    }
    if (ymax === ymin) {
      throw new Error("ymax i ymin ne smiju biti jednaki.");
    }

    this.distance = distance;
    this.canvas = platno;
    this.ctx = platno.getContext("2d");
    this.width = platno.width;
    this.height = platno.height;
    this._matrica = Persp._identitet(4);
    this.near = Math.max(1e-4, Math.abs(distance) * 1e-2);
    this._prevCam = null;
    this._hasMoved = false;
    this.setRaspon(xmin, xmax, ymin, ymax);
  }

  setRaspon(xmin, xmax, ymin, ymax) {
    if (xmax === xmin) {
      throw new Error("xmax i xmin ne smiju biti jednaki.");
    }
    if (ymax === ymin) {
      throw new Error("ymax i ymin ne smiju biti jednaki.");
    }
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = ymin;
    this.ymax = ymax;

    this.sx = this.width / (xmax - xmin);
    this.sy = this.height / (ymax - ymin);
  }

  static EqualX(platno, xmin, xmax, distance) {
    if (!platno || !platno.getContext) {
      throw new Error("Neispravno platno predano u Persp.EqualX.");
    }
    if (xmax === xmin) {
      throw new Error("xmax i xmin ne smiju biti jednaki.");
    }
    const width = platno.width;
    const height = platno.height;
    const sx = width / (xmax - xmin);
    const yRange = height / sx;
    const ymin = -yRange / 2;
    const ymax = yRange / 2;
    return new Persp(platno, xmin, xmax, ymin, ymax, distance);
  }

  static EqualY(platno, ymin, ymax, distance) {
    if (!platno || !platno.getContext) {
      throw new Error("Neispravno platno predano u Persp.EqualY.");
    }
    if (ymax === ymin) {
      throw new Error("ymax i ymin ne smiju biti jednaki.");
    }
    const width = platno.width;
    const height = platno.height;
    const sy = height / (ymax - ymin);
    const xRange = width / sy;
    const xmin = -xRange / 2;
    const xmax = xRange / 2;
    return new Persp(platno, xmin, xmax, ymin, ymax, distance);
  }

  ocistiCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  static _identitet(n) {
    const m = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) m[i][i] = 1;
    return m;
  }

  trans(m) {
    if (!m) return;
    if (typeof m.matrica !== "undefined") {
      this._matrica = m.matrica;
    } else if (typeof m._matrica !== "undefined") {
      this._matrica = m._matrica;
    }
  }

  _transformCamera(x, y, z) {
    const a = this._matrica;
    const tx = a[0][0] * x + a[0][1] * y + a[0][2] * z + a[0][3];
    const ty = a[1][0] * x + a[1][1] * y + a[1][2] * z + a[1][3];
    const tz = a[2][0] * x + a[2][1] * y + a[2][2] * z + a[2][3];
    return { x: tx, y: ty, z: tz };
  }

  _project(tx, ty, tz) {
    const zc = Math.min(tz, -this.near);
    const xpr = -(this.distance / zc) * tx;
    const ypr = -(this.distance / zc) * ty;
    return { x: xpr, y: ypr };
  }

  _toCanvas(xpr, ypr) {
    const cx = (xpr - this.xmin) * this.sx;
    const cy = this.height - (ypr - this.ymin) * this.sy;
    return { x: cx, y: cy };
  }

  postaviNa(x, y, z) {
    const cam = this._transformCamera(x, y, z);
    const nearZ = -this.near;
    this._prevCam = cam;
    this._hasMoved = false;
    this.ctx.beginPath();
    if (cam.z < nearZ) {
      const pr = this._project(cam.x, cam.y, cam.z);
      const p = this._toCanvas(pr.x, pr.y);
      this.ctx.moveTo(p.x, p.y);
      this._hasMoved = true;
    }
  }

  linijaDo(x, y, z) {
    const cam2 = this._transformCamera(x, y, z);
    const nearZ = -this.near;
    const cam1 = this._prevCam;

    if (!cam1) {
      this.postaviNa(x, y, z);
      this._prevCam = cam2;
      return;
    }

    const z1 = cam1.z;
    const z2 = cam2.z;
    const p1Visible = z1 < nearZ;
    const p2Visible = z2 < nearZ;

    const intersectNear = () => {
      const denom = z2 - z1;
      if (denom === 0) return { x: cam1.x, y: cam1.y, z: nearZ };
      let t = (nearZ - z1) / denom;
      if (!isFinite(t)) t = 0;
      t = Math.max(0, Math.min(1, t));
      const ix = cam1.x + t * (cam2.x - cam1.x);
      const iy = cam1.y + t * (cam2.y - cam1.y);
      return { x: ix, y: iy, z: nearZ };
    };

    const lineToProjected = (tx, ty, tz) => {
      const pr = this._project(tx, ty, tz);
      const c = this._toCanvas(pr.x, pr.y);
      if (!this._hasMoved) {
        this.ctx.moveTo(c.x, c.y);
        this._hasMoved = true;
        return { x: c.x, y: c.y };
      } else {
        this.ctx.lineTo(c.x, c.y);
        return { x: c.x, y: c.y };
      }
    };

    if (p1Visible && p2Visible) {
      if (!this._hasMoved) {
        lineToProjected(cam1.x, cam1.y, cam1.z); // this will moveTo
      }
      lineToProjected(cam2.x, cam2.y, cam2.z);
    } else if (p1Visible && !p2Visible) {
      const icam = intersectNear();
      if (!this._hasMoved) {
        lineToProjected(cam1.x, cam1.y, cam1.z);
      }
      lineToProjected(icam.x, icam.y, icam.z);
    } else if (!p1Visible && p2Visible) {
      const icam = intersectNear();
      this.ctx.moveTo(
        this._toCanvas(
          this._project(icam.x, icam.y, icam.z).x,
          this._project(icam.x, icam.y, icam.z).y
        ).x,
        this._toCanvas(
          this._project(icam.x, icam.y, icam.z).x,
          this._project(icam.x, icam.y, icam.z).y
        ).y
      );
      this._hasMoved = true;
      lineToProjected(cam2.x, cam2.y, cam2.z);
    } else {
    }

    this._prevCam = cam2;
  }

  koristiBoju(c) {
    this.ctx.strokeStyle = c;
  }

  povuciLiniju() {
    this.ctx.stroke();
  }

  stozac(r, h, n) {
    this.postaviNa(0, 0, r);
    const step = (2 * Math.PI) / n;
    const offset = n % 2 ? 0 : step;
    for (let i = 0; i <= 2 * Math.PI + offset; i = i + step) {
      this.linijaDo(r * Math.sin(i), 0, r * Math.cos(i));
    }
    this.povuciLiniju();
    for (let j = 0; j <= 2 * Math.PI; j = j + step) {
      this.postaviNa(0, h, 0);
      this.linijaDo(r * Math.sin(j), 0, r * Math.cos(j));
      this.povuciLiniju();
    }
  }

  krnji_stozac(r1, r2, h, n) {
    const step = (2 * Math.PI) / n;
    const offset = n % 2 ? 0 : step;

    this.postaviNa(0, 0, r1);
    for (let i = 0; i <= 2 * Math.PI + offset; i = i + step) {
      this.linijaDo(r1 * Math.sin(i), 0, r1 * Math.cos(i));
    }
    this.povuciLiniju();
    this.postaviNa(0, h, r2);
    for (let i = 0; i <= 2 * Math.PI + offset; i = i + step) {
      this.linijaDo(r2 * Math.sin(i), h, r2 * Math.cos(i));
    }
    this.povuciLiniju();

    for (let j = 0; j <= 2 * Math.PI + offset; j = j + step) {
      const x1 = r1 * Math.sin(j);
      const z1 = r1 * Math.cos(j);
      const x2 = r2 * Math.sin(j);
      const z2 = r2 * Math.cos(j);
      this.postaviNa(x1, 0, z1);
      this.linijaDo(x2, h, z2);
      this.povuciLiniju();
    }
  }

  torus(r, R, n1, n2) {
    const step1 = (2 * Math.PI) / n1;
    const step2 = (2 * Math.PI) / n2;
    const offset1 = n1 % 2 ? 0 : step1;
    const offset2 = n2 % 2 ? 0 : step2;

    for (let u = 0; u <= 2 * Math.PI + offset1; u += step1) {
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);
      let v = 0;
      let cosV = Math.cos(v);
      let sinV = Math.sin(v);
      let rad = R + r * cosV;
      this.postaviNa(rad * cosU, r * sinV, rad * sinU);

      for (v = step2; v <= 2 * Math.PI + offset2; v += step2) {
        cosV = Math.cos(v);
        sinV = Math.sin(v);
        rad = R + r * cosV;
        this.linijaDo(rad * cosU, r * sinV, rad * sinU);
      }
      this.povuciLiniju();
    }

    for (let v = 0; v <= 2 * Math.PI + offset2; v += step2) {
      const cosV = Math.cos(v);
      const sinV = Math.sin(v);
      const rad = R + r * cosV;

      let u = 0;
      let cosU = Math.cos(u);
      let sinU = Math.sin(u);
      this.postaviNa(rad * cosU, r * sinV, rad * sinU);

      for (u = step1; u <= 2 * Math.PI + offset1; u += step1) {
        cosU = Math.cos(u);
        sinU = Math.sin(u);
        this.linijaDo(rad * cosU, r * sinV, rad * sinU);
      }
      this.povuciLiniju();
    }
  }

  valjak(r, h, n, kut = 360) {
    const totalAngle = (kut * Math.PI) / 180;
    const step = totalAngle / n;
    const fullCircle = Math.abs(kut) >= 360;
    const offset = fullCircle && n % 2 === 0 ? step : 0;
    const endAngle = totalAngle + offset;

    for (let height = 0; height <= h; height += h) {
      if (fullCircle) {
        this.postaviNa(0, height, r);
        for (let i = 0; i <= endAngle; i += step) {
          this.linijaDo(r * Math.sin(i), height, r * Math.cos(i));
        }
      } else {
        this.postaviNa(0, height, 0);
        for (let i = 0; i <= endAngle; i += step) {
          this.linijaDo(r * Math.sin(i), height, r * Math.cos(i));
        }
        this.linijaDo(0, height, 0);
      }
      this.povuciLiniju();
    }

    for (let j = 0; j <= totalAngle; j += step) {
      const x = r * Math.sin(j);
      const z = r * Math.cos(j);
      this.postaviNa(x, 0, z);
      this.linijaDo(x, h, z);
      this.povuciLiniju();
    }
  }

  kugla(r, m, n, polukrug = false, innerStep = 0.01) {
    let phiConst = polukrug ? Math.PI : 2 * Math.PI;
    let phiStep = phiConst / m;
    let thetaStep = innerStep;
    let offset = m % 2 ? 0 : thetaStep;
    for (let stepP = 0; stepP <= phiConst; stepP += phiStep) {
      this.postaviNa(0, r, 0);
      for (let stepT = 0; stepT <= Math.PI + offset; stepT += thetaStep) {
        this.linijaDo(
          r * Math.sin(stepP) * Math.sin(stepT),
          r * Math.cos(stepT),
          r * Math.cos(stepP) * Math.sin(stepT)
        );
      }
      this.povuciLiniju();
    }

    thetaStep = Math.PI / (n + 1);
    phiStep = innerStep;
    offset = n % 2 ? 0 : phiStep;
    for (let stepT = 0; stepT <= Math.PI; stepT += thetaStep) {
      this.postaviNa(0, r * Math.cos(stepT), r * Math.sin(stepT));
      for (let stepP = 0; stepP <= phiConst + offset; stepP += phiStep) {
        this.linijaDo(
          r * Math.sin(stepP) * Math.sin(stepT),
          r * Math.cos(stepT),
          r * Math.cos(stepP) * Math.sin(stepT)
        );
      }
      this.povuciLiniju();
    }
  }

  nacrtajKvadar(width, height, depth, boja) {
    const hx = width / 2;
    const hy = height / 2;
    const hz = depth / 2;

    const V = [
      [-hx, -hy, -hz],
      [hx, -hy, -hz],
      [hx, hy, -hz],
      [-hx, hy, -hz],
      [-hx, -hy, hz],
      [hx, -hy, hz],
      [hx, hy, hz],
      [-hx, hy, hz],
    ];

    const E = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0], // donja baza
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4], // gornja baza
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7], // bridovi koji spajaju baze
    ];

    this.koristiBoju(boja);
    for (const [i, j] of E) {
      const [x1, y1, z1] = V[i];
      const [x2, y2, z2] = V[j];
      this.postaviNa(x1, y1, z1);
      this.linijaDo(x2, y2, z2);
      this.povuciLiniju();
    }
  }
}

if (typeof window !== "undefined") {
  window.Persp = Persp;
}
