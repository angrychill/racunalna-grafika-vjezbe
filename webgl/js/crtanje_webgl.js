"use strict";
// @ts-ignore
class CrtanjeWebGL {
    // ====================== KOCKA (filled) ======================
    vratiMeshKocka(a = 2, centered = true) {
        const h = a / 2;
        const x0 = centered ? -h : 0;
        const y0 = centered ? -h : 0;
        const z0 = centered ? -h : 0;
        const x1 = x0 + a;
        const y1 = y0 + a;
        const z1 = z0 + a;
        const vertices = [
            // Front (+Z)
            x0, y0, z1, 0, 0, 1,
            x1, y0, z1, 0, 0, 1,
            x1, y1, z1, 0, 0, 1,
            x0, y0, z1, 0, 0, 1,
            x1, y1, z1, 0, 0, 1,
            x0, y1, z1, 0, 0, 1,
            // Back (-Z)
            x0, y0, z0, 0, 0, -1,
            x1, y0, z0, 0, 0, -1,
            x1, y1, z0, 0, 0, -1,
            x0, y0, z0, 0, 0, -1,
            x1, y1, z0, 0, 0, -1,
            x0, y1, z0, 0, 0, -1,
            // Left (-X)
            x0, y0, z0, -1, 0, 0,
            x0, y0, z1, -1, 0, 0,
            x0, y1, z1, -1, 0, 0,
            x0, y0, z0, -1, 0, 0,
            x0, y1, z1, -1, 0, 0,
            x0, y1, z0, -1, 0, 0,
            // Right (+X)
            x1, y0, z0, 1, 0, 0,
            x1, y0, z1, 1, 0, 0,
            x1, y1, z1, 1, 0, 0,
            x1, y0, z0, 1, 0, 0,
            x1, y1, z1, 1, 0, 0,
            x1, y1, z0, 1, 0, 0,
            // Top (+Y)
            x0, y1, z0, 0, 1, 0,
            x0, y1, z1, 0, 1, 0,
            x1, y1, z1, 0, 1, 0,
            x0, y1, z0, 0, 1, 0,
            x1, y1, z1, 0, 1, 0,
            x1, y1, z0, 0, 1, 0,
            // Bottom (-Y)
            x0, y0, z0, 0, -1, 0,
            x0, y0, z1, 0, -1, 0,
            x1, y0, z1, 0, -1, 0,
            x0, y0, z0, 0, -1, 0,
            x1, y0, z1, 0, -1, 0,
            x1, y0, z0, 0, -1, 0,
        ];
        return {
            vertices: new Float32Array(vertices),
            drawModes: [{ mode: WebGL2RenderingContext.TRIANGLES, count: vertices.length / 6, offset: 0 }]
        };
    }
    // ====================== KOCKA WIRE (edges) ======================
    vratiMeshKockaWire(a = 2, centered = true) {
        const h = a / 2;
        const x0 = centered ? -h : 0;
        const y0 = centered ? -h : 0;
        const z0 = centered ? -h : 0;
        const x1 = x0 + a;
        const y1 = y0 + a;
        const z1 = z0 + a;
        const vertices = [
            // Bottom face
            x0, y0, z0, x1, y0, z0,
            x1, y0, z0, x1, y1, z0,
            x1, y1, z0, x0, y1, z0,
            x0, y1, z0, x0, y0, z0,
            // Top face
            x0, y0, z1, x1, y0, z1,
            x1, y0, z1, x1, y1, z1,
            x1, y1, z1, x0, y1, z1,
            x0, y1, z1, x0, y0, z1,
            // Vertical edges
            x0, y0, z0, x0, y0, z1,
            x1, y0, z0, x1, y0, z1,
            x1, y1, z0, x1, y1, z1,
            x0, y1, z0, x0, y1, z1,
        ];
        return {
            vertices: new Float32Array(vertices),
            drawModes: [{ mode: WebGL2RenderingContext.LINES, count: vertices.length / 6, offset: 0 }]
        };
    }
    // ====================== GRID ======================
    vratiMeshGrid(min = -5, max = 5, step = 1) {
        let vrhovi = [];
        const z = 0.01;
        for (let i = min; i <= max; i += step) {
            // horizontal
            vrhovi.push(i, min, z, 0, 1, 0);
            vrhovi.push(i, max, z, 0, 1, 0);
            // vertical
            vrhovi.push(min, i, z, 0, 1, 0);
            vrhovi.push(max, i, z, 0, 1, 0);
        }
        return {
            vertices: new Float32Array(vrhovi),
            drawModes: [{ mode: WebGL2RenderingContext.LINES, count: vrhovi.length / 6, offset: 0 }]
        };
    }
    // ====================== VALJAK ======================
    vratiMeshValjak(r = 1, h = 2, n = 32) {
        let vrhovi = [];
        let offset = 0;
        let drawModes = [];
        const phiStep = 2 * Math.PI / n;
        // Donja baza
        vrhovi.push(0, 0, -h / 2, 0, 0, -1);
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), -h / 2, 0, 0, -1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += n + 2;
        // Gornja baza
        vrhovi.push(0, 0, h / 2, 0, 0, 1);
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), h / 2, 0, 0, 1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += n + 2;
        // Plašt
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
    // ====================== STOŽAC ======================
    vratiMeshStozac(r = 1, h = 2, n = 32) {
        let vrhovi = [];
        let offset = 0;
        let drawModes = [];
        // Donja baza
        vrhovi.push(0, 0, 0, 0, 0, -1);
        for (let i = 0; i <= n; i++) {
            let phi = i * 2 * Math.PI / n;
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), 0, 0, 0, -1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += n + 2;
        // Plašt
        for (let i = 0; i <= n; i++) {
            let phi = i * 2 * Math.PI / n;
            let x = r * Math.cos(phi);
            let y = r * Math.sin(phi);
            let nx = -x, ny = -y, nz = h;
            let len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            nx /= len;
            ny /= len;
            nz /= len;
            vrhovi.push(x, y, 0, nx, ny, nz);
            vrhovi.push(0, 0, h, nx, ny, nz);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: 2 * (n + 1), offset: offset });
        return { vertices: new Float32Array(vrhovi), drawModes };
    }
    // ====================== KUGLA ======================
    vratiMeshKugla(r = 1, nLat = 20, nLon = 30) {
        let vrhovi = [];
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
        }
        return {
            vertices: new Float32Array(vrhovi),
            drawModes: [{ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: vrhovi.length / 6, offset: 0 }]
        };
    }
    // ====================== POLUKUGLA ======================
    vratiMeshPoluKugla(r = 1, nLat = 20, nLon = 30) {
        let vrhovi = [];
        for (let i = 0; i < nLat; i++) {
            let lat0 = Math.PI * (0.5 * i / nLat);
            let lat1 = Math.PI * (0.5 * (i + 1) / nLat);
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
        }
        return {
            vertices: new Float32Array(vrhovi),
            drawModes: [{ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: vrhovi.length / 6, offset: 0 }]
        };
    }
}
