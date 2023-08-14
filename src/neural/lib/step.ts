export class Activation_Step {
	output: undefined | number[];

	step(x: number) {
		return x > 0 ? 1 : 0;
	}

	forward(inputs: number[]) {
		this.output = inputs.map((input) => this.step(input));
	}
}
