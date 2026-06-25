(function () {
  function linija3D(persp, x1, y1, z1, x2, y2, z2, boja) {
    if (boja) persp.koristiBoju(boja);
    persp.postaviNa(x1, y1, z1);
    persp.linijaDo(x2, y2, z2);
    persp.povuciLiniju();
  }

  function crtanjeMreze(persp, gridDim, boja) {
    for (let s = -gridDim; s <= gridDim; s++) {
      linija3D(persp, -gridDim, 0, s, gridDim, 0, s, boja);
      linija3D(persp, s, 0, -gridDim, s, 0, gridDim, boja);
    }
  }

  // Helper za animaciju + pauzu. Možeš ga koristiti u svojim rješenjima.
  function makeScene(canvasId, state, drawFrame) {
    const platno = document.getElementById(canvasId);
    if (!platno) return;

    const btn = document.querySelector(`button[data-toggle="${canvasId}"]`);
    let paused = state;
    let last = performance.now();

    if (btn) {
      btn.addEventListener("click", () => {
        paused = !paused;
        btn.textContent = paused ? "Nastavi" : "Pauza";
      });
    }

    function loop(now) {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused) {
        drawFrame(now / 1000, dt);
      }
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }

  // Platno 1 – robotska ruka (IDEJA ZA IMPLEMENTACIJU)
  function initCanvas1() {
    const platno = document.getElementById("c1");
    if (!platno) return;

    // IDEJA:
    // - Kamera koja kruži oko središta: koristi postaviKameru sa sin/cos za x,z.
    // - Na podlozi iscrtaj mrežu s crtanjeMreze.
    // - Sastavi robotsku ruku od primitiva:
    //     * baza: valjak
    //     * gornja ruka: valjak
    //     * zglob: kugla
    //     * podlaktica: valjak
    //     * alat: stozac ili mala kugla
    // - Svaki dio neka se rotira s drugom brzinom (rotirajY / rotirajZ).
    // - Za animaciju:
    //     const persp = Persp.EqualX(...);
    //     const mt3d = new MT3D();
    //     makeScene("c1", (t, dt) => { ... t koristis za sin/cos i kutove ... });
    const canvasSize = 30;
    const camDist = canvasSize / 2;
    const mt3d = new MT3D();
    const persp = Persp.EqualX(platno, -canvasSize, canvasSize, camDist);
    const spread = 4;
    const rez = 8;
    const radiusCylinder = 0.2;
    const radiusSphere = 0.4;
    const radiusMiniCylinder = radiusCylinder / 4;
    const radiusMiniSphere = 0.2;
    const heightCylinder = 2;
    const radiusHeightCylinder = heightCylinder / 4;
    makeScene("c1", true, (t, dt) => {
      persp.ocistiCanvas();

      crtanjeMreze(persp, camDist, "red");
      mt3d.postaviKameru(0, 4, 0, 5 * Math.sin(t), 0, 5 * Math.cos(t), 0, 1, 0);
      persp.trans(mt3d);
      persp.koristiBoju("black");

      for (let i = 0; i < 2 * Math.PI; i += Math.PI / 2) {
        mt3d.pomakni(
          spread * Math.sin(i + Math.PI / 4),
          0,
          spread * Math.cos(i + Math.PI / 4)
        );
        persp.trans(mt3d);
        persp.valjak(radiusCylinder, heightCylinder, rez);
        mt3d.pomakni(
          0,
          heightCylinder +
            Math.sqrt(Math.pow(radiusSphere, 2) - Math.pow(radiusCylinder, 2)),
          0
        );
        persp.trans(mt3d);
        persp.kugla(radiusSphere, rez, rez);
        mt3d.rotirajX(15 * (i - Math.PI / 5));
        mt3d.pomakni(
          0,
          Math.sqrt(Math.pow(radiusSphere, 2) - Math.pow(radiusCylinder, 2)),
          0
        );
        persp.trans(mt3d);
        persp.valjak(radiusCylinder, heightCylinder, rez);
        mt3d.pomakni(
          0,
          heightCylinder +
            Math.sqrt(
              Math.pow(radiusMiniSphere, 2) - Math.pow(radiusCylinder, 2)
            ),
          0
        );
        persp.trans(mt3d);
        persp.kugla(radiusMiniSphere, rez, rez);
        mt3d.pomakni(
          0,
          Math.sqrt(
            Math.pow(radiusMiniSphere, 2) - Math.pow(radiusMiniCylinder, 2)
          ),
          0
        );
        for (let j = 0; j < 3; j++) {
          mt3d.rotirajZ(15 * j * (i - Math.PI / 5));

          persp.trans(mt3d);
          persp.valjak(radiusMiniCylinder, radiusHeightCylinder, rez);
        }

        mt3d.identitet();
        persp.trans(mt3d);
      }
    });
  }

  // Platno 2 – svemirski brod + sateliti (IDEJA ZA IMPLEMENTACIJU)
  function initCanvas2() {
    const platno = document.getElementById("c2");
    if (!platno) return;
    const canvasSize = 30;
    const camDist = canvasSize / 2;
    const mt3d = new MT3D();
    const persp = Persp.EqualX(platno, -canvasSize, canvasSize, camDist);
    makeScene("c2", false, (t, dt) => {
      persp.ocistiCanvas();

      crtanjeMreze(persp, camDist, "red");
      const Rx = 8; // longer radius in x  -> stretches the path
      const Rz = 3; // shorter radius in z -> “capsule” feel
      const yCam = 4;
      const angle = t;

      // position on ellipse (capsule-like top view)
      const cx = Rx * Math.cos(angle);
      const cz = Rz * Math.sin(angle) - 3;

      // tangent direction along ellipse
      const tx = cx - Rx * Math.sin(angle); // derivative x'
      const tz = cz + Rz * Math.cos(angle); // derivative z'

      // camera moves along ellipse and looks tangentially
      mt3d.postaviKameru(cx, yCam, cz, tx, yCam, tz, 0, 1, 0);

      persp.trans(mt3d);
      persp.koristiBoju("black");
      mt3d.pomakni(0, 4, 0);
      mt3d.rotirajZ(90);
      persp.trans(mt3d);
      persp.valjak(1, 1, 32);
      mt3d.pomakni(0.35, 0, -0.4);
      persp.trans(mt3d);
      persp.valjak(0.2, 1, 32);
      mt3d.pomakni(0, 0, 0.9);
      persp.trans(mt3d);
      persp.valjak(0.2, 1, 32);
      mt3d.pomakni(-0.4, 0, -0.6);
      mt3d.rotirajY(180);
      persp.trans(mt3d);
      persp.valjak(0.6, 1, 16, 181);
      mt3d.identitet();
      persp.trans(mt3d);
    });
  }

  // Platno 3 – valoviti lanac kugli i stupova (IDEJA ZA IMPLEMENTACIJU)
  function initCanvas3() {
    const platno = document.getElementById("c3");
    if (!platno) return;

    // IDEJA:
    // - U petlji po i generiraj točke duž neke 3D putanje npr.
    //     u = i * 0.5
    //     radius(t, u) = 4 + 1.5 * cos(0.5*t + 0.5*u)
    //     x = cos(u) * radius, z = sin(u) * radius
    //     y = 1.5 + sin(t + u)
    // - U svakoj točki nacrtaj tanki valjak od poda do y (stup) i na vrh kuglu.
    // - Kugle mogu dodatno rotirati oko vlastite osi (rotirajY) da se linije na njima miču.
    // - Kamera neka kruži oko cijelog lanca, blago gore-dolje.
    // - Opet, koristi makeScene("c3", (t, dt) => { ... }).
  }

  // Ovdje samo pozivamo tvoje init funkcije – one su sada prazne
  // i sluze kao polazna tocka za tvoje rjesenje.
  window.addEventListener("load", () => {
    initCanvas1();
    initCanvas2();
    initCanvas3();
  });
})();
