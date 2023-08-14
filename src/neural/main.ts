import { Layer_Dense } from "./lib/dense.js";
import { Activation_Softmax } from "./lib/softmax.js";
import { Activation_Step } from "./lib/step.js";

class NeuralNetwork {
	layers: any[];

	constructor(...dimensions: number[]) {
		this.layers = [];
		for (let i = 0; i < dimensions.length - 1; i++) {
			this.layers = this.layers.concat([new Layer_Dense(dimensions[i], dimensions[i + 1]), new Activation_Softmax()]);
		}

		this.layers[this.layers.length - 1] = new Activation_Step();
	}

	forward(inputs: number[]) {
		for (let i = 0; i < this.layers.length; i++) {
			if (i == 0) {
				this.layers[i].forward(inputs);
			} else {
				this.layers[i].forward(this.layers[i - 1].output);
			}
		}

		return this.layers[this.layers.length - 1].output;
	}
}

// NN example with size of (14;64;64;4)
const network = new NeuralNetwork(14, 64, 64, 4);

const inputs = new Array(14).fill(null).map((w) => Math.random() * 2 - 1);
console.log(inputs);

const output = network.forward(inputs);
console.log(output);
