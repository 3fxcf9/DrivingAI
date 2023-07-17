import { reset } from "../main.js";
import { Point } from "./point.js";

export function line(ctx: CanvasRenderingContext2D, A: Point, B: Point, color: string) {
	reset();
	ctx.beginPath();
	ctx.moveTo(...A.toArray);
	ctx.lineTo(...B.toArray);
	ctx.strokeStyle = color;
	ctx.stroke();
	ctx.closePath();
}
