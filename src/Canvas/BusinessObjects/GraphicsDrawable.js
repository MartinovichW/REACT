import Model from './Model';

export default class GraphicsDrawable {
    constructor(canvasRef) {
        this.model = new Model();
        this.canvas = canvasRef;
    }

    draw() {
        const canvas = this.canvas;
        const width = canvas.current.clientWidth;
        const height = canvas.current.clientHeight;
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

    drawSystem(canvas, size) {
        const dx = this.model.DX;
        const dy = this.model.DY;
        const scale = this.model.S;
        const ctx = canvas.current.getContext('2d');

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
        ctx.fillStyle = 'blue';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

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

    drawModel(canvas, model) {
        const ctx = canvas.current.getContext('2d');
        const countPoints = model.countPoints;

        if (model.LightMode !== 'Off') {
            //calculateLight(ctx);
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
        //ctx.closePath();
        ctx.stroke();

        for (let i = 8; i < 8 + model.N - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(model.p(i + 1).X, model.p(i + 1).Y);
            ctx.lineTo(model.p(i).X, model.p(i).Y);
            ctx.lineTo(model.p(i + model.N).X, model.p(i + model.N).Y);
            ctx.lineTo(model.p(i + model.N + 1).X, model.p(i + model.N + 1).Y);
            //ctx.closePath();
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
        //ctx.closePath();
        ctx.stroke();

        // 2 plain
        ctx.beginPath();
        ctx.moveTo(model.p(2).X, model.p(2).Y);
        ctx.lineTo(model.p(5).X, model.p(5).Y);
        ctx.lineTo(model.p(4).X, model.p(4).Y);
        ctx.lineTo(model.p(3).X, model.p(3).Y);
        //ctx.closePath();
        ctx.stroke();

        // 1 plain
        ctx.beginPath();
        ctx.moveTo(model.p(0).X, model.p(0).Y);
        ctx.lineTo(model.p(1).X, model.p(1).Y);
        ctx.lineTo(model.p(2).X, model.p(2).Y);
        ctx.lineTo(model.p(3).X, model.p(3).Y);
        ctx.lineTo(model.p(0).X, model.p(0).Y);
        //ctx.closePath();
        ctx.stroke();
    }
}