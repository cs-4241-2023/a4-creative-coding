import { ComplexNumber } from './complex-number.js';

export class CustomSet {
	constructor() {
		// Define ranges for complex numbers.
		this.minimum_real = -10;
		this.maximum_real = 10;
		this.minimum_imaginary = -10;
		this.maximum_imaginary = 10;
	}

	belongs(real, imaginary, iterations) {
		/*
		Determine if a given complex number belongs to this custom set after a certain number of
		iterations.
		*/
		let z = new ComplexNumber(real, imaginary);
		let c = new ComplexNumber(-1, 0);
		let i = 0;
		while(z.absoluteValue() < 2 && i < iterations) {
			z = z.multiply(z).add(c);
			i++;
		}
		return i / iterations;
	}
}