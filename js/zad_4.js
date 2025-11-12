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
        this.gks = new GKS3DPerspective(canvas, x_min, x_max, x_min, x_max, 5);
        this.mat = new MT3D();
        this.crtac = new Crtanje3DPerspective(this.gks, this.mat);
        this.crtaj(0);
    }
    crtaj(step) {
        this.mat.identitet();
        this.mat.postaviKameru(5, 5, 0, 0, 0, 0, 5, 5, 5);
        this.gks.trans(this.mat);
        //this.crtac.nacrtajKocku(3);
        this.crtac.nacrtajGlavneOsi();
    }
    step = 0;
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
