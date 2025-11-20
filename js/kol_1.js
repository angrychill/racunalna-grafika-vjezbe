"use strict";
// @ts-ignore
class zad_1 {
    crtac;
    gks;
    mat;
    isPaused = false;
    constructor(canvas) {
        var x_min = -10;
        var x_max = 10;
        var y_min = -10;
        var y_max = 10;
        this.gks = new GKS3DPerspective(canvas, x_min, x_max, y_min, y_max, 10);
        this.mat = new MT3D();
        this.crtac = new Crtanje3D(this.gks, this.mat);
        //this.crtaj(0);
        this.animiraj();
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.isPaused = !this.isPaused;
            }
        });
    }
    crtaj(step) {
        this.gks.g.clearRect(0, 0, this.gks.w, this.gks.h);
        this.mat.identitet();
        this.gks.trans(this.mat);
        let kam_x = Math.sin(step) * 8;
        let kam_z = Math.cos(step) * 8;
        let kam_y_min = 0.2;
        let kam_y_max = 7;
        let kam_y_offset = 5;
        let kam_y = Math.sin(step) * (kam_y_max - kam_y_min) + kam_y_offset;
        this.mat.postaviKameru(-5, -5, 0, 0, 0, 0, 0, 1, 0);
        this.gks.trans(this.mat);
        this.crtac.nacrtajGridXZ();
        this.gks.koristiBoju("black");
        this.gks.korisitDebljinu(0.75);
        //this.mat.rotirajY(Utility.degToRad(70));
        //this.gks.trans(this.mat);
        this.crtac.nacrtajVjetromjer(step);
    }
    step = 0;
    animiraj() {
        if (!this.isPaused) {
            this.step += 0.01;
            if (this.step > Math.PI * 2) {
                this.step = 0;
            }
            this.crtaj(this.step);
        }
        requestAnimationFrame(() => this.animiraj());
    }
}
// @ts-ignore
class zad_2 {
    crtac;
    gks;
    mat;
    isPaused = false;
    constructor(canvas) {
        var x_min = -10;
        var x_max = 10;
        var y_min = -10;
        var y_max = 10;
        this.gks = new GKS3DPerspective(canvas, x_min, x_max, y_min, y_max, 20);
        this.mat = new MT3D();
        this.crtac = new Crtanje3D(this.gks, this.mat);
        //this.crtaj(15);
        this.animiraj();
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.isPaused = !this.isPaused;
            }
        });
    }
    crtaj(step) {
        this.gks.g.clearRect(0, 0, this.gks.w, this.gks.h);
        this.mat.identitet();
        let r = 15;
        //let h = 2 + 2 * Math.sin(step)*0.5;
        //let eye_x = r * Math.cos(step)*0.5;
        //let eye_z = r * Math.sin(step)*0.5;
        let kam_x = Math.sin(step) * 25;
        let kam_z = Math.cos(step) * 25;
        let kam_y_min = 4;
        let kam_y_max = 8;
        let kam_y_offset = 6;
        let kam_y = Math.sin(step) * (kam_y_max - kam_y_min) + kam_y_offset;
        this.mat.postaviKameru(kam_x, kam_y, kam_z, 0, kam_y_offset, 0, 0, 1, 0);
        this.gks.trans(this.mat);
        this.crtac.nacrtajGridXZ();
        this.gks.koristiBoju("black");
        this.gks.korisitDebljinu(0.75);
        this.mat.skaliraj(3, 3, 3);
        this.mat.pomakni(0, Math.PI / 2, 0);
        this.gks.trans(this.mat);
        this.crtac.nacrtajParametarskuPlohu(-1, 1, 0, Math.PI * 2, 15, 15);
    }
    step = 0;
    animiraj() {
        if (!this.isPaused) {
            this.step += 0.005;
            if (this.step > Math.PI * 2) {
                this.step = 0;
            }
            this.crtaj(this.step);
        }
        requestAnimationFrame(() => this.animiraj());
    }
}
// @ts-ignore
function main() {
    let platno1 = document.getElementById("canvas1");
    let platno2 = document.getElementById("canvas2");
    var w = platno1.width;
    var h = platno1.height;
    var g = platno1.getContext("2d");
    new zad_1(platno1);
    new zad_2(platno2);
}
window.addEventListener("load", () => main());
