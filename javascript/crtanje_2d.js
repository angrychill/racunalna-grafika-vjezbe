
class Crtanje2D {
     
      /**
     * @param {GKS} gks
     * @param {MT2D} mat
    */
    constructor(gks, mat) {
        this.vrijeme = 0;

        this.gks = gks;
        this.mat = mat;
    }

    nacrtajElipsu(a, b, rezolucija = 0.05) {
       
       if (!a || !b || typeof a != "number" || typeof b != "number") alert("Nema argumenata!");
   
  
   
       for (let t = 0; t <= 2 * Math.PI + rezolucija; t = t + rezolucija) {
           var x_d = a * Math.cos(t);
           var y_d = b * Math.sin(t);
   
           if (t == 0) {
               this.gks.postaviNa(x_d, y_d);
           } else {
               this.gks.linijaDo(x_d, y_d);
   
           }
   
       }
       this.gks.povuciLiniju();
   
   
   }
   
    nacrtajLeptira(rezolucija = 0.05, skaliraj = 1, donja = 0, gornja = Math.PI * 12, ishodiste = { x: 0, y: 0 }) {
      
   
       if (typeof donja != "number" || typeof gornja != "number") alert("Krivi tip argumenta!");
       for (var t = donja; t <= gornja + rezolucija; t = t + rezolucija) {
           var R = (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5));
           var x = R * Math.sin(t) * skaliraj;
           var y = R * Math.cos(t) * skaliraj;
           if (t == donja) {
               this.gks.postaviNa(x, y);
           } else {
               this.gks.linijaDo(x, y);
           }
       }
   
       this.gks.povuciLiniju();
   
   
   }

   nacrtajCvijet(latice = 4, radius = 1, ponavljanja = 4, skaliraj = 1, rezolucija = 0.05 ){
  
        ponavljanja = ponavljanja+1;
       for (let i = radius; i>=0; i = i- (radius/ponavljanja)){
    
           for (var t = 0; t <= Math.PI*2 + rezolucija; t = t + rezolucija) {
               var R = i * Math.cos(latice*t);
               var x = R * Math.cos(t) * skaliraj * i;
               var y = R * Math.sin(t) * skaliraj * i;
               if (t == 0) {
                   this.gks.postaviNa(x, y);
               } else {
                   this.gks.linijaDo(x, y);
               }
           }
            this.gks.povuciLiniju();

       }

       this.gks.povuciLiniju();

   }
   /**
     * Crta pravac (y = kx + l) na GKS platnu.
    
     * @param {number} k - Koeficijent smjera pravca.
     * @param {number} l - Odsječak pravca na y-osi.
    */
   nacrtajPravac(k, l){
   

    // y = kx + l
    
    /** @type {number} */
    let x_min = this.gks.x_min
    /** @type {number} */
    let y_first = k*x_min + l

    this.gks.postaviNa(x_min, y_first);

    /** @type {number} */
    let x_max = this.gks.x_max
    let y_last = k*x_max + l;
    this.gks.linijaDo(x_max, y_last);
    this.gks.povuciLiniju();


   }
    /**
     
     * @param {number} a - Koeficijent smjera pravca.
    */
   nacrtajJednakiTrokut( a, centered = false){
     
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
             this.gks.postaviNa(x_d, y_d);
         } else {
            this.gks.linijaDo(x_d, y_d);
         }

        }
        this.gks.povuciLiniju();


   }
    /**

     * @param {number} a
     * @param {number} b
    */
   nacrtajPravokutnik(a, b, centered = false){
       let a_cen = a/2;
       let b_cen = b/2;
    if (centered == false){
        a_cen = 0;
        b_cen = 0;
    }

    for (let i = 0; i<4; i++){
     
        if (i%4 == 1) {
            this.gks.postaviNa(0 - a_cen, 0 - b_cen);
        } 
        if (i%4 == 1) {
            this.gks.linijaDo(a - a_cen, 0 - b_cen);
        } 
        if (i%4 == 2) {
            this.gks.linijaDo(a - a_cen, b - b_cen);
        } 
        if (i%4 == 3) {
            this.gks.linijaDo(0 - a_cen,b - b_cen);
        }
       
    }


    this.gks.linijaDo(0 - a_cen, 0 - b_cen)
    this.gks.povuciLiniju();

   }

   nacrtajLokomotivu(scale = 1){

        let stari_mat = this.mat._matrica;

        this.mat.pomakni(1*scale, 0);
        this.gks.trans(this.mat);
        this.nacrtajElipsu(this.gks, 0.5*scale, 0.5*scale);

        this.mat.pomakni(3*scale, 0);
        this.gks.trans(this.mat);
        this.nacrtajElipsu(this.gks, 0.5*scale, 0.5*scale);

        this.mat.pomakni(-4*scale, 0.25);
        this.gks.trans(this.mat);
        this.nacrtajPravokutnik(scale*5, scale*2);


        this.mat.pomakni(scale*3.5, scale*1);
        this.gks.trans(this.mat);
        this.nacrtajPravokutnik(scale*1.5, scale*1, true);

        this.mat._matrica = stari_mat;


   }

   ventilator(stupanj) {
        // prvo kruznica

        var staro = this.mat._matrica;

        this.nacrtajElipsu(0.75, 0.75);
        
        // pa 3 elipse
        this.mat.rotiraj((2*Math.PI)*(0/3) + Utility.degToRad(stupanj));
        this.mat.pomakni(1.5, 0);
        this.gks.trans(this.mat);
        this.nacrtajElipsu(4, 1);
        this.mat.identitet();
        this.mat.rotiraj((2*Math.PI)*(1/3) + Utility.degToRad(stupanj));
        this.mat.pomakni(1.5, 0);
        this.gks.trans(this.mat);
        this.nacrtajElipsu(4, 1);
        this.mat.identitet();
        this.mat.rotiraj((2*Math.PI)*(2/3) + Utility.degToRad(stupanj));
        this.mat.pomakni(1.5, 0);
        this.gks.trans(this.mat);
        this.nacrtajElipsu( 4, 1);

        // reset
        this.mat._matrica = staro;
        this.gks.trans(this.mat);
   }
   

   
   animiraj_ventilator(){
      
        this.gks.g.clearRect(0, 0, this.gks.w, this.gks.h);

        
        this.ventilator(this.vrijeme);

        if (this.vrijeme > 360){
            this.vrijeme = 0;
        }
        this.vrijeme += 1;
        
        requestAnimationFrame(() => this.animiraj_ventilator());
    

   }




}

