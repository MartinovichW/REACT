import Point3D from './Point3D';

export default class Model {
    constructor() {
        this.originalPoints = Array.from({ length: 152 }, () => new Point3D(0.0, 0.0, 0.0));
        this.projectionPoints = Array.from({ length: 152 }, () => new Point3D(0.0, 0.0, 0.0));
        this.allPoints = this.originalPoints.map((point, index) => [point, this.projectionPoints[index]]);

        this.S = 30.0;
        this.PI = -1.0 * Math.PI / 180.0;
        this.currentProjection = "Z";
        this.LightMode = "Off";
        this.DX = 0.0;
        this.DY = 0.0;
        this.LX = 0.0;
        this.LY = 0.0;
        this.LZ = 0.0;

        this.A = 8.0;
        this.minA = 7.0;
        this.B = 8.0;
        this.minB = 7.0;
        this.C = 8.0;
        this.R = 2.0;
        this.maxR = 3.0;
        this.dX = 4.0;
        this.mindX = 3.0;
        this.maxdX = 5.0;
        this.dZ = 4.0;
        this.mindZ = 3.0;
        this.maxdZ = 5.0;
        this.N = 12;

        this.MX = 1.0;
        this.MY = 1.0;
        this.MZ = 1.0;
        this.SX = 0.5;
        this.SY = 0.5;
        this.SZ = 0.5;
        this.AX = 5.0;
        this.AY = 5.0;
        this.AZ = 5.0;

        this.PSI = 30.0;
        this.FI = 30.0;
        this.Alpha = 45.0;
        this.L = 1.0;
    }

    get countPoints() {
        return 8 + (this.N * 2);
    }

    get countPlanes() {
        return 6 + this.N;
    }

    get p() {
        return (i) => {
            return this.currentProjection === "Z" ? this.originalPoints[i] : this.projectionPoints[i];
        };
    }

    setValue(fieldName, value){
        switch (fieldName) {
            case 'A':
                if (this.minA <= value) {
                    this.A = value;
                    this.calculatePoints();
                    this.calculateMinMax();
                }
                break;
            case 'B':
                if (this.minB <= value) {
                    this.B = value;
                    this.calculatePoints();
                    this.calculateMinMax();
                }
                break;
            case 'C':
                this.C = value;
                this.calculatePoints();
                break;
            case 'R':
                if (this.maxR >= value) {
                    this.R = value;
                    this.calculatePoints();
                    this.calculateMinMax();
                }
                break;
            case 'dX':
                if (value <= this.maxdX && value >= this.mindX) {
                    this.dX = value;
                    this.calculatePoints();
                    this.calculateMinMax();
                }
                break;
            case 'dZ':
                if (value <= this.maxdZ && value >= this.mindZ) {
                    this.dZ = value;
                    this.calculatePoints();
                    this.calculateMinMax();
                }
                break;
            case 'N':
                this.N = value;
                this.calculatePoints();
                break;
            case 'MX':
                this.MX = value;
                break;
            case 'MY':
                this.MY = value;
                break;
            case 'MZ':
                this.MZ = value;
                break;
            case 'SX':
                this.SX = value;
                break;
            case 'SY':
                this.SY = value;
                break;
            case 'SZ':
                this.SZ = value;
                break;
            case 'AX':
                this.AX = value;
                break;
            case 'AY':
                this.AY = value;
                break;
            case 'AZ':
                this.AZ = value;
                break;
            case 'PSI':
                this.PSI = value;
                break;
            case 'FI':
                this.FI = value;
                break;
            case 'Alpha':
                this.Alpha = value;
                break;
            case 'L':
                this.L = value;
                break;
            default:
                break;
        }
    }

    calculateMinMax() {
        this.minA = this.dX + this.R + 1;
        this.minB = this.dZ + this.R + 1;

        this.maxR = Math.min(this.A - this.dX - 1, this.B - this.dZ - 1, this.dX - 1, this.dZ - 1);

        this.mindX = this.R + 1;
        this.mindZ = this.R + 1;
        this.maxdX = this.A - 1 - this.R;
        this.maxdZ = this.B - 1 - this.R;
    }

    setVariables(dx, dy) {
        if (dx === 0 && dy === 0) return;

        if (this.DX !== dx || this.DY !== dy) {
            this.DX = dx;
            this.DY = dy;

            this.LX = this.DX;
            this.LY = this.DY;
            this.LZ = -500;

            this.calculatePoints();
        }
    }

    calculatePoints() {
        let x = this.DX + (this.A * this.S);
        let y = this.DY - (this.C * this.S);
        let z = this.B * this.S;

        this.originalPoints[0].X = this.DX;
        this.originalPoints[0].Y = this.DY;
        this.originalPoints[0].Z = 0;

        this.originalPoints[1].X = this.DX;
        this.originalPoints[1].Y = y;
        this.originalPoints[1].Z = 0;

        this.originalPoints[2].X = x;
        this.originalPoints[2].Y = y;
        this.originalPoints[2].Z = 0;

        this.originalPoints[3].X = x;
        this.originalPoints[3].Y = this.DY;
        this.originalPoints[3].Z = 0;

        this.originalPoints[4].X = x;
        this.originalPoints[4].Y = this.DY;
        this.originalPoints[4].Z = z;

        this.originalPoints[5].X = x;
        this.originalPoints[5].Y = y;
        this.originalPoints[5].Z = z;

        this.originalPoints[6].X = this.DX;
        this.originalPoints[6].Y = y;
        this.originalPoints[6].Z = z;

        this.originalPoints[7].X = this.DX;
        this.originalPoints[7].Y = this.DY;
        this.originalPoints[7].Z = z;

        let inc = 360 / this.N, alpha1, alpha2 = inc;

        for (let i = 8; i < 8 + this.N; i++) {
            alpha1 = alpha2 * Math.PI / 180;
            x = this.DX + ((this.R * Math.cos(alpha1) + this.dX) * this.S);
            y = this.DY - (this.C * this.S);
            z = (this.R * Math.sin(alpha1) + this.dZ) * this.S;

            this.originalPoints[i].X = x;
            this.originalPoints[i].Y = this.DY;
            this.originalPoints[i].Z = z;

            this.originalPoints[i + this.N].X = x;
            this.originalPoints[i + this.N].Y = y;
            this.originalPoints[i + this.N].Z = z;

            alpha2 += inc;
        }

        this.calculateProjection(this.currentProjection);
    }

    calculateTransformation(command) {
        switch (command) {
            case "11":
                this.executeTransformation(this.move, { dsax: this.MX * -1 * this.S });
                break;
            case "12":
                this.executeTransformation(this.move, { dsax: this.MX * this.S });
                break;
            case "13":
                this.executeTransformation(this.move, { dsax: 0, dsay: this.MY * -1 * this.S });
                break;
            case "14":
                this.executeTransformation(this.move, { dsax: 0, dsay: this.MY * this.S });
                break;
            case "15":
                this.executeTransformation(this.move, { dsax: 0, dsay: 0, dsaz: this.MZ * -1 * this.S });
                break;
            case "16":
                this.executeTransformation(this.move, { dsax: 0, dsay: 0, dsaz: this.MZ * this.S });
                break;
            case "21":
                this.executeTransformation(this.scale, { dsax: this.SX, dsay: 1, dsaz: 1, dX: this.originalPoints[0].X * (1 - this.SX) });
                break;
            case "22":
                this.executeTransformation(this.scale, { dsax: 1, dsay: this.SY, dsaz: 1, dY: this.originalPoints[0].Y * (1 - this.SY) });
                break;
            case "23":
                this.executeTransformation(this.scale, { dsax: 1, dsay: 1, dsaz: this.SZ, dZ: this.originalPoints[0].Z * (1 - this.SZ) });
                break;
            case "31":
                this.executeTransformation(this.rotate, {
                    dsax: this.AX * -1,
                    dY: this.originalPoints[0].Y * (1 - Math.cos(this.AX * -1 * this.PI)) +
                        this.originalPoints[0].Z * Math.sin(this.AX * -1 * this.PI),
                    dZ: this.originalPoints[0].Z * (1 - Math.cos(this.AX * -1 * this.PI)) -
                        this.originalPoints[0].Y * Math.sin(this.AX * -1 * this.PI)
                });
                break;
            case "32":
                this.executeTransformation(this.rotate, {
                    dsax: this.AX,
                    dY: this.originalPoints[0].Y * (1 - Math.cos(this.AX * this.PI)) +
                        this.originalPoints[0].Z * Math.sin(this.AX * this.PI),
                    dZ: this.originalPoints[0].Z * (1 - Math.cos(this.AX * this.PI)) -
                        this.originalPoints[0].Y * Math.sin(this.AX * this.PI)
                });
                break;
            case "33":
                this.executeTransformation(this.rotate, {
                    dsay: this.AY * -1,
                    dX: this.originalPoints[0].X * (1 - Math.cos(this.AY * -1 * this.PI)) +
                        this.originalPoints[0].Z * Math.sin(this.AY * -1 * this.PI),
                    dZ: this.originalPoints[0].Z * (1 - Math.cos(this.AY * -1 * this.PI)) -
                        this.originalPoints[0].X * Math.sin(this.AY * -1 * this.PI)
                });
                break;
            case "34":
                this.executeTransformation(this.rotate, {
                    dsay: this.AY,
                    dX: this.originalPoints[0].X * (1 - Math.cos(this.AY * this.PI)) +
                        this.originalPoints[0].Z * Math.sin(this.AY * this.PI),
                    dZ: this.originalPoints[0].Z * (1 - Math.cos(this.AY * this.PI)) -
                        this.originalPoints[0].X * Math.sin(this.AY * this.PI)
                });
                break;
            case "35":
                this.executeTransformation(this.rotate, {
                    dsaz: this.AZ * -1,
                    dX: this.originalPoints[0].X * (1 - Math.cos(this.AZ * -1 * this.PI)) +
                        this.originalPoints[0].Y * Math.sin(this.AZ * -1 * this.PI),
                    dY: this.originalPoints[0].Y * (1 - Math.cos(this.AZ * -1 * this.PI)) -
                        this.originalPoints[0].X * Math.sin(this.AZ * -1 * this.PI)
                });
                break;
            case "36":
                this.executeTransformation(this.rotate, {
                    dsaz: this.AZ,
                    dX: this.originalPoints[0].X * (1 - Math.cos(this.AZ * this.PI)) +
                        this.originalPoints[0].Y * Math.sin(this.AZ * this.PI),
                    dY: this.originalPoints[0].Y * (1 - Math.cos(this.AZ * this.PI)) -
                        this.originalPoints[0].X * Math.sin(this.AZ * this.PI)
                });
                break;
            default:
                break;
        }

        this.calculateProjection(this.currentProjection);
    }

    executeTransformation(transformationMethod, { dsax = 0, dsay = 0, dsaz = 0, dX = 0, dY = 0, dZ = 0 } = { }) {
        for (let point of this.originalPoints.slice(0, this.countPoints)) {
            const temp = transformationMethod(point, dsax, dsay, dsaz);

            point.X = temp[0] + dX;
            point.Y = temp[1] + dY;
            point.Z = temp[2] + dZ;
        }
    }

    move(p, dx, dy, dz) {
        const t = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [dx, dy, dz, 1]
        ];

        const pt = [
            (p.X * t[0][0]) + (p.Y * t[1][0]) + (p.Z * t[2][0]) + (p.A * t[3][0]),
            (p.X * t[0][1]) + (p.Y * t[1][1]) + (p.Z * t[2][1]) - (p.A * t[3][1]),
            (p.X * t[0][2]) + (p.Y * t[1][2]) + (p.Z * t[2][2]) + (p.A * t[3][2]),
            (p.X * t[0][3]) + (p.Y * t[1][3]) + (p.Z * t[2][3]) + (p.A * t[3][3])
        ];

        return pt;
    }

    scale(p, sx, sy, sz) {
        const s = [
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1]
        ];

        const ps = [
            (p.X * s[0][0]) + (p.Y * s[1][0]) + (p.Z * s[2][0]) + (p.A * s[3][0]),
            (p.X * s[0][1]) + (p.Y * s[1][1]) + (p.Z * s[2][1]) + (p.A * s[3][1]),
            (p.X * s[0][2]) + (p.Y * s[1][2]) + (p.Z * s[2][2]) + (p.A * s[3][2]),
            (p.X * s[0][3]) + (p.Y * s[1][3]) + (p.Z * s[2][3]) + (p.A * s[3][3])
        ];

        return ps;
    }

    rotate(p, ax, ay, az) {
        const PI = -1.0 * Math.PI / 180.0;

        if (ax !== 0) {
            const rx = [
                [1, 0, 0, 0],
                [0, Math.cos(ax * PI), Math.sin(ax * PI), 0],
                [0, -Math.sin(ax * PI), Math.cos(ax * PI), 0],
                [0, 0, 0, 1]
            ];

            const pr = [
                (p.X * rx[0][0]) + (p.Y * rx[1][0]) + (p.Z * rx[2][0]) - (p.A * rx[3][0]),
                (p.X * rx[0][1]) + (p.Y * rx[1][1]) + (p.Z * rx[2][1]) + (p.A * rx[3][1]),
                (p.X * rx[0][2]) + (p.Y * rx[1][2]) + (p.Z * rx[2][2]) + (p.A * rx[3][2]),
                (p.X * rx[0][3]) + (p.Y * rx[1][3]) + (p.Z * rx[2][3]) + (p.A * rx[3][3])
            ];

            return pr;
        }

        if (ay !== 0) {
            const ry = [
                [Math.cos(ay * PI), 0, Math.sin(ay * PI), 0],
                [0, 1, 0, 0],
                [-Math.sin(ay * PI), 0, Math.cos(ay * PI), 0],
                [0, 0, 0, 1]
            ];

            const pr = [
                (p.X * ry[0][0]) + (p.Y * ry[1][0]) + (p.Z * ry[2][0]) - (p.A * ry[3][0]),
                (p.X * ry[0][1]) + (p.Y * ry[1][1]) + (p.Z * ry[2][1]) + (p.A * ry[3][1]),
                (p.X * ry[0][2]) + (p.Y * ry[1][2]) + (p.Z * ry[2][2]) + (p.A * ry[3][2]),
                (p.X * ry[0][3]) + (p.Y * ry[1][3]) + (p.Z * ry[2][3]) + (p.A * ry[3][3])
            ];

            return pr;
        }

        if (az !== 0) {
            const rz = [
                [Math.cos(az * PI), Math.sin(az * PI), 0, 0],
                [-Math.sin(az * PI), Math.cos(az * PI), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ];

            const pr = [
                (p.X * rz[0][0]) + (p.Y * rz[1][0]) + (p.Z * rz[2][0]) - (p.A * rz[3][0]),
                (p.X * rz[0][1]) + (p.Y * rz[1][1]) + (p.Z * rz[2][1]) + (p.A * rz[3][1]),
                (p.X * rz[0][2]) + (p.Y * rz[1][2]) + (p.Z * rz[2][2]) + (p.A * rz[3][2]),
                (p.X * rz[0][3]) + (p.Y * rz[1][3]) + (p.Z * rz[2][3]) + (p.A * rz[3][3])
            ];

            return pr;
        }

        return [];
    }

    calculateProjection(projection) {
        let px, py, pa, po;

        switch (projection) {
            case "X":
                px = [
                    [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, -1, 0],
                    [0, 0, 0, 1]
                ];

                this.projectionMethod(px, projection, { dX: this.DX });
                break;

            case "Y":
                py = [
                    [1, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, -1, 0],
                    [0, 0, 0, 1]
                ];

                this.projectionMethod(py, projection, { dY: this.DY });
                break;

            case "A":
                pa = [
                    [Math.cos(this.PSI * this.PI), Math.sin(this.FI * this.PI * -1) * Math.sin(this.PSI * this.PI), 0, 0],
                    [0, Math.cos(this.FI * this.PI * -1), 0, 0],
                    [Math.sin(this.PSI * this.PI), -Math.sin(this.FI * this.PI * -1) * Math.cos(this.PSI * this.PI), 0, 0],
                    [0, 0, 0, 1]
                ];

                let dX = this.originalPoints[0].X * (1 - Math.cos(this.PSI * this.PI)) + this.originalPoints[0].Z * Math.sin(this.PSI * this.PI);
                let dY = this.originalPoints[0].Z * (1 - Math.cos(this.PSI * this.PI) * Math.sin(this.FI * this.PI * -1)) - (this.originalPoints[0].X * Math.sin(this.PSI * this.PI) * Math.sin(this.FI * this.PI * -1)) + (this.originalPoints[0].Y * (1 - Math.cos(this.FI * this.PI * -1)));

                this.projectionMethod(pa, projection, { dX: dX, dY: dY });
                break;

            case "O":
                po = [
                    [1, 0, 0, 0],
                    [0, 1, 0, 0],
                    [this.L * Math.cos(this.Alpha * this.PI), this.L * Math.sin(this.Alpha * this.PI), 0, 0],
                    [0, 0, 0, 1]
                ];

                this.projectionMethod(po, projection);
                break;
            default:
                break;
        }

        this.currentProjection = projection;
    }

    projectionMethod(matrix, projection, { dX = 0, dY = 0 } = {}) {
        this.refreshProjectionPoints();

        for (let p of this.projectionPoints.slice(0, this.countPoints)) {
            let pm = [
                (p.X * matrix[0][0]) + (p.Y * matrix[1][0]) + (p.Z * matrix[2][0]) + (p.A * matrix[3][0]),
                (p.X * matrix[0][1]) + (p.Y * matrix[1][1]) + (p.Z * matrix[2][1]) + (p.A * matrix[3][1]),
                (p.X * matrix[0][2]) + (p.Y * matrix[1][2]) + (p.Z * matrix[2][2]) + (p.A * matrix[3][2]),
                (p.X * matrix[0][3]) + (p.Y * matrix[1][3]) + (p.Z * matrix[2][3]) + (p.A * matrix[3][3])
            ];

            p.Z = projection === "X" ? p.X : projection === "Y" ? p.Y : p.Z;
            p.Y = projection === "Y" ? pm[2] + dY : pm[1] + dY;
            p.X = projection === "X" ? pm[2] + dX : pm[0] + dX;
        }
    }

    refreshProjectionPoints() {
        for (let [orig, proj] of this.allPoints.slice(0, this.countPoints)) {
            proj.X = orig.X;
            proj.Y = orig.Y;
            proj.Z = orig.Z;
        }
    }
}