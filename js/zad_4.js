"use strict";
// @ts-ignore
class zad_1 {
    crtac;
    gks;
    mat;
    constructor(canvas) {
        var x_min = -10;
        var x_max = 10;
        var y_min = -10;
        var y_max = 10;
        this.gks = new GKS3DPerspective(canvas, x_min, x_max, y_min, y_max, 10);
        this.mat = new MT3D();
        this.crtac = new Crtanje3D(this.gks, this.mat);
        this.crtaj(15);
        //this.animiraj();
    }
    crtaj(step) {
        this.gks.g.clearRect(0, 0, this.gks.w, this.gks.h);
        this.mat.identitet();
        let r = 8;
        let h = 5 + 5 * Math.sin(step);
        let eye_x = r * Math.cos(step);
        let eye_z = r * Math.sin(step);
        this.mat.postaviKameru(eye_x, h, eye_z, 0, 0, 0, 0, 1, 0);
        this.gks.trans(this.mat);
        this.crtac.nacrtajGridXZ();
        this.crtac.nacrtajGlavneOsi();
        this.crtac.nacrtajF();
    }
    step = 0;
    animiraj() {
        this.step += 0.01;
        if (this.step > Math.PI * 2) {
            this.step = 0;
        }
        this.crtaj(this.step);
        requestAnimationFrame(() => this.animiraj());
    }
}
// @ts-ignore
function main() {
    let platno1 = document.getElementById("canvas1");
    var w = platno1.width;
    var h = platno1.height;
    var g = platno1.getContext("2d");
    new zad_1(platno1);
}
window.addEventListener("load", () => main());
