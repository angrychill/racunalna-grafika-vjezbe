"use strict";
class WebGLPomocnici {
    // RG-WebGL.js - skup potprograma koji automatizira prevođenje programa za sjenčanje
    // za potrebe kolegija Računalna grafika pripremio Damir Horvat / preradio Ivan Hip
    // kreiranje shadera iz <script id="..."> taga
    //@ts-ignore
    static prevediShader(gl, source, tipShadera) {
        var shader = gl.createShader(tipShadera);
        // pridruzi mu izvorni kod
        gl.shaderSource(shader, source);
        // kompajliraj shader
        gl.compileShader(shader);
        // provjeri da li je sve ok
        var uspjeh = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!uspjeh) {
            throw "Shader nije kompajliran: " + gl.getShaderInfoLog(shader);
        }
        return shader;
    } // prevediShader
    // poveži sve zajedno u program
    //@ts-ignore
    static pripremiGPUprogram(gl, vsSource, fsSource) {
        var vshader = this.prevediShader(gl, vsSource, gl.VERTEX_SHADER);
        var fshader = this.prevediShader(gl, fsSource, gl.FRAGMENT_SHADER);
        var program = gl.createProgram();
        // pridruzi shadere
        gl.attachShader(program, vshader);
        gl.attachShader(program, fshader);
        // povezi shadere u program
        gl.linkProgram(program);
        // provjeri je li dobro povezano
        var uspjeh = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!uspjeh) {
            throw "Program nije kreiran kako treba: " + gl.getProgramInfoLog(program);
        }
        return program;
    } // pripremiGPUprogram
    static napuniSpremnike(gl, data) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return buffer;
    }
    static postaviAtribut(gl, program, attrName, size, stride, offset) {
        const loc = gl.getAttribLocation(program, attrName);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset);
    }
    static iscrtaj(gl, mode, count) {
        gl.drawArrays(mode, 0, count);
    }
}
