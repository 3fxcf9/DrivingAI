import { Point } from "./point.js";

export function line(A: Point, B: Point, color: string) {
	globalThis.game.reset();
	globalThis.game.ctx.beginPath();
	globalThis.game.ctx.moveTo(...A.toArray);
	globalThis.game.ctx.lineTo(...B.toArray);
	globalThis.game.ctx.strokeStyle = color;
	globalThis.game.ctx.stroke();
	globalThis.game.ctx.closePath();
}
