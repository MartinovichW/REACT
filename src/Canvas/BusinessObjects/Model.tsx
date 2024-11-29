import Point3D from './Point3D';

export default class Model {
    originalPoints: Point3D[];
    projectionPoints: Point3D[];
    allPoints: [Point3D, Point3D][];
    S: number;
    PI: number;
    currentProjection: string;
    DX: number;
    DY: number;
    A: number;
    minA: number;
    B: number;
    minB: number;
    C: number;
    R: number;
    maxR: number;
    dX: number;
    mindX: number;
    maxdX: number;
    dZ: number;
    mindZ: number;
    maxdZ: number;
    N: number;
    MX: number;
    MY: number;
    MZ: number;
    SX: number;
    SY: number;
    SZ: number;
    AX: number;
    AY: number;
    AZ: number;
    PSI: number;
    FI: number;
    Alpha: number;
    L: number;
    LX: number;
    LY: number;
    LZ: number;
    LDX: number;
    LDY: number;
    LDZ: number;
    LightMode: string;

    constructor() {
        this.originalPoints = Array.from({ length: 152 }, () => new Point3D(0.0, 0.0, 0.0));
        this.projectionPoints = Array.from({ length: 152 }, () => new Point3D(0.0, 0.0, 0.0));
        this.allPoints = this.originalPoints.map((point, index) => [point, this.projectionPoints[index]]);

        this.S = 30.0;
        this.PI = -1.0 * Math.PI / 180.0;
        this.currentProjection = "Z";
        this.DX = 0.0;
        this.DY = 0.0;

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

        this.LX = 0.0;
        this.LY = 0.0;
        this.LZ = 0.0;
        this.LDX = 1.0;
        this.LDY = 1.0;
        this.LDZ = 1.0;
        this.LightMode = "Off";
    }

    get countPoints(): number {
        return 8 + (this.N * 2);
    }

    get countPlanes(): number {
        return 6 + this.N;
    }

    get p(): (i: number) => Point3D {
        return (i: number) => {
            return this.currentProjection === "Z" ? this.originalPoints[i] : this.projectionPoints[i];
        };
    }

    setValue(fieldName: string, value: any): void {
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
            case 'LDX':
                this.LDX = value;
                break;
            case 'LDY':
                this.LDY = value;
                break;
            case 'LDZ':
                this.LDZ = value;
                break;
            case 'LightMode':
                this.LightMode = value;
                break;
            default:
                break;
        }
    }

    calculateMinMax(): void {
        this.minA = this.dX + this.R + 1;
        this.minB = this.dZ + this.R + 1;

        this.maxR = Math.min(this.A - this.dX - 1, this.B - this.dZ - 1, this.dX - 1, this.dZ - 1);

        this.mindX = this.R + 1;
        this.mindZ = this.R + 1;
        this.maxdX = this.A - 1 - this.R;
        this.maxdZ = this.B - 1 - this.R;
    }

    setVariables(dx: number, dy: number): void {
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

    calculatePoints(): void {
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

        let inc = 360 / this.N, alpha1: number, alpha2 = inc;

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

    calculateTransformation(command: string): void {
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

    executeTransformation(
        transformationMethod: (point: Point3D, dsax: number, dsay: number, dsaz: number) => [number, number, number, number],
        options: { dsax?: number; dsay?: number; dsaz?: number; dX?: number; dY?: number; dZ?: number } = {}
    ): void {
        const { dsax = 0, dsay = 0, dsaz = 0, dX = 0, dY = 0, dZ = 0 } = options;

        for (let point of this.originalPoints.slice(0, this.countPoints)) {
            const temp = transformationMethod(point, dsax, dsay, dsaz);

            point.X = temp[0] + dX;
            point.Y = temp[1] + dY;
            point.Z = temp[2] + dZ;
        }
    }

    move(p: Point3D, dx: number, dy: number, dz: number): [number, number, number, number] {
        const t = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [dx, dy, dz, 1]
        ];

        const pt: [number, number, number, number] = [
            (p.X * t[0][0]) + (p.Y * t[1][0]) + (p.Z * t[2][0]) + (p.A * t[3][0]),
            (p.X * t[0][1]) + (p.Y * t[1][1]) + (p.Z * t[2][1]) - (p.A * t[3][1]),
            (p.X * t[0][2]) + (p.Y * t[1][2]) + (p.Z * t[2][2]) + (p.A * t[3][2]),
            (p.X * t[0][3]) + (p.Y * t[1][3]) + (p.Z * t[2][3]) + (p.A * t[3][3])
        ];

        return pt;
    }

    scale(p: Point3D, sx: number, sy: number, sz: number): [number, number, number, number] {
        const s = [
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1]
        ];

        const ps: [number, number, number, number] = [
            (p.X * s[0][0]) + (p.Y * s[1][0]) + (p.Z * s[2][0]) + (p.A * s[3][0]),
            (p.X * s[0][1]) + (p.Y * s[1][1]) + (p.Z * s[2][1]) + (p.A * s[3][1]),
            (p.X * s[0][2]) + (p.Y * s[1][2]) + (p.Z * s[2][2]) + (p.A * s[3][2]),
            (p.X * s[0][3]) + (p.Y * s[1][3]) + (p.Z * s[2][3]) + (p.A * s[3][3])
        ];

        return ps;
    }

    rotate(p: Point3D, ax: number, ay: number, az: number): [number, number, number, number] {
        const PI = -1.0 * Math.PI / 180.0;

        if (ax !== 0) {
            const rx = [
                [1, 0, 0, 0],
                [0, Math.cos(ax * PI), Math.sin(ax * PI), 0],
                [0, -Math.sin(ax * PI), Math.cos(ax * PI), 0],
                [0, 0, 0, 1]
            ];

            const pr: [number, number, number, number] = [
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

            const pr: [number, number, number, number] = [
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

            const pr: [number, number, number, number] = [
                (p.X * rz[0][0]) + (p.Y * rz[1][0]) + (p.Z * rz[2][0]) - (p.A * rz[3][0]),
                (p.X * rz[0][1]) + (p.Y * rz[1][1]) + (p.Z * rz[2][1]) + (p.A * rz[3][1]),
                (p.X * rz[0][2]) + (p.Y * rz[1][2]) + (p.Z * rz[2][2]) + (p.A * rz[3][2]),
                (p.X * rz[0][3]) + (p.Y * rz[1][3]) + (p.Z * rz[2][3]) + (p.A * rz[3][3])
            ];

            return pr;
        }

        return [0, 0, 0, 0];
    }

    calculateProjection(projection: string): void {
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

    projectionMethod(
        matrix: number[][],
        projection: string,
        options: { dX?: number; dY?: number } = {}
    ): void {
        const { dX = 0, dY = 0 } = options;
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

    refreshProjectionPoints(): void {
        for (let [orig, proj] of this.allPoints.slice(0, this.countPoints)) {
            proj.X = orig.X;
            proj.Y = orig.Y;
            proj.Z = orig.Z;
        }
    }

    calculateLight(command: string): void {
        switch (command) {
            case "41":
                this.LX += this.LDX * this.S * -1;
                break;
            case "42":
                this.LX += this.LDX * this.S;
                break;
            case "43":
                this.LY += this.LDY * this.S;
                break;
            case "44":
                this.LY += this.LDY * this.S * -1;
                break;
            case "45":
                this.LZ += this.LDZ * this.S * -1;
                break;
            case "46":
                this.LZ += this.LDZ * this.S;
                break;
            default:
                break;
        }

        this.calculateProjection(this.currentProjection);
    }

    getPlanes(): Point3D[][] {
        const plainPoint: number[][] = [
            [0, 1, 2, 3],
            [3, 2, 5, 4],
            [4, 5, 6, 7],
            [7, 6, 1, 0],
            [0, 3, 4, 7],
            [1, 6, 5, 2],
            [8, this.countPoints - this.N, this.countPoints - this.N + 1, 9],
            [this.countPoints - this.N - 1, this.countPoints - 1, this.countPoints - this.N, 8]
        ];

        const rowLength = plainPoint.length;
        const colLength = plainPoint[0].length;
        const planes: Point3D[][] = [];

        for (let i = 0; i < rowLength - 2; i++) {
            planes.push([]);
            for (let j = 0; j < colLength; j++) {
                planes[i].push(this.p(plainPoint[i][j]));
            }
        }

        for (let i = rowLength - 2; i < this.countPlanes - 1; i++) {
            planes.push([]);
            for (let j = 0; j < colLength; j++) {
                planes[i].push(this.p(plainPoint[6][j]));
            }

            plainPoint[6][0] += 1;
            plainPoint[6][1] += 1;
            plainPoint[6][2] += 1;
            plainPoint[6][3] += 1;
        }

        planes.push([]);
        for (let j = 0; j < colLength; j++) {
            planes[planes.length - 1].push(this.p(plainPoint[7][j]));
        }

        planes.push([]);
        planes.push([]);
        for (let j = 8; j < 8 + this.N; j++) {
            planes[planes.length - 2].push(this.p(j));
            planes[planes.length - 1].push(this.p(j + this.N));
        }

        return planes;
    }
}