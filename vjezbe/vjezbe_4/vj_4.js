window.onload = function () {

    
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
    

    
    function slikaj_zad_1() {
        /** @type {GKS} */
        var gks = new GKS(platno1, x_min, x_max);
        
        
        /** @type {MT2D} */
        var mat = new MT2D();
        /** @type {Crtanje2D} */
        var crtac = new Crtanje2D(gks, mat);
      
        platno1.getContext("2d").clearRect(0, 0, w, h);
        gks.nacrtajGlavneOsi(true);
        
        gks.korisitDebljinu(1);
        gks.koristiBoju("red");
  

        crtac.animiraj_ventilator();





} 

    


}
