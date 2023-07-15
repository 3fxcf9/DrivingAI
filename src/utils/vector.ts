import { canvasArrow } from "./canvasArrow.js";

export class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static NULL() {
		return new this(0, 0);
	}
	static UNIT() {
		return new this(1, 0);
	}
	static UP() {
		return new this(0, 1);
	}
	static DOWN() {
		return new this(0, -1);
	}
	static LEFT() {
		return new this(-1, 0);
	}
	static RIGHT() {
		return new this(1, 0);
	}

	copy() {
		return new Vector2(this.x, this.y);
	}

	set(vector: Vector2) {
		[this.x, this.y] = [vector.x, vector.y];
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
		if (this.magnitude == 0) return Vector2.NULL();
		this.multiply(1 / this.magnitude);
		return this;
	}

	get normalized() {
		const copy = this.copy();
		copy.normalize();
		return copy;
	}

	/**
	 * Project vector to another one
	 * @param vector Vector to project on
	 */
	projectOn(vector: Vector2) {
		const projection = vector
			.copy()
			.normalize()
			.multiply(this.magnitude * Math.cos(Math.abs(this.angle - vector.angle)));

		this.set(projection);
		return this;
	}

	static dot(u: Vector2, v: Vector2) {
		return u.x * v.x + u.y * v.y;
	}

	setLength(length: number) {
		this.normalize().multiply(length);
		return this;
	}

	/**
	 * Set vector direction
	 * @param angle The angle from the vertical in gradients
	 */
	setAngle(angle: number) {
		const mag = this.magnitude;
		this.x = Math.cos(Math.PI / 2 - angle);
		this.y = Math.sin(Math.PI / 2 - angle);
		this.multiply(mag);
		return this;
	}

	/**
	 * Rotate a vector preserving its length
	 * @param angle The angle in radians
	 */
	rotate(angle: number) {
		this.setAngle(this.angle + angle);
		return this;
	}

	display(ctx: CanvasRenderingContext2D, origin_x: number, origin_y: number, color?: string) {
		canvasArrow(ctx, this.copy().multiply(20), origin_x, origin_y, color);
	}

	get angle() {
		if (this.x > 0) {
			return Math.acos(this.y / this.magnitude) || 0;
			console.log("POSITIVE");
		} else {
			return -Math.acos(this.y / this.magnitude) || 0;
			console.log("NEGATIVE");
		}
	}
}
