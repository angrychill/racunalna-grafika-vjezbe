
class Crtanje2D {

    constructor() {
        
    }

    nacrtajElipsu(gks, a, b, rezolucija = 0.05) {
       if (!gks || !(gks instanceof GKS)) alert("Greška - nema platna!");
       if (!a || !b || typeof a != "number" || typeof b != "number") alert("Nema argumenata!");
   
  
   
       for (let t = 0; t <= 2 * Math.PI + rezolucija; t = t + rezolucija) {
           var x_d = a * Math.cos(t);
           var y_d = b * Math.sin(t);
   
           if (t == 0) {
               gks.postaviNa(x_d, y_d);
           } else {
               gks.linijaDo(x_d, y_d);
   
           }
   
       }
       gks.povuciLiniju();
   
   
   }
   
    nacrtajLeptira(gks, rezolucija = 0.05, skaliraj = 1, donja = 0, gornja = Math.PI * 12, ishodiste = { x: 0, y: 0 }) {
       if (!gks || !(gks instanceof GKS)) alert("Greška - nema platna!");
   
       if (typeof donja != "number" || typeof gornja != "number") alert("Krivi tip argumenta!");
       for (var t = donja; t <= gornja + rezolucija; t = t + rezolucija) {
           var R = (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5));
           var x = R * Math.sin(t) * skaliraj;
           var y = R * Math.cos(t) * skaliraj;
           if (t == donja) {
               gks.postaviNa(x, y);
           } else {
               gks.linijaDo(x, y);
           }
       }
   
       gks.povuciLiniju();
   
   
   }
   /**
     * @param {GKS} gks - Objekt grafičkog koordinatnog sustava.

    */
   nacrtajCvijet(gks, latice = 4, radius = 1, ponavljanja = 4, skaliraj = 1, rezolucija = 0.05 ){
    if (!gks || !(gks instanceof GKS)) alert("Greška - nema platna!");
        ponavljanja = ponavljanja+1;
       for (let i = radius; i>=0; i = i- (radius/ponavljanja)){
    
           for (var t = 0; t <= Math.PI*2 + rezolucija; t = t + rezolucija) {
               var R = i * Math.cos(latice*t);
               var x = R * Math.cos(t) * skaliraj * i;
               var y = R * Math.sin(t) * skaliraj * i;
               if (t == 0) {
                   gks.postaviNa(x, y);
               } else {
                   gks.linijaDo(x, y);
               }
           }
            gks.povuciLiniju();

       }

       gks.povuciLiniju();

   }
   /**
     * Crta pravac (y = kx + l) na GKS platnu.
     * @param {GKS} gks - Objekt grafičkog koordinatnog sustava.
     * @param {number} k - Koeficijent smjera pravca.
     * @param {number} l - Odsječak pravca na y-osi.
    */
   nacrtajPravac(gks, k, l){
    if (!gks || !(gks instanceof GKS)) alert("Greška - nema platna!");
    /** @type {GKS} */

    // y = kx + l
    
    /** @type {number} */
    let x_min = gks.x_min
    /** @type {number} */
    let y_first = k*x_min + l

    gks.postaviNa(x_min, y_first);

    /** @type {number} */
    let x_max = gks.x_max
    let y_last = k*x_max + l;
    gks.linijaDo(x_max, y_last);
    gks.povuciLiniju();


   }
    /**
     * @param {GKS} gks - Objekt grafičkog koordinatnog sustava.
     * @param {number} a - Koeficijent smjera pravca.
    */
   nacrtajJednakiTrokut(gks, a, centered = false){
     if (!gks || !(gks instanceof GKS)) alert("Greška - nema platna!");
    
     // centroid to point:
     // 2/3 * height

     //height :
     // sqrt(3)/2 * a

     //  var x_d = a * Math.cos(t);
     // var y_d = a * Math.sin(t);

     

     let radius = a / Math.sqrt(3);
     let t = 2*(Math.PI)/3;
     for (let i = 0; i<=2*Math.PI; i = i + t){
         
         var x_d = radius * Math.cos(i);
         var y_d = radius * Math.sin(i);
         
         if (i == 0){
             gks.postaviNa(x_d, y_d);
         } else {
            gks.linijaDo(x_d, y_d);
         }

        }
        gks.povuciLiniju();


   }
    /**
     * @param {GKS} gks
     * @param {number} a
     * @param {number} b
    */
   nacrtajPravokutnik(gks, a, b, centered = false){
       let a_cen = a/2;
       let b_cen = b/2;
    if (centered == false){
        a_cen = 0;
        b_cen = 0;
    }

    for (let i = 0; i<4; i++){
     
        if (i%4 == 1) {
            gks.postaviNa(0 - a_cen, 0 - b_cen);
        } 
        if (i%4 == 1) {
            gks.linijaDo(a - a_cen, 0 - b_cen);
        } 
        if (i%4 == 2) {
            gks.linijaDo(a - a_cen, b - b_cen);
        } 
        if (i%4 == 3) {
            gks.linijaDo(0 - a_cen,b - b_cen);
        }
       
    }


    gks.linijaDo(0 - a_cen, 0 - b_cen)
    gks.povuciLiniju();

   }
    /**
     * @param {GKS} gks
     * @param {MT2D} mat
    */
   nacrtajLokomotivu(gks, mat, scale = 1){

        let stari_mat = mat._matrica;

        mat.pomakni(1*scale, 0);
        gks.trans(mat);
        this.nacrtajElipsu(gks, 0.5*scale, 0.5*scale);

        mat.pomakni(3*scale, 0);
        gks.trans(mat);
        this.nacrtajElipsu(gks, 0.5*scale, 0.5*scale);

        mat.pomakni(-4*scale, 0.25);
        gks.trans(mat);
        this.nacrtajPravokutnik(gks, scale*5, scale*2);


        mat.pomakni(scale*3.5, scale*1);
        gks.trans(mat);
        this.nacrtajPravokutnik(gks, scale*1.5, scale*1, true);

        mat._matrica = stari_mat;


   }


}

