"use strict";
// @ts-ignore
class CrtanjeWebGL {
    vratiVrhoveElipse() {
        var novi_vrhovi = [0.0, 0.0];
        for (let i = 0; i <= Math.PI * 2; i += Math.PI / 12) {
            let x = 1.0 * Math.cos(i);
            let y = 0.2 * Math.sin(i);
            novi_vrhovi.push(x);
            novi_vrhovi.push(y);
        }
        return novi_vrhovi;
    }
    spektarBoja = [
        [0.5, 0.0, 1.0], // ljubicasta 0
        [0.0, 0.0, 1.0], // plava 1 
        [0.0, 1.0, 1.0], // cyan 2
        [0.0, 1.0, 0.0], // zelena 3
        [1.0, 1.0, 0.0], // zuta 4
        [1.0, 0.0, 0.0,] // crvena 5
    ];
    kombiniraj2DVrhoveIBoje(vrhovi, boje) {
        var nova = [];
        for (let i = 0; i < vrhovi.length; i += 5) {
            nova.push(vrhovi[i]); // x
            nova.push(vrhovi[i + 1]); // y
            nova.push(this.spektarBoja[i][0]);
            nova.push(this.spektarBoja[i][1]);
            nova.push(this.spektarBoja[i][2]);
        }
        return nova;
    }
    kombiniraj3DVrhoveIBoje(vrhovi, boje) {
        var nova = [];
        for (let i = 0; i < vrhovi.length; i += 6) {
            nova.push(vrhovi[i]); // x
            nova.push(vrhovi[i + 1]); // y
            nova.push(vrhovi[i + 2]); // z
            nova.push(this.spektarBoja[i][0]);
            nova.push(this.spektarBoja[i][1]);
            nova.push(this.spektarBoja[i][2]);
        }
        return nova;
    }
    vratiVrhovePravokutnikaUTrokutima(a, b) { }
    vratiVrhovePravokutnikaUQuads(a, b) { }
    vratiVrhoveTrokuta(velicina_str) { }
    kombinirajRed3DVrhovaIBoju(vrhovi, boja) {
        let red = [];
        red.push(vrhovi[0], vrhovi[1], vrhovi[2]);
        red.push(boja[0], boja[1], boja[2]);
        return red;
    }
    vratiVrhoveKocke(a, centered) {
        var novi = [];
        const offsetX = centered ? a / 2 : 0;
        const offsetY = centered ? a / 2 : 0;
        const offsetZ = centered ? a / 2 : 0;
        const h = a / 2;
        const v = [
            [-h + offsetX, -h + offsetY, -h + offsetZ],
            [h + offsetX, -h + offsetY, -h + offsetZ],
            [h + offsetX, h + offsetY, -h + offsetZ],
            [-h + offsetX, h + offsetY, -h + offsetZ],
            [-h + offsetX, -h + offsetY, h + offsetZ],
            [h + offsetX, -h + offsetY, h + offsetZ],
            [h + offsetX, h + offsetY, h + offsetZ],
            [-h + offsetX, h + offsetY, h + offsetZ]
        ];
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // bottom face
            [4, 5], [5, 6], [6, 7], [7, 4], // top face
            [0, 4], [1, 5], [2, 6], [3, 7] // vertical edges
        ];
        for (const [i, j] of edges) {
            novi.push(v[i][0], v[i][1], v[i][2]);
            novi.push(v[j][0], v[j][1], v[j][2]);
        }
        return novi;
    }
    vratiVrhoveKockeTrokut(a, centered) {
        let novi = [];
        const offset = centered ? 0 : a / 2;
        const h = a / 2;
        // 8 vrhova kocke
        const v = [
            [-h + offset, -h + offset, -h + offset], // 0
            [h + offset, -h + offset, -h + offset], // 1
            [h + offset, h + offset, -h + offset], // 2
            [-h + offset, h + offset, -h + offset], // 3
            [-h + offset, -h + offset, h + offset], // 4
            [h + offset, -h + offset, h + offset], // 5
            [h + offset, h + offset, h + offset], // 6
            [-h + offset, h + offset, h + offset] // 7
        ];
        // svaka strana = 2 trokuta (CCW redoslijed!)
        const faces = [
            // prednja (z+)
            [4, 5, 6], [4, 6, 7],
            // stražnja (z-)
            [0, 2, 1], [0, 3, 2],
            // lijeva (x-)
            [0, 7, 3], [0, 4, 7],
            // desna (x+)
            [1, 2, 6], [1, 6, 5],
            // gornja (y+)
            [3, 7, 6], [3, 6, 2],
            // donja (y-)
            [0, 1, 5], [0, 5, 4],
        ];
        for (const [i, j, k] of faces) {
            novi.push(v[i][0], v[i][1], v[i][2], v[j][0], v[j][1], v[j][2], v[k][0], v[k][1], v[k][2]);
        }
        return novi;
    }
    vratiVrhoveGrid(min, max, step, boja) {
        let novi = [];
        for (let i = min; i <= max; i += step) {
            // horizontalne linije (paralelne x)
            novi.push(i, min, 0);
            novi.push(boja[0], boja[1], boja[2]);
            novi.push(i, max, 0);
            novi.push(boja[0], boja[1], boja[2]);
            // vertikalne linije (paralelne y)
            novi.push(min, i, 0);
            novi.push(boja[0], boja[1], boja[2]);
            novi.push(max, i, 0);
            novi.push(boja[0], boja[1], boja[2]);
        }
        return novi;
    }
    vratiVrhoveValjka(r, h, n) {
        var vrhovi = [];
        // n-terokut - donja baza valjka na z = -h / 2
        // vektori normale su prema dolje, tj. [0, 0, -1]
        vrhovi.push(0, 0, -h / 2, 0, 0, -1); // središte za TRIANGLE_FAN
        let phi = 2 * Math.PI / n;
        for (let i = 0; i <= n; i++) {
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), -h / 2, 0, 0, -1);
            phi += 2 * Math.PI / n;
        } // for
        // n-terokut - gornja baza valjka na z = h / 2
        // vektori normale su prema gore, tj. [0, 0, 1]
        vrhovi.push(0, 0, h / 2, 0, 0, 1); // središte za TRIANGLE_FAN
        phi = 2 * Math.PI;
        for (let i = 0; i <= n; i++) {
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), h / 2, 0, 0, 1);
            phi -= 2 * Math.PI / n;
        } // for
        // plašt valjka
        phi = 0;
        for (let i = 0; i <= n; i++) {
            let c = Math.cos(phi);
            let s = Math.sin(phi);
            let x = r * c;
            let y = r * s;
            vrhovi.push(x, y, -h / 2, c, s, 0);
            vrhovi.push(x, y, h / 2, c, s, 0);
            phi += 2 * Math.PI / n;
        } // for
        console.log("vrhovi.length: ", vrhovi.length);
        return vrhovi;
    } // valjak
}
