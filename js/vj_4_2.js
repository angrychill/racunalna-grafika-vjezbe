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
        this.gks = new GKS3D(canvas, x_min, x_max);
        this.mat = new MT3D();
        this.crtac = new Crtanje3D(this.gks, this.mat);
        this.animiraj();
    }
    crtaj(step) {
        this.mat.identitet();
        this.mat.rotirajY(step);
        this.mat.rotirajX(step);
        this.mat.rotirajZ(step);
        this.gks.trans(this.mat);
        this.crtac.nacrtajKocku(3);
    }
    step = 0;
    animiraj() {
        this.gks.g.clearRect(0, 0, this.gks.w, this.gks.h);
        this.step += 0.01;
        if (this.step > Math.PI * 2) {
            this.step = 0;
        }
        this.crtaj(this.step);
        requestAnimationFrame(() => this.animiraj());
    }
}
// @ts-ignore
class zad_2 {
    constructor(canvas) {
        var x_min = -10;
        var x_max = 10;
        var y_min = -10;
        var y_max = 10;
        var gks = new GKS3D(canvas, x_min, x_max);
        var mat = new MT3D();
        var crtac = new Crtanje3D(gks, mat);
        this.crtaj();
    }
    crtaj() {
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
