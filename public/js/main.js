import { loadWasm, wasm_exports } from './wasm.js';
import { CustomSet } from './custom_set.js';

// Configure canvas.
let canvas = document.querySelector('#canvas');
let context = canvas.getContext('2d');

function draw(minimum_real, maximum_real, minimum_imaginary, maximum_imaginary, iterations, z_real, 
	z_imaginary, flip_c_and_z, plot_diverging) {
	/*
	Draw the fractal with the given properties to the canvas.
	*/
	// Set the canvas size. (For when user resizes window in between draws.)
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Store the step sizes.
	let real_step = (maximum_real - minimum_real) / canvas.width;
	let imaginary_step = (maximum_imaginary - minimum_imaginary) / canvas.height;

	// Iterate over each pixel.
	for(let c_real = minimum_real; c_real < maximum_real; c_real += real_step) {
		for(let c_imaginary = minimum_imaginary; c_imaginary < maximum_imaginary; c_imaginary += imaginary_step) {
			// TODO: add options:
			// todo		- add colors
			// todo		- add option to add custom equation? would prob have to do this in js
			// Get the ratio of iterations over max iterations reached for this coordinate.
			// Use web assembly (only z -> z^2 + c).
			let value = 255 * wasm_exports.belongs(c_real, c_imaginary, z_real, z_imaginary, 
				iterations, flip_c_and_z, plot_diverging);

			// Use custom set from 'custom-set.js'.
			// let custom_set = new CustomSet();
			// let value = 255 * custom_set.belongs(c_real, c_imaginary, iterations);

			// Get the x and y values from the current real and imaginary values.
			let x = (c_real - minimum_real) / real_step;
			let y = (c_imaginary - minimum_imaginary) / imaginary_step;

			// Draw the pixel on the canvas.
			context.fillStyle = `rgb(${value}, ${value}, ${value})`;
			context.fillRect(x, y, 1, 1);
		}
	}
}

function validate() {
	/*
	Validates that all inputs have legal values. If a missing or illegal value is found, set it to 
	a legal value.
	*/
	// Get all number input elements.
	let inputs = document.querySelectorAll('input[type=number]');

	// Make sure all input values are legal
	for(let input of inputs) {
		// Store the current input value as a float.
		let value = parseFloat(input.value);

		// Value is not a valid number.
		if(!Number.isFinite(value)) {
			// Set it to 0.
			input.value = 0;
		}
		// Value is too small.
		else if(value < parseFloat(input.min)) {
			// Set it to the minimum value.
			input.value = input.min;
		}
		// Value is too large.
		else if(value > parseFloat(input.max)) {
			// Set it to the maximum value.
			input.value = input.max;
		}
		
	}
}

function generate() {
	/*
	Generates a fractal from the user-input values.
	*/
	// Validate user inputs.
	validate();

	// Store user inputs.
	let minimum_real = parseFloat(document.querySelector('#minimum-real').value);
	let maximum_real = parseFloat(document.querySelector('#maximum-real').value);
	let minimum_imaginary = parseFloat(document.querySelector('#minimum-imaginary').value);
	let maximum_imaginary = parseFloat(document.querySelector('#maximum-imaginary').value);
	let iterations = parseInt(document.querySelector('#iterations').value);
	let z_real = parseFloat(document.querySelector('#z-real').value);
	let z_imaginary = parseFloat(document.querySelector('#z-imaginary').value);
	let flip_c_and_z = document.querySelector('#flip-c-and-z').checked;
	let plot_diverging = document.querySelector('#plot-diverging').checked;


	// Draw fractal.
	draw(minimum_real, maximum_real, minimum_imaginary, maximum_imaginary, iterations, z_real, 
		z_imaginary, flip_c_and_z, plot_diverging);
}

function generateMandelbrot() {
	// Set input values.
	document.querySelector('#minimum-real').value = -2.2;
	document.querySelector('#maximum-real').value = 1;
	document.querySelector('#minimum-imaginary').value = -1.2;
	document.querySelector('#maximum-imaginary').value = 1.2;
	document.querySelector('#iterations').value = 100;
	document.querySelector('#z-real').value = 0;
	document.querySelector('#z-imaginary').value = 0;
	document.querySelector('#flip-c-and-z').checked = false;
	document.querySelector('#plot-diverging').checked = false;

	// Store input values.
	let minimum_real = parseFloat(document.querySelector('#minimum-real').value);
	let maximum_real = parseFloat(document.querySelector('#maximum-real').value);
	let minimum_imaginary = parseFloat(document.querySelector('#minimum-imaginary').value);
	let maximum_imaginary = parseFloat(document.querySelector('#maximum-imaginary').value);
	let iterations = parseInt(document.querySelector('#iterations').value);
	let z_real = parseFloat(document.querySelector('#z-real').value);
	let z_imaginary = parseFloat(document.querySelector('#z-imaginary').value);
	let flip_c_and_z = document.querySelector('#flip-c-and-z').checked;
	let plot_diverging = document.querySelector('#plot-diverging').checked

	// Draw the Mandelbrot fractal.
	draw(minimum_real, maximum_real, minimum_imaginary, maximum_imaginary, iterations, z_real, 
		z_imaginary, flip_c_and_z, plot_diverging);
}

function generateJulia1() {
	// Set input values.
	document.querySelector('#minimum-real').value = -2;
	document.querySelector('#maximum-real').value = 2;
	document.querySelector('#minimum-imaginary').value = -1.2;
	document.querySelector('#maximum-imaginary').value = 1.2;
	document.querySelector('#iterations').value = 100;
	document.querySelector('#z-real').value = -0.4;
	document.querySelector('#z-imaginary').value = 0.59;
	document.querySelector('#flip-c-and-z').checked = true;
	document.querySelector('#plot-diverging').checked = false;

	// Store input values.
	let minimum_real = parseFloat(document.querySelector('#minimum-real').value);
	let maximum_real = parseFloat(document.querySelector('#maximum-real').value);
	let minimum_imaginary = parseFloat(document.querySelector('#minimum-imaginary').value);
	let maximum_imaginary = parseFloat(document.querySelector('#maximum-imaginary').value);
	let iterations = parseInt(document.querySelector('#iterations').value);
	let z_real = parseFloat(document.querySelector('#z-real').value);
	let z_imaginary = parseFloat(document.querySelector('#z-imaginary').value);
	let flip_c_and_z = document.querySelector('#flip-c-and-z').checked;
	let plot_diverging = document.querySelector('#plot-diverging').checked

	// Draw the Mandelbrot fractal.
	draw(minimum_real, maximum_real, minimum_imaginary, maximum_imaginary, iterations, z_real, 
		z_imaginary, flip_c_and_z, plot_diverging);
}

function generateJulia2() {
	// Set input values.
	document.querySelector('#minimum-real').value = -2;
	document.querySelector('#maximum-real').value = 2;
	document.querySelector('#minimum-imaginary').value = -1.2;
	document.querySelector('#maximum-imaginary').value = 1.2;
	document.querySelector('#iterations').value = 100;
	document.querySelector('#z-real').value = -1;
	document.querySelector('#z-imaginary').value = 0;
	document.querySelector('#flip-c-and-z').checked = true;
	document.querySelector('#plot-diverging').checked = false;

	// Store input values.
	let minimum_real = parseFloat(document.querySelector('#minimum-real').value);
	let maximum_real = parseFloat(document.querySelector('#maximum-real').value);
	let minimum_imaginary = parseFloat(document.querySelector('#minimum-imaginary').value);
	let maximum_imaginary = parseFloat(document.querySelector('#maximum-imaginary').value);
	let iterations = parseInt(document.querySelector('#iterations').value);
	let z_real = parseFloat(document.querySelector('#z-real').value);
	let z_imaginary = parseFloat(document.querySelector('#z-imaginary').value);
	let flip_c_and_z = document.querySelector('#flip-c-and-z').checked;
	let plot_diverging = document.querySelector('#plot-diverging').checked

	// Draw the Mandelbrot fractal.
	draw(minimum_real, maximum_real, minimum_imaginary, maximum_imaginary, iterations, z_real, 
		z_imaginary, flip_c_and_z, plot_diverging);
}

function generateJulia3() {
	// Set input values.
	document.querySelector('#minimum-real').value = -2;
	document.querySelector('#maximum-real').value = 2;
	document.querySelector('#minimum-imaginary').value = -1.2;
	document.querySelector('#maximum-imaginary').value = 1.2;
	document.querySelector('#iterations').value = 100;
	document.querySelector('#z-real').value = 0;
	document.querySelector('#z-imaginary').value = 0.66;
	document.querySelector('#flip-c-and-z').checked = true;
	document.querySelector('#plot-diverging').checked = false;

	// Store input values.
	let minimum_real = parseFloat(document.querySelector('#minimum-real').value);
	let maximum_real = parseFloat(document.querySelector('#maximum-real').value);
	let minimum_imaginary = parseFloat(document.querySelector('#minimum-imaginary').value);
	let maximum_imaginary = parseFloat(document.querySelector('#maximum-imaginary').value);
	let iterations = parseInt(document.querySelector('#iterations').value);
	let z_real = parseFloat(document.querySelector('#z-real').value);
	let z_imaginary = parseFloat(document.querySelector('#z-imaginary').value);
	let flip_c_and_z = document.querySelector('#flip-c-and-z').checked;
	let plot_diverging = document.querySelector('#plot-diverging').checked

	// Draw the Mandelbrot fractal.
	draw(minimum_real, maximum_real, minimum_imaginary, maximum_imaginary, iterations, z_real, 
		z_imaginary, flip_c_and_z, plot_diverging);
}

function generateJulia4() {
	// Set input values.
	document.querySelector('#minimum-real').value = -2;
	document.querySelector('#maximum-real').value = 2;
	document.querySelector('#minimum-imaginary').value = -1.2;
	document.querySelector('#maximum-imaginary').value = 1.2;
	document.querySelector('#iterations').value = 100;
	document.querySelector('#z-real').value = 0;
	document.querySelector('#z-imaginary').value = 1;
	document.querySelector('#flip-c-and-z').checked = true;
	document.querySelector('#plot-diverging').checked = false;

	// Store input values.
	let minimum_real = parseFloat(document.querySelector('#minimum-real').value);
	let maximum_real = parseFloat(document.querySelector('#maximum-real').value);
	let minimum_imaginary = parseFloat(document.querySelector('#minimum-imaginary').value);
	let maximum_imaginary = parseFloat(document.querySelector('#maximum-imaginary').value);
	let iterations = parseInt(document.querySelector('#iterations').value);
	let z_real = parseFloat(document.querySelector('#z-real').value);
	let z_imaginary = parseFloat(document.querySelector('#z-imaginary').value);
	let flip_c_and_z = document.querySelector('#flip-c-and-z').checked;
	let plot_diverging = document.querySelector('#plot-diverging').checked

	// Draw the Mandelbrot fractal.
	draw(minimum_real, maximum_real, minimum_imaginary, maximum_imaginary, iterations, z_real, 
		z_imaginary, flip_c_and_z, plot_diverging);
}

function generateJulia5() {
	// Set input values.
	document.querySelector('#minimum-real').value = -2;
	document.querySelector('#maximum-real').value = 2;
	document.querySelector('#minimum-imaginary').value = -1.2;
	document.querySelector('#maximum-imaginary').value = 1.2;
	document.querySelector('#iterations').value = 100;
	document.querySelector('#z-real').value = 0.25;
	document.querySelector('#z-imaginary').value = 0;
	document.querySelector('#flip-c-and-z').checked = true;
	document.querySelector('#plot-diverging').checked = false;

	// Store input values.
	let minimum_real = parseFloat(document.querySelector('#minimum-real').value);
	let maximum_real = parseFloat(document.querySelector('#maximum-real').value);
	let minimum_imaginary = parseFloat(document.querySelector('#minimum-imaginary').value);
	let maximum_imaginary = parseFloat(document.querySelector('#maximum-imaginary').value);
	let iterations = parseInt(document.querySelector('#iterations').value);
	let z_real = parseFloat(document.querySelector('#z-real').value);
	let z_imaginary = parseFloat(document.querySelector('#z-imaginary').value);
	let flip_c_and_z = document.querySelector('#flip-c-and-z').checked;
	let plot_diverging = document.querySelector('#plot-diverging').checked

	// Draw the Mandelbrot fractal.
	draw(minimum_real, maximum_real, minimum_imaginary, maximum_imaginary, iterations, z_real, 
		z_imaginary, flip_c_and_z, plot_diverging);
}

function generateJulia6() {
	// Set input values.
	document.querySelector('#minimum-real').value = -2;
	document.querySelector('#maximum-real').value = 2;
	document.querySelector('#minimum-imaginary').value = -1.2;
	document.querySelector('#maximum-imaginary').value = 1.2;
	document.querySelector('#iterations').value = 100;
	document.querySelector('#z-real').value = 0.3;
	document.querySelector('#z-imaginary').value = -0.02;
	document.querySelector('#flip-c-and-z').checked = true;
	document.querySelector('#plot-diverging').checked = false;

	// Store input values.
	let minimum_real = parseFloat(document.querySelector('#minimum-real').value);
	let maximum_real = parseFloat(document.querySelector('#maximum-real').value);
	let minimum_imaginary = parseFloat(document.querySelector('#minimum-imaginary').value);
	let maximum_imaginary = parseFloat(document.querySelector('#maximum-imaginary').value);
	let iterations = parseInt(document.querySelector('#iterations').value);
	let z_real = parseFloat(document.querySelector('#z-real').value);
	let z_imaginary = parseFloat(document.querySelector('#z-imaginary').value);
	let flip_c_and_z = document.querySelector('#flip-c-and-z').checked;
	let plot_diverging = document.querySelector('#plot-diverging').checked

	// Draw the Mandelbrot fractal.
	draw(minimum_real, maximum_real, minimum_imaginary, maximum_imaginary, iterations, z_real, 
		z_imaginary, flip_c_and_z, plot_diverging);
}

function generateWhiteCircle() {
	// Set input values.
	document.querySelector('#minimum-real').value = -4;
	document.querySelector('#maximum-real').value = 4;
	document.querySelector('#minimum-imaginary').value = -2;
	document.querySelector('#maximum-imaginary').value = 2;
	document.querySelector('#iterations').value = 100;
	document.querySelector('#z-real').value = 0;
	document.querySelector('#z-imaginary').value = 0;
	document.querySelector('#flip-c-and-z').checked = true;
	document.querySelector('#plot-diverging').checked = false;

	// Store input values.
	let minimum_real = parseFloat(document.querySelector('#minimum-real').value);
	let maximum_real = parseFloat(document.querySelector('#maximum-real').value);
	let minimum_imaginary = parseFloat(document.querySelector('#minimum-imaginary').value);
	let maximum_imaginary = parseFloat(document.querySelector('#maximum-imaginary').value);
	let iterations = parseInt(document.querySelector('#iterations').value);
	let z_real = parseFloat(document.querySelector('#z-real').value);
	let z_imaginary = parseFloat(document.querySelector('#z-imaginary').value);
	let flip_c_and_z = document.querySelector('#flip-c-and-z').checked;
	let plot_diverging = document.querySelector('#plot-diverging').checked

	// Draw the Mandelbrot fractal.
	draw(minimum_real, maximum_real, minimum_imaginary, maximum_imaginary, iterations, z_real, 
		z_imaginary, flip_c_and_z, plot_diverging);
}

function generateBlackCircle() {
	// Set input values.
	document.querySelector('#minimum-real').value = -8;
	document.querySelector('#maximum-real').value = 8;
	document.querySelector('#minimum-imaginary').value = -4;
	document.querySelector('#maximum-imaginary').value = 4;
	document.querySelector('#iterations').value = 100;
	document.querySelector('#z-real').value = 0;
	document.querySelector('#z-imaginary').value = 0;
	document.querySelector('#flip-c-and-z').checked = true;
	document.querySelector('#plot-diverging').checked = true;

	// Store input values.
	let minimum_real = parseFloat(document.querySelector('#minimum-real').value);
	let maximum_real = parseFloat(document.querySelector('#maximum-real').value);
	let minimum_imaginary = parseFloat(document.querySelector('#minimum-imaginary').value);
	let maximum_imaginary = parseFloat(document.querySelector('#maximum-imaginary').value);
	let iterations = parseInt(document.querySelector('#iterations').value);
	let z_real = parseFloat(document.querySelector('#z-real').value);
	let z_imaginary = parseFloat(document.querySelector('#z-imaginary').value);
	let flip_c_and_z = document.querySelector('#flip-c-and-z').checked;
	let plot_diverging = document.querySelector('#plot-diverging').checked

	// Draw the Mandelbrot fractal.
	draw(minimum_real, maximum_real, minimum_imaginary, maximum_imaginary, iterations, z_real, 
		z_imaginary, flip_c_and_z, plot_diverging);
}

function showInstructions() {
	alert('INSTRUCTIONS:\n\nfractals are calculated by converting the x- and y-coordinates of each pixel on the screen to a complex number, then checking to see if that complex number diverges for a given function. each input on the left modifies the function, z = z^2 + c, where z and c are complex numbers, to change the look of the resulting fractal. see the "Plotting algorithms for the Mandelbrot set" Wikipedia page for more information.\n\nminimum/maximum real: the range of x-values\n\nminimum/maximum imaginary: the range of y-values\n\n# of iterations: how detailed the fractal is\n\nz real/imaginary: the starting values of z\n\nflip c and z: flips the values of c and z\n\nplot diverging: plots all values of c that diverge instead of converge');
}

window.onload = async () => {
	// Notify user that fractals take time to generate.
	alert('PLEASE READ:\n\ngenerating fractals is very computationally heavy, so please be patient. it may take a few seconds for fractals to load.');

	// Add functions to buttons.
	document.querySelector('#generate-button').addEventListener('click', generate, false);
	document.querySelector('#instructions-button').addEventListener('click', showInstructions, false);
	document.querySelector('#mandelbrot-button').addEventListener('click', generateMandelbrot, false);
	document.querySelector('#julia-1-button').addEventListener('click', generateJulia1, false);
	document.querySelector('#julia-2-button').addEventListener('click', generateJulia2, false);
	document.querySelector('#julia-3-button').addEventListener('click', generateJulia3, false);
	document.querySelector('#julia-4-button').addEventListener('click', generateJulia4, false);
	document.querySelector('#julia-5-button').addEventListener('click', generateJulia5, false);
	document.querySelector('#julia-6-button').addEventListener('click', generateJulia6, false);
	document.querySelector('#white-circle-button').addEventListener('click', generateWhiteCircle, false);
	document.querySelector('#black-circle-button').addEventListener('click', generateBlackCircle, false);

	// Load web assembly file.
	await loadWasm();

	// Generate the Mandelbrot fractal.
	generateMandelbrot();
};