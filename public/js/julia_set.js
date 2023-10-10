import { ComplexNumber } from './complex-number.js';

export class JuliaSet {
	constructor() {
		// Define ranges for complex numbers.
		this.minimum_real = -2.4;
		this.maximum_real = 2.4;
		this.minimum_imaginary = -1.2;
		this.maximum_imaginary = 1.2;
	}

	belongs(real, imaginary, iterations) {
		/*
		Determine if a given complex number belongs to the (a) Julia set after a certain number of
		iterations.
		*/
		let z = new ComplexNumber(real, imaginary);
		let c = new ComplexNumber(-0.4, 0.59);
		let i = 0;
		while(z.absoluteValue() < 2 && i < iterations) {
			// z -> z^2 + c
			z = z.multiply(z).add(c);
			i++;
		}
		return i / iterations;
	}
}