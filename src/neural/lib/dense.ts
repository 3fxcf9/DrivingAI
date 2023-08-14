type Batch = number[][];

export class Layer_Dense {
	weights: number[][];
	biases: number[];
	output: undefined | number[][];

	constructor(n_inputs: number, n_neurons: number) {
		this.weights = new Array(n_neurons).fill(null).map((n) => new Array(n_inputs).fill(null).map((w) => Math.random() * 2 - 1));
		this.biases = new Array(n_neurons).fill(0);
	}

	forward(batch: Batch) {
		this.output = [];
		for (const sample of batch) {
			const batch_output = this.biases.map((bias, neuron_index) => {
				return sample.map((activation, i) => activation * this.weights[neuron_index][i]).reduce((acc, cur) => acc + cur, bias);
			});

			this.output.push(batch_output);
		}
	}
}
