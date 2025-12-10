// vert
#version 300 es
      in vec2 a_vrhXY;
      in vec3 a_boja;
      out vec3 v_boja;
      uniform mat3 u_mTrans;

      void main() {
        gl_Position = vec4(u_mTrans * vec3(a_vrhXY, 1), 1); // primijeni matricu transformacije
        v_boja = a_boja;
      };

// frag
#version 300 es
      precision highp float;
      in vec3 v_boja;
      out vec4 bojaPiksela;

      void main() {
        bojaPiksela = vec4(v_boja, 1);
      }
;