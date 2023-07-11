import { canvasArrow } from "./canvasArrow.js";

export class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	copy() {
		return new Vector2(this.x, this.y);
	}

	add(vector: Vector2) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}

	substract(vector: Vector2) {
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	}

	multiply(scalar: number) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	get magnitude() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	normalize() {
		this.multiply(1 / this.magnitude);
		return this;
	}

	get normalized() {
		const copy = this.copy();
		copy.normalize();
		return copy;
	}

	display(ctx: CanvasRenderingContext2D, origin_x: number, origin_y: number, color?: string) {
		canvasArrow(ctx, this.copy().multiply(20), origin_x, origin_y, color);
	}

	static dot(u: Vector2, v: Vector2) {
		return u.x * v.x + u.y * v.y;
	}

	static angle(u: Vector2, v: Vector2) {
		const dot = Vector2.dot(u, v);
		const magnitude_product = u.magnitude * v.magnitude;

		return Math.acos(dot / magnitude_product);
	}
}
