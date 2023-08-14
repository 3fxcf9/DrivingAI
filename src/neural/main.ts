import { Layer_Dense } from "./lib/dense.js";

const layer1 = new Layer_Dense(3, 8);

const batch = [
	[0, 0, 0],
	[1, 1, 1],
];

layer1.forward(batch);

console.dir(layer1.output);
