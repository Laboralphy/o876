/**
 * Created by ralphy on 07/09/17.
 */

const ArrayHelper = require('./ArrayHelper');

class SpellBook {

	/**
	 * Renvoie le type d'une variable (différencie les Tableau Array des objet}
	 * @param x {*}
	 * @returns {string}
	 */
	static typeof(x) {
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
		return ArrayHelper.clone(aArgs).map(function(x) {
			return SpellBook.typeof(x);
		}).join('');
    }

	/**
     * Parse a search string (?variable=value)
     * @param sSearch {string} as in window.search
	 * @returns {{}}
	 */
	static parseSearch(sSearch) {
		if (sSearch) {
			let nQuest = sSearch.indexOf('?');
			if (nQuest >= 0) {
				sSearch = sSearch.substr(nQuest + 1);
			} else {
				return {};
			}
		} else {
			sSearch = window.location.search.substr(1);
		}
		let match,
			pl     = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			query  = sSearch,
			_decode = function(s) {
				return decodeURIComponent(s.replace(pl, ' '));
			};
		let oURLParams = {};
		while (match = search.exec(query)) {
			oURLParams[_decode(match[1])] = _decode(match[2]);
		}
		return oURLParams;
	}

    static prop(oInstance, sProperty, value) {
        if (value === undefined) {
            return oInstance[sProperty];
        } else {
            oInstance[sProperty] = value;
            return oInstance;
        }
    }

    static mod(n, d) {
        if (n > 0) {
            return n % d;
        } else {
            return (d - (-n % d)) % d;
        }
    }


};


module.exports = SpellBook;