import Model from './Model';

export default class GraphicsDrawable {
    model: Model;
    canvas: React.RefObject<HTMLCanvasElement>;

    constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
        this.model = new Model();
        this.canvas = canvasRef;
    }

    draw(): void {
        const canvas = this.canvas;
        const width = canvas.current?.clientWidth || 0;
        const height = canvas.current?.clientHeight || 0;
        if (canvas.current) {
            if (canvas.current.width !== width || canvas.current.height !== height) {
                canvas.current.width = width;
                canvas.current.height = height;
            }

            const size = { width: canvas.current.width, height: canvas.current.height };
            const dx = size.width * 0.3;
            const dy = size.height * 0.7;

            this.model.setVariables(dx, dy);

            this.drawSystem(canvas, size);
            this.drawModel(canvas, this.model);
        }
    }

    drawSystem(canvas: React.RefObject<HTMLCanvasElement>, size: { width: number; height: number }): void {
        const dx = this.model.DX;
        const dy = this.model.DY;
        const scale = this.model.S;
        const ctx = canvas.current?.getContext('2d');

        if (ctx) {
            ctx.clearRect(0, 0, size.width, size.height);

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, dy);
            ctx.lineTo(size.width, dy);
            ctx.moveTo(dx, size.height);
            ctx.lineTo(dx, 0);
            ctx.stroke();

            ctx.font = '18px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(this.model.currentProjection === "X" ? "Z" : "X", size.width - 10, dy + 20);
            ctx.fillText(this.model.currentProjection === "Y" ? "Z" : "Y", dx - 20, 10);

            ctx.fillStyle = 'blue';

            for (let i = 1; i <= size.width * 0.7 / scale - 1; i++) {
                ctx.beginPath();
                ctx.moveTo(dx + (scale * i), dy - 5);
                ctx.lineTo(dx + (scale * i), dy + 5);
                ctx.stroke();
                ctx.fillText(i.toString(), dx + (scale * i), dy + 20);
            }
            for (let i = 1; i <= dy / scale - 1; i++) {
                ctx.beginPath();
                ctx.moveTo(dx - 5, dy - (scale * i));
                ctx.lineTo(dx + 6, dy - (scale * i));
                ctx.stroke();
                ctx.fillText(i.toString(), dx - 20, dy - (scale * i));
            }
        }
    }

    drawModel(canvas: React.RefObject<HTMLCanvasElement>, model: Model): void {
        const ctx = canvas.current?.getContext('2d');
        const countPoints = model.countPoints;

        if (!ctx) return;

        if (model.LightMode !== 'Off') {
            this.calculateLight(ctx, model);
            return;
        }

        ctx.fillStyle = 'red';

        for (let i = 0; i < countPoints; i++) {
            const point = model.p(i);
            ctx.beginPath();
            ctx.ellipse(point.X, point.Y, 4, 4, 0, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.strokeStyle = 'orange';

        ctx.beginPath();
        ctx.moveTo(model.p(8).X, model.p(8).Y);
        ctx.lineTo(model.p(8 + model.N - 1).X, model.p(8 + model.N - 1).Y);
        ctx.lineTo(model.p(countPoints - 1).X, model.p(countPoints - 1).Y);
        ctx.lineTo(model.p(8 + model.N).X, model.p(8 + model.N).Y);
        ctx.stroke();

        for (let i = 8; i < 8 + model.N - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(model.p(i + 1).X, model.p(i + 1).Y);
            ctx.lineTo(model.p(i).X, model.p(i).Y);
            ctx.lineTo(model.p(i + model.N).X, model.p(i + model.N).Y);
            ctx.lineTo(model.p(i + model.N + 1).X, model.p(i + model.N + 1).Y);
            ctx.stroke();
        }

        ctx.strokeStyle = 'green';

        // 4 plain
        ctx.beginPath();
        ctx.moveTo(model.p(0).X, model.p(0).Y);
        ctx.lineTo(model.p(7).X, model.p(7).Y);
        ctx.moveTo(model.p(1).X, model.p(1).Y);
        ctx.lineTo(model.p(6).X, model.p(6).Y);
        ctx.stroke();

        // 3 plain
        ctx.beginPath();
        ctx.moveTo(model.p(5).X, model.p(5).Y);
        ctx.lineTo(model.p(6).X, model.p(6).Y);
        ctx.lineTo(model.p(7).X, model.p(7).Y);
        ctx.lineTo(model.p(4).X, model.p(4).Y);
        ctx.stroke();

        // 2 plain
        ctx.beginPath();
        ctx.moveTo(model.p(2).X, model.p(2).Y);
        ctx.lineTo(model.p(5).X, model.p(5).Y);
        ctx.lineTo(model.p(4).X, model.p(4).Y);
        ctx.lineTo(model.p(3).X, model.p(3).Y);
        ctx.stroke();

        // 1 plain
        ctx.beginPath();
        ctx.moveTo(model.p(0).X, model.p(0).Y);
        ctx.lineTo(model.p(1).X, model.p(1).Y);
        ctx.lineTo(model.p(2).X, model.p(2).Y);
        ctx.lineTo(model.p(3).X, model.p(3).Y);
        ctx.lineTo(model.p(0).X, model.p(0).Y);
        ctx.stroke();
    }

    calculateLight(ctx: CanvasRenderingContext2D, model: Model): void {
        const planes = model.getPlanes();
        const n = Array.from({ length: 3 }, () => new Array(planes.length).fill(0));
        const v = Array.from({ length: 3 }, () => new Array(planes.length).fill(0));
        const w = Array.from({ length: 3 }, () => new Array(planes.length).fill(0));

        let x1: number, x2: number, x3: number, y1: number, y2: number, y3: number, z1: number, z2: number, z3: number;
        let a: number, b: number, c: number;
        let tempX = 0, tempY = 0, tempZ = 0;
        const ia = 128, il = 90;
        const ex = (planes[0][0].X + planes[0][3].X) / 2;
        const ey = (planes[0][0].Y + planes[0][1].Y) / 2;
        const ez = 10000;

        planes.forEach((plane, i) => {
            x1 = plane[0].X;
            y1 = plane[0].Y;
            z1 = plane[0].Z;

            x2 = plane[1].X;
            y2 = plane[1].Y;
            z2 = plane[1].Z;

            x3 = plane[2].X;
            y3 = plane[2].Y;
            z3 = plane[2].Z;

            a = (y1 * z2) + (y2 * z3) + (y3 * z1) - (y2 * z1) - (y3 * z2) - (y1 * z3);
            b = (z1 * x2) + (z2 * x3) + (z3 * x1) - (z2 * x1) - (z3 * x2) - (z1 * x3);
            c = (x1 * y2) + (x2 * y3) + (x3 * y1) - (x2 * y1) - (x3 * y2) - (x1 * y3);

            tempX = plane.reduce((sum, s) => sum + s.X, 0) / 4;
            tempY = plane.reduce((sum, s) => sum + s.Y, 0) / 4;
            tempZ = plane.reduce((sum, s) => sum + s.Z, 0) / 4;

            n[0][i] = a;
            n[1][i] = b;
            n[2][i] = c;

            v[0][i] = ex - tempX;
            v[1][i] = ey - tempY;
            v[2][i] = ez - tempZ;

            w[0][i] = model.LX - tempX;
            w[1][i] = model.LY - tempY;
            w[2][i] = model.LZ - tempZ;

            tempX = tempY = tempZ = 0;
        });

        let cosNV: number;
        let cosNW: number;

        ctx.fillStyle = 'blue';
        ctx.strokeStyle = 'red';
        ctx.lineJoin = 'bevel';

        for (let i = 6; i < model.countPlanes; i++) {
            cosNV = this.calculateCOS(n[0][i], n[1][i], n[2][i], v[0][i], v[1][i], v[2][i]) * (180 / Math.PI);
            cosNW = this.calculateCOS(n[0][i], n[1][i], n[2][i], w[0][i], w[1][i], w[2][i]);

            if (!(cosNV > 0 && cosNV < 90) && (cosNW >= -1 && cosNW <= 1)) {
                ctx.beginPath();
                ctx.moveTo(planes[i][0].X, planes[i][0].Y);
                ctx.lineTo(planes[i][1].X, planes[i][1].Y);
                ctx.lineTo(planes[i][2].X, planes[i][2].Y);
                ctx.lineTo(planes[i][3].X, planes[i][3].Y);
                ctx.closePath();

                if (model.LightMode === "On") {
                    const intensity = Math.round(ia + il * cosNW);
                    ctx.fillStyle = this.colorFromRgb(intensity);
                    ctx.fill();
                } else {
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }

        ctx.fillStyle = 'orange';
        ctx.strokeStyle = 'green';

        for (let i = 0; i < 6; i++) {
            cosNV = this.calculateCOS(n[0][i], n[1][i], n[2][i], v[0][i], v[1][i], v[2][i]) * (180 / Math.PI);
            cosNW = this.calculateCOS(n[0][i], n[1][i], n[2][i], w[0][i], w[1][i], w[2][i]);

            if (cosNV >= 0 && cosNV < 90 && cosNW >= -1 && cosNW <= 1) {
                if (i > 3) {
                    ctx.beginPath();
                    ctx.moveTo(planes[i][0].X, planes[i][0].Y);
                    ctx.lineTo(planes[i][1].X, planes[i][1].Y);
                    ctx.lineTo(planes[i][2].X, planes[i][2].Y);
                    ctx.lineTo(planes[i][3].X, planes[i][3].Y);
                    ctx.closePath();

                    ctx.moveTo(planes[model.countPlanes - 4 + i][0].X, planes[model.countPlanes - 4 + i][0].Y);
                    planes[model.countPlanes - 4 + i].slice(0, model.N).forEach(p => ctx.lineTo(p.X, p.Y));
                    ctx.closePath();

                    if (model.LightMode === "On") {
                        const intensity = Math.round(255 - (ia + il * cosNW));
                        ctx.fillStyle = this.colorFromRgb(intensity);
                        ctx.fill('evenodd');
                    } else {
                        ctx.fill('evenodd');
                        ctx.stroke();
                    }
                } else {
                    ctx.beginPath();
                    ctx.moveTo(planes[i][0].X, planes[i][0].Y);
                    ctx.lineTo(planes[i][1].X, planes[i][1].Y);
                    ctx.lineTo(planes[i][2].X, planes[i][2].Y);
                    ctx.lineTo(planes[i][3].X, planes[i][3].Y);
                    ctx.closePath();

                    if (model.LightMode === "On") {
                        const intensity = Math.round(255 - (ia + il * cosNW));
                        ctx.fillStyle = this.colorFromRgb(intensity);
                        ctx.fill();
                    } else {
                        ctx.fill();
                        ctx.stroke();
                    }
                }
            }
        }

        if (model.LightMode === "On") {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.ellipse(model.LX, model.LY, 10, 10, 0, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    colorFromRgb(intensity: number): string {
        return `rgb(${intensity}, ${intensity}, ${intensity})`;
    }

    calculateCOS(a: number, b: number, c: number, vx: number, vy: number, vz: number): number {
        return ((a * vx) + (b * vy) + (c * vz)) /
            (Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2)) *
                Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2) + Math.pow(vz, 2)));
    }
}