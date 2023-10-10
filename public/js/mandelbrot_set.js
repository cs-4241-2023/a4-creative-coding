import { ComplexNumber } from './complex-number.js';

export class MandelbrotSet {
	constructor() {
		// Define ranges for complex numbers.
		this.minimum_real = -2;
		this.maximum_real = 1.2;
		this.minimum_imaginary = -1.2;
		this.maximum_imaginary = 1.2;
	}

	belongs(real, imaginary, iterations) {
		/*
		Determine if a given complex number belongs to the Mandelbrot set after a certain number of
		iterations. 

		Mandelbrot algorithm pseudocode from https://en.wikipedia.org/wiki/Plotting_algorithms_for_the_Mandelbrot_set.
		*/
		let z = new ComplexNumber(0, 0);
		let c = new ComplexNumber(real, imaginary);
		let i = 0;
		while(z.absoluteValue() < 2 && i < iterations) {
			// z -> z^2 + c
			z = z.multiply(z).add(c);
			i++;
		}
		return i / iterations;
	}
}