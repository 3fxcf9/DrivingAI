import { Vector2 } from "./utils/vector.js";
import { Car } from "./classes/car.js";

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

// Init classes
const car = new Car(canvas.width / 2, canvas.height / 2);

// Launch the game
function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
	requestAnimationFrame(draw);
	clear();

	car.render(ctx);
}

draw();
