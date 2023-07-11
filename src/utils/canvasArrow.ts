import { Vector2 } from "./vector";

export function canvasArrow(context: CanvasRenderingContext2D, vector: Vector2, origin_x: number = 0, origin_y: number = 0, color: string = "white") {
	const headlen = vector.magnitude * 0.3; // length of head in pixels
	const angle = Math.atan2(vector.y, vector.x);

	const tox = vector.x + origin_x;
	const toy = vector.y + origin_y;

	context.strokeStyle = color;
	context.beginPath();
	context.moveTo(origin_x, origin_y);
	context.lineTo(tox, toy);
	context.stroke();
	context.beginPath();
	context.moveTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
	context.lineTo(tox, toy);
	context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
	context.stroke();
}
