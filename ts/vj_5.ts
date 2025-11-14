// @ts-ignore
class zad_1 {
    crtac : Crtanje3D
    gks: GKS3D;
    mat: MT3D;
    isPaused: boolean = false;

    constructor(canvas : HTMLCanvasElement){
        var x_min = -10;
        var x_max = 10;
        var y_min = -10;
        var y_max = 10;

        this.gks = new GKS3DPerspective(canvas, x_min, x_max, y_min, y_max, 5);
        this.mat = new MT3D();
        this.crtac = new Crtanje3D(this.gks, this.mat);
        this.crtaj(15);
        //this.animiraj();

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.isPaused = !this.isPaused;
            }
        });
    }

    crtaj(step : number) {
        this.gks.g.clearRect(0, 0, this.gks.w, this.gks.h);
        this.mat.identitet();
        let r = 15;
        //let h = 2 + 2 * Math.sin(step)*0.5;
        //let eye_x = r * Math.cos(step)*0.5;
        //let eye_z = r * Math.sin(step)*0.5;
        this.mat.postaviKameru(3, 1, 3, 0, 0, 0, 0, 1, 0);
     
        this.gks.trans(this.mat);
        
        this.crtac.nacrtajGridXZ();
        this.crtac.nacrtajGlavneOsi();
        this.gks.korisitDebljinu(1);
    
        
        this.crtac.nacrtajParametarskuPlohu(-1, 1, 0, Math.PI * 2, 10,10);

    }
    step = 0;

    animiraj() {
        if (!this.isPaused) {
            this.step += 0.01;
            if (this.step > Math.PI * 2) {
                this.step = 0;
            }
            this.crtaj(this.step);
        }
        requestAnimationFrame(() => this.animiraj());
    }

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