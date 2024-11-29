export default class Point3D {
    X: number;
    Y: number;
    Z: number;
    A: number;

    constructor(x: number, y: number, z: number) {
        this.X = x;
        this.Y = y;
        this.Z = z;
        this.A = 1.0;
    }
}