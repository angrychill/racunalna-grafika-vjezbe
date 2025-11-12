"use strict";
// @ts-ignore
class GKS3D {
    _matrica;
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
    constructor(platno, xmin, xmax, ymin = 0, ymax = 0) {
        // @ts-ignore
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
        this._matrica = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    }
    nacrtajGrid(cell_w, cell_h) {
        this.g.beginPath();
        this.g.strokeStyle = "gray";
        this.g.lineWidth = 0.25;
        for (let i = this.y_min; i <= this.y_max + 1; i += cell_h) {
            this.postaviNa(this.x_min, i, 0);
            this.linijaDo(this.x_max, i, 0);
            this.povuciLiniju();
        }
        for (let i = this.x_min; i <= this.x_max + 1; i += cell_w) {
            this.postaviNa(i, this.y_min, 0);
            this.linijaDo(i, this.y_max, 0);
            this.povuciLiniju();
        }
    }
    postaviNa(x, y, z) {
        var kords = this.vratiPretvoreneKoord(x, y, z);
        // beginPath uvijek prije moveTo!
        this.g.beginPath();
        this.g.moveTo(kords.x, kords.y);
    }
    linijaDo(x, y, z, stroke = false) {
        var kords = this.vratiPretvoreneKoord(x, y, z);
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
    vratiPretvoreneKoord(x, y, z) {
        var x_trans = this._matrica[0][0] * x + this._matrica[0][1] * y + this._matrica[0][2] * z + this._matrica[0][3];
        var y_trans = this._matrica[1][0] * x + this._matrica[1][1] * y + this._matrica[1][2] * z + this._matrica[1][3];
        var x_i = this.p_x + this.s_x * x_trans;
        var y_i = this.p_y + this.s_y * y_trans;
        return { x: x_i, y: y_i };
    }
    trans(mat) {
        this._matrica = mat.multMatrice(mat._kamera, mat._matrica);
    }
}
