class Crtanje3D {
    vrijeme: number;
    gks: GKS3D;
    mat: MT3D;

    constructor (gks : GKS3D, mat : MT3D){
        this.vrijeme = 0;

        this.gks = gks;
        this.mat = mat;
    }

    nacrtajKocku(a = 1){
        // srediste u ishodistu
        var h = a/2;

        var vertices = [
            [-h, -h, -h],
            [ h, -h, -h],
            [ h,  h, -h],
            [-h,  h, -h],
            [-h, -h,  h],
            [ h, -h,  h],
            [ h,  h,  h],
            [-h,  h,  h]
  ];
    }
}