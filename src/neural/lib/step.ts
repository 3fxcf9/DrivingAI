type Batch = number[][];

export class Activation_Step {
	output: undefined | number[][];

	step(x: number) {
		return x > 0 ? 1 : 0;
	}

	forward(batch: Batch) {
		this.output = batch.map((sample) => sample.map((input) => this.step(input)));
	}
}
