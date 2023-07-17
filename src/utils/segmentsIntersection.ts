import { lerp } from "./lerp.js";
import { Point } from "./point.js";

/**
 * Two segments intersection [AB] and [CD] are the segments
 * @returns The intersection point or undefined
 */
export function intersection(A: Point, B: Point, C: Point, D: Point) {
	const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
	const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
	const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

	const t = tTop / bottom;
	const u = uTop / bottom;

	if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
	return undefined;
}

/**
 * Line and segment intersection. [AB) is the half line (origin A) and [CD] the segment
 * @returns The intersection point or undefined and the t value
 */
export function lineSegmentIntersection(A: Point, B: Point, C: Point, D: Point) {
	const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
	const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
	const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

	const t = tTop / bottom;
	const u = uTop / bottom;

	if (t >= 0 && u >= 0 && u <= 1) return { point: new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t)), t: t };
	return undefined;
}
