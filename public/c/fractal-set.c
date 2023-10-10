#include <emscripten.h>
#include <stdbool.h>

EMSCRIPTEN_KEEPALIVE
float belongs(float c_real, float c_imaginary, float z_real, float z_imaginary, int iterations, 
	bool flip_c_and_z, bool plot_diverging) {
	/*
	Determine if a given imaginary number is in the defined set.

	Optimized algorithm taken from https://en.wikipedia.org/wiki/Plotting_algorithms_for_the_Mandelbrot_set.
	*/

	// Flip c and z.
	if(flip_c_and_z) {
		float temporary_c_real = c_real;
		float temporary_c_imaginary = c_imaginary;
		c_real = z_real;
		c_imaginary = z_imaginary;
		z_real = temporary_c_real;
		z_imaginary = temporary_c_imaginary;
	}

	// Check if the given complex number diverges to infinity.
	int i = 0; // Index.
	
	// Plot diverging.
	if(plot_diverging) {
		// Comparison is greater than.
		while(z_real * z_real + z_imaginary * z_imaginary > 4 && i < iterations) {
			float x = z_real * z_real - z_imaginary * z_imaginary + c_real; // Temporary real value.
			z_imaginary = 2 * z_real * z_imaginary + c_imaginary;
			z_real = x;
			i++;
		}
	}
	// Plot converging.
	else {
		// Comparison is less than (default).
		while(z_real * z_real + z_imaginary * z_imaginary < 4 && i < iterations) {
			float x = z_real * z_real - z_imaginary * z_imaginary + c_real; // Temporary real value.
			z_imaginary = 2 * z_real * z_imaginary + c_imaginary;
			z_real = x;
			i++;
		}
	}

	// Optimized code. (Only works for Mandlebrot set.)
	/*
	// Check if the given complex number diverges to infinity.
	while(x + y < 2 && i < iterations) {
		z_imaginary = 2 * z_real * z_imaginary + c_imaginary;
		z_real = x - y + c_real;
		x = z_real * z_real;
		y = z_imaginary * z_imaginary;
		i++;
	}
	*/

	// Return the ratio of iterations reached.
	return (float) i / iterations;
}