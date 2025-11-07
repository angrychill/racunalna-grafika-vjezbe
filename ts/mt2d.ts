
class MT2D {
    public _matrica: number[][];

    constructor() {

        this._matrica = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }

    identitet() {
        this._matrica = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }

    pomakni(px: number, py: number) {
        let t = [[1, 0, px], [0, 1, py], [0, 0, 1]];
        this.mult(t);
    }

    skaliraj(sx: number, sy: number) {
        let s = [[sx, 0, 0], [0, sy, 0], [0, 0, 1]];
        this.mult(s);

    }

    zrcaliNaX() {
        let z = [[1, 0, 0], [0, -1, 0], [0, 0, 1]];
        this.mult(z);
        
    }

    zrcaliNaY() {
        let z = [[-1, 0, 0], [0, 1, 0], [0, 0, 1]];
        this.mult(z);

    }

    rotiraj(kut: number) {
        let r = [
            [Math.cos(kut), -Math.sin(kut), 0],
            [Math.sin(kut), Math.cos(kut), 0],
            [0, 0, 1]
        ];

        this.mult(r);
    }

    rotiraj_oko_tocke(tocka = {x: 0, y: 0}, kut: number){

        this.pomakni(-tocka.x, -tocka.y);

        this.rotiraj(kut);

        this.pomakni(tocka.x, tocka.y);

    }
    //skew
    smicanje(alpha : number, beta : number) {
        let sk = [
            [1, Math.tan(beta), 0],
            [Math.tan(alpha), 1, 0],
            [0, 0, 1]
        ];

        this.mult(sk);
    }

    mult(m: number[][]){
        let m1 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        for (let i = 0; i<3; i++){
            for (let j = 0; j<3; j++){
                for (let k = 0; k<3; k++){
                    m1[i][j] = m1[i][j] + this._matrica[i][k] * m[k][j];
                }
            }
        }
        this._matrica = m1;

    }

    zrcaliNaPravac(k: number, l: number){
        let a = Math.atan(k);
        this.pomakni(0, l);
        this.rotiraj(a);
        this.zrcaliNaX();
        this.rotiraj(-a);
        this.pomakni(0, -l);
    }


}