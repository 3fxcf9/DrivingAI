import { Vector2 } from "../utils/vector.js";
import { Point } from "../utils/point.js";
import { line } from "../utils/canvasLine.js";
import { intersection, lineSegmentIntersection } from "../utils/segmentsIntersection.js";

export class Car {
	position: Vector2;

	velocity: Vector2;
	heading: number;
	wheels_angle: number;

	acceleration: number;
	drag_coefficient: number;
	drag_hardness: number;
	braking_coefficient: number;
	rotation_speed: number;
	wheel_rotation_angle: number;

	color: string;

	constructor(x: number = 0, y: number = 0, color?: string) {
		this.position = new Vector2(x, y);

		// Variables
		this.velocity = new Vector2(0, 0);
		this.heading = 0;
		this.wheels_angle = 0;

		// Constants
		this.acceleration = 100;
		this.braking_coefficient = 4;

		this.rotation_speed = 6;
		this.wheel_rotation_angle = 1;

		this.drag_hardness = 0.2;
		this.drag_coefficient = 4;

		this.color = color || "red";
	}

	checkCollision() {
		const i = new Vector2(-10, 15).rotate(this.heading);
		const j = new Vector2(10, 15).rotate(this.heading);
		const k = new Vector2(10, -15).rotate(this.heading);
		const l = new Vector2(-10, -15).rotate(this.heading);

		const a = new Point(this.position.x + i.x, this.position.y + i.y);
		const b = new Point(this.position.x + j.x, this.position.y + j.y);
		const c = new Point(this.position.x + k.x, this.position.y + k.y);
		const d = new Point(this.position.x + l.x, this.position.y + l.y);

		let game_over = false;
		intersection_detected: for (const path of globalThis.game.track.track) {
			for (let i = 1; i < path.length; i++) {
				const trackSegmentPoints: Point[] = [globalThis.game.track.trackCoordsToPoint(path[i - 1]), globalThis.game.track.trackCoordsToPoint(path[i])];

				const m = intersection(a, b, trackSegmentPoints[0], trackSegmentPoints[1]);
				if (m) {
					m.display("brown");
					game_over = true;
					// break intersection_detected;
				}

				const n = intersection(b, c, trackSegmentPoints[0], trackSegmentPoints[1]);
				if (n) {
					n.display("brown");
					game_over = true;
					// break intersection_detected;
				}

				const o = intersection(c, d, trackSegmentPoints[0], trackSegmentPoints[1]);
				if (o) {
					o.display("brown");
					game_over = true;
					// break intersection_detected;
				}

				const p = intersection(d, a, trackSegmentPoints[0], trackSegmentPoints[1]);
				if (p) {
					p.display("brown");
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

	raycast() {
		const headingUnitVector = Vector2.UNIT().setAngle(this.heading);

		const origin = new Point(this.position.x, this.position.y);
		// +15
		const centerToFront = headingUnitVector.copy().multiply(15);
		origin.x += centerToFront.x;
		origin.y += centerToFront.y;

		let angles = [];
		for (let i = -1.5; i < 1.5; i += 0.02) angles.push(i);
		// const angles = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];
		const points = angles.map((a) => getUnitPoint(a));
		let distances = new Array(points.length).fill({ d: Infinity, p: undefined });

		for (const path of globalThis.game.track.track) {
			for (let i = 1; i < path.length; i++) {
				const trackSegmentPoints: Point[] = [globalThis.game.track.trackCoordsToPoint(path[i - 1]), globalThis.game.track.trackCoordsToPoint(path[i])];

				distances = distances.map(({ d, p }, i) => {
					const intersection = lineSegmentIntersection(origin, points[i], trackSegmentPoints[0], trackSegmentPoints[1]);

					if (intersection && intersection.t < d) {
						return { d: intersection.t, p: intersection.point };
					}
					return { d, p };
				});
			}
		}

		for (const { p } of distances) {
			if (!p) continue;

			line(origin, p, "blue");
			p.display("red");
		}

		// globalThis.game.ctx.setTransform(1, 0, 0, 1, 0, 0);
		// globalThis.game.ctx.fillStyle = "white";
		// globalThis.game.ctx.font = "1.2rem bold monospace";
		// globalThis.game.ctx.textAlign = "center";
		// globalThis.game.ctx.fillText(`[${distances.map(({ d }) => Math.round(d)).join("|")}]`, globalThis.game.canvas.width / 2, 10);
		// globalThis.game.reset();

		const visuSize = [400, 500];
		const visuXOrigin = -globalThis.game.canvas.width / 2;
		const rectWidth = Math.round(visuSize[0] / distances.length);
		const rectHeights = distances.map(({ d }) => {
			return { h: visuSize[1] / (d + 1) ** 2, c: 255 / (d + 1) ** 2 + 20 };
		});

		globalThis.game.ctx.fillStyle = "black";
		globalThis.game.ctx.strokeStyle = this.color;
		globalThis.game.ctx.lineWidth = 2;
		globalThis.game.ctx.fillRect(visuXOrigin, -visuSize[1] / 2, rectWidth * distances.length + 1, visuSize[1]);
		globalThis.game.ctx.strokeRect(visuXOrigin, -visuSize[1] / 2, rectWidth * distances.length + 1, visuSize[1]);

		rectHeights.forEach(({ h, c }, i) => {
			globalThis.game.ctx.fillStyle = `rgba(${c}, ${c}, ${c})`;
			globalThis.game.ctx.fillRect(visuXOrigin + i * rectWidth, -h / 2, rectWidth, h);
		});

		function getUnitPoint(angle: number) {
			const unitRotated = headingUnitVector.copy().rotate(angle).multiply(50);
			return new Point(origin.x + unitRotated.x, origin.y + unitRotated.y);
		}
	}

	drawCar() {
		globalThis.game.reset();

		globalThis.game.ctx.translate(this.position.x, this.position.y);
		globalThis.game.ctx.rotate(-this.heading);

		globalThis.game.ctx.fillStyle = this.color;
		globalThis.game.ctx.fillRect(-10, -15, 20, 30);

		globalThis.game.reset();
	}

	render(delta: number) {
		let forces = Vector2.NULL();
		const headingUnitVector = Vector2.UNIT().setAngle(this.heading);

		// Forward
		let acceleration = Vector2.NULL();
		if (globalThis.game.keys.has("KeyW")) {
			acceleration = headingUnitVector.copy().multiply(this.acceleration);
		}

		// Drag
		const drag = headingUnitVector
			.copy()
			.multiply(-1)
			.multiply(this.drag_hardness * this.velocity.magnitude ** 2 * this.drag_coefficient);

		if (globalThis.game.keys.has("KeyS")) {
			drag.add(
				headingUnitVector
					.copy()
					.multiply(-1)
					.multiply(this.velocity.magnitude * this.braking_coefficient)
			);
		}

		// Left
		this.wheels_angle = 0;
		if (globalThis.game.keys.has("KeyA")) {
			this.wheels_angle = -this.wheel_rotation_angle;
		}
		// Right
		if (globalThis.game.keys.has("KeyD")) {
			this.wheels_angle = this.wheel_rotation_angle;
		}

		let lateral = Vector2.NULL();

		if (this.wheels_angle != 0) {
			lateral = this.velocity
				.copy()
				.normalize()
				.rotate(this.wheels_angle)
				.multiply(this.velocity.magnitude * this.rotation_speed);
			acceleration.substract(lateral.copy().projectOn(acceleration));
		}

		// Move the car
		forces.add(acceleration);
		forces.add(drag);
		forces.add(lateral);

		forces.multiply(delta);

		this.velocity.add(forces);

		this.position.add(this.velocity);

		this.heading = this.velocity.angle;

		// Debug
		// headingUnitVector.multiply(5).display(ctx, this.position.x, this.position.y, "white");
		// this.velocity.copy().multiply(5).display(ctx, this.position.x, this.position.y, "yellow");
		// forces.multiply(50).display(ctx, this.position.x, this.position.y, "green");
		// drag.multiply(5).display(ctx, this.position.x, this.position.y, "red");
		// lateral.copy().multiply(50).display(ctx, this.position.x, this.position.y, "violet");

		this.drawCar();
		this.raycast();
		this.checkCollision();
	}
}
