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

let points: number[][] = [];
let paths: (typeof points)[] = [];

ctx.strokeStyle = "white";

let first = true;
document.addEventListener("click", (e) => {
	points.push([(e.clientX - canvas.width / 2) / (canvas.width / 2), -(e.clientY - canvas.height / 2) / (canvas.height / 2)]);

	if (first) {
		first = false;
		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
	} else {
		ctx.lineTo(e.clientX, e.clientY);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
	}
});
document.addEventListener("keypress", (e) => {
	if (e.code == "KeyQ") {
		ctx.closePath();
		console.log(points);
		paths.push(points);
		points = [];
		first = true;
	}
	if (e.code == "KeyS") {
		console.log(paths);
		paths = [];
	}
});
