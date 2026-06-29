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
    // ====================== KOCKA WIRE (edges) - FIXED ======================
    // ====================== KOCKA WIRE (edges) - FIXED & COMPATIBLE ======================
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
            x0, y0, z0, 0, 0, 1, x1, y0, z0, 0, 0, 1,
            x1, y0, z0, 0, 0, 1, x1, y1, z0, 0, 0, 1,
            x1, y1, z0, 0, 0, 1, x0, y1, z0, 0, 0, 1,
            x0, y1, z0, 0, 0, 1, x0, y0, z0, 0, 0, 1,
            // Top face
            x0, y0, z1, 0, 0, 1, x1, y0, z1, 0, 0, 1,
            x1, y0, z1, 0, 0, 1, x1, y1, z1, 0, 0, 1,
            x1, y1, z1, 0, 0, 1, x0, y1, z1, 0, 0, 1,
            x0, y1, z1, 0, 0, 1, x0, y0, z1, 0, 0, 1,
            // Vertical edges
            x0, y0, z0, 0, 0, 1, x0, y0, z1, 0, 0, 1,
            x1, y0, z0, 0, 0, 1, x1, y0, z1, 0, 0, 1,
            x1, y1, z0, 0, 0, 1, x1, y1, z1, 0, 0, 1,
            x0, y1, z0, 0, 0, 1, x0, y1, z1, 0, 0, 1,
        ];
        return {
            vertices: new Float32Array(vertices),
            drawModes: [{
                    mode: WebGL2RenderingContext.LINES,
                    count: vertices.length / 6, // Now correct (6 components)
                    offset: 0
                }]
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
    vratiMeshCilindar(r = 1, h = 2, n = 32) {
        return this.vratiMeshValjak(r, h, n); // Reuse existing valjak implementation
    }
    vratiMeshPrsten(R = 2, r = 0.5, nR = 32, nT = 24) {
        let vrhovi = [];
        const phiStep = 2 * Math.PI / nR;
        const thetaStep = 2 * Math.PI / nT;
        for (let i = 0; i < nR; i++) {
            const phi0 = i * phiStep;
            const phi1 = (i + 1) * phiStep;
            for (let j = 0; j <= nT; j++) {
                const theta = j * thetaStep;
                // First ring
                const x0 = (R + r * Math.cos(theta)) * Math.cos(phi0);
                const y0 = (R + r * Math.cos(theta)) * Math.sin(phi0);
                const z0 = r * Math.sin(theta);
                const nx0 = Math.cos(theta) * Math.cos(phi0);
                const ny0 = Math.cos(theta) * Math.sin(phi0);
                const nz0 = Math.sin(theta);
                // Second ring
                const x1 = (R + r * Math.cos(theta)) * Math.cos(phi1);
                const y1 = (R + r * Math.cos(theta)) * Math.sin(phi1);
                const z1 = r * Math.sin(theta);
                const nx1 = Math.cos(theta) * Math.cos(phi1);
                const ny1 = Math.cos(theta) * Math.sin(phi1);
                const nz1 = Math.sin(theta);
                vrhovi.push(x0, y0, z0, nx0, ny0, nz0);
                vrhovi.push(x1, y1, z1, nx1, ny1, nz1);
            }
        }
        return {
            vertices: new Float32Array(vrhovi),
            drawModes: [{ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: vrhovi.length / 6, offset: 0 }]
        };
    }
    vratiMeshKvadar(sx = 2, sy = 1, sz = 3, centered = true) {
        const hx = sx / 2;
        const hy = sy / 2;
        const hz = sz / 2;
        const x0 = centered ? -hx : 0;
        const y0 = centered ? -hy : 0;
        const z0 = centered ? -hz : 0;
        const x1 = x0 + sx;
        const y1 = y0 + sy;
        const z1 = z0 + sz;
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
    vratiMeshTrokut(a = 2, b = 2, centered = true) {
        const hx = a / 2;
        const hy = b / 2;
        const x0 = centered ? -hx : 0;
        const y0 = centered ? -hy : 0;
        const x1 = x0 + a;
        const y1 = y0 + b;
        const z = 0; // perfectly flat
        const vertices = [
            // Single flat triangle (facing +Z)
            x0, y0, z, 0, 0, 1,
            x1, y0, z, 0, 0, 1,
            (x0 + x1) / 2, y1, z, 0, 0, 1, // top point
        ];
        return {
            vertices: new Float32Array(vertices),
            drawModes: [{
                    mode: WebGL2RenderingContext.TRIANGLES,
                    count: vertices.length / 6,
                    offset: 0
                }]
        };
    }
    vratiMeshPravokutnik(width = 2, height = 1, centered = true) {
        const hw = width / 2;
        const hh = height / 2;
        const x0 = centered ? -hw : 0;
        const y0 = centered ? -hh : 0;
        const x1 = x0 + width;
        const y1 = y0 + height;
        const z = 0; // perfectly flat on XY plane
        const vertices = [
            // Two triangles forming a flat rectangle (facing +Z)
            x0, y0, z, 0, 0, 1,
            x1, y0, z, 0, 0, 1,
            x0, y1, z, 0, 0, 1,
            x1, y0, z, 0, 0, 1,
            x1, y1, z, 0, 0, 1,
            x0, y1, z, 0, 0, 1,
        ];
        return {
            vertices: new Float32Array(vertices),
            drawModes: [{
                    mode: WebGL2RenderingContext.TRIANGLES,
                    count: vertices.length / 6,
                    offset: 0
                }]
        };
    }
    vratiMeshPiramida(base = 2, height = 2, n = 4) {
        let vrhovi = [];
        let offset = 0;
        let drawModes = [];
        const half = base / 2;
        // Base (bottom)
        vrhovi.push(0, 0, 0, 0, 0, -1); // center
        for (let i = 0; i <= n; i++) {
            const phi = i * 2 * Math.PI / n;
            vrhovi.push(half * Math.cos(phi), half * Math.sin(phi), 0, 0, 0, -1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += n + 2;
        // Lateral faces
        for (let i = 0; i < n; i++) {
            const phi0 = i * 2 * Math.PI / n;
            const phi1 = (i + 1) * 2 * Math.PI / n;
            const x0 = half * Math.cos(phi0);
            const y0 = half * Math.sin(phi0);
            const x1 = half * Math.cos(phi1);
            const y1 = half * Math.sin(phi1);
            // Normal calculation (approximate)
            const nx = (x0 + x1) / 2;
            const ny = (y0 + y1) / 2;
            const nz = height;
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            const nnx = nx / len, nny = ny / len, nnz = nz / len;
            vrhovi.push(x0, y0, 0, nnx, nny, nnz);
            vrhovi.push(x1, y1, 0, nnx, nny, nnz);
            vrhovi.push(0, 0, height, nnx, nny, nnz);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLES, count: n * 3, offset: offset });
        return { vertices: new Float32Array(vrhovi), drawModes };
    }
    vratiMeshKrnjiStozac(r1 = 1, r2 = 0.5, h = 2, n = 32) {
        let vrhovi = [];
        let offset = 0;
        let drawModes = [];
        // Bottom base (larger)
        vrhovi.push(0, 0, -h / 2, 0, 0, -1);
        for (let i = 0; i <= n; i++) {
            let phi = i * 2 * Math.PI / n;
            vrhovi.push(r1 * Math.cos(phi), r1 * Math.sin(phi), -h / 2, 0, 0, -1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += n + 2;
        // Top base (smaller)
        vrhovi.push(0, 0, h / 2, 0, 0, 1);
        for (let i = 0; i <= n; i++) {
            let phi = i * 2 * Math.PI / n;
            vrhovi.push(r2 * Math.cos(phi), r2 * Math.sin(phi), h / 2, 0, 0, 1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += n + 2;
        // Lateral surface
        for (let i = 0; i <= n; i++) {
            let phi = i * 2 * Math.PI / n;
            let c = Math.cos(phi);
            let s = Math.sin(phi);
            // Bottom point
            vrhovi.push(r1 * c, r1 * s, -h / 2, c, s, 0);
            // Top point
            vrhovi.push(r2 * c, r2 * s, h / 2, c, s, 0);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: 2 * (n + 1), offset: offset });
        return { vertices: new Float32Array(vrhovi), drawModes };
    }
    // ====================== HOLOW CYLINDER (Tube only) ======================
    vratiMeshCilindarSuplji(r = 1, h = 2, n = 48) {
        let vrhovi = [];
        const phiStep = 2 * Math.PI / n;
        // Lateral surface only (TRIANGLE_STRIP)
        for (let i = 0; i <= n; i++) {
            const phi = i * phiStep;
            const c = Math.cos(phi);
            const s = Math.sin(phi);
            // Bottom vertex
            vrhovi.push(r * c, r * s, -h / 2, c, s, 0);
            // Top vertex
            vrhovi.push(r * c, r * s, h / 2, c, s, 0);
        }
        return {
            vertices: new Float32Array(vrhovi),
            drawModes: [{
                    mode: WebGL2RenderingContext.TRIANGLE_STRIP,
                    count: vrhovi.length / 6,
                    offset: 0
                }]
        };
    }
    // ====================== ELIPTIČKI POLU-PRSTEN (Half Elliptical Ring) ======================
    // Low poly (4 sides), but smooth shading thanks to correct normals
    // ====================== ELIPTIČKI POLU-PRSTEN - FIXED ======================
    // ====================== SMOOTH ELIPTIČKI POLU-PRSTEN ======================
    // Designed to look like the yellow ring in your image
    vratiMeshPoluPrstenElipsa(R = 4, // Main radius (how wide the ring is)
    rX = 1, // Tube thickness horizontal
    rY = 1, // Tube thickness vertical
    angleDegrees = 180, nSegments = 4, // 4~8 recommended for "only 4 sides" feel
    nArc = 32, // Higher = smoother curve (like in the image)
    tilt = 0 // Optional: tilt the ring (degrees)
    ) {
        let vrhovi = [];
        const phiStep = (angleDegrees * Math.PI / 180) / nArc;
        const thetaStep = 2 * Math.PI / nSegments;
        const tiltRad = tilt * Math.PI / 180;
        for (let i = 0; i < nArc; i++) {
            const phi0 = i * phiStep;
            const phi1 = (i + 1) * phiStep;
            for (let j = 0; j <= nSegments; j++) {
                const theta = j * thetaStep;
                // Elliptical tube cross section
                const ex = rX * Math.cos(theta);
                const ey = rY * Math.sin(theta);
                // Main ring position
                const cx0 = R * Math.cos(phi0);
                const cy0 = R * Math.sin(phi0);
                const cx1 = R * Math.cos(phi1);
                const cy1 = R * Math.sin(phi1);
                // Position
                const x0 = cx0 + ex * Math.cos(phi0);
                const y0 = cy0 + ex * Math.sin(phi0);
                const z0 = ey * Math.cos(tiltRad);
                const x1 = cx1 + ex * Math.cos(phi1);
                const y1 = cy1 + ex * Math.sin(phi1);
                const z1 = ey * Math.cos(tiltRad);
                // Normal
                const nx = Math.cos(theta) * Math.cos((phi0 + phi1) * 0.5);
                const ny = Math.cos(theta) * Math.sin((phi0 + phi1) * 0.5);
                const nz = Math.sin(theta);
                vrhovi.push(x0, y0, z0, nx, ny, nz);
                vrhovi.push(x1, y1, z1, nx, ny, nz);
            }
        }
        return {
            vertices: new Float32Array(vrhovi),
            drawModes: [{
                    mode: WebGL2RenderingContext.TRIANGLE_STRIP,
                    count: vrhovi.length / 6,
                    offset: 0
                }]
        };
    }
    // ====================== KRIVA / TUBE PATH ======================
    // Draws a smooth tubular curve based on array of points
    // ====================== KRIVA LINE (Pure Line / Curve) ======================
    // Draws a simple line or curve from array of points using LINES mode
    // ====================== KRIVA LINE (Pure Thin Line) ======================
    // Always 1px thin, unaffected by lighting, uses LINES mode
    // ====================== KRIVA LINE - BRIGHT (Max brightness) ======================
    // Normals are calculated to face towards the camera for maximum lighting
    // ====================== KRIVA LINE - ALWAYS BRIGHT ======================
    vratiMeshLine(points, kameraXYZ = [10, 5, 2]) {
        if (points.length < 2) {
            console.warn("vratiMeshKrivaLine: Need at least 2 points");
            return { vertices: new Float32Array(0), drawModes: [] };
        }
        let vrhovi = [];
        // Strong direction towards main light / camera
        const lightDirX = 0.5; // tweak these if needed
        const lightDirY = 0.6;
        const lightDirZ = 0.6;
        const len = Math.sqrt(lightDirX * lightDirX + lightDirY * lightDirY + lightDirZ * lightDirZ);
        const nx = lightDirX / len;
        const ny = lightDirY / len;
        const nz = lightDirZ / len;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            vrhovi.push(p0[0], p0[1], p0[2], nx, ny, nz);
            vrhovi.push(p1[0], p1[1], p1[2], nx, ny, nz);
        }
        return {
            vertices: new Float32Array(vrhovi),
            drawModes: [{
                    mode: WebGL2RenderingContext.LINES,
                    count: vrhovi.length / 6,
                    offset: 0
                }]
        };
    }
}
