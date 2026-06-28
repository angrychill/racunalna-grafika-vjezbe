// @ts-ignore
class CrtanjeWebGL {

 // ====================== KOCKA (filled) ======================
    vratiMeshKocka(a: number = 2, centered: boolean = true): Mesh3D {
        const h = a / 2;
        const x0 = centered ? -h : 0;
        const y0 = centered ? -h : 0;
        const z0 = centered ? -h : 0;
        const x1 = x0 + a;
        const y1 = y0 + a;
        const z1 = z0 + a;

        const vertices = [
            // Front (+Z)
            x0, y0, z1,  0, 0, 1,
            x1, y0, z1,  0, 0, 1,
            x1, y1, z1,  0, 0, 1,
            x0, y0, z1,  0, 0, 1,
            x1, y1, z1,  0, 0, 1,
            x0, y1, z1,  0, 0, 1,

            // Back (-Z)
            x0, y0, z0,  0, 0, -1,
            x1, y0, z0,  0, 0, -1,
            x1, y1, z0,  0, 0, -1,
            x0, y0, z0,  0, 0, -1,
            x1, y1, z0,  0, 0, -1,
            x0, y1, z0,  0, 0, -1,

            // Left (-X)
            x0, y0, z0, -1, 0, 0,
            x0, y0, z1, -1, 0, 0,
            x0, y1, z1, -1, 0, 0,
            x0, y0, z0, -1, 0, 0,
            x0, y1, z1, -1, 0, 0,
            x0, y1, z0, -1, 0, 0,

            // Right (+X)
            x1, y0, z0,  1, 0, 0,
            x1, y0, z1,  1, 0, 0,
            x1, y1, z1,  1, 0, 0,
            x1, y0, z0,  1, 0, 0,
            x1, y1, z1,  1, 0, 0,
            x1, y1, z0,  1, 0, 0,

            // Top (+Y)
            x0, y1, z0,  0, 1, 0,
            x0, y1, z1,  0, 1, 0,
            x1, y1, z1,  0, 1, 0,
            x0, y1, z0,  0, 1, 0,
            x1, y1, z1,  0, 1, 0,
            x1, y1, z0,  0, 1, 0,

            // Bottom (-Y)
            x0, y0, z0,  0, -1, 0,
            x0, y0, z1,  0, -1, 0,
            x1, y0, z1,  0, -1, 0,
            x0, y0, z0,  0, -1, 0,
            x1, y0, z1,  0, -1, 0,
            x1, y0, z0,  0, -1, 0,
        ];

        return {
            vertices: new Float32Array(vertices),
            drawModes: [{ mode: WebGL2RenderingContext.TRIANGLES, count: vertices.length / 6, offset: 0 }]
        };
    }

    // ====================== KOCKA WIRE (edges) ======================
    vratiMeshKockaWire(a: number = 2, centered: boolean = true): Mesh3D {
        const h = a / 2;
        const x0 = centered ? -h : 0;
        const y0 = centered ? -h : 0;
        const z0 = centered ? -h : 0;
        const x1 = x0 + a;
        const y1 = y0 + a;
        const z1 = z0 + a;

        const vertices = [
            // Bottom face
            x0,y0,z0, x1,y0,z0,
            x1,y0,z0, x1,y1,z0,
            x1,y1,z0, x0,y1,z0,
            x0,y1,z0, x0,y0,z0,
            // Top face
            x0,y0,z1, x1,y0,z1,
            x1,y0,z1, x1,y1,z1,
            x1,y1,z1, x0,y1,z1,
            x0,y1,z1, x0,y0,z1,
            // Vertical edges
            x0,y0,z0, x0,y0,z1,
            x1,y0,z0, x1,y0,z1,
            x1,y1,z0, x1,y1,z1,
            x0,y1,z0, x0,y1,z1,
        ];

        return {
            vertices: new Float32Array(vertices),
            drawModes: [{ mode: WebGL2RenderingContext.LINES, count: vertices.length / 6, offset: 0 }]
        };
    }

    // ====================== GRID ======================
    vratiMeshGrid(min: number = -5, max: number = 5, step: number = 1): Mesh3D {
        let vrhovi: number[] = [];
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
    vratiMeshValjak(r: number = 1, h: number = 2, n: number = 32): Mesh3D {
        let vrhovi: number[] = [];
        let offset = 0;
        let drawModes: {mode: number, count: number, offset: number}[] = [];

        const phiStep = 2 * Math.PI / n;

        // Donja baza
        vrhovi.push(0, 0, -h/2, 0, 0, -1);
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), -h/2, 0, 0, -1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += n + 2;

        // Gornja baza
        vrhovi.push(0, 0, h/2, 0, 0, 1);
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), h/2, 0, 0, 1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += n + 2;

        // Plašt
        for (let i = 0; i <= n; i++) {
            let phi = i * phiStep;
            let x = r * Math.cos(phi);
            let y = r * Math.sin(phi);
            vrhovi.push(x, y, -h/2, Math.cos(phi), Math.sin(phi), 0);
            vrhovi.push(x, y, h/2, Math.cos(phi), Math.sin(phi), 0);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: 2 * (n + 1), offset: offset });

        return { vertices: new Float32Array(vrhovi), drawModes };
    }

    // ====================== STOŽAC ======================
    vratiMeshStozac(r: number = 1, h: number = 2, n: number = 32): Mesh3D {
        let vrhovi: number[] = [];
        let offset = 0;
        let drawModes: {mode: number, count: number, offset: number}[] = [];

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
            let len = Math.sqrt(nx*nx + ny*ny + nz*nz);
            nx /= len; ny /= len; nz /= len;

            vrhovi.push(x, y, 0, nx, ny, nz);
            vrhovi.push(0, 0, h, nx, ny, nz);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: 2 * (n + 1), offset: offset });

        return { vertices: new Float32Array(vrhovi), drawModes };
    }

    // ====================== KUGLA ======================
    vratiMeshKugla(r: number = 1, nLat: number = 20, nLon: number = 30): Mesh3D {
        let vrhovi: number[] = [];
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
    vratiMeshPoluKugla(r: number = 1, nLat: number = 20, nLon: number = 30): Mesh3D {
        let vrhovi: number[] = [];
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

        /*  function nacrtaj_kuglu(){}

            function nacrtaj_polukuglu() {}
            
            function nacrtaj_grid() {}

            function nacrtaj_kocku() {}

            function nacrtaj_stozac(){}

            function nacrtaj_cilindar(){}

            function nacrtaj_prsten() {}

            function nacrtaj_kvadar() {}

            function nacrtaj_trokut() {}

            function nacrtaj_piramidu() {}

            function nacrtaj_krnji_stozac() {}*/


    }
    


type Mesh3D = {
    vertices: Float32Array; // x,y,z, nx,ny,nz
    drawModes: {mode: number, count: number, offset: number}[]; // kako crtati (TRIANGLE_FAN, TRIANGLE_STRIP)
};