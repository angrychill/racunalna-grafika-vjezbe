// @ts-ignore
class Crtanje3D {
   
    gks: GKS3D | GKS3DPerspective;
    mat: MT3D;

    constructor (gks : GKS3D| GKS3DPerspective, mat : MT3D){
        this.gks = gks;
        this.mat = mat;
    }

    nacrtajKocku(a = 1){
        // srediste u ishodistu
        let h = a/2;

        let v : number[][]= [
            [-h, -h, -h],
            [ h, -h, -h],
            [ h,  h, -h],
            [-h,  h, -h],
            [-h, -h,  h],
            [ h, -h,  h],
            [ h,  h,  h],
            [-h,  h,  h]
                        ];
        
        let e = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7]
    ];

        for (const [i, j] of e) {
            this.gks.postaviNa(v[i][0], v[i][1], v[i][2]);
            this.gks.linijaDo(v[j][0], v[j][1], v[j][2], true);
        }
            
    }

    nacrtajGlavneOsi() {
        this.gks.koristiBoju("red");
        this.gks.postaviNa(-20, 0, 0);
        this.gks.linijaDo(20, 0, 0);
        this.gks.povuciLiniju();
        this.gks.koristiBoju("blue");
        this.gks.postaviNa(0, -20, 0);
        this.gks.linijaDo(0, 20, 0);
        this.gks.povuciLiniju();
        this.gks.koristiBoju("green");
        this.gks.postaviNa(0, 0, -20);
        this.gks.linijaDo(0, 0, 20);
        this.gks.povuciLiniju();
        this.gks.koristiBoju("black");

    }

    nacrtajF() {

        this.gks.koristiBoju("red");
        this.gks.korisitDebljinu(1);
       
        for (let i = 0; i < 5; i++) {
            this.nacrtajKocku(1);
            this.mat.pomakni(0, 1, 0);
            this.gks.trans(this.mat);
        }
       
        this.mat.pomakni(0, -1, 0);

        for (let i = 1; i < 3; i++) {
            this.mat.pomakni(1, 0, 0);
            this.gks.trans(this.mat);
            this.nacrtajKocku(1);
        }

        this.mat.pomakni(-2, -2, 0);

        for (let i = 1; i < 3; i++) {
            this.mat.pomakni(1, 0, 0);
            this.gks.trans(this.mat);
            this.nacrtajKocku(1);
        }
  
    }


    nacrtajGridXZ(cell_w: number = 1, cell_h: number = 1) {
        this.gks.koristiBoju("gray");
        this.gks.korisitDebljinu(0.5);

        for (let i = -10; i <= 10; i += cell_h) {
            this.gks.postaviNa(-10, 0, i);
            this.gks.linijaDo(10, 0, i);
            this.gks.povuciLiniju();
        }
     
        for (let i = -10; i <= 10; i += cell_w) {
            this.gks.postaviNa(i, 0, -10);
            this.gks.linijaDo(i, 0, 10);
            this.gks.povuciLiniju();
        }
    }

    nacrtajOs(point1: number[], point2: number[]) {
        let dx = point2[0] - point1[0];
        let dy = point2[1] - point1[1];
        let dz = point2[2] - point1[2];
        let length = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (length === 0) return; // points are the same
        dx /= length;
        dy /= length;
        dz /= length;
        let t = this.gks.x_max*2; // large enough to be "infinite"
        let p1 = [point1[0] - t * dx, point1[1] - t * dy, point1[2] - t * dz];
        let p2 = [point1[0] + t * dx, point1[1] + t * dy, point1[2] + t * dz];
        this.gks.postaviNa(p1[0], p1[1], p1[2]);
        this.gks.linijaDo(p2[0], p2[1], p2[2]);
        this.gks.povuciLiniju();
    }

    nacrtajGridURavnini() {}

    


}