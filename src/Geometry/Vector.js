/**
 * Created by ralphy on 04/09/17.
 */

import Point from './Point.js';
import Helper from './Helper.js';

export default class Vector {
    /**
	 * The constructor accepts one two parameters
	 * If one parameter is given, the constructor will consider it as
	 * Vector or Point and will build this vector accordingly.
	 * If two parameters are given (both numbers), the constructor will initialize the x and y
	 * components with these numbers.
	 * if no parameters are given : the vector will be ZERO
     * @param (x) {Vector|Point|number}
     * @param (y) {number}
     */
	constructor(x, y) {
		if ((x instanceof Vector) || (x instanceof Point)) {
			this.x = x.x;
			this.y = x.y;
		} else {
            this.x = x || 0;
            this.y = y || 0;
		}
	}

	/**
	 * Immutable !
	 * returns a new Vector which is the sum of this instance + the given argument
	 * @param v {Vector|Point}
	 * @returns {Vector}
	 */
	add(v) {
		return new Vector(v.x + this.x, v.y + this.y);
	}

	/**
	 * Immutable !
	 * returns a scalar product
	 * multiplies the vector components by a given value -(vector, point or number)
	 * @param f {Vector|number}
	 * @param y ({number})
	 * @returns {Vector|number}
	 */
	mul(f) {
		if ((f instanceof Vector) || (f instanceof Point)) {
			return this.x * f.x + this.y * f.y;
		} else if (typeof f === 'number') {
			return new Vector(this.x * f, this.y * f);
		} else {
			throw new Error('vector product accepts only vectors or number as parameter');
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