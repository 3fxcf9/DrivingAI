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

	// Raycast
	debugView: boolean;

	raycastAngles: number[];

	debugCtx: CanvasRenderingContext2D | null; // Debug raycast view

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

		// -------- Raycast --------
		this.debugView = false; // Change this

		this.raycastAngles = [];
		for (let i = -1.3; i < 1.3; i += 0.2) this.raycastAngles.push(i);

		// Debug raycast view
		this.debugCtx = null;
		if (this.debugView) {
			const debugPopup = window.open("", "Car view", "width=400,height=500");
			if (!debugPopup) this.debugView = false;
			else {
				debugPopup.document.body.style.margin = "0";
				const debugCanvas = debugPopup.document.createElement("canvas");
				debugCanvas.width = 400;
				debugCanvas.height = 500;
				debugPopup.document.body.appendChild(debugCanvas);
				this.debugCtx = debugCanvas.getContext("2d") as CanvasRenderingContext2D;
			}
		}
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
		// Translate origin to the front of the car
		const centerToFront = headingUnitVector.copy().multiply(15);
		origin.x += centerToFront.x;
		origin.y += centerToFront.y;

		function getUnitPoint(angle: number) {
			const unitRotated = headingUnitVector.copy().rotate(angle).multiply(50);
			return new Point(origin.x + unitRotated.x, origin.y + unitRotated.y);
		}

		const points = this.raycastAngles.map((a) => getUnitPoint(a));
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

		// Display rays and intersection points
		if (this.debugView) {
			for (const { p } of distances) {
				if (!p) continue;

				line(origin, p, "blue");
				p.display("red");
			}
		}

		// Debug raycast view
		if (this.debugView) {
			console.log(this.debugCtx);

			const rectWidth = Math.round(this.debugCtx!.canvas.width / distances.length);
			const rectHeights = distances.map(({ d }) => {
				return { h: this.debugCtx!.canvas.height / (d + 1) ** 2, c: 255 / (d + 1) ** 2 + 20 };
			});

			this.debugCtx!.fillStyle = "black";
			this.debugCtx!.fillRect(0, 0, this.debugCtx!.canvas.width, this.debugCtx!.canvas.height);

			// Sky
			this.debugCtx!.fillStyle = "#00609f";
			this.debugCtx!.fillRect(0, 0, this.debugCtx!.canvas.width, this.debugCtx!.canvas.height / 2);

			rectHeights.forEach(({ h, c }, i) => {
				this.debugCtx!.fillStyle = `rgba(${c}, ${c}, ${c})`;
				this.debugCtx!.fillRect(i * rectWidth, (this.debugCtx!.canvas.height - h) / 2, rectWidth, h);
			});

			// Border
			this.debugCtx!.strokeStyle = this.color;
			this.debugCtx!.lineWidth = 2;
			this.debugCtx!.strokeRect(2, 2, this.debugCtx!.canvas.width - 2, this.debugCtx!.canvas.height - 2);
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

	checkControls(controls?: [number, number, number, number]) {
		return [
			controls?.[0] || globalThis.game.keys.has("KeyW"),
			controls?.[1] || globalThis.game.keys.has("KeyA"),
			controls?.[2] || globalThis.game.keys.has("KeyD"),
			controls?.[3] || globalThis.game.keys.has("KeyS"),
		];
	}

	render(delta: number, controls?: [number, number, number, number]) {
		const [upPressed, leftPressed, rightPressed, downPressed] = this.checkControls(controls);

		let forces = Vector2.NULL();
		const headingUnitVector = Vector2.UNIT().setAngle(this.heading);

		// Forward
		let acceleration = Vector2.NULL();
		if (upPressed) {
			acceleration = headingUnitVector.copy().multiply(this.acceleration);
		}

		// Drag
		const drag = headingUnitVector
			.copy()
			.multiply(-1)
			.multiply(this.drag_hardness * this.velocity.magnitude ** 2 * this.drag_coefficient);

		if (downPressed) {
			drag.add(
				headingUnitVector
					.copy()
					.multiply(-1)
					.multiply(this.velocity.magnitude * this.braking_coefficient)
			);
		}

		// Left
		this.wheels_angle = 0;
		if (leftPressed) {
			this.wheels_angle = -this.wheel_rotation_angle;
		}
		// Right
		if (rightPressed) {
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
