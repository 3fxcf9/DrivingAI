import { Vector2 } from "../utils/vector.js";
import { Point } from "../utils/point.js";
import { line } from "../utils/canvasLine.js";
import { reset, track } from "../main.js";
import { intersection, lineSegmentIntersection } from "../utils/segmentsIntersection.js";

export class Car {
	position: Vector2;

	velocity: Vector2;
	heading: number;
	wheels_angle: number;

	acceleration: number;
	maxspeed: number;
	friction: number;
	drag_coefficient: number;
	drag_hardness: number;
	braking_coefficient: number;
	rotation_speed: number;
	direction_angle: number;

	color: string;

	constructor(x: number = 0, y: number = 0, color?: string) {
		this.position = new Vector2(x, y);

		// Variables
		this.velocity = new Vector2(0, 0);
		this.heading = 0;
		this.wheels_angle = 0;

		// Constants
		this.acceleration = 1;
		this.maxspeed = 8;
		this.friction = 0.95;
		this.rotation_speed = 0.08;
		this.direction_angle = 0.1;
		this.drag_coefficient = 0.04;
		this.drag_hardness = 0.2;
		this.braking_coefficient = 0.04;

		this.color = color || "red";
	}

	checkCollision(ctx: CanvasRenderingContext2D) {
		const i = new Vector2(-10, 15).rotate(this.heading);
		const j = new Vector2(10, 15).rotate(this.heading);
		const k = new Vector2(10, -15).rotate(this.heading);
		const l = new Vector2(-10, -15).rotate(this.heading);

		const a = new Point(this.position.x + i.x, this.position.y + i.y);
		const b = new Point(this.position.x + j.x, this.position.y + j.y);
		const c = new Point(this.position.x + k.x, this.position.y + k.y);
		const d = new Point(this.position.x + l.x, this.position.y + l.y);

		// a.display(ctx);
		// b.display(ctx);
		// c.display(ctx);
		// d.display(ctx);

		let game_over = false;
		intersection_detected: for (const path of track.track) {
			for (let i = 1; i < path.length; i++) {
				const trackSegmentPoints: Point[] = [Point.fromArray(track.pointToCoords(path[i - 1])), Point.fromArray(track.pointToCoords(path[i]))];

				const m = intersection(a, b, trackSegmentPoints[0], trackSegmentPoints[1]);
				if (m) {
					m.display(ctx, "brown");
					game_over = true;
					// break intersection_detected;
				}

				const n = intersection(b, c, trackSegmentPoints[0], trackSegmentPoints[1]);
				if (n) {
					n.display(ctx, "brown");
					game_over = true;
					// break intersection_detected;
				}

				const o = intersection(c, d, trackSegmentPoints[0], trackSegmentPoints[1]);
				if (o) {
					o.display(ctx, "brown");
					game_over = true;
					// break intersection_detected;
				}

				const p = intersection(d, a, trackSegmentPoints[0], trackSegmentPoints[1]);
				if (p) {
					p.display(ctx, "brown");
					game_over = true;
					// break intersection_detected;
				}
			}
		}
		if (game_over) {
			this.color = "yellow";
		} else {
			this.color = "red";
		}
	}

	raycast(ctx: CanvasRenderingContext2D) {
		const headingUnitVector = Vector2.UNIT().setAngle(this.heading).multiply(50);

		const origin = new Point(this.position.x, this.position.y);

		const angles = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];
		const points = angles.map((a) => getUnitPoint(a));
		let distances = new Array(points.length).fill(Infinity);

		for (const path of track.track) {
			for (let i = 1; i < path.length; i++) {
				const trackSegmentPoints: Point[] = [Point.fromArray(track.pointToCoords(path[i - 1])), Point.fromArray(track.pointToCoords(path[i]))];

				distances = distances.map((d, i) => {
					const intersection = lineSegmentIntersection(origin, points[i], trackSegmentPoints[0], trackSegmentPoints[1]);

					if (intersection && intersection.t < d) {
						line(ctx, origin, intersection?.point, "blue");
						intersection.point.display(ctx, "red");
						return intersection.t;
					}
					return d;
				});
			}
		}

		function getUnitPoint(angle: number) {
			const unitRotated = headingUnitVector.copy().rotate(angle);
			return new Point(origin.x + unitRotated.x, origin.y + unitRotated.y);
		}
	}

	drawCar(ctx: CanvasRenderingContext2D) {
		reset();

		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(-this.heading);

		ctx.fillStyle = this.color;
		ctx.fillRect(-10, -15, 20, 30);

		reset();

		// // Wheels
		// ctx.fillStyle = "white";

		// ctx.translate(this.position.x - 8, this.position.y - 10);
		// ctx.fillStyle = "black";
		// ctx.fillRect(-2, -5, 7, 12);
		// ctx.rotate(this.wheels_angle);
		// ctx.fillStyle = "white";
		// ctx.fillRect(-3, -5, 6, 10);

		// ctx.setTransform(1, 0, 0, 1, 0, 0);

		// ctx.translate(this.position.x + 8, this.position.y - 10);
		// ctx.fillStyle = "black";
		// ctx.fillRect(-5, -5, 7, 12);
		// ctx.rotate(this.wheels_angle);
		// ctx.fillStyle = "white";
		// ctx.fillRect(-3, -5, 6, 10);

		// ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	render(ctx: CanvasRenderingContext2D, keys: Set<string>) {
		let forces = Vector2.NULL();
		const headingUnitVector = Vector2.UNIT().setAngle(this.heading);

		// Forward
		let acceleration = Vector2.NULL();
		if (keys.has("KeyW")) {
			acceleration = headingUnitVector.copy().multiply(this.acceleration);
		}

		// Drag
		const drag = headingUnitVector
			.copy()
			.multiply(-1)
			.multiply(this.drag_hardness * this.velocity.magnitude ** 2 * this.drag_coefficient);

		if (keys.has("KeyS")) {
			drag.add(
				headingUnitVector
					.copy()
					.multiply(-1)
					.multiply(this.velocity.magnitude ** 2 * this.braking_coefficient)
			);
		}

		// Left
		this.wheels_angle = 0;
		if (keys.has("KeyA")) {
			this.wheels_angle = -1;
		}
		// Right
		if (keys.has("KeyD")) {
			this.wheels_angle = 1;
		}

		let lateral = Vector2.NULL();

		if (this.wheels_angle != 0) {
			// const speed_component = 0.1 * this.velocity.magnitude;

			// const vect_len = speed_component / Math.cos(Math.abs(this.wheels_angle - this.velocity.angle));

			// lateral = this.velocity.copy().normalize().rotate(this.wheels_angle).multiply(vect_len);
			// drag.add(this.velocity.copy().normalize().multiply(-speed_component));

			// console.log(speed_component, vect_len, lateral.copy().projectOn(this.velocity).magnitude);

			lateral = this.velocity
				.copy()
				.normalize()
				.rotate(this.wheels_angle)
				.multiply(this.velocity.magnitude / 10);
			acceleration.substract(lateral.copy().projectOn(acceleration));
		}

		// Move the car
		forces.add(acceleration);
		forces.add(drag);
		forces.add(lateral);

		this.velocity.add(forces);

		this.position.add(this.velocity);

		this.heading = this.velocity.angle;

		// Debug
		// headingUnitVector.multiply(5).display(ctx, this.position.x, this.position.y, "white");
		// this.velocity.copy().multiply(5).display(ctx, this.position.x, this.position.y, "yellow");
		// forces.multiply(50).display(ctx, this.position.x, this.position.y, "green");
		// drag.multiply(5).display(ctx, this.position.x, this.position.y, "red");
		// lateral.copy().multiply(50).display(ctx, this.position.x, this.position.y, "violet");

		this.drawCar(ctx);
		this.raycast(ctx);
		this.checkCollision(ctx);
	}
}
