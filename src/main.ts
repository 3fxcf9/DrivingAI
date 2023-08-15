import { Vector2 } from "./utils/vector.js";
import { canvasArrow } from "./utils/canvasArrow.js";
import { Car } from "./classes/car.js";
import { Track } from "./classes/track.js";

class Game {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	keys: Set<string>;

	car: Car;
	track: Track;

	last_frame: number;
	last_deltas: number[];
	current_fps: number;

	constructor() {
		globalThis.game = this;

		this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
		window.addEventListener("resize", this.#resizeCanvas);
		this.#resizeCanvas();

		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

		// Controls
		this.keys = new Set<string>();

		document.addEventListener(
			"keydown",
			(e) => {
				this.keys.add(e.code);
			},
			false
		);
		document.addEventListener(
			"keyup",
			(e) => {
				this.keys.delete(e.code);
			},
			false
		);
		// Init classes
		this.car = new Car({ x: 0, y: 0, bot: false });
		this.track = new Track();

		// Launch the game
		this.last_frame = performance.now();
		this.last_deltas = [];
		this.current_fps = 0;
		this.#render();
	}

	#resizeCanvas() {
		this.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		this.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	}

	reset() {
		this.ctx.setTransform(1, 0, 0, -1, this.canvas.width / 2, this.canvas.height / 2);
		this.ctx.strokeStyle = "white";
		this.ctx.lineWidth = 1;
		this.ctx.textAlign = "left";
		this.ctx.textBaseline = "hanging";
	}

	clear() {
		this.ctx.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
	}

	#render = () => {
		this.clear();

		const now_time = performance.now();
		const delta = (now_time - this.last_frame) / 1000;
		this.last_frame = now_time;

		if (this.last_deltas.reduce((a, b) => a + b, 0) < 0.2) {
			this.last_deltas.push(delta);
		} else {
			const meanDelta = this.last_deltas.reduce((a, b) => a + b, 0) / this.last_deltas.length;
			this.current_fps = Math.round(1 / meanDelta);

			this.last_deltas = [];
		}
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.fillStyle = "white";
		this.ctx.font = "bold monospace 2rem";
		this.ctx.textBaseline = "hanging";
		this.ctx.fillText(`${this.current_fps}`, 10, 10);

		this.reset();

		// Axis
		canvasArrow(new Vector2(this.canvas.width, 0), -this.canvas.width / 2, 0, "white");
		canvasArrow(new Vector2(0, this.canvas.height), 0, -this.canvas.height / 2, "white");

		this.track.render();
		this.car.render(delta);

		requestAnimationFrame(this.#render);
	};
}

new Game();
