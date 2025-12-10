"use strict";
// @ts-ignore
class MT2D {
    _matrica;
    constructor() {
        this._matrica = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
    lista() {
        let lista = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                lista.push(this._matrica[j][i]);
            }
        }
        return lista;
    }
    projekcija2D(xmin, xmax, ymin, ymax) {
        // sx = 2 / ( xmax - xmin)
        // sy = 2 / ( ymax - ymin)
        // py = -sy*ymax + 1
        // px = -sx*xmax + 1
        let sx = 2 / (xmax - xmin);
        let sy = 2 / (ymax - ymin);
        let py = (-sy * ymax) + 1;
        let px = (-sx * xmax) + 1;
        this.mult([
            [sx, 0, px],
            [0, sy, py],
            [0, 0, 1],
        ]);
        ;
    }
    identitet() {
        this._matrica = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
    pomakni(px, py) {
        let t = [[1, 0, px], [0, 1, py], [0, 0, 1]];
        this.mult(t);
    }
    skaliraj(sx, sy) {
        let s = [[sx, 0, 0], [0, sy, 0], [0, 0, 1]];
        this.mult(s);
    }
    zrcaliNaX() {
        let z = [[1, 0, 0], [0, -1, 0], [0, 0, 1]];
        this.mult(z);
    }
    zrcaliNaY() {
        let z = [[-1, 0, 0], [0, 1, 0], [0, 0, 1]];
        this.mult(z);
    }
    rotiraj(kut) {
        let r = [
            [Math.cos(kut), -Math.sin(kut), 0],
            [Math.sin(kut), Math.cos(kut), 0],
            [0, 0, 1]
        ];
        this.mult(r);
    }
    rotiraj_oko_tocke(tocka = { x: 0, y: 0 }, kut) {
        this.pomakni(-tocka.x, -tocka.y);
        this.rotiraj(kut);
        this.pomakni(tocka.x, tocka.y);
    }
    //skew
    smicanje(alpha, beta) {
        let sk = [
            [1, Math.tan(beta), 0],
            [Math.tan(alpha), 1, 0],
            [0, 0, 1]
        ];
        this.mult(sk);
    }
    mult(m) {
        let m1 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    m1[i][j] = m1[i][j] + this._matrica[i][k] * m[k][j];
                }
            }
        }
        this._matrica = m1;
    }
    zrcaliNaPravac(k, l) {
        let a = Math.atan(k);
        this.pomakni(0, l);
        this.rotiraj(a);
        this.zrcaliNaX();
        this.rotiraj(-a);
        this.pomakni(0, -l);
    }
}
