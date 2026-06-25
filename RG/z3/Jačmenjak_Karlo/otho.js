// Ortho – ortogonalna projekcija 3D linija na xy-ravninu

class Ortho {
  constructor(platno, xmin, xmax, ymin, ymax) {
    if (!platno || !platno.getContext) {
      throw new Error("Neispravno platno predano u Ortho konstruktor.");
    }
    if (xmax === xmin) {
      throw new Error("xmax i xmin ne smiju biti jednaki.");
    }
    if (ymax === ymin) {
      throw new Error("ymax i ymin ne smiju biti jednaki.");
    }

    this.canvas = platno;
    this.ctx = platno.getContext("2d");
    this.width = platno.width;
    this.height = platno.height;
    this._matrica = Ortho._identitet(4);
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

  static EqualX(platno, xmin, xmax) {
    if (!platno || !platno.getContext) {
      throw new Error("Neispravno platno predano u Ortho.EqualX.");
    }
    if (xmax === xmin) {
      throw new Error("xmax i xmin ne smiju biti jednaki.");
    }
    const width = platno.width;
    const height = platno.height;
    const sx = width / (xmax - xmin);
    const yRange = height / sx; // sy = sx
    const ymin = -yRange / 2;
    const ymax = yRange / 2;
    return new Ortho(platno, xmin, xmax, ymin, ymax);
  }

  static EqualY(platno, ymin, ymax) {
    if (!platno || !platno.getContext) {
      throw new Error("Neispravno platno predano u Ortho.EqualY.");
    }
    if (ymax === ymin) {
      throw new Error("ymax i ymin ne smiju biti jednaki.");
    }
    const width = platno.width;
    const height = platno.height;
    const sy = height / (ymax - ymin);
    const xRange = width / sy; // sx = sy
    const xmin = -xRange / 2;
    const xmax = xRange / 2;
    return new Ortho(platno, xmin, xmax, ymin, ymax);
  }

  ocistiCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  static _identitet(n) {
    const m = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) m[i][i] = 1;
    return m;
  }

  static _lijepKorak(priblizno) {
    if (!isFinite(priblizno) || priblizno <= 0) return 1;
    const exp = Math.floor(Math.log10(priblizno));
    const baza = Math.pow(10, exp);
    const fr = priblizno / baza;
    let lijepo;
    if (fr <= 1) lijepo = 1;
    else if (fr <= 2) lijepo = 2;
    else if (fr <= 5) lijepo = 5;
    else lijepo = 10;
    return lijepo * baza;
  }

  static _formatBroj(vrijednost, korak) {
    if (!isFinite(vrijednost)) return "";
    let dec = 0;
    if (isFinite(korak) && korak > 0) {
      const log = Math.log10(korak);
      dec = log < 0 ? Math.min(6, Math.ceil(-log) + 1) : 0;
    } else {
      dec = 2;
    }
    let s = vrijednost.toFixed(dec);
    if (s.indexOf(".") >= 0) {
      s = s.replace(/0+$/, "").replace(/\.$/, "");
    }
    return s;
  }

  trans(m) {
    if (!m) return;
    if (typeof m.matrica !== "undefined") {
      this._matrica = m.matrica;
    } else if (typeof m._matrica !== "undefined") {
      this._matrica = m._matrica;
    }
  }

  _primijeniTransformaciju(x, y, z = 0) {
    const a = this._matrica;
    const tx = a[0][0] * x + a[0][1] * y + a[0][2] * z + a[0][3];
    const ty = a[1][0] * x + a[1][1] * y + a[1][2] * z + a[1][3];
    const tz = a[2][0] * x + a[2][1] * y + a[2][2] * z + a[2][3];
    return { x: tx, y: ty, z: tz };
  }

  _toCanvas(x, y) {
    const cx = (x - this.xmin) * this.sx;
    const cy = this.height - (y - this.ymin) * this.sy;
    return { x: cx, y: cy };
  }

  postaviNa(x, y, z = 0) {
    const tg = this._primijeniTransformaciju(x, y, z);
    const p = this._toCanvas(tg.x, tg.y);
    this.ctx.beginPath();
    this.ctx.moveTo(p.x, p.y);
  }

  linijaDo(x, y, z = 0) {
    const tg = this._primijeniTransformaciju(x, y, z);
    const p = this._toCanvas(tg.x, tg.y);
    this.ctx.lineTo(p.x, p.y);
  }

  koristiBoju(c) {
    this.ctx.strokeStyle = c;
  }

  povuciLiniju() {
    this.ctx.stroke();
  }

  // Nacrtaj koordinatne osi (x i y) unutar trenutnog raspona.
  // Opcije:
  //   - boja (string, default '#000')
  //   - sirina (number, default 1)
  //   - bezTransformacije (bool, default true) — privremeno ignorira MT3D transformaciju
  //   - oznake (bool, default true) — ispis brojeva na oznakama
  //   - bojaTeksta (string, default boja)
  //   - font (string, default '12px system-ui')
  //   - korakX, korakY (number, opcionalno) — fiksni razmak između oznaka
  //   - duljinaOznake (px, default 6) — duljina crtice oznake u pikselima
  //   - pomakTeksta (px, default 4) — koliki razmak teksta od osi
  crtajOsi(opcije = {}) {
    const {
      boja = "#000",
      sirina = 1,
      bezTransformacije = true,
      oznake = true,
      bojaTeksta = undefined,
      font = "12px system-ui",
      korakX = undefined,
      korakY = undefined,
      duljinaOznake = 6,
      pomakTeksta = 4,
    } = opcije || {};

    // Spremi postojeća platno stanja
    const stariStroke = this.ctx.strokeStyle;
    const staraDebljina = this.ctx.lineWidth;
    const staraMatrica = this._matrica;
    const stariFill = this.ctx.fillStyle;
    const stariFont = this.ctx.font;
    const stariAlign = this.ctx.textAlign;
    const stariBaseline = this.ctx.textBaseline;

    if (bezTransformacije) {
      this._matrica = Ortho._identitet(4);
    }
    this.koristiBoju(boja);
    this.ctx.lineWidth = sirina;
    this.ctx.font = font;
    this.ctx.fillStyle = bojaTeksta || boja;

    // X-os (y = 0) ako je vidljiva u rasponu
    if (this.ymin <= 0 && this.ymax >= 0) {
      this.postaviNa(this.xmin, 0, 0);
      this.linijaDo(this.xmax, 0, 0);
      this.povuciLiniju();

      // Oznake i brojevi na X-osi
      if (oznake) {
        const ciljPx = 50; // ciljano ~50px između oznaka
        const predKorak = ciljPx / this.sx;
        const kx = korakX || Ortho._lijepKorak(predKorak);
        const start = Math.ceil(this.xmin / kx) * kx;
        const dyWorld = duljinaOznake / this.sy;
        const t0 = this._primijeniTransformaciju(0, 0, 0);
        const cy = this._toCanvas(t0.x, t0.y).y;
        for (let x = start; x <= this.xmax + 1e-12; x += kx) {
          // crtica
          this.postaviNa(x, 0 - dyWorld, 0);
          this.linijaDo(x, 0 + dyWorld, 0);
          this.povuciLiniju();
          // broj
          const tg = this._primijeniTransformaciju(x, 0, 0);
          const p = this._toCanvas(tg.x, tg.y);
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "top";
          const txt = Ortho._formatBroj(x, kx);

          if (p.x >= 0 && p.x <= this.width) {
            this.ctx.fillText(txt, p.x, cy + pomakTeksta);
          }
        }
      }
    }

    if (this.xmin <= 0 && this.xmax >= 0) {
      this.postaviNa(0, this.ymin, 0);
      this.linijaDo(0, this.ymax, 0);
      this.povuciLiniju();

      if (oznake) {
        const ciljPx = 50;
        const predKorak = ciljPx / this.sy;
        const ky = korakY || Ortho._lijepKorak(predKorak);
        const start = Math.ceil(this.ymin / ky) * ky;
        const dxWorld = duljinaOznake / this.sx;
        const t0 = this._primijeniTransformaciju(0, 0, 0);
        const cx = this._toCanvas(t0.x, t0.y).x;
        for (let y = start; y <= this.ymax + 1e-12; y += ky) {
          // crtica
          this.postaviNa(0 - dxWorld, y, 0);
          this.linijaDo(0 + dxWorld, y, 0);
          this.povuciLiniju();
          // broj
          const tg = this._primijeniTransformaciju(0, y, 0);
          const p = this._toCanvas(tg.x, tg.y);
          this.ctx.textAlign = "right";
          this.ctx.textBaseline = "middle";
          const txt = Ortho._formatBroj(y, ky);
          if (p.y >= 0 && p.y <= this.height) {
            this.ctx.fillText(txt, cx - pomakTeksta, p.y);
          }
        }
      }
    }

    // Vrati stara stanja
    this.ctx.strokeStyle = stariStroke;
    this.ctx.lineWidth = staraDebljina;
    this._matrica = staraMatrica;
    this.ctx.fillStyle = stariFill;
    this.ctx.font = stariFont;
    this.ctx.textAlign = stariAlign;
    this.ctx.textBaseline = stariBaseline;
  }
}

if (typeof window !== "undefined") {
  window.Ortho = Ortho;
}
