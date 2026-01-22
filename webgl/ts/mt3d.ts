// @ts-ignore
class MT3D {
    public _matrica: number[][];
    public _kamera: number[][];
    public _projekcija: number[][];
    public _kamera_poz : number[];
    public _svijetlo_poz : number[];
    public _boja_svjetla : number[];

    constructor() {

        this._matrica = [[1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]];

        this._kamera = [[1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]];

        this._projekcija = [
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1]];

            this._kamera_poz = [0, 0, 0];
            this._svijetlo_poz = [0, 0, 0];
            this._boja_svjetla = [1, 1, 1];
            

    }

    get matrica() {
        return this.multMatrice(this._projekcija, this.multMatrice(this._kamera, this._matrica));
    }

    postaviSvjetlo(x:number, y:number, z:number){
        this._svijetlo_poz = [x, y, z];
    }

    vratiPozicijuSvjetla(){
        return this._svijetlo_poz;
    }

    postaviBojuSvjetla(r:number, g:number, b:number){
        this._boja_svjetla = [r, g, b];
    }

    vratiBojuSvjetla() {
        return this._boja_svjetla;
    }

    viewProjLista(): number[] {
        const VP = this.multMatrice(this._projekcija, this._kamera);
        const out: number[] = [];
        for (let j = 0; j < 4; j++)
            for (let i = 0; i < 4; i++)
                out.push(VP[i][j]);
        return out;
}


    lista(){
        let lista = []
        for (let i = 0; i<4; i++){
            for (let j = 0; j<4; j++){
                lista.push(this._matrica[j][i]);
            }
        }
        return lista;
    }

    modelLista() : number[] {
        const out: number[] = [];
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
            out.push(this._matrica[i][j]);
        }
    }
    return out;

    }

    vratiPozicijuKamere() : number[]{

        return this._kamera_poz;
    }

    projekcijaLista() : number[]{
         const PK = this.multMatrice(this._projekcija, this._kamera);
        const out: number[] = [];
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 4; i++) {
                out.push(PK[i][j]);
            }
        }
        return out;
    }

    identitet() : void {
        this._matrica = [[1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]]
    }

    resetKamera() : void {
        this._kamera = [[1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]]
    }

    resetProjekcija() : void {
        this._projekcija = [[1, 0, 0, 0],
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
        this._kamera_poz = [x0, y0, z0];
        //x0 y0 z0 : globalni ks
        // x1 y1 z1 : kamera gleda prema tocki
        //Vx Vy Vz: view up vektor

        // postaviKameru postavlja matricu transformacije

                let nx = x0 - x1;
            let ny = y0 - y1;
            let nz = z0 - z1;
            const nl = Math.hypot(nx, ny, nz) || 1;
            nx /= nl; ny /= nl; nz /= nl;

            // 2. u = normalize(up × n)
            let Ux = Vy * nz - Vz * ny;
            let Uy = Vz * nx - Vx * nz;
            let Uz = Vx * ny - Vy * nx;
            const ul = Math.hypot(Ux, Uy, Uz) || 1;
            Ux /= ul; Uy /= ul; Uz /= ul;

            // 3. v = n × u
            const vx = ny * Uz - nz * Uy;
            const vy = nz * Ux - nx * Uz;
            const vz = nx * Uy - ny * Ux;

            // 4. dot products for translation
            const tx = -(Ux * x0 + Uy * y0 + Uz * z0);
            const ty = -(vx * x0 + vy * y0 + vz * z0);
            const tz = -(nx * x0 + ny * y0 + nz * z0);

            // 5. assign _kamera directly
            this._kamera = [
                [Ux, Uy, Uz, tx],
                [vx, vy, vz, ty],
                [nx, ny, nz, tz],
                [0, 0, 0, 1]
            ];

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

    orto(xmin: number, xmax: number, ymin: number, ymax: number, zpr: number, zst: number) {
        let sx = 2 / (xmax - xmin);
    let sy = 2 / (ymax - ymin);
    let sz = -2 / (zst - zpr);

    let px = -(xmax + xmin) / (xmax - xmin);
    let py = -(ymax + ymin) / (ymax - ymin);
    let pz = -(zst + zpr) / (zst - zpr);

    this._projekcija = [
        [sx,0,0,px],
        [0,sy,0,py],
        [0,0,sz,pz],
        [0,0,0,1]
        ];
    }

    
   persp(xmin:number, xmax:number, ymin:number, ymax:number, zpr:number, zst:number) {
        const l = xmin, r = xmax, b = ymin, t = ymax, n = zpr, f = zst;
        const rl = r - l, tb = t - b, fn = f - n;


    // Prevent division by zero
    if (rl === 0 || tb === 0 || fn === 0 || n <= 0 || f <= 0) {
        this._projekcija = [
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1]
        ];
        return;
    }

    this._projekcija = [
        [(2*n)/rl, 0, (r+l)/rl, 0],
        [0, (2*n)/tb, (t+b)/tb, 0],
        [0, 0, -(f+n)/fn, (-2*f*n)/fn],
        [0, 0, -1, 0]
    ];
}


}
