"use strict";
class WebGLPomocnici {
    //@ts-ignore
    static napuniSpremnike(gl, GPUprogram1, novi_vrhovi) {
        const spremnikVrhova = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, spremnikVrhova);
        GPUprogram1.a_vrhXY = gl.getAttribLocation(GPUprogram1, "a_vrhXY");
        gl.enableVertexAttribArray(GPUprogram1.a_vrhXY);
        gl.vertexAttribPointer(GPUprogram1.a_vrhXY, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(novi_vrhovi), gl.STATIC_DRAW);
        return spremnikVrhova;
    }
    //@ts-ignore
    static iscrtaj(gl, platno1, GPUprogram1, novi_vrhovi) {
        gl.clearColor(0.4, 0.4, 0.4, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, platno1.width, platno1.height);
        // Transform setup
        const mat = new MT2D();
        const gks = new GKS2D(platno1, 10, 10);
        mat.pomakni(0.9, 0.3);
        const crtac = new Crtanje2D(gks, mat);
        gl.uniformMatrix3fv(GPUprogram1.u_mTrans, false, mat.lista());
        gl.uniform4fv(GPUprogram1.u_boja, [0.0, 1.0, 0.0, 1.0]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, novi_vrhovi.length / 2);
    }
}
