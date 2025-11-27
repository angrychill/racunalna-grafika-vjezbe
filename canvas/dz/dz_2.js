window.onload = function () {

    /** @type {Crtanje2D} */
    var crtac = new Crtanje2D();

    /** @type {HTMLCanvasElement} */
    // @ts-ignore
    var platno1 = document.getElementById("canvas1");
    /** @type {HTMLCanvasElement} */
    // @ts-ignore
    var platno2 = document.getElementById("canvas2");

    /** @type {Utility} */
    var ut = new Utility();

    if (!platno1) alert("Nema platna!");

    var w = platno1.width;
    var h = platno1.height;
    var g = platno1.getContext("2d");



    var x_min = -10;
    var x_max = 10;
    var y_min = -10;
    var y_max = 10;

    slikaj_zad_1();
    slikaj_zad_2();

    
    function slikaj_zad_1() {
        /** @type {GKS} */
        var gks = new GKS(platno1, x_min, x_max);
    
    
        /** @type {MT2D} */
        var mat = new MT2D();
        if (!platno1) alert("Nema platna!");
        if (!gks || !(gks instanceof GKS)) alert("Nema GKS!");
        //nactrajElipsu(gks, 4, 2, {x: 2, y: 2}, 0.05);
        platno1.getContext("2d").clearRect(0, 0, w, h);
        gks.nacrtajGlavneOsi(true);
        
        gks.korisitDebljinu(1);
        gks.koristiBoju("red");
        
        crtac.nacrtajPravac(gks, 3, 6);

        mat.pomakni(2, 2);
        gks.trans(mat);
        gks.koristiBoju("black");
        crtac.nacrtajLokomotivu(gks, mat);

        mat.identitet();
        mat.zrcaliNaPravac(3, 6);
        mat.pomakni(2, 2);
        gks.koristiBoju("blue");
        crtac.nacrtajLokomotivu(gks, mat);



} 

    function slikaj_zad_2() {
        /** @type {GKS} */
        var gks = new GKS(platno2, x_min, x_max);
    
    
        /** @type {MT2D} */
        var mat = new MT2D();
        if (!platno2) alert("Nema platna!");
        if (!gks || !(gks instanceof GKS)) alert("Nema GKS!");

        //nactrajElipsu(gks, 4, 2, {x: 2, y: 2}, 0.05);
        platno2.getContext("2d").clearRect(0, 0, w, h);

        gks.nacrtajGlavneOsi(true);
        
        gks.korisitDebljinu(0.5);
        gks.koristiBoju("red");

        mat.pomakni(0, -4);
        gks.trans(mat);
        crtac.nacrtajCvijet(gks, 4, 1.15);

        mat.identitet();
        mat.rotiraj(Utility.degToRad(135));
        mat.pomakni(0, 5);
        mat.skaliraj(1, 1.8);
        gks.trans(mat);
        crtac.nacrtajLeptira(gks, 0.05, 0.5);

        mat.identitet();
        mat.zrcaliNaY();
        mat.rotiraj(Utility.degToRad(135));
        mat.pomakni(0, 5);
        mat.skaliraj(1, 1.8);
        gks.trans(mat);
        crtac.nacrtajLeptira(gks, 0.05, 0.5);
   
        mat.identitet();
        mat.rotiraj(Utility.degToRad(25));
        mat.pomakni(5, 0);
        mat.skaliraj(1, 0.35);
        gks.trans(mat);
        crtac.nacrtajLeptira(gks, 0.05, 0.5);

        mat.identitet();
        mat.zrcaliNaY();
        mat.rotiraj(Utility.degToRad(25));
        mat.pomakni(5, 0);
        mat.skaliraj(1, 0.35);
        gks.trans(mat);
        crtac.nacrtajLeptira(gks, 0.05, 0.5);

        mat.identitet();
        mat.rotiraj(Utility.degToRad(40));
        mat.pomakni(0, 5);
        gks.trans(mat);
        crtac.nacrtajCvijet(gks, 4, 1.15);

        mat.identitet();
        mat.zrcaliNaY();
        mat.rotiraj(Utility.degToRad(40));
        mat.pomakni(0, 5);
        gks.trans(mat);
        crtac.nacrtajCvijet(gks, 4, 1.15);

     

       

} 


}
