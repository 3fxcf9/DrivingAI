export class Point {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static fromArray(array: [x: number, y: number]) {
		return new Point(array[0], array[1]);
	}

	get toArray(): [x: number, y: number] {
		return [this.x, this.y];
	}

	copy() {
		return new Point(this.x, this.y);
	}

	display(color?: string, radius?: number) {
		globalThis.game.reset();
		globalThis.game.ctx.beginPath();
		globalThis.game.ctx.arc(this.x, this.y, radius || 5, 0, Math.PI * 2);
		globalThis.game.ctx.fillStyle = color || "white";
		globalThis.game.ctx.fill();
		globalThis.game.ctx.closePath();
	}
}
