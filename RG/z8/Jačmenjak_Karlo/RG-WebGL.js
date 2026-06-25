// RG-WebGL.js - skup potprograma za rad s WebGL programima za sjenčanje

function prevediShader(gl, id, tipShadera) {
  const shaderSkripta = document.getElementById(id);
  if (!shaderSkripta) {
    throw "Nepoznata skripta: " + id;
  }
  const izvorniKodShadera = shaderSkripta.text.trim();
  const shader = gl.createShader(tipShadera);
  gl.shaderSource(shader, izvorniKodShadera);
  gl.compileShader(shader);
  const uspjeh = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!uspjeh) {
    throw "Shader nije kompajliran: " + gl.getShaderInfoLog(shader);
  }
  return shader;
}

function pripremiGPUprogram(gl, vsID, fsID) {
  const vshader = prevediShader(gl, vsID, gl.VERTEX_SHADER);
  const fshader = prevediShader(gl, fsID, gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vshader);
  gl.attachShader(program, fshader);
  gl.linkProgram(program);
  const uspjeh = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!uspjeh) {
    throw "Program nije kreiran kako treba: " + gl.getProgramInfoLog(program);
  }
  return program;
}

