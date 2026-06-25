// GKS (Globalni Koordinatni Sustav)
// Korištenje:
//   const gks = new GKS(platno, xmin, xmax, ymin, ymax);
//   gks.koristiBoju('red');
//   gks.postaviNa(x0, y0);
//   gks.linijaDo(x1, y1);
//   gks.povuciLiniju();

(function attachGKS(global) {
  class GKS {
    constructor(platno, xmin, xmax, ymin, ymax) {
      if (!platno || !platno.getContext) {
        throw new Error("Neispravno platno predano u GKS konstruktor.");
      }

      this.canvas = platno;
      this.ctx = platno.getContext("2d");
      this.width = platno.width;
      this.height = platno.height;

      this.setRaspon(xmin, xmax, ymin, ymax);
    }

    // Interno: postavlja raspon i priprema faktore skaliranja
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

    // Transformacija iz globalnih koordinata (x, y) u koordinate canvasa (cx, cy)
    // Napomena: y-os globalno raste prema gore; canvas y raste prema dolje → inverzija y-a.
    _toCanvas(x, y) {
      const cx = (x - this.xmin) * this.sx;
      const cy = this.height - (y - this.ymin) * this.sy;
      return { x: cx, y: cy };
    }

    // postavlja "olovku" na (x, y) u globalnim koordinatama
    postaviNa(x, y) {
      const p = this._toCanvas(x, y);
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
    }

    // povlači liniju do (x, y) u globalnim koordinatama
    linijaDo(x, y) {
      const p = this._toCanvas(x, y);
      this.ctx.lineTo(p.x, p.y);
    }

    // postavlja boju linije
    koristiBoju(c) {
      this.ctx.strokeStyle = c;
    }

    // povlači (iscrtava) trenutni path
    povuciLiniju() {
      this.ctx.stroke();
    }
  }

  // Izvoz u globalni scope (browser)
  global.GKS = GKS;
})(typeof window !== "undefined" ? window : this);
