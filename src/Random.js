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
     * @param [a] {number|Array|Object} lower limit
     * @param [b] {number} upper limit
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

    /**
     * This function will randomly pick an item ffrom the given array.
     * This choice is influenced by a weight.
     * The weight is either the item value or the result of a function called back with
     * the item given as parameter.
     * ex : chooseFate([10, 60, 30]) will give :
     *  - 0 : 10% of chance
     *  - 1 : 60% of chance
     *  - 2 : 40% of chance
     *
     * @param aArray {array}
     * @param pProbFunction {function}
     * @return {number} the rank of the chosen item
     */
    chooseFate(aArray, pProbFunction) {
        let nSum;
        if (pProbFunction) {
            nSum = aArray.reduce((p, c) => Math.max(0, pProbFunction(c)) + p, 0);
        } else {
            nSum = aArray.reduce((p, c) => Math.max(0, c) + p, 0);
        }
        let nChoice = this.rand(0, nSum - 1);
        for (let i = 0, l = aArray.length; i < l; ++i) {
            let ci;
            if (pProbFunction) {
                ci = Math.max(0, pProbFunction(aArray[i]));
            } else {
                ci = Math.max(0, aArray[i]);
            }
            if (nChoice < ci) {
                return i;
            }
            nChoice -= ci;
        }
        return null;
    }

    /**
     * Shuffles array in place. ES6 version
     * @param {Array} aArray items The array containing the items.
     * @param {boolean} bImmutable if true, a new array is built, the provide array remains untouched
     */
    shuffle(aArray, bImmutable) {
        if (bImmutable) {
            aArray = aArray.slice(0);
        }
        for (let i = aArray.length; i; --i) {
            let j = this.rand(i);
            [aArray[i - 1], aArray[j]] = [aArray[j], aArray[i - 1]];
        }
        return aArray;
    }

    /**
     * randomly pick an item from an array
     * @param aArray {array}
     * @param bRemove {boolean} if true the item is removed from the array
     */
    randPick(aArray, bRemove) {
        let n = this.rand(aArray.length);
        let r = aArray[n];
        if (bRemove) {
            aArray.splice(n, 1);
        }
        return r;
    }

};
