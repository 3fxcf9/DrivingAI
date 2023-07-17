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
		this.car = new Car(0, 0);
		this.track = new Track();

		// Launch the game
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
	}

	clear() {
		this.ctx.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
	}

	#render = () => {
		requestAnimationFrame(this.#render);

		this.reset();
		this.clear();

		// Axis
		canvasArrow(new Vector2(this.canvas.width, 0), -this.canvas.width / 2, 0, "white");
		canvasArrow(new Vector2(0, this.canvas.height), 0, -this.canvas.height / 2, "white");

		this.track.render();
		this.car.render();
	};
}

new Game();
