// @ts-ignore
class zad_1 {
    crtac : Crtanje3D
    gks: GKS3DPerspective;
    mat: MT3D;
    
    constructor(canvas : HTMLCanvasElement){
        var x_min = -10;
        var x_max = 10;
        var y_min = -10;
        var y_max = 10;

        this.gks = new GKS3DPerspective(canvas, x_min, x_max, x_min, x_max, 5);
        this.mat = new MT3D();
        this.crtac = new Crtanje3DPerspective(this.gks, this.mat);

        this.crtaj(0);

    }

    crtaj(step : number) {
        this.mat.identitet();
        this.mat.postaviKameru(
            5, 5, 0,
            0, 0, 0,
            5, 5, 5
        );
        this.gks.trans(this.mat);
        //this.crtac.nacrtajKocku(3);
        this.crtac.nacrtajGlavneOsi();

    }
    step = 0;

//     animiraj() {
//         this.gks.g.clearRect(0, 0, this.gks.w, this.gks.h);
//         this.step += 0.01
//         if (this.step > Math.PI*2) {
//             this.step = 0
//         }
//         this.crtaj(this.step);
//         requestAnimationFrame(() => this.animiraj());
//   }

}

// @ts-ignore
function main() {

 
    let platno1 : HTMLCanvasElement = document.getElementById("canvas1") as HTMLCanvasElement;



    var w = platno1.width;
    var h = platno1.height;
    var g = platno1.getContext("2d");


    
    new zad_1(platno1);
 
   
}

window.addEventListener("load", () => main());