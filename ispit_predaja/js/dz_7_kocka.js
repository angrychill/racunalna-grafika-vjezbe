"use strict";
window.onload = WebGLaplikacija;
function WebGLaplikacija() {
    var platno1 = document.getElementById("slika1");
    //@ts-expect-error
    const gl = platno1.getContext("webgl2");
    if (!gl)
        alert("WebGL2 nije dostupan!");
    const GPUprogram1 = pripremiGPUprogram(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(GPUprogram1);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // možemo imati više GPU programa
    // definiranje geometrije preko javascript polja
    let a = 1.0;
    let mat = new MT3D();
    //@ts-expect-error
    let gks = new GKS3DPerspective(platno1, -10, 10);
    let crtac = new CrtanjeWebGL();
    crtac.spektarBoja = [
        [1.0, 0.0, 0.0], // red
        [0.0, 1.0, 0.0], // green
        [0.0, 0.0, 1.0], // blue
        [1.0, 1.0, 0.0], // yellow
        [1.0, 0.0, 1.0], // magenta
        [0.0, 1.0, 1.0] // cyan
    ];
    let novi2 = [];
    let vrhovi_kocke = crtac.vratiVrhoveKockeTrokut(a, true);
    let faceIndex = 0;
    let vrhPoFace = 0;
    for (let i = 0; i < vrhovi_kocke.length; i += 3) {
        // preskoci prva 3
        novi2.push(vrhovi_kocke[i], vrhovi_kocke[i + 1], vrhovi_kocke[i + 2]);
        novi2.push(crtac.spektarBoja[faceIndex][0], crtac.spektarBoja[faceIndex][1], crtac.spektarBoja[faceIndex][2]);
        vrhPoFace++;
        if (vrhPoFace == 6) {
            vrhPoFace = 0;
            faceIndex++;
        }
    }
    let grid2 = crtac.vratiVrhoveGrid(-5, 5, 1, [0.3, 0.3, 0.3]);
    let spremnikKocka;
    let spremnikGrid;
    function napuniSpremnike() {
        // povezivanje s atribut varijablama u programu za sjenčanje
        GPUprogram1.a_vrhXYZ = gl.getAttribLocation(GPUprogram1, "a_vrhXYZ");
        GPUprogram1.a_boja = gl.getAttribLocation(GPUprogram1, "a_boja");
        spremnikKocka = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, spremnikKocka);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(novi2), gl.STATIC_DRAW);
        spremnikGrid = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, spremnikGrid);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grid2), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(GPUprogram1.a_vrhXYZ);
        gl.enableVertexAttribArray(GPUprogram1.a_boja);
    } // napuniSpremnike
    let kut = 0;
    GPUprogram1.u_mTrans = gl.getUniformLocation(GPUprogram1, "u_mTrans");
    function animacija() {
        kut += 0.01;
        let m = new MT3D();
        m.identitet();
        // 1. Model rotation
        m.rotirajY(kut);
        m.rotirajX(2 * kut);
        m.rotirajZ(3 * kut);
        // 2. Camera transform
        m.postaviKameru(0, 1, 1, 0, 0, 0, 0, 1, 0);
        // 3. Perspective projection
        m.persp(-10, 10, -10, 10, 0.1, 20);
        // Remove gks.trans(m) calls unless you're using the GKS3DPerspective for separate 2D rendering;
        // assuming this is for WebGL uniform, just use m directly as before
        //@ts-expect-error
        gl.viewport(0, 0, platno1.width, platno1.height);
        gl.uniformMatrix4fv(GPUprogram1.u_mTrans, false, m.lista());
        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Draw grid
        gl.bindBuffer(gl.ARRAY_BUFFER, spremnikGrid);
        gl.vertexAttribPointer(GPUprogram1.a_vrhXYZ, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(GPUprogram1.a_boja, 3, gl.FLOAT, false, 24, 12);
        gl.drawArrays(gl.LINES, 0, grid2.length / 6);
        // Draw cube
        gl.bindBuffer(gl.ARRAY_BUFFER, spremnikKocka);
        gl.vertexAttribPointer(GPUprogram1.a_vrhXYZ, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(GPUprogram1.a_boja, 3, gl.FLOAT, false, 24, 12);
        gl.drawArrays(gl.TRIANGLES, 0, novi2.length / 6);
        requestAnimationFrame(animacija);
    }
    napuniSpremnike();
    animacija();
} // WebGLaplikacija
