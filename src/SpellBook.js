/**
 * Created by ralphy on 07/09/17.
 */

export default class SpellBook {
    /**
     * Turns an array-like-structure into an array (a real one)
     */
    static array(subject) {
        const LENGTH_PROPERTY = 'length';
        if (Array.isArray(subject)) {
            return subject;
        }
        if (typeof subject === 'object') {
            // is there a length property ?
            let bLength = LENGTH_PROPERTY in subject;
            // extracting keys minus "length" property
            let aKeys = Object
                .keys(subject)
                .filter(k => k !== LENGTH_PROPERTY);
            if (aKeys.some(k => isNaN(k))) {
                return false;
            }
            if ((bLength) && (subject[LENGTH_PROPERTY] !== aKeys.length)) {
                return false;
            }
            if (aKeys
                .map(k => parseInt(k))
                .sort((k1, k2) => k1 - k2)
                .every((k, i) => k === i)) {
                return bLength
                    ? Array.prototype.slice.call(subject, 0)
                    : aKeys.map(k => subject[k]);
            }
        }
        return false;
    }

    /**
     * quickly clones an array into a new one
     * this method is mainly used for turning "arguments" pseudo array into a real array
     * @param a {Array|Object}
     * @return {Array}
     */
    static cloneArray(a) {
        return Array.prototype.slice.call(a, 0)
    }

    /**
     * maps an array into a string
     * converting all elements into there "type" counterpart.
     * any number element will be turned into "n"
     * any object element will be turned into "o"
     * this method is used to quickly switch-case an array according to its elements types.
     *
     * example : [222, "abc", [1,2,3], null, {x: 1.00, y: 3.00}]
     * will produce : "nsauo"
     * n: number
     * s: string
     * b: boolean
     * o: object
     * a: real array
     * f: function
     * u: undefined / null
     *
     * @param aArgs
     * @return {string}
     */
    static typeMap(aArgs) {
		return this.cloneArray(aArgs).map(function(x) {
			let tx = (typeof x);
			switch (tx) {
				case 'object':
					if (x === null) {
						return 'u';
					} else if (Array.isArray(x)) {
						return 'a';
					} else {
						return 'o';
					}
					break;

				default:
					return tx.charAt(0);
			}
		}).join('');
    }
}