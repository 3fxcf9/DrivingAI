import { Vector2 } from "./utils/vector.js";
import { canvasArrow } from "./utils/canvasArrow.js";
import { Car } from "./classes/car.js";
import { Track } from "./classes/track.js";

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// Dynamic canvas size
function resizeCanvas() {
	canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export function reset() {
	if (!canvas || !ctx) return console.log("Reset error");
	ctx.setTransform(1, 0, 0, -1, canvas.width / 2, canvas.height / 2);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 1;
}
function clear() {
	ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
}

// Controls
// 37, 38, 39, 40 => Left, Top, Right, Down
// 90, 81, 83, 68 => Z, Q, S, D
const keys = new Set<string>();

function keyDownHandler(e: KeyboardEvent) {
	keys.add(e.code);
}
function keyUpHandler(e: KeyboardEvent) {
	keys.delete(e.code);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Init classes
const car = new Car(0, 0);
export const track = new Track();

// Launch the game
function draw() {
	requestAnimationFrame(draw);
	reset();
	clear();

	// Axis
	canvasArrow(ctx, new Vector2(canvas.width, 0), -canvas.width / 2, 0, "white");
	canvasArrow(ctx, new Vector2(0, canvas.height), 0, -canvas.height / 2, "white");

	track.render(ctx);
	car.render(ctx, keys);
}

draw();
