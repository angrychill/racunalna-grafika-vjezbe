"use strict";
// @ts-ignore
class GKS3DPerspective {
    _matrica;
    _distance;
    _lastpos;
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
    constructor(platno, xmin, xmax, ymin = 0, ymax = 0, dist = 5) {
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
        this._distance = dist;
        this._lastpos = { x: 0, y: 0, z: 0 };
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
        var trans = this.vratiKameraKoord(x, y, z);
        this._lastpos = trans;
        var kords = this.vratiPretvoreneKoord(x, y, z);
        if (!Number.isNaN(kords.x) && !Number.isNaN(kords.y)) {
            this.g.beginPath();
            this.g.moveTo(kords.x, kords.y);
        }
        // beginPath uvijek prije moveTo!
    }
    linijaDo(x, y, z, stroke = false) {
        var trans = this.vratiKameraKoord(x, y, z);
        let eps = -0.001;
        let kords = { x: 0, y: 0 };
        if (this._lastpos.z < eps && trans.z < eps) {
            // Case 1: both front
            kords = this.vratiProjektiraneKoord(trans.x, trans.y, trans.z);
            if (!Number.isNaN(kords.x) && !Number.isNaN(kords.y)) {
                this.g.lineTo(kords.x, kords.y);
                this._lastpos = trans;
            }
        }
        else if (this._lastpos.z > eps && trans.z > eps) {
            // Case 2: both behind - nothing
        }
        else if (this._lastpos.z > eps && trans.z < eps) {
            // Case 3: last behind, current front
            let t = (this._lastpos.z + eps) / (this._lastpos.z - trans.z);
            let x_pr = this._lastpos.x + t * (trans.x - this._lastpos.x);
            let y_pr = this._lastpos.y + t * (trans.y - this._lastpos.y);
            kords = this.vratiProjektiraneKoord(x_pr, y_pr, eps);
            if (!Number.isNaN(kords.x) && !Number.isNaN(kords.y)) {
                this.g.lineTo(kords.x, kords.y);
                this._lastpos = trans;
            }
            kords = this.vratiProjektiraneKoord(trans.x, trans.y, trans.z);
            if (!Number.isNaN(kords.x) && !Number.isNaN(kords.y)) {
                this.g.lineTo(kords.x, kords.y);
                this._lastpos = trans;
            }
        }
        else if (this._lastpos.z < eps && trans.z > eps) {
            // Case 4: last front, current behind
            let t = (this._lastpos.z + eps) / (this._lastpos.z - trans.z);
            let x_pr = this._lastpos.x + t * (trans.x - this._lastpos.x);
            let y_pr = this._lastpos.y + t * (trans.y - this._lastpos.y);
            kords = this.vratiProjektiraneKoord(x_pr, y_pr, eps);
            if (!Number.isNaN(kords.x) && !Number.isNaN(kords.y)) {
                this.g.lineTo(kords.x, kords.y);
                this._lastpos = trans;
            }
        }
        if (stroke == true) {
            this.povuciLiniju();
        }
        //this._lastpos = trans;
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
        let x_trans = this._matrica[0][0] * x + this._matrica[0][1] * y + this._matrica[0][2] * z + this._matrica[0][3];
        let y_trans = this._matrica[1][0] * x + this._matrica[1][1] * y + this._matrica[1][2] * z + this._matrica[1][3];
        let z_trans = this._matrica[2][0] * x + this._matrica[2][1] * y + this._matrica[2][2] * z + this._matrica[2][3];
        if (z_trans >= 0) {
            return { x: NaN, y: NaN };
        }
        let x_pr = -(this._distance / z_trans) * x_trans;
        let y_pr = -(this._distance / z_trans) * y_trans;
        let x_pix = this.p_x + this.s_x * x_pr;
        let y_pix = this.p_y + this.s_y * y_pr;
        return { x: x_pix, y: y_pix };
    }
    vratiKameraKoord(x, y, z) {
        let x_trans = this._matrica[0][0] * x + this._matrica[0][1] * y + this._matrica[0][2] * z + this._matrica[0][3];
        let y_trans = this._matrica[1][0] * x + this._matrica[1][1] * y + this._matrica[1][2] * z + this._matrica[1][3];
        let z_trans = this._matrica[2][0] * x + this._matrica[2][1] * y + this._matrica[2][2] * z + this._matrica[2][3];
        return { x: x_trans, y: y_trans, z: z_trans };
    }
    vratiProjektiraneKoord(x_kam, y_kam, z_kam) {
        if (z_kam >= 0) {
            return { x: NaN, y: NaN };
        }
        let x_pr = -(this._distance / z_kam) * x_kam;
        let y_pr = -(this._distance / z_kam) * y_kam;
        let x_pix = this.p_x + this.s_x * x_pr;
        let y_pix = this.p_y + this.s_y * y_pr;
        return { x: x_pix, y: y_pix };
    }
    trans(mat) {
        this._matrica = mat.multMatrice(mat._kamera, mat._matrica);
    }
}
