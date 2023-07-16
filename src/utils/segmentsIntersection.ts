import { lerp } from "./lerp.js";
import { Point } from "./point.js";

export function intersection(A: Point, B: Point, C: Point, D: Point) {
	const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
	const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
	const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

	const t = tTop / bottom;
	const u = uTop / bottom;

	if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
	return undefined;
}
