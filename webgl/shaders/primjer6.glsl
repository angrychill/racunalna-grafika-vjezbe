// ===== VERTEX SHADER =====
#version 300 es
in vec2 a_vrhXY;
uniform mat3 u_mTrans;

void main() {
  gl_Position = vec4(u_mTrans * vec3(a_vrhXY, 1), 1);
}

// ===== FRAGMENT SHADER =====
#version 300 es
precision mediump float;
uniform vec4 u_boja;
out vec4 bojaPiksela;

void main() {
  bojaPiksela = u_boja;
}
