class GKS_s {
    constructor(platno, xmin, xmax, ymin = 0, ymax = 0) {
        this.g = platno.getContext("2d");
        this.w = platno.width;
        this.h = platno.height;
        this.x_min = xmin;
        this.x_max = xmax;
        if (ymin == 0 && ymax == 0) {
            this.y_min = xmin;
            this.y_max = xmax;
            this.s_x = this.w / (this.x_max - this.x_min);
            this.s_y = -this.s_x
            this.p_x = -this.s_x * this.x_min;
            this.p_y = this.h / 2
        } else {
            this.y_min = ymin;
            this.y_max = ymax;
            this.s_x = this.w / (this.x_max - this.x_min);
            this.s_y = -this.h / (this.y_max - this.y_min);
            this.p_x = -this.s_x * this.x_min;
            this.p_y = -this.s_y * this.y_max;

        }

        this._matrica = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]

    }

    nacrtajGlavneOsi(koristiOznake = false, razmak = 1) {
        this.g.beginPath();
        this.g.moveTo(0, this.p_y);
        this.g.lineTo(this.w, this.p_y);
        this.g.moveTo(this.p_x, 0);
        this.g.lineTo(this.p_x, this.h);
        this.g.strokeStyle = "black";
        this.g.lineWidth = 2;
        this.g.stroke()

        this.g.beginPath();
        this.g.lineWidth = 0.5;
        for (let x = this.x_min; x <= this.x_max + 1; x += razmak) {
            var koords = this.vratiPretvoreneKoord(x, 0);
            this.g.moveTo(koords.x, koords.y - razmak * 5);
            this.g.lineTo(koords.x, koords.y + razmak * 5);
        }

        for (let y = this.y_min; y <= this.y_max + 1; y += razmak) {
            var koords = this.vratiPretvoreneKoord(0, y);
            this.g.moveTo(koords.x - razmak * 5, koords.y);
            this.g.lineTo(koords.x + razmak * 5, koords.y);
        }

        this.g.stroke();

        if (koristiOznake == true) {
            this.g.font = "10px Times New Roman";
            var offset = 20;

            for (let x = this.x_min; x <= this.x_max + 1; x += razmak) {
                var koords = this.vratiPretvoreneKoord(x, 0);
                if (x != 0) {

                    this.g.fillText(x, koords.x, koords.y + offset);
                }
            }

            for (let y = this.y_min; y <= this.y_max + 1; y += razmak) {
                var koords = this.vratiPretvoreneKoord(0, y);
                if (y != 0) {
                    this.g.fillText(y, koords.x + offset / 2, koords.y);

                }
            }

        }
    }


    nacrtajGrid(cell_w, cell_h) {
        this.g.beginPath();
        this.g.strokeStyle = "gray"
        this.g.lineWidth = 0.25
        for (let i = this.y_min; i <= this.y_max + 1; i += cell_h) {
            this.postaviNa(this.x_min, i);
            this.linijaDo(this.x_max, i);
            this.povuciLiniju();
        }

        for (let i = this.x_min; i <= this.x_max + 1; i += cell_w) {
            this.postaviNa(i, this.y_min);
            this.linijaDo(i, this.y_max);
            this.povuciLiniju();
        }
    }

    postaviNa(x, y) {
        
        var kords = this.vratiPretvoreneKoord(x, y);
        // beginPath uvijek prije moveTo!
        this.g.beginPath();
        this.g.moveTo(kords.x, kords.y);
    }

    linijaDo(x, y, stroke = false) {
        var kords = this.vratiPretvoreneKoord(x, y);
        this.g.lineTo(kords.x, kords.y);
        this.g.moveTo(kords.x, kords.y);

        if (stroke == true) {
            this.povuciLiniju();
        }

    }

    koristiBoju(c) {
        if (typeof c != "string") {
            alert("boja nije string!");
        }
        this.g.strokeStyle = c;

    }

    korisitDebljinu(c) {
        if (typeof c != "number") {
            alert("debljina nije broj!");
        }

        this.g.lineWidth = c;
    }

    povuciLiniju() {
        this.g.stroke();

    }

    vratiPretvoreneKoord(x, y) {
        // x' = a_00*x + a_01*y + a_02
        // y' = a_10*x + a_11*y + a_12
        var x_trans = this._matrica[0][0]*x + this._matrica[0][1]*y + this._matrica[0][2];
        var y_trans = this._matrica[1][0]*x + this._matrica[1][1]*y + this._matrica[1][2];

        var x_i = this.p_x + this.s_x * x_trans;
        var y_i = this.p_y + this.s_y * y_trans;

        return { x: x_i, y: y_i };
    }

    trans(mat) {
        if (mat instanceof MT2D_s == true) {
            this._matrica = mat._matrica

        } else {
            alert("Nije pružan MT2D objekt");
        }
    }

}

class MT2D_s {

    constructor() {

        this._matrica = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }

    identitet() {
        this._matrica = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }

    pomakni(px, py) {
        let t = [[1, 0, px], [0, 1, py], [0, 0, 1]];
        this.mult(t);
    }

    skaliraj(sx, sy) {
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

    rotiraj(kut) {
        let r = [
            [Math.cos(kut), -Math.sin(kut), 0],
            [Math.sin(kut), Math.cos(kut), 0],
            [0, 0, 1]
        ];

        this.mult(r);


    }
    //skew
    smicanje(alpha, beta) {
        let sk = [
            [1, Math.tan(beta), 0],
            [Math.tan(alpha), 1, 0],
            [0, 0, 1]
        ];

        this.mult(sk);
    }

    mult(m){
        let m1 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        for (let i = 0; i<3; i++){
            for (let j = 0; j<3; j++){
                for (let k = 0; k<3; k++){
                    m1[i][j] = m1[i][j] + this._matrica[i][k] * m[k][j];
                }
            }
        }
        this._matrica = m1;
        console.log(m);
        console.log(m1);
        console.log(this._matrica);
    }


}

function nacrtajElipsu(gks, a, b, ishodiste = { x: 0, y: 0 }, rezolucija = 0.05) {
    if (!gks || !(gks instanceof GKS_s)) alert("Greška - nema platna!");
    if (!a || !b || typeof a != "number" || typeof b != "number") alert("Nema argumenata!");

    gks.postaviNa(ishodiste.x, ishodiste.y);

    for (let t = 0; t <= 2 * Math.PI + rezolucija; t = t + rezolucija) {
        var x_d = a * Math.cos(t) + ishodiste.x;
        var y_d = b * Math.sin(t) + ishodiste.y;

        if (t == 0) {
            gks.postaviNa(x_d, y_d);
        } else {
            gks.linijaDo(x_d, y_d);

        }

    }
    gks.povuciLiniju();


}

function nacrtajLeptira(gks, rezolucija = 0.05, skaliraj = 1, donja = 0, gornja = Math.PI * 12, ishodiste = { x: 0, y: 0 }) {
    if (!gks || !(gks instanceof GKS_s)) alert("Greška - nema platna!");

    if (typeof donja != "number" || typeof gornja != "number") alert("Krivi tip argumenta!");
    for (var t = donja; t <= gornja + rezolucija; t = t + rezolucija) {
        var R = (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5));
        var x = R * Math.sin(t) * skaliraj;
        var y = R * Math.cos(t) * skaliraj;
        if (t == donja) {
            gks.postaviNa(x, y);
        } else {
            gks.linijaDo(x, y);
        }


    }


    gks.povuciLiniju();


}

function degToRad(deg){
    return deg * (Math.PI/180);
}

function radToDeg(rad){
    return rad * (180 / Math.PI);

}