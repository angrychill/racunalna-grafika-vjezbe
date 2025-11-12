// @ts-ignore
class Crtanje3DPerspective {
   
    gks: GKS3DPerspective;
    mat: MT3D;

    constructor (gks : GKS3DPerspective, mat : MT3D){
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
        this.gks.postaviNa(-10, 0, 0);
        this.gks.linijaDo(10, 0, 0);
        this.gks.postaviNa(0, -10, 0);
        this.gks.linijaDo(0, 10, 0);
        this.gks.postaviNa(0, 0, -10);
        this.gks.linijaDo(0, 0, 10);

        this.gks.povuciLiniju();

    }

    nacrtajOs() {}

    nacrtajGridURavnini() {}

    


}