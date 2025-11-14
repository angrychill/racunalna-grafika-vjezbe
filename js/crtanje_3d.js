"use strict";
// @ts-ignore
class Crtanje3D {
    gks;
    mat;
    constructor(gks, mat) {
        this.gks = gks;
        this.mat = mat;
    }
    nacrtajKocku(a = 1) {
        // srediste u ishodistu
        let h = a / 2;
        let v = [
            [-h, -h, -h],
            [h, -h, -h],
            [h, h, -h],
            [-h, h, -h],
            [-h, -h, h],
            [h, -h, h],
            [h, h, h],
            [-h, h, h]
        ];
        let e = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];
        for (const [i, j] of e) {
            this.gks.postaviNa(v[i][0], v[i][1], v[i][2]);
            this.gks.linijaDo(v[j][0], v[j][1], v[j][2], true);
        }
    }
    nacrtajGlavneOsi() {
        this.gks.koristiBoju("red");
        this.gks.postaviNa(-20, 0, 0);
        this.gks.linijaDo(20, 0, 0);
        this.gks.povuciLiniju();
        this.gks.koristiBoju("blue");
        this.gks.postaviNa(0, -20, 0);
        this.gks.linijaDo(0, 20, 0);
        this.gks.povuciLiniju();
        this.gks.koristiBoju("green");
        this.gks.postaviNa(0, 0, -20);
        this.gks.linijaDo(0, 0, 20);
        this.gks.povuciLiniju();
        this.gks.koristiBoju("black");
    }
    nacrtajF() {
        this.gks.koristiBoju("red");
        this.gks.korisitDebljinu(1);
        for (let i = 0; i < 5; i++) {
            this.nacrtajKocku(1);
            this.mat.pomakni(0, 1, 0);
            this.gks.trans(this.mat);
        }
        this.mat.pomakni(0, -1, 0);
        for (let i = 1; i < 3; i++) {
            this.mat.pomakni(1, 0, 0);
            this.gks.trans(this.mat);
            this.nacrtajKocku(1);
        }
        this.mat.pomakni(-2, -2, 0);
        for (let i = 1; i < 3; i++) {
            this.mat.pomakni(1, 0, 0);
            this.gks.trans(this.mat);
            this.nacrtajKocku(1);
        }
    }
    nacrtajGrid() {
    }
    nacrtajGridXZ(cell_w = 1, cell_h = 1) {
        this.gks.koristiBoju("gray");
        this.gks.korisitDebljinu(0.5);
        for (let i = -10; i <= 10; i += cell_h) {
            this.gks.postaviNa(-10, 0, i);
            this.gks.linijaDo(10, 0, i);
            this.gks.povuciLiniju();
        }
        for (let i = -10; i <= 10; i += cell_w) {
            this.gks.postaviNa(i, 0, -10);
            this.gks.linijaDo(i, 0, 10);
            this.gks.povuciLiniju();
        }
    }
    nacrtajOs(point1, point2) {
        let dx = point2[0] - point1[0];
        let dy = point2[1] - point1[1];
        let dz = point2[2] - point1[2];
        let length = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (length === 0)
            return;
        dx /= length;
        dy /= length;
        dz /= length;
        let t = this.gks.x_max * 2;
        let p1 = [point1[0] - t * dx, point1[1] - t * dy, point1[2] - t * dz];
        let p2 = [point1[0] + t * dx, point1[1] + t * dy, point1[2] + t * dz];
        this.gks.postaviNa(p1[0], p1[1], p1[2]);
        this.gks.linijaDo(p2[0], p2[1], p2[2]);
        this.gks.povuciLiniju();
    }
    nacrtajStozac(r, h, n) {
        // r polumjer baze
        // h visina stozca
        // n broj segmenata (rezolucija)
        // rub baze: r cos kut, r sin kut, 0
        // za kut e 0, 2pi
        // vrh stozca u 0, 0, h
        // svaki korak se povecava za 2pi/n
        this.gks.postaviNa(0, 0, 0);
        for (let i = 0; i <= Math.PI * 2 + (2 * Math.PI) / n; i += (2 * Math.PI) / n) {
            let x = r * Math.cos(i);
            let z = r * Math.sin(i);
            if (i == 0) {
                this.gks.postaviNa(x, 0, z);
                this.gks.linijaDo(0, h, 0);
                this.gks.postaviNa(x, 0, z);
            }
            else {
                this.gks.linijaDo(x, 0, z);
                this.gks.linijaDo(0, h, 0, true);
                this.gks.postaviNa(x, 0, z);
            }
        }
        this.gks.povuciLiniju();
    }
    nacrtajValjak(r, h, n) {
        let h1 = 0;
        let h2 = h;
        // donja baza
        for (let i = 0; i <= Math.PI * 2 + (2 * Math.PI) / n; i += (2 * Math.PI) / n) {
            let x = r * Math.cos(i);
            let z = r * Math.sin(i);
            if (i == 0) {
                this.gks.postaviNa(x, h1, z);
            }
            else {
                this.gks.linijaDo(x, h1, z, true);
                this.gks.postaviNa(x, h1, z);
            }
        }
        // gornja baza
        for (let i = 0; i <= Math.PI * 2 + (2 * Math.PI) / n; i += (2 * Math.PI) / n) {
            let x = r * Math.cos(i);
            let z = r * Math.sin(i);
            if (i == 0) {
                this.gks.postaviNa(x, h2, z);
            }
            else {
                this.gks.linijaDo(x, h2, z, true);
                this.gks.postaviNa(x, h2, z);
            }
        }
        // columns
        for (let i = 0; i <= Math.PI * 2 + (2 * Math.PI) / n; i += (2 * Math.PI) / n) {
            let x = r * Math.cos(i);
            let z = r * Math.sin(i);
            this.gks.postaviNa(x, h1, z);
            this.gks.linijaDo(x, h2, z, true);
        }
    }
    // todo: fix wrong number of segments
    nacrtajKuglu(r, m, n) {
        // r polumjer
        // m meridijani
        //n paralele
        // x = r cos kut sin n
        // y = r cos kut sin n
        // z = r cos n
        // radius paralele = r sin n
        // paralela 0 O knstanta
        // prvo svi meridijani
        for (let i = 0; i <= Math.PI * 2; i += (2 * Math.PI) / m) {
            console.log(i);
            // prvo nacrtaj jedan meridijan za dani segment?
            for (let j = 0; j <= Math.PI + 0.1; j += 0.1) {
                let x = r * Math.cos(i) * Math.sin(j);
                let y = r * Math.cos(j);
                let z = r * Math.sin(i) * Math.sin(j);
                if (j == 0) {
                    this.gks.postaviNa(x, y, z);
                }
                else {
                    this.gks.linijaDo(x, y, z);
                }
                this.gks.povuciLiniju();
            }
        }
        // pa sve paralele
        for (let i = 0; i <= Math.PI; i += Math.PI / (n + 1)) {
            // nacrtaj paralelu
            for (let j = 0; j <= (Math.PI * 2) + 0.1; j += 0.1) {
                let x = r * Math.cos(j) * Math.sin(i);
                let y = r * Math.cos(i);
                let z = r * Math.sin(j) * Math.sin(i);
                if (j == 0) {
                    this.gks.postaviNa(x, y, z);
                }
                else {
                    this.gks.linijaDo(x, y, z);
                }
                this.gks.povuciLiniju();
            }
        }
    }
    nacrtajParametarskuPlohu(u_min, u_max, v_min, v_max, u_curves = 5, v_curves = 10) {
        // x = u sin v
        // y = u cos v
        // z = arcsin u
        let u_increment = (u_max - u_min) / (u_curves);
        let v_increment = (v_max - v_min) / (v_curves);
        for (let v = v_min; v <= v_max; v += v_increment) {
            for (let u = u_min; u <= u_max + u_increment; u += u_increment) {
                let x = u * Math.sin(v);
                let z = u * Math.cos(v);
                let y = Math.asin(u);
                if (u == u_min) {
                    this.gks.postaviNa(x, y, z);
                }
                else {
                    this.gks.linijaDo(x, y, z, true);
                    this.gks.postaviNa(x, y, z);
                }
            }
            //this.gks.povuciLiniju();
        }
        for (let u = u_min; u <= u_max; u += u_increment) {
            for (let v = v_min; v <= v_max + v_increment; v += v_increment) {
                let x = u * Math.sin(v);
                let z = u * Math.cos(v);
                let y = Math.asin(u);
                if (v == v_min) {
                    this.gks.postaviNa(x, y, z);
                }
                else {
                    this.gks.linijaDo(x, y, z, true);
                    this.gks.postaviNa(x, y, z);
                }
            }
            //this.gks.povuciLiniju();
        }
    }
}
