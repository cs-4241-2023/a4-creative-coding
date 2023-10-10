export class ComplexNumber {
	constructor (real, imaginary) {
		/*
		A complex number. Has a real and imaginary part.
		*/
		this.real = real;
		this.imaginary = imaginary;
	}

	add(complex_number) {
		/*
		Add a complex number to this one.
		*/
		return new ComplexNumber(this.real + complex_number.real, 
			this.imaginary + complex_number.imaginary);
	}

	subtract(complex_number) {
		/*
		Subtract this complex number by another one.
		*/
		return new ComplexNumber(this.real - complex_number.real, 
			this.imaginary - complex_number.imaginary);
	}

	multiply(complex_number) {
		/*
		Multiply this complex number by another one.
		*/
		return new ComplexNumber(this.real * complex_number.real - this.imaginary 
			* complex_number.imaginary, this.real * complex_number.imaginary + this.imaginary 
			* complex_number.real);
	}

	divide(complex_number) {
		/*
		Divide this complex number by another one.
		*/
		let denominator = Math.pow(complex_number.real, 2) + Math.pow(complex_number.imaginary, 2);
		return new ComplexNumber((this.real * complex_number.real + this.imaginary 
			+ complex_number.imaginary) / denominator, (this.imaginary * complex_number.real 
			- this.real + complex_number.imaginary) / denominator);
	}

	absoluteValue() {
		/* 
		Calculate the absolute value of this complex number.
		*/
		return Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imaginary, 2));
	}
}