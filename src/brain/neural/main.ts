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

	get params() {
		const params = [];

		for (const layer of this.layers) {
			if (layer instanceof Layer_Dense) {
				params.push(...layer.weights.flat(), ...layer.biases);
			}
		}

		return params;
	}

	set params(params) {
		for (const layer of this.layers) {
			if (layer instanceof Layer_Dense) {
				params.push(...layer.weights.flat(), ...layer.biases);

				const layer_weight_matrix = [];
				for (let i = 0; i < layer.n_neurons; i++) layer_weight_matrix.push(params.splice(0, layer.n_inputs));
				layer.weights = layer_weight_matrix;
				layer.biases = params.splice(0, layer.n_neurons);
			}
		}
	}
}

// NN example with size of (14;64;64;4)
const network = new NeuralNetwork(14, 64, 64, 4);

const inputs = new Array(14).fill(null).map((w) => Math.random() * 2 - 1);

const output = network.forward(inputs);
console.log("Output: ", output);

const a = network.params;
network.params = a;

const output2 = network.forward(inputs);
console.log("Output2: ", output2);

console.log(JSON.stringify(network.params) == JSON.stringify(a)); // True
