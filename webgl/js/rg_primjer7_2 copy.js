"use strict";
// Extracted and restructured from RG-primjer7-2-bojanje-vrhova.html
class RGPrimjer7_2 {
    gl;
    program;
    //@ts-ignore
    buffer;
    vertices;
    canvas;
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2"); // Force cast for simplicity, ensure context is available
        if (!this.gl) {
            throw new Error("WebGL2 is not available");
        }
        // Define shaders as string literals
        const vsSource = vertShader();
        const fsSource = fragShader();
        this.program = WebGLPomocnici.pripremiGPUprogram(this.gl, vsSource, fsSource);
        this.gl.useProgram(this.program);
        console.log("test");
        const a = 2;
        this.vertices = [
            [0, 0, 1, 0, 0], // crveno
            [-a, -a, 1, 0, 0], // crveno
            [a, -a, 1, 0, 0], // crveno
            [0, 0, 1, 0, 0], // crveno
            [a, a, 1, 1, 0], // žuto
            [-a, a, 0.5, 0, 1] // ljubičasto
        ];
        this.napuniSpremnike();
        this.iscrtaj();
    }
    napuniSpremnike() {
        const flatData = new Float32Array(this.vertices.flat());
        this.buffer = WebGLPomocnici.napuniSpremnike(this.gl, flatData);
        WebGLPomocnici.postaviAtribut(this.gl, this.program, "a_vrhXY", 2, 20, 0);
        WebGLPomocnici.postaviAtribut(this.gl, this.program, "a_boja", 3, 20, 8);
    }
    iscrtaj() {
        this.gl.clearColor(0.5, 0.5, 0.5, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        let mat = new MT2D();
        let gks = new GKS2D(this.canvas, -10, 10);
        let crtac = new Crtanje2D(gks, mat);
        mat.pomakni(0, 0);
        mat.projekcija2D(-10, 10, -10, 10);
        const u_mTrans = this.gl.getUniformLocation(this.program, "u_mTrans");
        this.gl.uniformMatrix3fv(u_mTrans, false, mat.lista()); // matrica transformacije
        WebGLPomocnici.iscrtaj(this.gl, this.gl.TRIANGLES, this.vertices.length);
    }
}
function vertShader() {
    const glsl = (x) => x;
    let vert = glsl `#version 300 es

      in vec2 a_vrhXY;
      in vec3 a_boja;
      out vec3 v_boja;
      uniform mat3 u_mTrans;

      void main() {
        gl_Position = vec4(u_mTrans * vec3(a_vrhXY, 1), 1); // primijeni matricu transformacije
        v_boja = a_boja;
      }`;
    return vert;
}
function fragShader() {
    const glsl = (x) => x;
    let frag = glsl `#version 300 es
        precision highp float;
        in vec3 v_boja;
        out vec4 bojaPiksela;

        void main() {
          bojaPiksela = vec4(v_boja, 1);
        }
      `;
    return frag;
}
// @ts-ignore
function main() {
    let platno1 = document.getElementById("canvas1");
    var w = platno1.width;
    var h = platno1.height;
    new RGPrimjer7_2(platno1);
}
window.addEventListener("load", () => main());
