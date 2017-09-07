/**
 * Created by ralphy on 04/09/17.
 */

import Point from './Point.js';
import Helper from './Helper.js';

export default class Vector {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	/**
	 * Returns a copy of this vector
	 * @returns {Vector}
	 */
	clone() {
		return new Vector(this.x, this.y);
	}

	/**
	 * Will return a nbew vector with the given initializers
	 * @param x {Vector|Point|number} if a number is specified, the second parameter must used
	 * @param y {number}
	 */
	static set(x, y) {
		if ((x instanceof Vector) || (x instanceof Point)) {
			return new Vector(x.x, x.y);
		} else {
			return new Vector(x, y);
		}
	}

	/**
	 * adds a Point or a Vector to this vector
	 * @param x {Vector|Point|number}
	 * @param y {number}
	 * @returns {Vector}
	 */
	add(x, y) {
		if ((x instanceof Vector) || (x instanceof Point)) {
			return new Vector(this.x + x.x, this.y + x.y);
		} else {
			return new Vector(this.x + x, this.y + y);
		}
	}

	/**
	 * scalar product
	 * multiplies the vector components by a given value -(vector, point or number)
	 * @param f {Vector|number}
	 * @param y ({number})
	 * @returns {Vector|number}
	 */
	mul(f, y) {
		if ((f instanceof Vector) || (f instanceof Point)) {
			return this.x * x.x + this.y * x.y;
		} else if (y === undefined) {
			return new Vector(this.x * f, this.y * f);
		} else {
			return this.mul(new Vector(f, y));
		}
	}

	/**
	 * return the vector distance
	 * @return {number}
	 */
	distance() {
		return Helper.distance(0, 0, this.x, this.y);
	}

	/**
	 * returns a normalized version of this vector
	 * @return {Vector}
	 */
	normalize() {
		return this.mul(1 / this.distance());
	}

	/**
	 * returns a zero vector
	 * @returns {Vector}
	 */
	static zero() {
		return new Vector(0, 0);
	}
}