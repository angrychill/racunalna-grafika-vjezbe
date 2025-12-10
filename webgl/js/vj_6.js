"use strict";
// @ts-ignore
class zad_1 {
    crtac;
    gks;
    mat;
    isPaused = false;
    gl;
    //@ts-ignore
    gpuProgram;
    constructor(canvas) {
        var x_min = -10;
        var x_max = 10;
        var y_min = -10;
        var y_max = 10;
        this.gks = new GKS2D(canvas, x_min, x_max, y_min, y_max);
        this.mat = new MT2D();
        this.crtac = new Crtanje2D(this.gks, this.mat);
        //@ts-ignore
        this.gl = canvas.getContext("webgl2");
        if (!this.gl)
            alert("WebGL2 nije dostupan!");
        //this.crtaj(15);
        this.animiraj();
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.isPaused = !this.isPaused;
            }
        });
        this.program();
    }
    program() {
        let GPUprogram1 = WebGLPomocnici.pripremiGPUprogram(this.gl, "vertex-shader", "fragment-shader");
        this.gpuProgram = GPUprogram1;
        this.gl.useProgram(GPUprogram1); // možemo imati više GPU programa
        // povezivanje s uniform varijablama u programima za sjenčanje
        this.gpuProgram.u_mTrans = this.gl.getUniformLocation(GPUprogram1, "u_mTrans");
        this.gpuProgram.u_boja = this.gl.getUniformLocation(GPUprogram1, "u_boja");
        // definiranje geometrije preko javascript polja
        var vrhovi = [0.0, 0.0, // sredina
            -0.5, -0.5, // lijevi donji vrh
            0.5, -0.5, // desni donji vrh
            0.5, 0.5, // desni gornji vrh
            -0.5, 0.5, // lijevi gornji vrh
            0.0, 0.0]; // sredina
        var novi_vrhovi = [0.0, 0.0];
        for (let i = 0; i <= Math.PI * 2; i += Math.PI / 12) {
            let x = 0.9 * Math.cos(i);
            let y = 0.2 * Math.sin(i);
            novi_vrhovi.push(x);
            novi_vrhovi.push(y);
        }
        this.napuniSpremnike();
        this.iscrtaj();
    }
    napuniSpremnike() {
        let spremnikVrhova = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, spremnikVrhova);
        // povezivanje s atribut varijablom a_vrhXY u programu za sjenčanje
        this.gpuProgram.a_vrhXY = this.gl.getAttribLocation(this.gpuProgram, "a_vrhXY");
        this.gl.enableVertexAttribArray(this.gpuProgram.a_vrhXY);
        this.gl.vertexAttribPointer(this.gpuProgram.a_vrhXY, 2, gl.FLOAT, false, 0, 0);
        // punjenje spremnika - podaci koji se šalju na GPU
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(novi_vrhovi), this.gl.STATIC_DRAW);
    }
    iscrtaj() {
        this.gl.clearColor(0.4, 0.4, 0.4, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.viewport(0, 0, platno1.width, platno1.height);
        // postavljanje vrijednosti uniform varijabli
        let mat = this.mat;
        // constructor(platno, xmin, xmax, ymin = 0, ymax = 0)
        let gks = this.gks;
        mat.pomakni(0.9, 0.3);
        let crtac = this.crtac;
        let gl = this.gl;
        gl.uniformMatrix3fv(this.gpuProgram.u_mTrans, false, mat.lista()); // jedinična matrica
        gl.uniform4fv(this.gpuProgram.u_boja, [0.0, 1.0, 0.0, 1.0]); // zelena boja
        gl.drawArrays(gl.TRIANGLE_FAN, 0, novi_vrhovi.length / 2);
    }
    crtaj(step) {
        this.gks.g.clearRect(0, 0, this.gks.w, this.gks.h);
        this.mat.identitet();
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
    var w = platno1.width;
    var h = platno1.height;
    var g = platno1.getContext("2d");
    new zad_1(platno1);
}
window.addEventListener("load", () => main());
