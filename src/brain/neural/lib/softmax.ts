export class Activation_Softmax {
	output: undefined | number[];

	softmax(x: number) {
		return x > 0 ? x : 0;
	}

	forward(inputs: number[]) {
		this.output = inputs.map((input) => this.softmax(input));
	}
}
