// @ts-ignore
class zad_1 {
    crtac : Crtanje3D
    gks: GKS3D;
    mat: MT3D;
    
    constructor(canvas : HTMLCanvasElement){
        var x_min = -10;
        var x_max = 10;
        var y_min = -10;
        var y_max = 10;

        this.gks = new GKS3D(canvas, x_min, x_max);
        this.mat = new MT3D();
        this.crtac = new Crtanje3D(this.gks, this.mat);

        this.animiraj();

    }

    crtaj(step : number) {
        this.mat.identitet();
        this.mat.rotirajY(step);
        this.mat.rotirajX(step);
        this.mat.rotirajZ(step);
        this.gks.trans(this.mat);
        this.crtac.nacrtajKocku(3);

    }
    step = 0;

    animiraj() {
        this.gks.g.clearRect(0, 0, this.gks.w, this.gks.h);
        this.step += 0.01
        if (this.step > Math.PI*2) {
            this.step = 0
        }
        this.crtaj(this.step);
        requestAnimationFrame(() => this.animiraj());
  }

}

// @ts-ignore
class zad_2 {
     crtac : Crtanje2D
    gks: GKS2D;
    mat: MT2D;
    
    constructor(canvas : HTMLCanvasElement){
        var x_min = -10;
        var x_max = 10;
        var y_min = -10;
        var y_max = 10;

        this.gks = new GKS2D(canvas, x_min, x_max);
        this.mat = new MT2D();
        this.crtac = new Crtanje2D(this.gks, this.mat);

        this.animiraj();

    }

    crtaj(step : number) {
     
        //this.mat.identitet();
        //this.gks.trans(this.mat);
        

        this.mat.identitet();
        this.gks.trans(this.mat);
       let koord = this.crtac.astroida(1, step);
       if (step == 0){
        this.gks.postaviNa(koord.x, koord.y);
       } else {
        this.gks.linijaDo(koord.x, koord.y, true);
       }
      
        this.crtac.nacrtajElipsu(4, 4, 0.1);
   

       this.mat.pomakni(koord.x, koord.y);
       this.gks.trans(this.mat);
       this.crtac.nacrtajElipsu(0.1, 0.1, 0.5);


    }

    step = 0;

    animiraj() {
        this.gks.g.clearRect(0, 0, this.gks.w, this.gks.h);
        this.step += 0.01
        if (this.step > Math.PI*2) {
            this.step = 0
        }
        this.crtaj(this.step);
        requestAnimationFrame(() => this.animiraj());
  }
}
// @ts-ignore
function main() {

 
    let platno1 : HTMLCanvasElement = document.getElementById("canvas1") as HTMLCanvasElement;
    let platno2 : HTMLCanvasElement = document.getElementById("canvas2") as HTMLCanvasElement;



    var w = platno1.width;
    var h = platno1.height;
    var g = platno1.getContext("2d");


    
    

    new zad_1(platno1);
    new zad_2(platno2);
   
}

window.addEventListener("load", () => main());