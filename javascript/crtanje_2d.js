class Crtanje2D {

    constructor() {
        
    }

     static nacrtajElipsu(gks, a, b, ishodiste = { x: 0, y: 0 }, rezolucija = 0.05) {
       if (!gks || !(gks instanceof GKS)) alert("Greška - nema platna!");
       if (!a || !b || typeof a != "number" || typeof b != "number") alert("Nema argumenata!");
   
       gks.postaviNa(ishodiste.x, ishodiste.y);
   
       for (let t = 0; t <= 2 * Math.PI + rezolucija; t = t + rezolucija) {
           var x_d = a * Math.cos(t) + ishodiste.x;
           var y_d = b * Math.sin(t) + ishodiste.y;
   
           if (t == 0) {
               gks.postaviNa(x_d, y_d);
           } else {
               gks.linijaDo(x_d, y_d);
   
           }
   
       }
       gks.povuciLiniju();
   
   
   }
   
     static nacrtajLeptira(gks, rezolucija = 0.05, skaliraj = 1, donja = 0, gornja = Math.PI * 12, ishodiste = { x: 0, y: 0 }) {
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
   
     static degToRad(deg){
       return deg * (Math.PI/180);
   }
   
     static radToDeg(rad){
       return rad * (180 / Math.PI);
   
   }

}

