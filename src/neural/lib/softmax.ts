type Batch = number[][];

export class Activation_Softmax {
	output: undefined | number[][];

	softmax(x: number) {
		return x > 0 ? x : 0;
	}

	forward(batch: Batch) {
		this.output = batch.map((sample) => sample.map((input) => this.softmax(input)));
	}
}
