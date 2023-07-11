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

// Controls
// 37, 38, 39, 40 => Left, Top, Right, Down
// 90, 81, 83, 68 => Z, Q, S, D
let keys: { [x: string]: boolean } = {};

function keyDownHandler(e: KeyboardEvent) {
	keys[e.code] = true;
}
function keyUpHandler(e: KeyboardEvent) {
	keys[e.code] = false;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Launch the game
function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
	requestAnimationFrame(draw);
	// clear();
	new Vector2(1, 1).display(ctx, 100, 100);
}

draw();
