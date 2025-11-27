// @ts-ignore
class MT3D {
    public _matrica: number[][];
    public _kamera: number[][];

    constructor() {

        this._matrica = [[1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]];

        this._kamera = [[1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]];
    }

    identitet() : void {
        this._matrica = [[1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]]
    }

    pomakni(px: number, py: number, pz: number) : void {
        let t = [[1, 0, 0, px],
                [0, 1, 0, py],
                [0, 0, 1, pz],
                [0, 0, 0, 1]]

        this.mult(t);
    }

    skaliraj(sx: number, sy: number, sz: number) : void {
        let s = [[sx, 0, 0, 0],
                    [0, sy, 0, 0],
                    [0, 0, sz, 0],
                    [0, 0, 0, 1]]
        this.mult(s);

    }

    zrcaliNaX() : void {
        let z = [[1, 0, 0, 0],
                [0, -1, 0, 0],
                [0, 0, -1, 0],
                [0, 0, 0, 1]];
        this.mult(z);
        
    }

    zrcaliNaY() : void {
        let z = [[-1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, -1, 0],
                [0, 0, 0, 1]];
        this.mult(z);

    }

    zrcaliNaZ() : void {
        let z = [[-1, 0, 0, 0],
                [0, -1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]];
        this.mult(z);

    }

    zrcaliNaXY() : void {
        let z = [[1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, -1, 0],
                [0, 0, 0, 1]];
        this.mult(z);

    }

    zrcaliNaXZ() : void {
        let z = [[1, 0, 0, 0],
                [0, -1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]];
        this.mult(z);

    }

     zrcaliNaYZ() : void {
        let z = [[-1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]];
        this.mult(z);

    }

    rotirajX(kut: number) : void {
        let r = [
            [1, 0, 0, 0],
            [0, Math.cos(kut), -Math.sin(kut), 0],
            [0, Math.sin(kut), Math.cos(kut), 0],
            [0, 0, 0, 1]
        ];

        this.mult(r);
    }

    rotirajY(kut: number) : void {
        let r = [
            [Math.cos(kut), 0, Math.sin(kut), 0],
            [0, 1, 0, 0],
            [-Math.sin(kut), 0, Math.cos(kut), 0],
            [0, 0, 0, 1]
        ];

        this.mult(r);
    }

    rotirajZ(kut: number) : void {
        let r = [
            [Math.cos(kut), -Math.sin(kut), 0, 0],
            [Math.sin(kut), Math.cos(kut), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        this.mult(r);
    }

    rotiraj_oko_osi(x0: number, y0: number, z0: number,
         u1: number, u2: number, u3: number, kut: number) : void{

        let kut_rad : number= Utility.degToRad(kut);

    }


    mult(m: number[][])  : void{
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

    crossProdukt(u : number[], v : number[]) : number[]{
        let vek : number[] = [0, 0, 0];
        vek[0] = u[1]*v[2] - u[2]*v[1];
        vek[1] = u[2]*v[0] - u[0]*v[2];
        vek[2] = u[0]*v[1] - u[1]*v[0];

        return vek;

    }

    dotProdukt(u : number[], v : number[]) : number{
        let res = 0;
        for (let i = 0; i<3; i++){
            res += u[i]*v[i];
        }

        return res;
    }

    multMatrice(m1: number[][], m2:number[][]) : number[][]{
        let res  = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];

        for (let i = 0; i<4; i++) {
            for (let j = 0; j<4; j++){
                for (let k =0; k<4; k++){
                    res[i][j] += m1[i][k] * m2[k][j];
                }
            }
        }

 
        return res;
    }

    postaviKameru(x0: number, y0: number, z0: number,
                x1:number, y1: number, z1:number,
                Vx:number, Vy:number, Vz:number
    ) : void {
        //x0 y0 z0 : globalni ks
        // x1 y1 z1 : kamera gleda prema tocki
        //Vx Vy Vz: view up vektor

        // postaviKameru postavlja matricu transformacije

        let up_vekt = [Vx, Vy, Vz];

        let N = [x0-x1, y0-y1, z0-z1];


       //let norm_vekt = N/Math.abs(N);
       let abs_N = this.vratiAbsVektora(N);
       let n = this.vratiScalarDivVektora(N, abs_N);

       let U = this.crossProdukt(up_vekt, n);
       let abs_U = this.vratiAbsVektora(U);
       let u = this.vratiScalarDivVektora(U, abs_U);

       let v = this.crossProdukt(n, u);
       
        let T = [
            [1, 0, 0, -x0],
            [0, 1, 0, -y0],
            [0, 0, 1, -z0],
            [0, 0, 0, 1]
        ];

        let K = [
            [u[0], u[1], u[2], 0],
            [v[0], v[1], v[2], 0],
            [n[0], n[1], n[2], 0],
            [0, 0, 0, 1]
        ];

        let final = [
            [u[0], u[1], u[2], -u[0]*x0-u[1]*y0 - u[2]*z0],
            [v[0], v[1], v[2], -v[0]*x0-v[1]*y0 - v[2]*z0],
            [n[0], n[1], n[2], -n[0]*x0-n[1]*y0 - n[2]*z0],
            [0, 0, 0, 1]

        ];

        
        this._kamera = final;

    }


    vratiAbsVektora(vek : number[]) : number{

        let a = 0;
        a = Math.pow(vek[0], 2) + Math.pow(vek[1], 2) + Math.pow(vek[2], 2);
        a = Math.sqrt(a);

        return a;
    }

    vratiScalarDivVektora(vek : number[], scal : number) : number[]{

        let ret = [];
        for (let i = 0; i<3; i++){
            ret[i] = vek[i]/scal;
        }

        return ret;
    }


}