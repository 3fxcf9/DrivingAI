import { Vector2 } from "../utils/vector.js";

export class Car {
	position: Vector2;
	velocity: Vector2;
	acceleration: Vector2;

	maxspeed: number;

	color: string;

	constructor(x: number = 0, y: number = 0, color?: string) {
		this.position = new Vector2(x, y);
		this.velocity = new Vector2(1, 1);
		this.acceleration = new Vector2(0, 0);

		this.color = color || "red";
		this.maxspeed = 10;
	}

	drawCar(ctx: CanvasRenderingContext2D) {
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(Vector2.angle(new Vector2(0, 1), this.velocity));

		ctx.fillStyle = this.color;
		ctx.fillRect(-10, -15, 20, 30);

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	render(ctx: CanvasRenderingContext2D) {
		this.drawCar(ctx);
	}
}
