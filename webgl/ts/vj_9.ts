window.onload = WebGL2aplikacija;


function WebGL2aplikacija() {
        var platno1 = document.getElementById("slika1");
        //@ts-expect-error
        let gl = platno1.getContext("webgl2");
        if (!gl) alert("WebGL2 nije dostupan!");

        var GPUprog1 = pripremiGPUprogram(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(GPUprog1); // možemo imati više GPU programa
        GPUprog1.u_viewProj = gl.getUniformLocation(GPUprog1, "u_viewProj");
         gl.disable(gl.CULL_FACE);

                        
        // povezivanje s uniform varijablama u programu za sjenčanje
        GPUprog1.u_mTrans = gl.getUniformLocation(GPUprog1, "u_mTrans");
        GPUprog1.u_izvorXYZ = gl.getUniformLocation(GPUprog1, "u_izvorXYZ");
        GPUprog1.u_kameraXYZ = gl.getUniformLocation(GPUprog1, "u_kameraXYZ");
        GPUprog1.u_boja = gl.getUniformLocation(GPUprog1, "u_boja");

        var crtac = new CrtanjeWebGL();
        var matKamera = new MT3D();
        var matModel = new MT3D();
        //gl.enable(gl.DEPTH_TEST);

      
        
        var meshValjak
        var drawModesValjak: { mode: number; count: number; offset: number; }[]

        function napuniSpremnike() {
             meshValjak  = crtac.vratiSupliMeshValjak(5, 0.5, 2.5, n);
             drawModesValjak = crtac.napuniBuffer(gl, GPUprog1, meshValjak);
        }

        function iscrtaj() {
                gl.clearColor(0.5,0.5,0.5,1);
               gl.enable(gl.DEPTH_TEST);
           gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

           
           // @ts-expect-error
           gl.viewport(0, 0, platno1.width, platno1.height);

           // 1. Model transform
           matModel.identitet();
           matModel.rotirajZ(Utility.degToRad(90));
           matModel.rotirajY(Utility.degToRad(90));
           matModel.pomakni(-2.5, 0, 0);
           
           //matModel.rotirajX(alpha);
           matModel.postaviBojuSvjetla(0.6, 0.8, 1);
            

           // 2. Camera + Projection
           matKamera.postaviKameru(10, 5, 5, 0, 0, 0, 0, 1, 0);
           matKamera.postaviSvjetlo(5, 0, 10);
           matKamera.postaviBojuSvjetla(1.0, 1.0, 0.0);
           matKamera.persp(-1, 1, -1, 1, 1, 50);

          gl.uniformMatrix4fv(GPUprog1.u_viewProj, false, new Float32Array(matKamera.viewProjLista()));
            gl.uniformMatrix4fv(GPUprog1.u_mTrans, false, new Float32Array(matModel.modelLista()));


           // 3. Light & Camera
           gl.uniform3fv(GPUprog1.u_izvorXYZ, matKamera.vratiPozicijuSvjetla());
           gl.uniform3fv(GPUprog1.u_kameraXYZ, matKamera.vratiPozicijuKamere());
           gl.uniform3fv(GPUprog1.u_boja, matKamera.vratiBojuSvjetla()); // Set a default white color for light

           // 4. Draw cylinder
          for (const dm of drawModesValjak) {
             gl.drawArrays(dm.mode, dm.offset, dm.count);
            }

           alpha += Math.PI / 180;
           requestAnimationFrame(iscrtaj);
       } // iscrtaj

                var alpha = 0; // kut rotacije koji se koristi kod animacije
                var n = 32; // broj stranica koje čine plašt valjka
                
                napuniSpremnike();
                //umjesto napuniSpremnike(), koristi ovo;
                
        

                //@ts-expect-error
                gl.viewport(0, 0, platno1.width, platno1.height);
                // model transform for this object


        // camera + projection (for lighting calculations if shader uses it)

                    gl.clearColor(0.5, 0.5, 0.5, 1);
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


                // omogući selektivno odbacivanje
                gl.enable(gl.CULL_FACE);

        
        iscrtaj();

      

        
      } // WebGL2Aplikacija
      