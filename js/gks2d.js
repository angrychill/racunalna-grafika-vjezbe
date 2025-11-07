"use strict";
// @ts-ignore
class GKS2D {
    g;
    w;
    h;
    x_min;
    x_max;
    y_min;
    y_max;
    s_x;
    s_y;
    p_x;
    p_y;
    _matrica;
    constructor(platno, xmin, xmax, ymin = 0, ymax = 0) {
        this.g = platno.getContext("2d");
        this.w = platno.width;
        this.h = platno.height;
        this.x_min = xmin;
        this.x_max = xmax;
        if (ymin == 0 && ymax == 0) {
            this.y_min = xmin;
            this.y_max = xmax;
            this.s_x = this.w / (this.x_max - this.x_min);
            this.s_y = -this.s_x;
            this.p_x = -this.s_x * this.x_min;
            this.p_y = this.h / 2;
        }
        else {
            this.y_min = ymin;
            this.y_max = ymax;
            this.s_x = this.w / (this.x_max - this.x_min);
            this.s_y = -this.h / (this.y_max - this.y_min);
            this.p_x = -this.s_x * this.x_min;
            this.p_y = -this.s_y * this.y_max;
        }
        this._matrica = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
    nacrtajGlavneOsi(koristiOznake = false, razmak = 1) {
        this.g.beginPath();
        this.g.moveTo(0, this.p_y);
        this.g.lineTo(this.w, this.p_y);
        this.g.moveTo(this.p_x, 0);
        this.g.lineTo(this.p_x, this.h);
        this.g.strokeStyle = "black";
        this.g.lineWidth = 2;
        this.g.stroke();
        this.g.beginPath();
        this.g.lineWidth = 0.5;
        for (let x = this.x_min; x <= this.x_max + 1; x += razmak) {
            var koords = this.vratiPretvoreneKoord(x, 0);
            this.g.moveTo(koords.x, koords.y - razmak * 5);
            this.g.lineTo(koords.x, koords.y + razmak * 5);
        }
        for (let y = this.y_min; y <= this.y_max + 1; y += razmak) {
            var koords = this.vratiPretvoreneKoord(0, y);
            this.g.moveTo(koords.x - razmak * 5, koords.y);
            this.g.lineTo(koords.x + razmak * 5, koords.y);
        }
        this.g.stroke();
        if (koristiOznake == true) {
            this.g.font = "10px Times New Roman";
            var offset = 20;
            for (let x = this.x_min; x <= this.x_max + 1; x += razmak) {
                var koords = this.vratiPretvoreneKoord(x, 0);
                if (x != 0) {
                    this.g.fillText(x.toString(), koords.x, koords.y + offset);
                }
            }
            for (let y = this.y_min; y <= this.y_max + 1; y += razmak) {
                var koords = this.vratiPretvoreneKoord(0, y);
                if (y != 0) {
                    this.g.fillText(y.toString(), koords.x + offset / 2, koords.y);
                }
            }
        }
    }
    nacrtajGrid(cell_w, cell_h) {
        this.g.beginPath();
        this.g.strokeStyle = "gray";
        this.g.lineWidth = 0.25;
        for (let i = this.y_min; i <= this.y_max + 1; i += cell_h) {
            this.postaviNa(this.x_min, i);
            this.linijaDo(this.x_max, i);
            this.povuciLiniju();
        }
        for (let i = this.x_min; i <= this.x_max + 1; i += cell_w) {
            this.postaviNa(i, this.y_min);
            this.linijaDo(i, this.y_max);
            this.povuciLiniju();
        }
    }
    postaviNa(x, y) {
        var kords = this.vratiPretvoreneKoord(x, y);
        // beginPath uvijek prije moveTo!
        this.g.beginPath();
        this.g.moveTo(kords.x, kords.y);
    }
    linijaDo(x, y, stroke = false) {
        var kords = this.vratiPretvoreneKoord(x, y);
        this.g.lineTo(kords.x, kords.y);
        this.g.moveTo(kords.x, kords.y);
        if (stroke == true) {
            this.povuciLiniju();
        }
    }
    koristiBoju(c) {
        if (typeof c != "string") {
            alert("boja nije string!");
        }
        this.g.strokeStyle = c;
    }
    korisitDebljinu(c) {
        if (typeof c != "number") {
            alert("debljina nije broj!");
        }
        this.g.lineWidth = c;
    }
    povuciLiniju() {
        this.g.stroke();
    }
    vratiPretvoreneKoord(x, y) {
        // x' = a_00*x + a_01*y + a_02
        // y' = a_10*x + a_11*y + a_12
        var x_trans = this._matrica[0][0] * x + this._matrica[0][1] * y + this._matrica[0][2];
        var y_trans = this._matrica[1][0] * x + this._matrica[1][1] * y + this._matrica[1][2];
        var x_i = this.p_x + this.s_x * x_trans;
        var y_i = this.p_y + this.s_y * y_trans;
        return { x: x_i, y: y_i };
    }
    trans(mat) {
        if (mat instanceof MT2D == true) {
            this._matrica = mat._matrica;
        }
        else {
            alert("Nije pružan MT2D objekt");
        }
    }
}
