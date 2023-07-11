import { Vector2 } from "./vector.js";

const a = new Vector2(1, 1);
a.add(new Vector2(10, 1)).normalize();
console.log(a);
