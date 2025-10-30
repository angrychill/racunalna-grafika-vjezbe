
class MT3D {

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

    pomakni(px, py, pz) {
        let t = [[1, 0, 0, px],
                [0, 1, 0, py],
                [0, 0, 1, pz],
                [0, 0, 0, 1]]

        this.mult(t);
    }

    skaliraj(sx, sy, sz) {
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

    rotirajX(kut) {
        let r = [
            [1, 0, 0, 0],
            [0, Math.cos(kut), -Math.sin(kut), 0],
            [0, Math.sin(kut), Math.cos(kut), 0],
            [0, 0, 0, 1]
        ];

        this.mult(r);
    }

    rotirajY(kut) {
        let r = [
            [Math.cos(kut), 0, Math.sin(kut), 0],
            [0, 1, 0, 0],
            [-Math.sin(kut), 0, Math.cos(kut), 0],
            [0, 0, 0, 1]
        ];

        this.mult(r);
    }

    rotirajZ(kut) {
        let r = [
            [Math.cos(kut), -Math.sin(kut), 0, 0],
            [Math.sin(kut), Math.cos(kut), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        this.mult(r);
    }


    mult(m){
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