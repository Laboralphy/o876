/**
 * Created by ralphy on 07/09/17.
 */

class SpellBook {
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

    static catsortArray(aInput, {cat, sort = null}) {
    	let oOutput = {};
    	aInput.forEach(e => {
    		let sCat = cat(e);
    		if (!(sCat in oOutput)) {
    			oOutput[sCat] = [];
			}
			oOutput[sCat].push(e);
		});
    	if (typeof sort === 'function') {
			for (let sCat in oOutput) {
				oOutput[sCat] = oOutput[sCat].sort(sort)
			}
		}
		return oOutput;
	}

	/**
	 * élimine tout les doubloons de l'array spécifié. Ne modifie par l'array, mais renvoie un nouveau tableau
	 * @param aArray
	 * @returns {*}
	 */
	static uniqArray(aArray) {
    	return aArray.filter((x, i, a) => a.indexOf(x) === i)
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
		return this.cloneArray(aArgs).map(function(x) {
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