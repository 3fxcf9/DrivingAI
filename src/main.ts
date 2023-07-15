import { Car } from "./classes/car.js";
import { canvasArrow } from "./utils/canvasArrow.js";
import { Vector2 } from "./utils/vector.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// Dynamic canvas size
function resizeCanvas() {
	canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export function reset() {
	if (!canvas || !ctx) return console.log("Reset error");
	ctx.setTransform(1, 0, 0, -1, canvas.width / 2, canvas.height / 2);
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

// Launch the game
function draw() {
	requestAnimationFrame(draw);
	reset();
	clear();

	// Axis

	canvasArrow(ctx, new Vector2(canvas.width, 0), -canvas.width / 2, 0, "white");
	canvasArrow(ctx, new Vector2(0, canvas.height), 0, -canvas.height / 2, "white");

	car.render(ctx, keys);
}

draw();
