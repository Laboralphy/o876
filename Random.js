/**
 * @class O876.Random
 * a FALSE random very false...
 * generated random numbers, with seed
 * used for predictable landscape generation
 */

const SB = require('./SpellBook');

module.exports = class Random {

	constructor() {
        this._seed = Math.random();
	}

    /**
	 * Will define a new seed
     * @param x {number}
     * @returns {*}
     */
	seed(x) {
    	return SB.prop(this, '_seed', x);
	}

    /**
	 * Return a random generated number using the simple sine-66 function
     * @returns {number} a number between 0 and 1
     * @private
     */
	_rand() {
		return this._seed = Math.abs(((Math.sin(this._seed) * 1e12) % 1e6) / 1e6);
	}

    /**
	 * returns a random generated number.
	 * the result will vary according to the given parameter values
	 * - two integer (a, b) gives a random number between a and b
	 * - an array gives a random item of this array
	 * - an object gives a random key of this object
	 * - no parameter gives a random float value between 0 and 1
     * @param a {number|Array|Object} lower limit
     * @param b {number} upper limit
     * @returns {*}
     */
	rand(a, b) {
		let r = this._rand();
		switch (typeof a) {
			case "undefined":
				return r;
				
			case "number":
				if (b === undefined) {
					b = a - 1;
					a = 0;
				}
				return Math.max(a, Math.min(b, (b - a + 1) * r + a | 0));
			
			case "object":
				if (Array.isArray(a)) {
					if (a.length > 0) {
						return a[r * a.length | 0];
					} else {
						return undefined;
					}
				} else {
					return this.rand(Object.keys(a));
				}
				
			default:
				return r;
		}
	}
};
