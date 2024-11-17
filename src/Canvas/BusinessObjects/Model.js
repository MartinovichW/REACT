import Point3D from './Point3D';

export default class Model {
    constructor() {
        this.originalPoints = Array.from({ length: 152 }, () => new Point3D(0.0, 0.0, 0.0));
        this.projectionPoints = Array.from({ length: 152 }, () => new Point3D(0.0, 0.0, 0.0));
        this.allPoints = this.originalPoints.map((point, index) => [point, this.projectionPoints[index]]);

        this.S = 30.0;
        this.PI = -1.0 * Math.PI / 180.0;
        this.currentProjection = "Z";
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
        this.DX = 0.0;
        this.DY = 0.0;
        this.LX = 0.0;
        this.LY = 0.0;
        this.LZ = 0.0;
        this.S = 30;
        this.LightMode = "Off";
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

        this.originalPoints[0] = { X: this.DX, Y: this.DY, Z: 0 };
        this.originalPoints[1] = { X: this.DX, Y: y, Z: 0 };
        this.originalPoints[2] = { X: x, Y: y, Z: 0 };
        this.originalPoints[3] = { X: x, Y: this.DY, Z: 0 };
        this.originalPoints[4] = { X: x, Y: this.DY, Z: z };
        this.originalPoints[5] = { X: x, Y: y, Z: z };
        this.originalPoints[6] = { X: this.DX, Y: y, Z: z };
        this.originalPoints[7] = { X: this.DX, Y: this.DY, Z: z };

        let inc = 360 / this.N, alpha1, alpha2 = inc;

        for (let i = 8; i < 8 + this.N; i++) {
            alpha1 = alpha2 * Math.PI / 180;
            x = this.DX + ((this.R * Math.cos(alpha1) + this.dX) * this.S);
            y = this.DY - (this.C * this.S);
            z = (this.R * Math.sin(alpha1) + this.dZ) * this.S;

            this.originalPoints[i] = { X: x, Y: this.DY, Z: z };
            this.originalPoints[i + this.N] = { X: x, Y: y, Z: z };

            alpha2 += inc;
        }

        // CalculateProjection(CurrentProjection);
    }
}