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
         
            x0, y0, z1,  0, 0, 1,
            x1, y0, z1,  0, 0, 1,
            x1, y1, z1,  0, 0, 1,
            x0, y0, z1,  0, 0, 1,
            x1, y1, z1,  0, 0, 1,
            x0, y1, z1,  0, 0, 1,

            x0, y0, z0,  0, 0, -1,
            x1, y0, z0,  0, 0, -1,
            x1, y1, z0,  0, 0, -1,
            x0, y0, z0,  0, 0, -1,
            x1, y1, z0,  0, 0, -1,
            x0, y1, z0,  0, 0, -1,

            x0, y0, z0, -1, 0, 0,
            x0, y0, z1, -1, 0, 0,
            x0, y1, z1, -1, 0, 0,
            x0, y0, z0, -1, 0, 0,
            x0, y1, z1, -1, 0, 0,
            x0, y1, z0, -1, 0, 0,

            x1, y0, z0,  1, 0, 0,
            x1, y0, z1,  1, 0, 0,
            x1, y1, z1,  1, 0, 0,
            x1, y0, z0,  1, 0, 0,
            x1, y1, z1,  1, 0, 0,
            x1, y1, z0,  1, 0, 0,

            x0, y1, z0,  0, 1, 0,
            x0, y1, z1,  0, 1, 0,
            x1, y1, z1,  0, 1, 0,
            x0, y1, z0,  0, 1, 0,
            x1, y1, z1,  0, 1, 0,
            x1, y1, z0,  0, 1, 0,

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

        // ====================== KOCKA WIRE (edges) - FIXED ======================
        // ====================== KOCKA WIRE (edges) - FIXED & COMPATIBLE ======================
    vratiMeshKockaWire(a: number = 2, centered: boolean = true): Mesh3D {
        const h = a / 2;
        const x0 = centered ? -h : 0;
        const y0 = centered ? -h : 0;
        const z0 = centered ? -h : 0;
        const x1 = x0 + a;
        const y1 = y0 + a;
        const z1 = z0 + a;

        const vertices = [
          
            x0, y0, z0,  0,0,1,   x1, y0, z0,  0,0,1,
            x1, y0, z0,  0,0,1,   x1, y1, z0,  0,0,1,
            x1, y1, z0,  0,0,1,   x0, y1, z0,  0,0,1,
            x0, y1, z0,  0,0,1,   x0, y0, z0,  0,0,1,

           
            x0, y0, z1,  0,0,1,   x1, y0, z1,  0,0,1,
            x1, y0, z1,  0,0,1,   x1, y1, z1,  0,0,1,
            x1, y1, z1,  0,0,1,   x0, y1, z1,  0,0,1,
            x0, y1, z1,  0,0,1,   x0, y0, z1,  0,0,1,

           
            x0, y0, z0,  0,0,1,   x0, y0, z1,  0,0,1,
            x1, y0, z0,  0,0,1,   x1, y0, z1,  0,0,1,
            x1, y1, z0,  0,0,1,   x1, y1, z1,  0,0,1,
            x0, y1, z0,  0,0,1,   x0, y1, z1,  0,0,1,
        ];

        return {
            vertices: new Float32Array(vertices),
            drawModes: [{ 
                mode: WebGL2RenderingContext.LINES, 
                count: vertices.length / 6,   // Now correct (6 components)
                offset: 0 
            }]
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

    vratiMeshPrsten(R: number = 2, r: number = 0.5, nR: number = 32, nT: number = 24): Mesh3D {
        let vrhovi: number[] = [];
        const phiStep = 2 * Math.PI / nR;
        const thetaStep = 2 * Math.PI / nT;

        for (let i = 0; i < nR; i++) {
            const phi0 = i * phiStep;
            const phi1 = (i + 1) * phiStep;
            for (let j = 0; j <= nT; j++) {
                const theta = j * thetaStep;

                
                const x0 = (R + r * Math.cos(theta)) * Math.cos(phi0);
                const y0 = (R + r * Math.cos(theta)) * Math.sin(phi0);
                const z0 = r * Math.sin(theta);
                const nx0 = Math.cos(theta) * Math.cos(phi0);
                const ny0 = Math.cos(theta) * Math.sin(phi0);
                const nz0 = Math.sin(theta);

              
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

    vratiMeshKvadar(sx: number = 2, sy: number = 1, sz: number = 3, centered: boolean = true): Mesh3D {
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
          
            x0, y0, z1,  0, 0, 1,
            x1, y0, z1,  0, 0, 1,
            x1, y1, z1,  0, 0, 1,
            x0, y0, z1,  0, 0, 1,
            x1, y1, z1,  0, 0, 1,
            x0, y1, z1,  0, 0, 1,

           
            x0, y0, z0,  0, 0, -1,
            x1, y0, z0,  0, 0, -1,
            x1, y1, z0,  0, 0, -1,
            x0, y0, z0,  0, 0, -1,
            x1, y1, z0,  0, 0, -1,
            x0, y1, z0,  0, 0, -1,

           
            x0, y0, z0, -1, 0, 0,
            x0, y0, z1, -1, 0, 0,
            x0, y1, z1, -1, 0, 0,
            x0, y0, z0, -1, 0, 0,
            x0, y1, z1, -1, 0, 0,
            x0, y1, z0, -1, 0, 0,

           
            x1, y0, z0,  1, 0, 0,
            x1, y0, z1,  1, 0, 0,
            x1, y1, z1,  1, 0, 0,
            x1, y0, z0,  1, 0, 0,
            x1, y1, z1,  1, 0, 0,
            x1, y1, z0,  1, 0, 0,

           
            x0, y1, z0,  0, 1, 0,
            x0, y1, z1,  0, 1, 0,
            x1, y1, z1,  0, 1, 0,
            x0, y1, z0,  0, 1, 0,
            x1, y1, z1,  0, 1, 0,
            x1, y1, z0,  0, 1, 0,

            
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

   vratiMeshTrokut(
        a: number = 2, 
        b: number = 2, 
        centered: boolean = true
    ): Mesh3D {
        const hx = a / 2;
        const hy = b / 2;
        
        const x0 = centered ? -hx : 0;
        const y0 = centered ? -hy : 0;
        const x1 = x0 + a;
        const y1 = y0 + b;
        const z = 0; // perfectly flat

        const vertices = [
            // Single flat triangle (facing +Z)
            x0, y0, z,  0, 0, 1,
            x1, y0, z,  0, 0, 1,
            (x0 + x1)/2, y1, z,  0, 0, 1,   // top point
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

    vratiMeshPravokutnik(
        width: number = 2, 
        height: number = 1, 
        centered: boolean = true
    ): Mesh3D {
        const hw = width / 2;
        const hh = height / 2;
        const x0 = centered ? -hw : 0;
        const y0 = centered ? -hh : 0;
        const x1 = x0 + width;
        const y1 = y0 + height;
        const z = 0; // perfectly flat on XY plane

        const vertices = [
            // Two triangles forming a flat rectangle (facing +Z)
            x0, y0, z,  0, 0, 1,
            x1, y0, z,  0, 0, 1,
            x0, y1, z,  0, 0, 1,

            x1, y0, z,  0, 0, 1,
            x1, y1, z,  0, 0, 1,
            x0, y1, z,  0, 0, 1,
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

    vratiMeshPiramida(base: number = 2, height: number = 2, n: number = 4): Mesh3D {
        let vrhovi: number[] = [];
        let offset = 0;
        let drawModes: {mode: number, count: number, offset: number}[] = [];

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
            const len = Math.sqrt(nx*nx + ny*ny + nz*nz);
            const nnx = nx / len, nny = ny / len, nnz = nz / len;

            vrhovi.push(x0, y0, 0, nnx, nny, nnz);
            vrhovi.push(x1, y1, 0, nnx, nny, nnz);
            vrhovi.push(0, 0, height, nnx, nny, nnz);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLES, count: n * 3, offset: offset });

        return { vertices: new Float32Array(vrhovi), drawModes };
    }

    vratiMeshKrnjiStozac(r1: number = 1, r2: number = 0.5, h: number = 2, n: number = 32): Mesh3D {
        let vrhovi: number[] = [];
        let offset = 0;
        let drawModes: {mode: number, count: number, offset: number}[] = [];

        // Bottom base (larger)
        vrhovi.push(0, 0, -h/2, 0, 0, -1);
        for (let i = 0; i <= n; i++) {
            let phi = i * 2 * Math.PI / n;
            vrhovi.push(r1 * Math.cos(phi), r1 * Math.sin(phi), -h/2, 0, 0, -1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += n + 2;

        // Top base (smaller)
        vrhovi.push(0, 0, h/2, 0, 0, 1);
        for (let i = 0; i <= n; i++) {
            let phi = i * 2 * Math.PI / n;
            vrhovi.push(r2 * Math.cos(phi), r2 * Math.sin(phi), h/2, 0, 0, 1);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_FAN, count: n + 2, offset: offset });
        offset += n + 2;

        // Lateral surface
        for (let i = 0; i <= n; i++) {
            let phi = i * 2 * Math.PI / n;
            let c = Math.cos(phi);
            let s = Math.sin(phi);

            // Bottom point
            vrhovi.push(r1 * c, r1 * s, -h/2, c, s, 0);
            // Top point
            vrhovi.push(r2 * c, r2 * s, h/2,  c, s, 0);
        }
        drawModes.push({ mode: WebGL2RenderingContext.TRIANGLE_STRIP, count: 2 * (n + 1), offset: offset });

        return { vertices: new Float32Array(vrhovi), drawModes };
    }

        // ====================== HOLOW CYLINDER (Tube only) ======================
    vratiMeshCilindarSuplji(r: number = 1, h: number = 2, n: number = 48): Mesh3D {
        let vrhovi: number[] = [];
        const phiStep = 2 * Math.PI / n;

        // Lateral surface only (TRIANGLE_STRIP)
        for (let i = 0; i <= n; i++) {
            const phi = i * phiStep;
            const c = Math.cos(phi);
            const s = Math.sin(phi);

            // Bottom vertex
            vrhovi.push(r * c, r * s, -h/2, c, s, 0);
            // Top vertex
            vrhovi.push(r * c, r * s,  h/2, c, s, 0);
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


    vratiMeshPoluPrstenElipsa(
        R: number = 4,         // Main radius (how wide the ring is)
        rX: number = 1,       // Tube thickness horizontal
        rY: number = 1,       // Tube thickness vertical
        angleDegrees: number = 180,
        nSegments: number = 4,   // 4~8 recommended for "only 4 sides" feel
        nArc: number = 32,       // Higher = smoother curve (like in the image)
        tilt: number = 0        // Optional: tilt the ring (degrees)
    ): Mesh3D {
        let vrhovi: number[] = [];
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

    vratiMeshLine(
        points: number[], 
        lightPos: [number, number, number] = [10, 15, 20]   // default light position
    ): Mesh3D {
        if (!points || points.length < 6) {
            console.warn("vratiMeshLine: Need at least one full vertex (6 values)");
            return { vertices: new Float32Array(0), drawModes: [] };
        }

        let vrhovi: number[] = [];

        for (let i = 0; i < points.length; i += 6) {
            const x = points[i];
            const y = points[i + 1];
            const z = points[i + 2];

            // Vector from point to light
            let dx = lightPos[0] - x;
            let dy = lightPos[1] - y;
            let dz = lightPos[2] - z;

            // Normalize
            const len = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1.0;
            dx /= len;
            dy /= len;
            dz /= len;

            vrhovi.push(x, y, z, dx, dy, dz);   // position + normal toward light
        }

        return {
            vertices: new Float32Array(vrhovi),
            drawModes: [{
                mode: WebGL2RenderingContext.LINE_STRIP,
                count: vrhovi.length / 6,
                offset: 0
            }]
        };
    }

        // ====================== TORUS / PRSTEN (with optional square cross-section) ======================
        vratiMeshTorus(
        R: number = 3,
        r: number = 0.8,
        nMajor: number = 64,
        nTube: number = 24,
        squareCrossSection: boolean = false,
        crossSectionRotation: number = 0,
        startAngle: number = 0,
        endAngle: number = 360
    ): Mesh3D {
        let vrhovi: number[] = [];
        const phiStart = startAngle * Math.PI / 180;
        const phiEnd = endAngle * Math.PI / 180;
        const phiRange = phiEnd - phiStart;
        const phiStep = phiRange / nMajor;

        const rotRad = crossSectionRotation * Math.PI / 180;
        const cosRot = Math.cos(rotRad);
        const sinRot = Math.sin(rotRad);

        const sides = squareCrossSection ? 4 : nTube;
        const thetaStep = 2 * Math.PI / sides;

        for (let i = 0; i < nMajor; i++) {
            const phi0 = phiStart + i * phiStep;
            const phi1 = phiStart + (i + 1) * phiStep;

            const cx0 = R * Math.cos(phi0);
            const cy0 = R * Math.sin(phi0);
            const cx1 = R * Math.cos(phi1);
            const cy1 = R * Math.sin(phi1);

            for (let j = 0; j <= sides; j++) {
                let theta = j * thetaStep;

                let ex = 0, ey = 0;

                if (squareCrossSection) {
                    const s = r;
                    const t = (theta + Math.PI / 4) % (Math.PI * 2);

                    if (t < Math.PI / 2)      { ex = s;  ey = s * (2 * (t / (Math.PI / 2)) - 1); }
                    else if (t < Math.PI)     { ex = s * (1 - 2 * ((t - Math.PI / 2) / (Math.PI / 2))); ey = s; }
                    else if (t < 3*Math.PI/2) { ex = -s; ey = s * (1 - 2 * ((t - Math.PI) / (Math.PI / 2))); }
                    else                      { ex = s * (2 * ((t - 3*Math.PI/2) / (Math.PI/2)) - 1); ey = -s; }
                } else {
                    ex = r * Math.cos(theta);
                    ey = r * Math.sin(theta);
                }

                // Apply rotation to cross-section
                const exRot = ex * cosRot - ey * sinRot;
                const eyRot = ex * sinRot + ey * cosRot;

                // Positions
                const x0 = cx0 + exRot * Math.cos(phi0);
                const y0 = cy0 + exRot * Math.sin(phi0);
                const z0 = eyRot;

                const x1 = cx1 + exRot * Math.cos(phi1);
                const y1 = cy1 + exRot * Math.sin(phi1);
                const z1 = eyRot;

                // === IMPROVED NORMAL CALCULATION ===
                // Direction from tube center to surface point
                const nx0 = exRot * Math.cos(phi0);
                const ny0 = exRot * Math.sin(phi0);
                const nz0 = eyRot;

                const len = Math.sqrt(nx0*nx0 + ny0*ny0 + nz0*nz0) || 1;
                
                const nx = nx0 / len;
                const ny = ny0 / len;
                const nz = nz0 / len;

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

        // ====================== DISK / KRUG (flat circle) ======================
    vratiMeshDisk(
        r: number = 1.0,           // Radius
        n: number = 48,            // Number of segments (higher = smoother)
        centered: boolean = true,  // Center at origin or at (0,0,0) with bottom at edge
        plane: 'xy' | 'xz' | 'yz' = 'xy'  // Which plane the disk lies on
    ): Mesh3D {
        let vrhovi: number[] = [];
        let offset = 0;
        let drawModes: { mode: number; count: number; offset: number }[] = [];

        const centerX = 0;
        const centerY = 0;
        const centerZ = 0;

        // Normal direction depends on plane
        let nx = 0, ny = 0, nz = 1;

        if (plane === 'xz') nz = 0, nx = 0, ny = 1;   // +Y normal
        if (plane === 'yz') nz = 0, nx = 1, ny = 0;   // +X normal

        // Center vertex
        vrhovi.push(centerX, centerY, centerZ, nx, ny, nz);

        // Outer vertices
        const angleStep = 2 * Math.PI / n;
        for (let i = 0; i <= n; i++) {
            const angle = i * angleStep;
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);
            let z = 0;

            if (plane === 'xz') {
                y = 0;
                z = r * Math.sin(angle);
                x = r * Math.cos(angle);
            } else if (plane === 'yz') {
                x = 0;
                z = r * Math.sin(angle);
                y = r * Math.cos(angle);
            }

            vrhovi.push(x, y, z, nx, ny, nz);
        }

        drawModes.push({
            mode: WebGL2RenderingContext.TRIANGLE_FAN,
            count: n + 2,
            offset: offset
        });

        return {
            vertices: new Float32Array(vrhovi),
            drawModes: drawModes
        };
    }

        // ====================== ELLIPTICAL DISK WITH HOLE + THICKNESS + ARC ======================
    vratiMeshElipsaSaRupom(
        rOuterX: number = 3.0,     // Outer radius X
        rOuterY: number = 2.0,     // Outer radius Y
        rInnerX: number = 1.5,     // Inner radius X (hole)
        rInnerY: number = 1.0,     // Inner radius Y
        height: number = 0.4,      // Thickness
        n: number = 64,            // Segments
        startAngle: number = 0,    // degrees
        endAngle: number = 360,    // degrees (180 = half, 90 = quarter)
        centered: boolean = true
    ): Mesh3D {
        if (rInnerX < 0) rInnerX = 0;
        if (rInnerY < 0) rInnerY = 0;

        const halfH = height / 2;
        const z0 = centered ? -halfH : 0;
        const z1 = centered ? halfH : height;

        let vrhovi: number[] = [];
        let drawModes: { mode: number; count: number; offset: number }[] = [];
        let vertexOffset = 0;

        const phiStart = startAngle * Math.PI / 180;
        const phiEnd = endAngle * Math.PI / 180;
        const phiRange = phiEnd - phiStart;
        const step = phiRange / n;

        const addVertex = (x: number, y: number, z: number, nx: number, ny: number, nz: number) => {
            vrhovi.push(x, y, z, nx, ny, nz);
        };

        // === TOP FACE ===
        const topStart = vertexOffset;
        if (rInnerX > 0.001 || rInnerY > 0.001) {
            // Elliptical ring
            for (let i = 0; i <= n; i++) {
                const phi = phiStart + i * step;
                const c = Math.cos(phi);
                const s = Math.sin(phi);

                // Inner point
                addVertex(rInnerX * c, rInnerY * s, z1, 0, 0, 1);
                // Outer point
                addVertex(rOuterX * c, rOuterY * s, z1, 0, 0, 1);
            }
            drawModes.push({
                mode: WebGL2RenderingContext.TRIANGLE_STRIP,
                count: 2 * (n + 1),
                offset: topStart
            });
            vertexOffset += 2 * (n + 1);
        } else {
            // Full elliptical disk
            addVertex(0, 0, z1, 0, 0, 1);
            for (let i = 0; i <= n; i++) {
                const phi = phiStart + i * step;
                addVertex(rOuterX * Math.cos(phi), rOuterY * Math.sin(phi), z1, 0, 0, 1);
            }
            drawModes.push({
                mode: WebGL2RenderingContext.TRIANGLE_FAN,
                count: n + 2,
                offset: topStart
            });
            vertexOffset += n + 2;
        }

        // === BOTTOM FACE ===
        const bottomStart = vertexOffset;
        if (rInnerX > 0.001 || rInnerY > 0.001) {
            for (let i = 0; i <= n; i++) {
                const phi = phiStart + i * step;
                const c = Math.cos(phi);
                const s = Math.sin(phi);
                addVertex(rOuterX * c, rOuterY * s, z0, 0, 0, -1);
                addVertex(rInnerX * c, rInnerY * s, z0, 0, 0, -1);
            }
            drawModes.push({
                mode: WebGL2RenderingContext.TRIANGLE_STRIP,
                count: 2 * (n + 1),
                offset: bottomStart
            });
            vertexOffset += 2 * (n + 1);
        } else {
            addVertex(0, 0, z0, 0, 0, -1);
            for (let i = 0; i <= n; i++) {
                const phi = phiStart + i * step;
                addVertex(rOuterX * Math.cos(phi), rOuterY * Math.sin(phi), z0, 0, 0, -1);
            }
            drawModes.push({
                mode: WebGL2RenderingContext.TRIANGLE_FAN,
                count: n + 2,
                offset: bottomStart
            });
            vertexOffset += n + 2;
        }

        // === OUTER WALL ===
        const outerStart = vertexOffset;
        for (let i = 0; i <= n; i++) {
            const phi = phiStart + i * step;
            const x = rOuterX * Math.cos(phi);
            const y = rOuterY * Math.sin(phi);
            addVertex(x, y, z0, x, y, 0);
            addVertex(x, y, z1, x, y, 0);
        }
        drawModes.push({
            mode: WebGL2RenderingContext.TRIANGLE_STRIP,
            count: 2 * (n + 1),
            offset: outerStart
        });
        vertexOffset += 2 * (n + 1);

        // === INNER WALL ===
        if (rInnerX > 0.001 || rInnerY > 0.001) {
            const innerStart = vertexOffset;
            for (let i = 0; i <= n; i++) {
                const phi = phiStart + i * step;
                const x = rInnerX * Math.cos(phi);
                const y = rInnerY * Math.sin(phi);
                addVertex(x, y, z1, -x, -y, 0);
                addVertex(x, y, z0, -x, -y, 0);
            }
            drawModes.push({
                mode: WebGL2RenderingContext.TRIANGLE_STRIP,
                count: 2 * (n + 1),
                offset: innerStart
            });
        }

        return {
            vertices: new Float32Array(vrhovi),
            drawModes: drawModes
        };
    }
}
    


type Mesh3D = {
    vertices: Float32Array; // x,y,z, nx,ny,nz
    drawModes: {mode: number, count: number, offset: number}[]; // kako crtati (TRIANGLE_FAN, TRIANGLE_STRIP)
};