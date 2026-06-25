// shapes3d.js - biblioteka 3D oblika za WebGL2
// Oblik ne sadrži vlastiti MT3D, već koristi jednu
// injektiranu MT3D instancu za sve transformacije.

(function (global) {
  "use strict";

  /**
   * Factory koja injektira jednu MT3D instancu i vraća API za oblike.
   * MT3D je zadužen za sve transformacije (model + kamera + projekcija),
   * a Shape samo priprema VBO i crta koristeći tu matricu.
   *
   * @param {MT3D} mtInstance - instanca MT3D klase (iz mt3d.js)
   */
  function createShapes3D(mtInstance) {
    if (!mtInstance || typeof mtInstance.lista !== "function") {
      throw new Error("createShapes3D: očekujem instancu MT3D.");
    }

    const mt = mtInstance;

    class Shape {
      /**
       * @param {Float32Array|number[]} vertices [x,y,z,nx,ny,nz] interleaved
       * @param {{mode:string|number, first:number, count:number}[]} parts
       */
      constructor(vertices, parts) {
        this.vertices =
          vertices instanceof Float32Array
            ? vertices
            : new Float32Array(vertices || []);
        this.parts = Array.isArray(parts) ? parts : [];
        this.buffer = null;
        // zadana boja objekta (bijela)
        this.color = [1, 1, 1];
      }

      /**
       * Postavi boju objekta (RGB, 0-1).
       */
      setColor(r, g, b) {
        this.color = [r, g, b];
      }

      /**
       * Kreira i napuni VBO za ovaj oblik ako već nije kreiran.
       * Sprema buffer u this.buffer i vraća ga.
       */
      createBuffer(gl) {
        if (!gl) throw new Error("Shape.createBuffer: nedostaje gl.");
        if (!this.buffer) {
          const buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
          this.buffer = buffer;
        }
        return this.buffer;
      }

      /**
       * Povezuje buffer i postavlja atribute vrha/normale.
       * Očekuje da program ima a_vrhXYZ i a_normala lokacije.
       */
      bind(gl, program) {
        if (!gl || !program) {
          throw new Error("Shape.bind: nedostaje gl ili program.");
        }

        const buffer = this.createBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        const aPos = program.a_vrhXYZ;
        const aNorm = program.a_normala;
        if (aPos === undefined || aNorm === undefined) {
          throw new Error(
            "Shape.bind: program nema a_vrhXYZ / a_normala atribute.",
          );
        }

        gl.enableVertexAttribArray(aPos);
        gl.enableVertexAttribArray(aNorm);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 24, 12);
      }

      /**
       * Crta oblik.
       * - baseTransform(mt) prima DI-injektiranu MT3D instancu i na njoj
       *   poziva pomak/rotacije (samo model dio – kamera/projekcija su
       *   već postavljene izvan ove funkcije).
       * - globalno svjetlo / kamera NE diraju se ovdje (dijeljeni su
       *   za sve oblike).
       */
      draw(gl, program, baseTransform) {
        if (!gl || !program) {
          throw new Error("Shape.draw: nedostaje gl ili program.");
        }

        // resetiraj samo model matricu; kamera i projekcija ostaju
        if (typeof mt.identitet === "function") {
          mt.identitet();
        }

        if (typeof baseTransform === "function") {
          baseTransform(mt);
        }

        // boja objekta (ako program podržava u_objColor)
        if (program.u_objColor !== undefined && this.color) {
          gl.uniform3fv(program.u_objColor, this.color);
        }

        const uTrans = program.u_mTrans;
        if (uTrans === undefined) {
          throw new Error("Shape.draw: program nema u_mTrans uniformu.");
        }

        // view-projection matrica (P * K) za pozicije
        const vpMatrix =
          typeof mt.viewProjLista === "function"
            ? new Float32Array(mt.viewProjLista())
            : new Float32Array(mt.lista());
        gl.uniformMatrix4fv(uTrans, false, vpMatrix);

        // model matrica (M) za ispravan izračun normala / svjetla
        if (
          program.u_model !== undefined &&
          typeof mt.modelLista === "function"
        ) {
          const modelLista = new Float32Array(mt.modelLista());
          gl.uniformMatrix4fv(program.u_model, false, modelLista);
        }
        this.bind(gl, program);

        for (const part of this.parts) {
          const mode =
            typeof part.mode === "string" ? gl[part.mode] : part.mode;
          gl.drawArrays(mode, part.first, part.count);
        }
      }
    }

    // ----------------- Pomoćne funkcije za generiranje geometrije -----------------

    // Ravnina (plane) u xz-ravnini, y = 0, normala prema gore [0, 1, 0].
    function buildPlaneVertices(width, depth) {
      const w = width || 1;
      const d = depth || 1;
      const hx = w / 2;
      const hz = d / 2;

      const nx = 0;
      const ny = 1;
      const nz = 0;

      // četverokut u xz-ravnini, dva trokuta (gledano odozgo u CCW smjeru)
      const v = [
        // prvi trokut
        -hx,
        0,
        -hz,
        nx,
        ny,
        nz,
        hx,
        0,
        -hz,
        nx,
        ny,
        nz,
        hx,
        0,
        hz,
        nx,
        ny,
        nz,
        // drugi trokut
        -hx,
        0,
        -hz,
        nx,
        ny,
        nz,
        hx,
        0,
        hz,
        nx,
        ny,
        nz,
        -hx,
        0,
        hz,
        nx,
        ny,
        nz,
      ];

      return {
        vertices: new Float32Array(v),
        parts: [{ mode: "TRIANGLES", first: 0, count: 6 }],
      };
    }

    // Jednostavni trokut zadan s tri 3D točke.
    function buildTriangleVertices(p1, p2, p3) {
      const [x1, y1, z1] = p1;
      const [x2, y2, z2] = p2;
      const [x3, y3, z3] = p3;

      // vektori bridova i normala trokuta
      const ux = x2 - x1;
      const uy = y2 - y1;
      const uz = z2 - z1;
      const vx = x3 - x1;
      const vy = y3 - y1;
      const vz = z3 - z1;

      let nx = uy * vz - uz * vy;
      let ny = uz * vx - ux * vz;
      let nz = ux * vy - uy * vx;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      nz /= len;

      const vertices = new Float32Array([
        x1,
        y1,
        z1,
        nx,
        ny,
        nz,
        x2,
        y2,
        z2,
        nx,
        ny,
        nz,
        x3,
        y3,
        z3,
        nx,
        ny,
        nz,
      ]);

      return {
        vertices,
        parts: [{ mode: "TRIANGLES", first: 0, count: 3 }],
      };
    }

    // Dužina između dvije 3D točke; crta se s gl.LINES.
    function buildLineVertices(p1, p2) {
      const [x1, y1, z1] = p1;
      const [x2, y2, z2] = p2;

      // smjer dužine, koristi se kao normala
      let nx = x2 - x1;
      let ny = y2 - y1;
      let nz = z2 - z1;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      nz /= len;

      const vertices = new Float32Array([
        x1,
        y1,
        z1,
        nx,
        ny,
        nz,
        x2,
        y2,
        z2,
        nx,
        ny,
        nz,
      ]);

      return {
        vertices,
        parts: [{ mode: "LINES", first: 0, count: 2 }],
      };
    }

    // Cilindar: os ide uz y-os (stoji uspravno), baze u ravnini xz.
    // KruŽni presjek (baze su krugovi radijusa r).
    function buildCylinderVertices(r, h, n) {
      const v = [];
      const halfH = h / 2;
      const step = (2 * Math.PI) / n;

      // Donja baza (y = -h/2), normale [0, -1, 0]
      v.push(0, -halfH, 0, 0, -1, 0);
      let phi = 0;
      for (let i = 0; i <= n; i++) {
        const x = r * Math.cos(phi);
        const z = r * Math.sin(phi);
        v.push(x, -halfH, z, 0, -1, 0);
        phi += step;
      }
      const baseBottomCount = n + 2;

      // Gornja baza (y = +h/2), normale [0, 1, 0]
      v.push(0, halfH, 0, 0, 1, 0);
      phi = 2 * Math.PI;
      for (let i = 0; i <= n; i++) {
        const x = r * Math.cos(phi);
        const z = r * Math.sin(phi);
        v.push(x, halfH, z, 0, 1, 0);
        phi -= step;
      }
      const baseTopCount = n + 2;

      // Plašt: normale radijalno prema van
      const sideOffset = baseBottomCount + baseTopCount;
      phi = 0;
      for (let i = 0; i <= n; i++) {
        const c = Math.cos(phi);
        const s = Math.sin(phi);
        const x = r * c;
        const z = r * s;
        v.push(x, -halfH, z, c, 0, s);
        v.push(x, halfH, z, c, 0, s);
        phi += step;
      }
      const sideCount = 2 * n + 2;

      return {
        vertices: new Float32Array(v),
        parts: [
          { mode: "TRIANGLE_FAN", first: 0, count: baseBottomCount },
          {
            mode: "TRIANGLE_FAN",
            first: baseBottomCount,
            count: baseTopCount,
          },
          { mode: "TRIANGLE_STRIP", first: sideOffset, count: sideCount },
        ],
      };
    }

    // Cilindar bez baza: samo plašt (bočna površina).
    function buildCylinderShellVertices(r, h, n) {
      const v = [];
      const halfH = h / 2;
      const step = (2 * Math.PI) / n;

      let phi = 0;
      for (let i = 0; i <= n; i++) {
        const c = Math.cos(phi);
        const s = Math.sin(phi);
        const x = r * c;
        const z = r * s;
        v.push(x, -halfH, z, c, 0, s);
        v.push(x, halfH, z, c, 0, s);
        phi += step;
      }
      const sideCount = 2 * n + 2;

      return {
        vertices: new Float32Array(v),
        parts: [{ mode: "TRIANGLE_STRIP", first: 0, count: sideCount }],
      };
    }

    // Eliptični cilindar: os ide uz y-os, baze su elipse u xz-ravnini.
    // Poluosi elipse su rx (u smjeru x) i rz (u smjeru z).
    function buildEllipticCylinderVertices(rx, rz, h, n) {
      const v = [];
      const halfH = h / 2;
      const step = (2 * Math.PI) / n;

      const rxSafe = rx || 1;
      const rzSafe = rz || 1;

      // Donja baza (y = -h/2), normale [0, -1, 0]
      v.push(0, -halfH, 0, 0, -1, 0);
      let phi = 0;
      for (let i = 0; i <= n; i++) {
        const x = rxSafe * Math.cos(phi);
        const z = rzSafe * Math.sin(phi);
        v.push(x, -halfH, z, 0, -1, 0);
        phi += step;
      }
      const baseBottomCount = n + 2;

      // Gornja baza (y = +h/2), normale [0, 1, 0]
      v.push(0, halfH, 0, 0, 1, 0);
      phi = 2 * Math.PI;
      for (let i = 0; i <= n; i++) {
        const x = rxSafe * Math.cos(phi);
        const z = rzSafe * Math.sin(phi);
        v.push(x, halfH, z, 0, 1, 0);
        phi -= step;
      }
      const baseTopCount = n + 2;

      // Plašt: normale radijalno prema van za elipsu.
      const sideOffset = baseBottomCount + baseTopCount;
      phi = 0;
      for (let i = 0; i <= n; i++) {
        const c = Math.cos(phi);
        const s = Math.sin(phi);
        const x = rxSafe * c;
        const z = rzSafe * s;

        // Normala eliptičnog cilindra dobiva se iz gradijenta
        // implicitne funkcije x^2/rx^2 + z^2/rz^2 = 1:
        // n ~ (x/rx^2, z/rz^2).
        const nxRaw = c / rxSafe;
        const nzRaw = s / rzSafe;
        const len = Math.hypot(nxRaw, nzRaw) || 1;
        const nx = nxRaw / len;
        const nz = nzRaw / len;

        v.push(x, -halfH, z, nx, 0, nz);
        v.push(x, halfH, z, nx, 0, nz);
        phi += step;
      }
      const sideCount = 2 * n + 2;

      return {
        vertices: new Float32Array(v),
        parts: [
          { mode: "TRIANGLE_FAN", first: 0, count: baseBottomCount },
          {
            mode: "TRIANGLE_FAN",
            first: baseBottomCount,
            count: baseTopCount,
          },
          { mode: "TRIANGLE_STRIP", first: sideOffset, count: sideCount },
        ],
      };
    }

    // Stožac: os ide uz y-os (stoji uspravno), baza u ravnini xz.
    function buildConeVertices(r, h, n) {
      const v = [];
      const halfH = h / 2;
      const step = (2 * Math.PI) / n;

      // Donja baza (y = -h/2), normale [0, 1, 0] (prema gore)
      v.push(0, -halfH, 0, 0, 1, 0);
      let phi = 0;
      for (let i = 0; i <= n; i++) {
        const x = r * Math.cos(phi);
        const z = r * Math.sin(phi);
        v.push(x, -halfH, z, 0, 1, 0);
        phi += step;
      }
      const baseCount = n + 2;

      // Bočni plašt (TRIANGLE_FAN oko vrha)
      const sideOffset = baseCount;
      // vrh stošca, normala prema gore
      v.push(0, halfH, 0, 0, 1, 0);

      phi = 0;
      for (let i = 0; i <= n; i++) {
        const x = r * Math.cos(phi);
        const z = r * Math.sin(phi);
        const y = -halfH;

        // prava normala stošca dobivena iz presjeka generatrice i kružnice:
        // n ~ (h*cos(phi), r, h*sin(phi)) – zatim normalizirana.
        const nx = h * Math.cos(phi);
        const ny = r;
        const nz = h * Math.sin(phi);
        const len = Math.hypot(nx, ny, nz) || 1;
        const nnx = nx / len;
        const nny = ny / len;
        const nnz = nz / len;

        v.push(x, y, z, nnx, nny, nnz);
        phi += step;
      }

      return {
        vertices: new Float32Array(v),
        parts: [
          { mode: "TRIANGLE_FAN", first: 0, count: baseCount },
          { mode: "TRIANGLE_FAN", first: sideOffset, count: n + 2 },
        ],
      };
    }

    // Kugla (ili dio kugle) – glatke normale, y-os je "gore".
    function buildSphereVertices(
      r,
      latSegments,
      lonSegments,
      thetaStart,
      thetaEnd,
    ) {
      const v = [];
      const thetaRange = thetaEnd - thetaStart;

      for (let lat = 0; lat < latSegments; lat++) {
        const t1 = thetaStart + (lat / latSegments) * thetaRange;
        const t2 = thetaStart + ((lat + 1) / latSegments) * thetaRange;

        for (let lon = 0; lon < lonSegments; lon++) {
          const p1 = (lon / lonSegments) * 2 * Math.PI;
          const p2 = ((lon + 1) / lonSegments) * 2 * Math.PI;

          const x1 = r * Math.sin(t1) * Math.cos(p1);
          const y1 = r * Math.cos(t1);
          const z1 = r * Math.sin(t1) * Math.sin(p1);

          const x2 = r * Math.sin(t2) * Math.cos(p1);
          const y2 = r * Math.cos(t2);
          const z2 = r * Math.sin(t2) * Math.sin(p1);

          const x3 = r * Math.sin(t2) * Math.cos(p2);
          const y3 = r * Math.cos(t2);
          const z3 = r * Math.sin(t2) * Math.sin(p2);

          const x4 = r * Math.sin(t1) * Math.cos(p2);
          const y4 = r * Math.cos(t1);
          const z4 = r * Math.sin(t1) * Math.sin(p2);

          function pushVertex(x, y, z) {
            const len = Math.hypot(x, y, z) || 1;
            v.push(x, y, z, x / len, y / len, z / len);
          }

          // pazi na orijentaciju trokuta – 1,3,2 i 1,4,3
          pushVertex(x1, y1, z1);
          pushVertex(x3, y3, z3);
          pushVertex(x2, y2, z2);

          pushVertex(x1, y1, z1);
          pushVertex(x4, y4, z4);
          pushVertex(x3, y3, z3);
        }
      }

      const vertices = new Float32Array(v);
      const count = vertices.length / 6;
      return {
        vertices,
        parts: [{ mode: "TRIANGLES", first: 0, count }],
      };
    }

    // Polulopta kao "školjka": vanjska + unutarnja strana (šuplja iznutra)
    function buildHemisphereShellVertices(r, latBands, lonBands) {
      const vrhovi = [];

      const push = (x, y, z, nx, ny, nz) => {
        vrhovi.push(x, y, z, nx, ny, nz);
      };

      const thetaMax = Math.PI / 2;

      for (let lat = 0; lat < latBands; lat++) {
        const theta1 = (lat * thetaMax) / latBands;
        const theta2 = ((lat + 1) * thetaMax) / latBands;

        for (let lon = 0; lon < lonBands; lon++) {
          const phi1 = (2 * Math.PI * lon) / lonBands;
          const phi2 = (2 * Math.PI * (lon + 1)) / lonBands;

          const x1 = r * Math.sin(theta1) * Math.cos(phi1);
          const y1 = r * Math.cos(theta1);
          const z1 = r * Math.sin(theta1) * Math.sin(phi1);

          const x2 = r * Math.sin(theta2) * Math.cos(phi1);
          const y2 = r * Math.cos(theta2);
          const z2 = r * Math.sin(theta2) * Math.sin(phi1);

          const x3 = r * Math.sin(theta2) * Math.cos(phi2);
          const y3 = r * Math.cos(theta2);
          const z3 = r * Math.sin(theta2) * Math.sin(phi2);

          const x4 = r * Math.sin(theta1) * Math.cos(phi2);
          const y4 = r * Math.cos(theta1);
          const z4 = r * Math.sin(theta1) * Math.sin(phi2);

          const n1x = x1 / r;
          const n1y = y1 / r;
          const n1z = z1 / r;
          const n2x = x2 / r;
          const n2y = y2 / r;
          const n2z = z2 / r;
          const n3x = x3 / r;
          const n3y = y3 / r;
          const n3z = z3 / r;
          const n4x = x4 / r;
          const n4y = y4 / r;
          const n4z = z4 / r;

          const n1ix = -n1x;
          const n1iy = -n1y;
          const n1iz = -n1z;
          const n2ix = -n2x;
          const n2iy = -n2y;
          const n2iz = -n2z;
          const n3ix = -n3x;
          const n3iy = -n3y;
          const n3iz = -n3z;
          const n4ix = -n4x;
          const n4iy = -n4y;
          const n4iz = -n4z;

          // outer hemisphere
          push(x1, y1, z1, n1x, n1y, n1z);
          push(x3, y3, z3, n3x, n3y, n3z);
          push(x2, y2, z2, n2x, n2y, n2z);

          push(x1, y1, z1, n1x, n1y, n1z);
          push(x4, y4, z4, n4x, n4y, n4z);
          push(x3, y3, z3, n3x, n3y, n3z);

          // inner hemisphere
          push(x1, y1, z1, n1ix, n1iy, n1iz);
          push(x2, y2, z2, n2ix, n2iy, n2iz);
          push(x3, y3, z3, n3ix, n3iy, n3iz);

          push(x1, y1, z1, n1ix, n1iy, n1iz);
          push(x3, y3, z3, n3ix, n3iy, n3iz);
          push(x4, y4, z4, n4ix, n4iy, n4iz);
        }
      }

      const vertices = new Float32Array(vrhovi);
      const count = vertices.length / 6;
      return {
        vertices,
        parts: [{ mode: "TRIANGLES", first: 0, count }],
      };
    }

    // ----------------- Javni API -----------------

    function createPlane(width, depth) {
      const { vertices, parts } = buildPlaneVertices(width, depth);
      return new Shape(vertices, parts);
    }

    function createTriangle(p1, p2, p3) {
      const { vertices, parts } = buildTriangleVertices(p1, p2, p3);
      return new Shape(vertices, parts);
    }

    function createLine(p1, p2) {
      const { vertices, parts } = buildLineVertices(p1, p2);
      return new Shape(vertices, parts);
    }

    function createCylinder(r, h, n) {
      const { vertices, parts } = buildCylinderVertices(r, h, n);
      return new Shape(vertices, parts);
    }

    function createCylinderShell(r, h, n) {
      const { vertices, parts } = buildCylinderShellVertices(r, h, n);
      return new Shape(vertices, parts);
    }

    function createEllipticCylinder(rx, rz, h, n) {
      const { vertices, parts } = buildEllipticCylinderVertices(rx, rz, h, n);
      return new Shape(vertices, parts);
    }

    function createCone(r, h, n) {
      const { vertices, parts } = buildConeVertices(r, h, n);
      return new Shape(vertices, parts);
    }

    function createSphere(r, latSegments, lonSegments) {
      const { vertices, parts } = buildSphereVertices(
        r,
        latSegments,
        lonSegments,
        0,
        Math.PI,
      );
      return new Shape(vertices, parts);
    }

    function createHemisphere(r, latSegments, lonSegments) {
      const { vertices, parts } = buildHemisphereShellVertices(
        r,
        latSegments,
        lonSegments,
      );
      return new Shape(vertices, parts);
    }

    return {
      Shape,
      createPlane,
      createTriangle,
      createLine,
      createCylinder,
      createCylinderShell,
      createEllipticCylinder,
      createCone,
      createSphere,
      createHemisphere,
    };
  }

  if (typeof global !== "undefined") {
    global.createShapes3D = createShapes3D;
  }
})(typeof window !== "undefined" ? window : this);
