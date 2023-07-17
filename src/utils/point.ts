import { reset } from "../main.js";

export class Point {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static fromArray(array: [x: number, y: number]) {
		return new Point(array[0], array[1]);
	}

	get toArray(): [x: number, y: number] {
		return [this.x, this.y];
	}

	copy() {
		return new Point(this.x, this.y);
	}

	display(ctx: CanvasRenderingContext2D, color?: string, radius?: number) {
		reset();
		ctx.beginPath();
		ctx.arc(this.x, this.y, radius || 5, 0, Math.PI * 2);
		ctx.fillStyle = color || "white";
		ctx.fill();
		ctx.closePath();
	}
}
