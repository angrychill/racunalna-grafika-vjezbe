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
    vratiMeshValjak(r, h, n) {
        let vrhovi = [];
        let offset = 0;
        let drawModes = [];
        // DONJA BAZA
        let start = vrhovi.length / 6;
        vrhovi.push(0, 0, -h / 2, 0, 0, -1); // centar
        let phiStep = 2 * Math.PI / n;
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), -h / 2, 0, 0, -1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += (n + 2);
        // GORNJA BAZA
        let start2 = vrhovi.length / 6;
        vrhovi.push(0, 0, h / 2, 0, 0, 1);
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), h / 2, 0, 0, 1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += (n + 2);
        // PLAŠT
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            let x = r * Math.cos(phi);
            let y = r * Math.sin(phi);
            vrhovi.push(x, y, -h / 2, Math.cos(phi), Math.sin(phi), 0);
            vrhovi.push(x, y, h / 2, Math.cos(phi), Math.sin(phi), 0);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: 2 * (n + 1), offset: offset });
        return { vertices: new Float32Array(vrhovi), drawModes };
    }
    vratiMeshStozac(r, h, n) {
        let vrhovi = [];
        let offset = 0;
        let drawModes = [];
        // DONJA BAZA
        vrhovi.push(0, 0, 0, 0, 0, -1);
        for (let i = 0; i <= n; i++) {
            let phi = i * 2 * Math.PI / n;
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), 0, 0, 0, -1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += n + 2;
        // PLAŠT
        let tipX = 0, tipY = 0, tipZ = h;
        for (let i = 0; i <= n; i++) {
            let phi = i * 2 * Math.PI / n;
            let x = r * Math.cos(phi);
            let y = r * Math.sin(phi);
            // vrh baza, vrh stošca
            let nx = tipX - x;
            let ny = tipY - y;
            let nz = tipZ - 0;
            let len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            nx /= len;
            ny /= len;
            nz /= len;
            vrhovi.push(x, y, 0, nx, ny, nz);
            vrhovi.push(tipX, tipY, tipZ, nx, ny, nz);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: 2 * (n + 1), offset: offset });
        return { vertices: new Float32Array(vrhovi), drawModes };
    }
    vratiMeshKugla(r, nLat, nLon) {
        let vrhovi = [];
        let offset = 0;
        let drawModes = [];
        for (let i = 0; i < nLat; i++) {
            let lat0 = Math.PI * (-0.5 + i / nLat);
            let lat1 = Math.PI * (-0.5 + (i + 1) / nLat);
            let z0 = r * Math.sin(lat0);
            let z1 = r * Math.sin(lat1);
            let r0 = r * Math.cos(lat0);
            let r1 = r * Math.cos(lat1);
            for (let j = 0; j <= nLon; j++) {
                let lon = 2 * Math.PI * j / nLon;
                let x0 = r0 * Math.cos(lon);
                let y0 = r0 * Math.sin(lon);
                let x1 = r1 * Math.cos(lon);
                let y1 = r1 * Math.sin(lon);
                let nx0 = x0 / r, ny0 = y0 / r, nz0 = z0 / r;
                let nx1 = x1 / r, ny1 = y1 / r, nz1 = z1 / r;
                vrhovi.push(x0, y0, z0, nx0, ny0, nz0);
                vrhovi.push(x1, y1, z1, nx1, ny1, nz1);
            }
            drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: 2 * (nLon + 1), offset: offset });
            offset += 2 * (nLon + 1);
        }
        return { vertices: new Float32Array(vrhovi), drawModes };
    }
    vratiMeshPoluKugla(r, nLat, nLon) {
        let vrhovi = [];
        let offset = 0;
        let drawModes = [];
        for (let i = 0; i < nLat; i++) {
            let lat0 = Math.PI * (-0.5 + i / nLat);
            let lat1 = Math.PI * (-0.5 + (i + 1) / nLat);
            let z0 = r * Math.sin(lat0);
            let z1 = r * Math.sin(lat1);
            let r0 = r * Math.cos(lat0);
            let r1 = r * Math.cos(lat1);
            for (let j = 0; j <= nLon; j++) {
                let lon = 2 * Math.PI * j / nLon;
                let x0 = r0 * Math.cos(lon);
                let y0 = r0 * Math.sin(lon);
                let x1 = r1 * Math.cos(lon);
                let y1 = r1 * Math.sin(lon);
                let nx0 = x0 / r, ny0 = y0 / r, nz0 = z0 / r;
                let nx1 = x1 / r, ny1 = y1 / r, nz1 = z1 / r;
                vrhovi.push(x0, y0, z0, nx0, ny0, nz0);
                vrhovi.push(x1, y1, z1, nx1, ny1, nz1);
            }
            drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: 2 * (nLon + 1), offset: offset });
            offset += 2 * (nLon + 1);
        }
        return { vertices: new Float32Array(vrhovi), drawModes };
    }
    napuniBuffer(gl, program, mesh) {
        const a_vrhXYZ = gl.getAttribLocation(program, "a_vrhXYZ");
        const a_normala = gl.getAttribLocation(program, "a_normala");
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a_vrhXYZ);
        gl.enableVertexAttribArray(a_normala);
        gl.vertexAttribPointer(a_vrhXYZ, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(a_normala, 3, gl.FLOAT, false, 24, 12);
        return mesh.drawModes;
    }
    vratiSupliMeshValjak(r, h, r_inner, n) {
        let vrhovi = [];
        let offset = 0;
        let drawModes = [];
        const phiStep = 2 * Math.PI / n;
        // ======================
        // DONJA BAZA (PRSTEN)
        // ======================
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            // vanjski rub
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), -h / 2, 0, 0, -1);
            // unutarnji rub
            vrhovi.push(r_inner * Math.cos(phi), r_inner * Math.sin(phi), -h / 2, 0, 0, -1);
        }
        drawModes.push({
            mode: WebGL2RenderingContext.TRIANGLE_STRIP,
            count: 2 * (n + 1),
            offset: offset
        });
        offset += 2 * (n + 1);
        // ======================
        // GORNJA BAZA (PRSTEN)
        // ======================
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            // vanjski rub
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), h / 2, 0, 0, 1);
            // unutarnji rub
            vrhovi.push(r_inner * Math.cos(phi), r_inner * Math.sin(phi), h / 2, 0, 0, 1);
        }
        drawModes.push({
            mode: WebGL2RenderingContext.TRIANGLE_STRIP,
            count: 2 * (n + 1),
            offset: offset
        });
        offset += 2 * (n + 1);
        // ======================
        // VANJSKI PLAŠT
        // ======================
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            let nx = Math.cos(phi);
            let ny = Math.sin(phi);
            let x = r * nx;
            let y = r * ny;
            vrhovi.push(x, y, -h / 2, nx, ny, 0);
            vrhovi.push(x, y, h / 2, nx, ny, 0);
        }
        drawModes.push({
            mode: WebGL2RenderingContext.TRIANGLE_STRIP,
            count: 2 * (n + 1),
            offset: offset
        });
        offset += 2 * (n + 1);
        // ======================
        // UNUTARNJI PLAŠT (normale prema unutra)
        // ======================
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            let nx = -Math.cos(phi);
            let ny = -Math.sin(phi);
            let x = r_inner * Math.cos(phi);
            let y = r_inner * Math.sin(phi);
            vrhovi.push(x, y, -h / 2, nx, ny, 0);
            vrhovi.push(x, y, h / 2, nx, ny, 0);
        }
        drawModes.push({
            mode: WebGL2RenderingContext.TRIANGLE_STRIP,
            count: 2 * (n + 1),
            offset: offset
        });
        return {
            vertices: new Float32Array(vrhovi),
            drawModes
        };
    }
}
