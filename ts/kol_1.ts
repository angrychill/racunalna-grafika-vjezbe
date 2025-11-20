// @ts-ignore
class zad_1 {
    crtac : Crtanje3D
    gks: GKS3D;
    mat: MT3D;
    isPaused: boolean = false;

    constructor(canvas : HTMLCanvasElement){
        var x_min = -10;
        var x_max = 10;
    

        this.gks = new GKS3DPerspective(canvas, x_min, x_max, 0, 0, 15);
        this.mat = new MT3D();
        this.crtac = new Crtanje3D(this.gks, this.mat);
        //this.crtaj(0);
        this.animiraj();

        this.gks.g.fillStyle = "#FFFFE0";

        

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.isPaused = !this.isPaused;
            }
        });
        
    }

    crtaj(step : number) {
        this.gks.g.clearRect(0, 0, this.gks.w, this.gks.h);
        this.gks.g.fillStyle = "#FFFFE0";
        this.gks.g.fillRect(0, 0, this.gks.w, this.gks.h);
        
        this.mat.identitet();
        this.gks.trans(this.mat);

        this.mat.postaviKameru(7.5, 7.5,10, 0, 0, 0, 0, 1, 0);
     
        this.gks.trans(this.mat);
    
        //this.crtac.nacrtajGridXZ();
        this.gks.korisitDebljinu(1);
        this.crtac.nacrtajGlavneOsi();
       this.gks.koristiBoju("black");
        this.gks.korisitDebljinu(0.75);

        this.gks.koristiBoju("#00ADEF");
        this.mat.pomakni(0, -3, 0);
        this.gks.trans(this.mat);
        this.crtac.nacrtajKrnjiStozac(2, 0.3, 5, 20);
        this.mat.pomakni(0, 5, 0);
        this.gks.trans(this.mat);
        this.gks.koristiBoju("#FA003F");
        
        this.mat.rotirajY(step);
        this.gks.trans(this.mat);
        this.crtac.nacrtajArrayLinija(0.3, 5, 20);
        this.gks.koristiBoju("black");
        this.crtac.nacrtajTorus(5, 0.15, 40);



        for (let i = 0; i<4; i++){

            // prvo pozicija na torusu gornja
            // sin i cos po rotaciji?

            // postavljanje pravilne pozicije na x
           
            this.mat.rotirajY(Utility.degToRad(360/4));
              this.mat.pomakni(5, -0.15, 0);
            this.gks.trans(this.mat);

            this.gks.korisitDebljinu(1);
            this.gks.koristiBoju("black");
            this.gks.postaviNa(0, 0, 0);
          
            this.mat.rotirajY(step*4);
            this.mat.rotirajZ(Utility.degToRad(30));
           
            this.gks.trans(this.mat);

            this.mat.pomakni(0, -2, 0);
            this.gks.trans(this.mat);
            this.gks.linijaDo(0, 0, 0, true);

            this.gks.korisitDebljinu(0.25);
            this.gks.koristiBoju("magenta");
            this.crtac.nacrtajKuglu(0.25, 5, 5);


            this.mat.pomakni(0, 2, 0);
            this.gks.trans(this.mat);
            this.mat.rotirajZ(Utility.degToRad(-30));
            this.mat.rotirajY(-step*4);
              this.mat.pomakni(-5, 0.15, 0);
            this.gks.trans(this.mat);

        }

    }
    step = 0;
    rotationSpeed : number = 0;

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

    let div1 = document.getElementById("arguments")

    


    var w = platno1.width;
    var h = platno1.height;
    var g = platno1.getContext("2d");


    
    new zad_1(platno1);

 
   
}

window.addEventListener("load", () => main());