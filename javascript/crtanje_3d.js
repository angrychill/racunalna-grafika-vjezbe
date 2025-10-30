class Crtanje3D {
    /**
     * @param {GKS3D} gks
     * @param {MT3D} mat
    */
    constructor (gks, mat){
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