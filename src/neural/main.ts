type Batch = number[][];

import { Layer_Dense } from "./lib/dense.js";
import { Activation_Softmax } from "./lib/softmax.js";
import { Activation_Step } from "./lib/step.js";

// NN example with size of (14;64;64;4)
const layer1 = new Layer_Dense(14, 64);
const activation1 = new Activation_Softmax();
const layer2 = new Layer_Dense(64, 64);
const activation2 = new Activation_Softmax();
const layer3 = new Layer_Dense(64, 4);
const activation3 = new Activation_Step();

const batch: Batch = new Array(100).fill(null).map((n) => new Array(14).fill(null).map((w) => Math.random() * 2 - 1));

// Layer 1
layer1.forward(batch);
activation1.forward(layer1.output as Batch);

// Layer 2
layer2.forward(activation1.output as Batch);
activation2.forward(layer2.output as Batch);

// Layer 3
layer3.forward(activation2.output as Batch);
activation3.forward(layer3.output as Batch);

console.dir(activation3.output);
