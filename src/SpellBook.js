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
            let bLength = LENGTH_PROPERTY in subject;
            let aKeys = Object
                .keys(subject)
                .filter(k => k !== LENGTH_PROPERTY);
            if (aKeys)
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

    static cloneArray(a) {
        return Array.prototype.slice.call(a, 0)
    }

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