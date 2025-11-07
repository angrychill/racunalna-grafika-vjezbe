// @ts-ignore
class MT3D {
    public _matrica: number[][];

    constructor() {

        this._matrica = [[1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]];
    }

    identitet() {
        this._matrica = [[1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]]
    }

    pomakni(px: number, py: number, pz: number) {
        let t = [[1, 0, 0, px],
                [0, 1, 0, py],
                [0, 0, 1, pz],
                [0, 0, 0, 1]]

        this.mult(t);
    }

    skaliraj(sx: number, sy: number, sz: number) {
        let s = [[sx, 0, 0, 0],
                    [0, sy, 0, 0],
                    [0, 0, sz, 0],
                    [0, 0, 0, 1]]
        this.mult(s);

    }

    zrcaliNaX() {
        let z = [[1, 0, 0, 0],
                [0, -1, 0, 0],
                [0, 0, -1, 0],
                [0, 0, 0, 1]];
        this.mult(z);
        
    }

    zrcaliNaY() {
        let z = [[-1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, -1, 0],
                [0, 0, 0, 1]];
        this.mult(z);

    }

    zrcaliNaZ() {
        let z = [[-1, 0, 0, 0],
                [0, -1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]];
        this.mult(z);

    }

    zrcaliNaXY() {
        let z = [[1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, -1, 0],
                [0, 0, 0, 1]];
        this.mult(z);

    }

    zrcaliNaXZ() {
        let z = [[1, 0, 0, 0],
                [0, -1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]];
        this.mult(z);

    }

     zrcaliNaYZ() {
        let z = [[-1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]];
        this.mult(z);

    }

    rotirajX(kut: number) {
        let r = [
            [1, 0, 0, 0],
            [0, Math.cos(kut), -Math.sin(kut), 0],
            [0, Math.sin(kut), Math.cos(kut), 0],
            [0, 0, 0, 1]
        ];

        this.mult(r);
    }

    rotirajY(kut: number) {
        let r = [
            [Math.cos(kut), 0, Math.sin(kut), 0],
            [0, 1, 0, 0],
            [-Math.sin(kut), 0, Math.cos(kut), 0],
            [0, 0, 0, 1]
        ];

        this.mult(r);
    }

    rotirajZ(kut: number) {
        let r = [
            [Math.cos(kut), -Math.sin(kut), 0, 0],
            [Math.sin(kut), Math.cos(kut), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        this.mult(r);
    }

    rotiraj_oko_osi(x0: number, y0: number, z0: number,
         u1: number, u2: number, u3: number, kut: number){

        let kut_rad : number= Utility.degToRad(kut);

    }


    mult(m: number[][]){
        let m1 = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

        for (let i = 0; i<4; i++){
            for (let j = 0; j<4; j++){
                for (let k = 0; k<4; k++){
                    m1[i][j] = m1[i][j] + this._matrica[i][k] * m[k][j];
                }
            }
        }
        this._matrica = m1;

    }


}