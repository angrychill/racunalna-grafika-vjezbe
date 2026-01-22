window.onload = WebGL2aplikacija;


		  function WebGL2aplikacija() {
        var platno1 = document.getElementById("slika1");
        //@ts-expect-error
        let gl = platno1.getContext("webgl2");
        if (!gl) alert("WebGL2 nije dostupan!");

        var GPUprog1 = pripremiGPUprogram(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(GPUprog1); // možemo imati više GPU programa

        // povezivanje s uniform varijablama u programu za sjenčanje
        GPUprog1.u_mTrans = gl.getUniformLocation(GPUprog1, "u_mTrans");
        GPUprog1.u_izvorXYZ = gl.getUniformLocation(GPUprog1, "u_izvorXYZ");
        GPUprog1.u_kameraXYZ = gl.getUniformLocation(GPUprog1, "u_kameraXYZ");
        GPUprog1.u_boja = gl.getUniformLocation(GPUprog1, "u_boja");

        var crtac = new CrtanjeWebGL();
        var mat = new MT3D();
      
        function napuniSpremnike() {
          GPUprog1.a_vrhXYZ = gl.getAttribLocation(GPUprog1, "a_vrhXYZ");
          GPUprog1.a_normala = gl.getAttribLocation(GPUprog1, "a_normala");
        
          gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
          gl.enableVertexAttribArray(GPUprog1.a_vrhXYZ);
          gl.enableVertexAttribArray(GPUprog1.a_normala);
          gl.vertexAttribPointer(GPUprog1.a_vrhXYZ, 3, gl.FLOAT, false, 24, 0);
          gl.vertexAttribPointer(GPUprog1.a_normala, 3, gl.FLOAT, false, 24, 12);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(crtac.vratiVrhoveValjka(0.5, 1, n)),
            gl.STATIC_DRAW);
        } // napuni spremnike
       

        function iscrtaj() {
          gl.clearColor(0.5, 0.5, 0.5, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
          //@ts-expect-error
          gl.viewport(0, 0, platno1.width, platno1.height);

          mat.identitet();
          // donja baza valjka
          gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);
          
          // gornja baza valjka
          gl.drawArrays(gl.TRIANGLE_FAN, n + 2, n + 2);
          
          // plašt valjka
          gl.drawArrays(gl.TRIANGLE_STRIP, 2 * (n + 2), 2 * n + 2);
          
          mat.postaviKameru(1, 1, 1, 0, 0, 0, 0, 1, 0);
          mat.rotirajX(alpha/Math.PI);
          mat.persp(-1, 1, -1, 1, 1, 10);

          //matrica transformacije - rotacija oko x osi za kut alpha
          gl.uniformMatrix4fv(GPUprog1.u_mTrans, false,
          mat.projekcijaLista());

          alpha += Math.PI / 180;
          

          requestAnimationFrame(iscrtaj);
        } // iscrtaj

        var alpha = 0; // kut rotacije koji se koristi kod animacije
        var n = 32; // broj stranica koje čine plašt valjka
        napuniSpremnike();

        //@ts-expect-error
         gl.viewport(0, 0, platno1.width, platno1.height);
         
            gl.uniformMatrix4fv(GPUprog1.u_kameraPoz, false, mat.lista());
            gl.clearColor(0.5, 0.5, 0.5, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // vektori položaja izvora svjetlosti i kamere
        gl.uniform3fv(GPUprog1.u_izvorXYZ, [-1, 0, -10]);
        gl.uniform3fv(GPUprog1.u_kameraXYZ, [1, 0, -50]);

        // boja izvora u RGB formatu
        gl.uniform3fv(GPUprog1.u_boja, [1.0, 1.0, 0.0]);

        // omogući selektivno odbacivanje
        gl.enable(gl.CULL_FACE);

        
        iscrtaj();

        function pomiciKameru(alpha : number){
            gl.uniform3fv(GPUprog1.u_kameraXYZ, [0, 0, 0]);
        }

        function pomiciIzvor(){

        }

        
      } // WebGL2Aplikacija
      