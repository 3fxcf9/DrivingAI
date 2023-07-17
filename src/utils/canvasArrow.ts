import { Vector2 } from "./vector.js";

export function canvasArrow(vector: Vector2, origin_x: number = 0, origin_y: number = 0, color: string = "white") {
	const headlen = 10; // length of head in pixels

	const angle = Math.atan2(vector.y, vector.x);

	const tox = vector.x + origin_x;
	const toy = vector.y + origin_y;

	globalThis.game.ctx.strokeStyle = color;
	globalThis.game.ctx.beginPath();
	globalThis.game.ctx.moveTo(origin_x, origin_y);
	globalThis.game.ctx.lineTo(tox, toy);
	globalThis.game.ctx.stroke();
	globalThis.game.ctx.beginPath();
	globalThis.game.ctx.moveTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
	globalThis.game.ctx.lineTo(tox, toy);
	globalThis.game.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
	globalThis.game.ctx.stroke();
}
