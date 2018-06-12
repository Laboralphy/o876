/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/indexWeb.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Emitter.js":
/*!************************!*\
  !*** ./src/Emitter.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by ralphy on 07/09/17.
 */

const SB = __webpack_require__(/*! ./SpellBook */ "./src/SpellBook.js");
/**
 * this class is similar to the node.js Emitter system
 * it emits events
 * client instances may instanciate this class and call methods such as
 * .on  to defines an event handler
 * .off to undefined an event handler
 * .one to define a "one triggered" handler
 * .trigger to cast an event
 *
 * Only usefull in javascript, as node.js is provided with the "events" module.
 */


module.exports = class Emitter {
    constructor() {
        this._oEventHandlers = {};
    }

    /**
	 * triggers an event
	 * @param sEvent {string} event name
	 * @param params {*} any parameter that will transmitted to the handler
     * @return {*}
     */
    trigger(sEvent, params) {
        let aArgs = SB.array(arguments);
        aArgs.shift();
        let eh = this._oEventHandlers;
        if (sEvent in eh) {
			eh[sEvent].one.forEach(f => f.apply(this, aArgs));
			eh[sEvent].one = [];
            eh[sEvent].on.forEach(f => f.apply(this, aArgs));
        }
		return this;
    }

    /**
	 * A private helper to define a handler
     * @param sEvent {string}
     * @param sType {string}
     * @param pHandler {function}
     * @private
     */
	_define(sEvent, sType, pHandler) {
		let eh = this._oEventHandlers;
		if (!(sEvent in eh)) {
			eh[sEvent] = {
			    on: [],
                one: []
            };
		}
		eh[sEvent][sType].push(pHandler);
	}

    /**
	 * a private method to undefined an event
     * @param sEvent {string}
     * @param sType {string}
     * @param pHandler ({function})
     * @private
     */
	_undefine(sEvent, sType, pHandler) {
		let eh = this._oEventHandlers;
		if (!(sEvent in eh)) {
			return;
		}
		eh = eh[sEvent];
		if (!(sType in eh)) {
			return;
		}
		if (pHandler) {
			eh[sType] = eh[sType].filter(h => h !== pHandler);
        } else {
			eh[sType] = [];
        }
	}

    /**
	 * Defines an event handler, that will be invoked each time the event is triggered
     * @param sEvent {string}
     * @param pHandler {function}
     * @return {Emitter}
     */
	on(sEvent, pHandler) {
		this._define(sEvent, 'on', pHandler);
		return this;
	}

    /**
     * Defines an event handler, that will be invoked only the next time
	 * the event will be triggered
     * @param sEvent {string}
     * @param pHandler {function}
     * @return {Emitter}
     */
	one(sEvent, pHandler) {
		this._define(sEvent, 'one', pHandler);
		return this;
	}

    /**
	 * unload event handlers
     * @param sEvent {string}
     * @param pHandler {function}
     * @return {Emitter}
     */
	off(sEvent, pHandler) {
        switch (SB.typeMap(arguments)) {
            case 's': // turn off handler
				this._undefine(sEvent, 'on');
				this._undefine(sEvent, 'one');
				break;

            case 'sf':
				this._undefine(sEvent, 'on', pHandler);
				this._undefine(sEvent, 'one', pHandler);
				break;
        }
		return this;
	}
};

/***/ }),

/***/ "./src/Rainbow.js":
/*!************************!*\
  !*** ./src/Rainbow.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @class O876.Rainbow
 * Rainbow - Color Code Convertor Boîte à outil graphique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 * good to GIT
 */

const COLORS = {
	aliceblue : '#F0F8FF',
	antiquewhite : '#FAEBD7',
	aqua : '#00FFFF',
	aquamarine : '#7FFFD4',
	azure : '#F0FFFF',
	beige : '#F5F5DC',
	bisque : '#FFE4C4',
	black : '#000000',
	blanchedalmond : '#FFEBCD',
	blue : '#0000FF',
	blueviolet : '#8A2BE2',
	brown : '#A52A2A',
	burlywood : '#DEB887',
	cadetblue : '#5F9EA0',
	chartreuse : '#7FFF00',
	chocolate : '#D2691E',
	coral : '#FF7F50',
	cornflowerblue : '#6495ED',
	cornsilk : '#FFF8DC',
	crimson : '#DC143C',
	cyan : '#00FFFF',
	darkblue : '#00008B',
	darkcyan : '#008B8B',
	darkgoldenrod : '#B8860B',
	darkgray : '#A9A9A9',
	darkgrey : '#A9A9A9',
	darkgreen : '#006400',
	darkkhaki : '#BDB76B',
	darkmagenta : '#8B008B',
	darkolivegreen : '#556B2F',
	darkorange : '#FF8C00',
	darkorchid : '#9932CC',
	darkred : '#8B0000',
	darksalmon : '#E9967A',
	darkseagreen : '#8FBC8F',
	darkslateblue : '#483D8B',
	darkslategray : '#2F4F4F',
	darkslategrey : '#2F4F4F',
	darkturquoise : '#00CED1',
	darkviolet : '#9400D3',
	deeppink : '#FF1493',
	deepskyblue : '#00BFFF',
	dimgray : '#696969',
	dimgrey : '#696969',
	dodgerblue : '#1E90FF',
	firebrick : '#B22222',
	floralwhite : '#FFFAF0',
	forestgreen : '#228B22',
	fuchsia : '#FF00FF',
	gainsboro : '#DCDCDC',
	ghostwhite : '#F8F8FF',
	gold : '#FFD700',
	goldenrod : '#DAA520',
	gray : '#808080',
	grey : '#808080',
	green : '#008000',
	greenyellow : '#ADFF2F',
	honeydew : '#F0FFF0',
	hotpink : '#FF69B4',
	indianred  : '#CD5C5C',
	indigo  : '#4B0082',
	ivory : '#FFFFF0',
	khaki : '#F0E68C',
	lavender : '#E6E6FA',
	lavenderblush : '#FFF0F5',
	lawngreen : '#7CFC00',
	lemonchiffon : '#FFFACD',
	lightblue : '#ADD8E6',
	lightcoral : '#F08080',
	lightcyan : '#E0FFFF',
	lightgoldenrodyellow : '#FAFAD2',
	lightgray : '#D3D3D3',
	lightgrey : '#D3D3D3',
	lightgreen : '#90EE90',
	lightpink : '#FFB6C1',
	lightsalmon : '#FFA07A',
	lightseagreen : '#20B2AA',
	lightskyblue : '#87CEFA',
	lightslategray : '#778899',
	lightslategrey : '#778899',
	lightsteelblue : '#B0C4DE',
	lightyellow : '#FFFFE0',
	lime : '#00FF00',
	limegreen : '#32CD32',
	linen : '#FAF0E6',
	magenta : '#FF00FF',
	maroon : '#800000',
	mediumaquamarine : '#66CDAA',
	mediumblue : '#0000CD',
	mediumorchid : '#BA55D3',
	mediumpurple : '#9370DB',
	mediumseagreen : '#3CB371',
	mediumslateblue : '#7B68EE',
	mediumspringgreen : '#00FA9A',
	mediumturquoise : '#48D1CC',
	mediumvioletred : '#C71585',
	midnightblue : '#191970',
	mintcream : '#F5FFFA',
	mistyrose : '#FFE4E1',
	moccasin : '#FFE4B5',
	navajowhite : '#FFDEAD',
	navy : '#000080',
	oldlace : '#FDF5E6',
	olive : '#808000',
	olivedrab : '#6B8E23',
	orange : '#FFA500',
	orangered : '#FF4500',
	orchid : '#DA70D6',
	palegoldenrod : '#EEE8AA',
	palegreen : '#98FB98',
	paleturquoise : '#AFEEEE',
	palevioletred : '#DB7093',
	papayawhip : '#FFEFD5',
	peachpuff : '#FFDAB9',
	peru : '#CD853F',
	pink : '#FFC0CB',
	plum : '#DDA0DD',
	powderblue : '#B0E0E6',
	purple : '#800080',
	rebeccapurple : '#663399',
	red : '#FF0000',
	rosybrown : '#BC8F8F',
	royalblue : '#4169E1',
	saddlebrown : '#8B4513',
	salmon : '#FA8072',
	sandybrown : '#F4A460',
	seagreen : '#2E8B57',
	seashell : '#FFF5EE',
	sienna : '#A0522D',
	silver : '#C0C0C0',
	skyblue : '#87CEEB',
	slateblue : '#6A5ACD',
	slategray : '#708090',
	slategrey : '#708090',
	snow : '#FFFAFA',
	springgreen : '#00FF7F',
	steelblue : '#4682B4',
	tan : '#D2B48C',
	teal : '#008080',
	thistle : '#D8BFD8',
	tomato : '#FF6347',
	turquoise : '#40E0D0',
	violet : '#EE82EE',
	wheat : '#F5DEB3',
	white : '#FFFFFF',
	whitesmoke : '#F5F5F5',
	yellow : '#FFFF00',
	yellowgreen : '#9ACD32'
};

module.exports = class Rainbow {

	/** 
	 * Fabrique une chaine de caractère représentant une couleur au format CSS
	 * @param xData une structure {r: int, g: int, b: int, a: float}
	 * @return code couleur CSS au format rgb(r, g, b) ou rgba(r, g, b, a)
	 */
	static rgba(xData) {
		return Rainbow._buildRGBAFromStructure(Rainbow.parse(xData));
	}
	
	/**
	 * Analyse une valeur d'entrée pour construire une structure avec les 
	 * composantes "r", "g", "b", et eventuellement "a".
	 */ 
	static parse(xData) {
		if (typeof xData === "object") {
			return xData;
		} else if (typeof xData === "number") {
			return Rainbow._buildStructureFromInt(xData);
		} else if (typeof xData === "string") {
			xData = xData.toLowerCase();
			if (xData in COLORS) {
				xData = COLORS[xData];
			}
			switch (xData.length) {
				case 3:
					return Rainbow._buildStructureFromString3(xData);
					
				case 4:
					if (xData[0] === '#') {
						return Rainbow._buildStructureFromString3(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				case 6:
					return Rainbow._buildStructureFromString6(xData);
					
				case 7:
					if (xData[0] === '#') {
						return Rainbow._buildStructureFromString6(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				default:
					let rx = xData.match(/^rgb\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)$/);
					if (rx) {
						return {r: rx[1] | 0, g: rx[2] | 0, b: rx[3] | 0};
					} else {
						rx = xData.match(/^rgba\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([.0-9]+) *\)$/);
						if (rx) {
							return {r: rx[1] | 0, g: rx[2] | 0, b: rx[3] | 0, a: parseFloat(rx[4])};
						} else {
							throw new Error('invalid color structure ' + xData);
						}
					}
			}
		}
	}
	
	/**
	 * Génère un spectre entre deux valeurs de couleurs
	 * La fonction renvoi 
	 */
	static spectrum(sColor1, sColor2, nSteps) {
		let c1 = Rainbow.parse(sColor1);
		let c2 = Rainbow.parse(sColor2);
		
		let nSecur = 100;
		
		function getMedian(x1, x2) {
			if (x1 === undefined) {
				throw new Error('first color is undefined');
			}
			if (x2 === undefined) {
				throw new Error('second color is undefined');
			}
			return {
				r: (x1.r + x2.r) >> 1,
				g: (x1.g + x2.g) >> 1,
				b: (x1.b + x2.b) >> 1
			};			
		}
		
		function fillArray(a, x1, x2, n1, n2) {
			let m = getMedian(x1, x2);
			let n = (n1 + n2) >> 1;
			if (--nSecur < 0) {
				return a;
			}
			if (Math.abs(n1 - n2) > 1) {
				fillArray(a, x1, m, n1, n);
				fillArray(a, m, x2, n, n2);
			}
			a[n1] = x1;
			a[n2] = x2;
			return a;
		}
		
		return fillArray([], c1, c2, 0, nSteps - 1).map(function(c) {
			return Rainbow.rgba(c);
		}, this);
	}
	
	/**
	 * Generate a gradient
	 * @param oPalette palette definition
	 * 
	 * {
	 * 		start: value,
	 * 		stop1: value,
	 * 		stop2: value,
	 * 		...
	 * 		stopN: value,
	 * 		end: value
	 * },
	 * 
	 * example :
	 * {
	 * 		0: '#00F',
	 * 		50: '#FF0',
	 * 		100: '#F00'
	 * }
	 * rappel : une palette d'indices de 0 à 100 dispose de 101 entrée
	 */
	static gradient(oPalette) {
		let aPalette = [];
		let sColor;
		let sLastColor = null;
		let nPal;
		let nLastPal = 0;
		for (let iPal in oPalette) {
			nPal = iPal | 0;
			sColor = oPalette[iPal];
			if (sLastColor !== null) {
				aPalette = aPalette.concat(Rainbow.spectrum(sLastColor, sColor, nPal - nLastPal + 1).slice(1));
			} else {
				aPalette[nPal] = Rainbow.rgba(sColor);
			}
			sLastColor = sColor;
			nLastPal = nPal;
		}
		return aPalette;
	}

	static _buildStructureFromInt(n) {
		let r = (n >> 16) & 0xFF;
		let g = (n >> 8) & 0xFF;
		let b = n & 0xFF;
		return {r: r, g: g, b: b};
	}
	
	static _buildStructureFromString3(s) {
		let r = parseInt('0x' + s[0] + s[0]);
		let g = parseInt('0x' + s[1] + s[1]);
		let b = parseInt('0x' + s[2] + s[2]);
		return {r: r, g: g, b: b};
	}

	static _buildStructureFromString6(s) {
		let r = parseInt('0x' + s[0] + s[1]);
		let g = parseInt('0x' + s[2] + s[3]);
		let b = parseInt('0x' + s[4] + s[5]);
		return {r: r, g: g, b: b};
	}

	static _buildRGBAFromStructure(oData) {
		let s1 = 'rgb';
		let s2 = oData.r.toString() + ', ' + oData.g.toString() + ', ' + oData.b.toString();
		if ('a' in oData) {
			s1 += 'a';
			s2 += ', ' + oData.a.toString();
		}
		return s1 + '(' + s2 + ')';
	}
	
	static _buildString3FromStructure(oData) {
		let sr = ((oData.r >> 4) & 0xF).toString(16);
		let sg = ((oData.g >> 4) & 0xF).toString(16);
		let sb = ((oData.b >> 4) & 0xF).toString(16);
		return sr + sg + sb;
	}

	static byte(n) {
		return Math.min(255, Math.max(0, n | 0));
	}

	static brightness(color, f) {
		let c = Rainbow.parse(color);
		c.r = Rainbow.byte(f * c.r);
		c.g = Rainbow.byte(f * c.g);
		c.b = Rainbow.byte(f * c.b);
		return c;
	}
};


/***/ }),

/***/ "./src/Random.js":
/*!***********************!*\
  !*** ./src/Random.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @class O876.Random
 * a FALSE random very false...
 * generated random numbers, with seed
 * used for predictable landscape generation
 */

const SB = __webpack_require__(/*! ./SpellBook */ "./src/SpellBook.js");

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
     * randomly pick an item from an array or a string
     * @param aArray {array|string}
     * @param [bRemove] {boolean} if true the item is removed from the array
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


/***/ }),

/***/ "./src/SpellBook.js":
/*!**************************!*\
  !*** ./src/SpellBook.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
};


module.exports = SpellBook;

/***/ }),

/***/ "./src/algorithms/Astar/Astar.js":
/*!***************************************!*\
  !*** ./src/algorithms/Astar/Astar.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by ralphy on 06/09/17.
 */

const Helper = __webpack_require__(/*! ../../geometry/Helper */ "./src/geometry/Helper.js");
const Nood = __webpack_require__(/*! ./Nood */ "./src/algorithms/Astar/Nood.js");
const NoodList = __webpack_require__(/*! ./NoodList */ "./src/algorithms/Astar/NoodList.js");
const Emitter = __webpack_require__(/*! ../../Emitter */ "./src/Emitter.js");
const Point = __webpack_require__(/*! ../../geometry/Point */ "./src/geometry/Point.js");
const SB = __webpack_require__(/*! ../../SpellBook */ "./src/SpellBook.js");

/**
 * @class
 * this class is an implementation of a-star path finding algorithm
 * how to use :
 * const pf = new Astar()
 * pf.init({
 * 	grid: [[][]..] give a 2D array of cells here
 * 	walkable: code for walkable cell in the grid
 * 	diagonals: true if you want to allow diagonal moves
 * 	max: maximum iteration (act as watch dog)
 * })
 * pf.find(xfrom, yfrom, xto, yto)
 */
module.exports = class Astar {
	constructor() {
		// configuration
		this._bUseDiagonals = false;
        this._grid = null;
        this._width = 0;
        this._height = 0;
		this.MAX_ITERATIONS = 4096;
        this.GRID_BLOCK_WALKABLE = 0;

		// working objects and variables
        this.oOpList = null;
        this.oClList = null;
        this.aPath = null;
		this.nIterations = 0;

		// utilities
		this.emitter = new Emitter();
	}

    on() { this.emitter.on(...arguments); return this; }
    off() { this.emitter.off(...arguments); return this; }
    one() { this.emitter.one(...arguments); return this; }
    trigger() { this.emitter.trigger(...arguments); return this; }

    /**
	 * modifies a cell value
     */
	_setCell(x, y, n) {
		if (this._grid[y] !== undefined && this._grid[y][x] !== undefined) {
			this._grid[y][x] = n;
		} else {
			throw new Error(
				'Astar: writing tile out of Grid: ' + x + ', ' + y);
		}
	}

	_getCell(x, y) {
		if (this._grid[y]) {
			if (x < this._grid[y].length) {
				return this._grid[y][x];
			}
		}
		throw new Error('Astar: read tile out of Grid: ' + x + ', ' + y);
	}

	_isCellWalkable(x, y) {
		try {
			let r = {
				walkable: this._getCell(x, y) === this.GRID_BLOCK_WALKABLE,
				cell: {
					x: x,
					y: y
				}
			};
			this.trigger('walkable', r);
			return r.walkable;
		} catch (e) {
			return false;
		}
	}

	_closeNood(x, y) {
		let n = this.oOpList.get(x, y);
		if (n) {
			this.oClList.set(x, y, n);
			this.oOpList.del(x, y);
		}
	}

	_addAdjacent(x, y, xArrival, yArrival) {
		let i, j;
		let i0, j0;
		let oTmp;
		let w = this._width, h = this._height, bDiag = this._bUseDiagonals;
		for (i0 = -1; i0 <= 1; i0++) {
			i = x + i0;
			if ((i < 0) || (i >= w)) {
				continue;
			}
			for (j0 = -1; j0 <= 1; j0++) {
				if (!bDiag && (j0 * i0) !== 0) {
					continue;
				}
				j = y + j0;
				if ((j < 0) || (j >= h)) {
					continue;
				}
				if ((i === x) && (j === y)) {
					continue;
				}
				if (!this._isCellWalkable(i, j)) {
					continue;
				}

				if (!this.oClList.exists(i, j)) {
					oTmp = new Nood();
					oTmp.fGCost = this.oClList.get(x, y).fGCost	+ Helper.distance(i, j, x, y);
					oTmp.fHCost = Helper.distance(i, j, xArrival, yArrival);
					oTmp.fFCost = oTmp.fGCost + oTmp.fHCost;
					oTmp.oPos = new Point(i, j);
					oTmp.oParent = new Point(x, y);

					if (this.oOpList.exists(i, j)) {
						if (oTmp.fFCost < this.oOpList.get(i, j).fFCost) {
							this.oOpList.set(i, j, oTmp);
						}
					} else {
						this.oOpList.set(i, j, oTmp);
					}
				}
			}
		}
	}

	// Recherche le meilleur noeud de la liste et le renvoi
	_bestNood(oList) {
		let oBest = null;
		let oNood;

		for (let iNood in oList.oList) {
			oNood = oList.oList[iNood];
			if (oBest === null) {
				oBest = oNood;
			} else if (oNood.fFCost < oBest.fFCost) {
				oBest = oNood;
			}
		}
		return oBest;
	}

    _buildPath(xTo, yTo) {
        let oCursor = this.oClList.get(xTo, yTo);
        if (oCursor !== null) {
            while (!oCursor.isRoot()) {
                this.aPath.unshift({
                    x: oCursor.oPos.x,
                    y: oCursor.oPos.y
                });
                oCursor = this.oClList.get(oCursor.oParent.x, oCursor.oParent.y);
            }
        }
    }

	find(xFrom, yFrom, xTo, yTo) {
		this.reset();
		let oBest;
		let oDepart = new Nood();
		oDepart.oPos = new Point(xFrom, yFrom);
		oDepart.oParent = new Point(xFrom, yFrom);
		let xCurrent = xFrom;
		let yCurrent = yFrom;
		this.oOpList.add(oDepart);
		this._closeNood(xCurrent, yCurrent);
		this._addAdjacent(xCurrent, yCurrent, xTo, yTo);

		let iIter = 0, MAX = this.MAX_ITERATIONS;

		while (!((xCurrent === xTo) && (yCurrent === yTo)) && (!this.oOpList.empty())) {
			oBest = this._bestNood(this.oOpList);
			if (!oBest) {
				// could not find path
                throw new Error('Astar: no path to destination');
			}
			xCurrent = oBest.oPos.x;
			yCurrent = oBest.oPos.y;
			this._closeNood(xCurrent, yCurrent);
			this._addAdjacent(oBest.oPos.x, oBest.oPos.y, xTo, yTo);
			if (++iIter > MAX) {
				throw new Error('Astar: too much iterations');
			}
		}
		if (this.oOpList.empty() && !((xCurrent === xTo) && (yCurrent === yTo))) {
			throw new Error('Astar: no path to destination');
		}
		this.nIterations = iIter;
		this._buildPath(xTo, yTo);
		return this.aPath;
	}

    /**
	 * Changes a cell value inside the grid
     * @param x {number} cell coordinates
     * @param y {number} cell coordinates
     * @param (v) {number} new value
     * @return {*}
     */
	cell(x, y, v) {
        if (v === undefined) {
            return this._getCell(x, y);
        } else {
            this._setCell(x, y, v);
            return this;
        }
    }

    /**
     * resets the grid
     * @return {*}
     */
    reset() {
        this.oOpList = new NoodList();
        this.oClList = new NoodList();
        this.aPath = [];
        this.nIterations = 0;
        return this;
    }

    /**
     * Setter/Getter of the internal grid.
     * @param (g) {[]}
     * @return {[]|Astar}
     */
    grid(g) {
        if (g !== undefined) {
            this._height = g.length;
            this._width = g[0].length;
        }
        return SB.prop(this, '_grid', g);
    }

	/**
	 * Setter/getter of the walkable code.
	 * This code is use to determine if a grid cell is walkable or not.
	 * @param (w) {string|number}
	 * @return {string|number|Astar}
	 */
	walkable(w) {
		return SB.prop(this, 'GRID_BLOCK_WALKABLE', w);
	}

	/**
	 * Setter/getter of the diagonal flag.
	 * if set to true, the path finder will cross the grid diagonaly if needed.
	 * @param (b) {boolean}
	 * @return {boolean|Astar}
	 */
	diagonals(b) {
		return SB.prop(this, '_bUseDiagonals', b);
	}
};


/***/ }),

/***/ "./src/algorithms/Astar/Nood.js":
/*!**************************************!*\
  !*** ./src/algorithms/Astar/Nood.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by ralphy on 04/09/17.
 */

const Point = __webpack_require__(/*! ../../geometry/Point.js */ "./src/geometry/Point.js");

module.exports = class Nood {
	constructor() {
		this.fGCost = 0.0;
		this.fHCost = 0.0;
		this.fFCost = 0.0;
		this.oParent = new Point(0, 0);
		this.oPos = new Point(0, 0);
	}

	isRoot() {
		return this.oParent.x === this.oPos.x && this.oParent.y === this.oPos.y;
	}
};


/***/ }),

/***/ "./src/algorithms/Astar/NoodList.js":
/*!******************************************!*\
  !*** ./src/algorithms/Astar/NoodList.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Created by ralphy on 06/09/17.
 */

/**
 * The NoodList class is a simple class aimed at facilitating nood list manipulations
 */
module.exports = class NoodList {
	constructor() {
		this.oList = {};
	}

	/**
	 * adds an instance of Nood in the list
	 * @param oNood
	 */
	add(oNood) {
		this.set(oNood.oPos.x, oNood.oPos.y, oNood);
	}

	/**
	 * Sets an instance of Nood in the list
	 * a Nood is indexed by its position. Thus two Nood shall not have the same x and y pair
	 * @param x {number}
	 * @param y {number}
	 * @param oNood {Nood}
	 */
	set(x, y, oNood) {
		this.oList[this.getKey(x, y)] = oNood;
	}

	/**
	 * Returns the numbers of Nood in the list
	 * @return {number}
	 */
	count() {
		return Object(this.oList).length;
	}

	/**
	 * Returns true if the spécified position (x, y) has a matching Nood in the list
	 * @param x {number}
	 * @param y {number}
	 * @returns {boolean}
	 */
	exists(x, y) {
		return this.getKey(x, y) in this.oList;
	}

	/**
	 * Creates a key from an x and y values
	 * @param x {number}
	 * @param y {number}
	 * @returns {string}
	 */
	getKey(x, y) {
		return x.toString() + '__' + y.toString();
	}

	/**
	 * Gets the Nood matching the given x y pair
	 * Returns null if does not exists
	 * @param x {number}
	 * @param y {number}
	 * @returns {Nood|null}
	 */
	get(x, y) {
		return this.oList[this.getKey(x, y)] || null;
	}

	/**
	 * Remove a Nood from the list with the given coordinates
	 * @param x {number}
	 * @param y {number}
	 */
	del(x, y) {
		delete this.oList[this.getKey(x, y)];
	}

	/**
	 * Returns true if the liste is empty
	 * @returns {boolean}
	 */
	empty() {
		return this.count() === 0;
	}
};

/***/ }),

/***/ "./src/algorithms/Astar/index.js":
/*!***************************************!*\
  !*** ./src/algorithms/Astar/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Astar = __webpack_require__(/*! ./Astar */ "./src/algorithms/Astar/Astar.js");

module.exports = Astar;


/***/ }),

/***/ "./src/algorithms/Bresenham.js":
/*!*************************************!*\
  !*** ./src/algorithms/Bresenham.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This class implements the bresenham algorithm
 * and extend its use for other purpose than drawing pixel lines
 * good to GIT
 */
module.exports = class Bresenham {
	/**
	 * This function will virtually draw points along a line
	 * and will call back a plot function. 
	 * The line will start at x0, y0 and will end at x1, y1
	 * Each time a points is "drawn" a callback is done 
	 * if the callback returns false, the line function will stop and return false
	 * else the line function will return an array of plots
	 * @param x0 starting point x
	 * @param y0 starting point y
	 * @param x1 ending point x
	 * @param y1 ending point y
	 * @param pCallback a plot function of type function(x, y, n) { return bool; }
	 * avec x, y les coordonnées du point et n le numéro duj point
	 * @returns {Boolean} false if the fonction has been canceled
	 */
	static line(x0, y0, x1, y1, pCallback) {
		x0 |= 0;
		y0 |= 0;
		x1 |= 0;
		y1 |= 0;
		let dx = Math.abs(x1 - x0);
		let dy = Math.abs(y1 - y0);
		let sx = (x0 < x1) ? 1 : -1;
		let sy = (y0 < y1) ? 1 : -1;
		let err = dx - dy;
		let e2;
		let n = 0;
		while (true) {
			if (pCallback) {
				if (pCallback(x0, y0, n) === false) {
					return false;
				}
			}
			if (x0 === x1 && y0 === y1) {
				break;
			}
			e2 = err << 1;
			if (e2 > -dy) {
				err -= dy;
				x0 += sx;
			}
			if (e2 < dx) {
				err += dx;
				y0 += sy;
			}
			++n;
		}
		return true;
	}
};


/***/ }),

/***/ "./src/algorithms/Easing.js":
/*!**********************************!*\
  !*** ./src/algorithms/Easing.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Interface de controle des mobile 
 * O876 Raycaster project
 * @class O876.Easing
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger un mobile de manière non-lineaire
 * Avec des coordonnée de dépat, d'arriver, et un temps donné
 * L'option lineaire est tout de même proposée.
 * good to GIT
 */
module.exports = class Easing {

	constructor() {
		this.xStart = 0;
		this.xEnd = 0;
		this.x = 0;
		this.nTime = 0;
		this.iTime = 0;
		this.fWeight = 1;
		this.pFunction = null;
	}

    /**
	 * Will define de starting value
     * @param x {number}
     * @returns {O876.Easing}
     */
	from(x) {
		this.xStart = this.x = x;
		return this;
	}

    /**
	 * Will define the ending value
     * @param x {number}
     * @returns {O876.Easing}
     */
	to(x) {
		this.xEnd = x;
		return this;
	}

    /**
	 * Will define the duration of the transition
     * @param t {number} arbitrary unit
     * @returns {O876.Easing}
     */
	during(t) {
		this.nTime = t;
		this.iTime = 0;
		return this;
	}

	/**
	 * Définition de la fonction d'Easing
	 * @param xFunction {string|Function} fonction à choisir parmi :
	 * linear : mouvement lineaire uniforme
	 * smoothstep : accelération et déccelération douce
	 * smoothstepX2 : accelération et déccelération moyenne
	 * smoothstepX3 : accelération et déccelération brutale
	 * squareAccel : vitesse 0 à T-0 puis uniquement accelération 
	 * squareDeccel : vitesse max à T-0 puis uniquement deccelération
	 * cubeAccel : vitesse 0 à T-0 puis uniquement accelération brutale 
	 * cubeDeccel : vitesse max à T-0 puis uniquement deccelération brutale
	 * sine : accelération et deccelération brutal, vitesse nulle à mi chemin
	 * cosine : accelération et deccelération selon le cosinus, vitesse max à mi chemin
	 * weightAverage : ... me rapelle plus 
	 */
	use(xFunction) {
		switch (typeof xFunction) {
			case 'string':
				this.pFunction = this['_' + xFunction].bind(this);
			break;

			case 'function':
				this.pFunction = xFunction;
			break;

			default:
				throw new Error('unknown function type');
		}
		return this;
	}
	
	/**
	 * Calcule les coordonnée pour le temps t
	 * mets à jour les coordonnée x et y de l'objets
	 * @param t {number} temps
	 * si "t" est indéfini, utilise le timer interne 
	 */
	next(t) {
		if (t === undefined) {
			t = ++this.iTime;
		} else {
			this.iTime = t;
		}
		let p = this.pFunction;
		if (typeof p !== 'function') {
			throw new Error('easing function is invalid : ' + p);
		}
		let v = p(t / this.nTime);
		this.x = this.xEnd * v + (this.xStart * (1 - v));
		return this;
	}

	val() {
		return this.x;
	}

	over() {
		return this.iTime >= this.nTime;
	}

	_linear(v) {
		return v;
	}
	
	_smoothstep(v) {
		return v * v * (3 - 2 * v);
	}
	
	_smoothstepX2(v) {
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	}
	
	_smoothstepX3(v) {
		v = v * v * (3 - 2 * v);
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	}
	
	_squareAccel(v) {
		return v * v;
	}
	
	_squareDeccel(v) {
		return 1 - (1 - v) * (1 - v);
	}
	
	_cubeAccel(v) {
		return v * v * v;
	}
	
	_cubeDeccel(v) {
		return 1 - (1 - v) * (1 - v) * (1 - v);
	}
	
	_cubeInOut(v) {
		if (v < 0.5) {
			v = 2 * v;
			return v * v * v;
		} else {
			v = (1 - v) * 2;
			return v * v * v;
		}
	}
	
	_sine(v) {
		return Math.sin(v * Math.PI / 2);
	}
	
	_cosine(v) {
		return 0.5 - Math.cos(-v * Math.PI) * 0.5;
	}
	
	_weightAverage(v) {
		return ((v * (this.nTime - 1)) + this.fWeight) / this.nTime;
	}
	
	_quinticBezier(v) {
		let ts = v * this.nTime;
		let tc = ts * this.nTime;
		return 4 * tc - 9 * ts + 6 * v;
	}
};

/***/ }),

/***/ "./src/algorithms/Perlin.js":
/*!**********************************!*\
  !*** ./src/algorithms/Perlin.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const SpellBook = __webpack_require__(/*! ../SpellBook */ "./src/SpellBook.js");
const Random = __webpack_require__(/*! ../Random */ "./src/Random.js");
const Rainbow = __webpack_require__(/*! ../Rainbow */ "./src/Rainbow.js");
const Cache2D = __webpack_require__(/*! ../structures/Cache2D */ "./src/structures/Cache2D.js");


class Perlin {

	constructor() {
		this._size = 64;
		this._width = 64;
		this._height = 64;
		this._octaves = 8;
		this._interpolate = null;
		this._rand = new Random();
		this.interpolation('cosine');
		this._cache = new Cache2D();
		this._seed = 1;
	}

	seed(n) {
		return SpellBook.prop(this, '_seed', n);
	}
	
	size(n) {
		if (n === undefined) {
			return this._size;
		} else {
			let i = 10;
			while (i > 0) {
				let i2 = 1 << i;
				if (i2 === n) {
					this._width = i2;
					this._height = i2;
					this._octaves = i;
					this._size = n;
					return this;
				}
				--i;
			}
			throw new Error('size must be a power of 2 between 2 and 1024');
		}
	}
	
	width() {
		return this._width;
	}

	height(h) {
		return this._height;
	}
	
	octaves(n) {
		return this._octaves;
	}

	/**
	 * Generate white noise on a matrix
	 * @param w matrix width
	 * @param h matrix height
	 * @return {array}
	 */
	generateWhiteNoise(w, h) {
		let r, a = [];
		for (let x, y = 0; y < h; ++y) {
			r = []; 
			for (x = 0; x < w; ++x) {
				r.push(this._rand.rand());
			}
			a.push(r);
		}
		return a;
	}

	/**
	 * Linear interpolation
	 * @param x0 minimum
	 * @param x1 maximum
	 * @param alpha value between 0 and 1
	 * @return float, interpolation result
	 */
	linearInterpolate(x0, x1, alpha) {
		return x0 * (1 - alpha) + alpha * x1;
	}

	/**
	 * Cosine Interpolation
	 */
	cosineInterpolate(x0, x1, mu) {
		let mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
   		return x0 * (1 - mu2) + x1 * mu2;
	}

	/**
	 * selects or define an interpolation function
	 * @param f string | function the new interpolation function
	 * f can be either a string ('cosine', 'linear') or a custom function
	 */
	interpolation(f) {
		switch (typeof f) {
			case 'string':
				if ((f + 'Interpolate') in this) {
					this._interpolate = this[f + 'Interpolate'];
				} else {
					throw new Error('only "linear" or "cosine" interpolation');
				}
				return this;
				
			case 'function':
				this._interpolate = f;
				return this;
				
			case 'undefined':
				return this._interpolate;
		}
		return this;
	}

	generateSmoothNoise(aBaseNoise, nOctave) {
		let w = aBaseNoise.length;
		let h = aBaseNoise[0].length;
		let aSmoothNoise = [];
		let r;
		let nSamplePeriod = 1 << nOctave;
		let fSampleFreq = 1 / nSamplePeriod;
		let xs = [], ys = [];
		let hBlend, vBlend, fTop, fBottom;
		for (let x, y = 0; y < h; ++y) {
      		ys[0] = (y / nSamplePeriod | 0) * nSamplePeriod;
      		ys[1] = (ys[0] + nSamplePeriod) % h;
      		hBlend = (y - ys[0]) * fSampleFreq;
      		r = [];
      		for (x = 0; x < w; ++ x) {
       			xs[0] = (x / nSamplePeriod | 0) * nSamplePeriod;
      			xs[1] = (xs[0] + nSamplePeriod) % w;
      			vBlend = (x - xs[0]) * fSampleFreq;

      			fTop = this._interpolate(aBaseNoise[ys[0]][xs[0]], aBaseNoise[ys[1]][xs[0]], hBlend);
      			fBottom = this._interpolate(aBaseNoise[ys[0]][xs[1]], aBaseNoise[ys[1]][xs[1]], hBlend);
     			
     			r.push(this._interpolate(fTop, fBottom, vBlend));
      		}

      		aSmoothNoise.push(r);
		}
		return aSmoothNoise;
	}

	generatePerlinNoise(aBaseNoise, nOctaveCount) {
		let w = aBaseNoise.length;
		let h = aBaseNoise[0].length;
		let aSmoothNoise = [];
		let fPersist = 0.5;

		for (let i = 0; i < nOctaveCount; ++i) {
			aSmoothNoise.push(this.generateSmoothNoise(aBaseNoise, i));
		}

		let aPerlinNoise = [];
		let fAmplitude = 1;
		let fTotalAmp = 0;
		let x, y, r;

		for (y = 0; y < h; ++y) {
			r = [];
			for (x = 0; x < w; ++x) {
				r.push(0);
			}
			aPerlinNoise.push(r);
		}

		for (let iOctave = nOctaveCount - 1; iOctave >= 0; --iOctave) {
			fAmplitude *= fPersist;
			fTotalAmp += fAmplitude;

			for (y = 0; y < h; ++y) {
				r = [];
				for (x = 0; x < w; ++x) {
					aPerlinNoise[y][x] += aSmoothNoise[iOctave][y][x] * fAmplitude;
				}
			} 
		}
		for (y = 0; y < h; ++y) {
			r = [];
			for (x = 0; x < w; ++x) {
				aPerlinNoise[y][x] /= fTotalAmp;
			}
		}
		return aPerlinNoise;
	}


	static hash (a) {
		if (a < 0) {
			let b = 0, h = Perlin.hash(-a);
			while (h) {
				b = (b << 4) | h & 15;
				h >>= 4;
			}
			return Math.abs(b);
		}
	    a = (a ^ 61) ^ (a >> 16);
	    a = a + (a << 3);
	    a = a ^ (a >> 4);
	    a = a * 0x27d4eb2d;
	    a = a ^ (a >> 15);
    	return a;
    }

	/** 
	 * Calcule le hash d'une région
	 * Permet de choisir une graine aléatoire
	 * et de raccorder seamlessly les région adjacente
	 */
	static getPointHash(x, y) {
		let xh = Perlin.hash(x).toString().split('');
		let yh = Perlin.hash(y).toString().split('');
		let s = xh.shift() + yh.shift() + '.';
		if (s === '--.') {
		//	s = '0.';
		}
		while (xh.length || yh.length) {
			if (xh.length) {
				s += xh.shift();
			}
			if (yh.length) {
				s += yh.shift();
			}
		}
		return parseFloat(s);
	}
	
	generate(x, y, callbacks) {
		if (x >= Number.MAX_SAFE_INTEGER || x <= -Number.MAX_SAFE_INTEGER || y >= Number.MAX_SAFE_INTEGER || y <= -Number.MAX_SAFE_INTEGER) {
			throw new Error('trying to generate x:' + x + ' - y:' + y + ' - maximum safe integer is ' + Number.MAX_SAFE_INTEGER + ' !');
		}
		callbacks = callbacks || {};
		let perlin = 'perlin' in callbacks ? callbacks.perlin : null;
		let noise = 'noise' in callbacks ? callbacks.noise : null;
		let cached = this._cache.getPayload(x, y);
		if (cached) {
			return cached;
		}
		
		const gwn = (xg, yg) => {
			let nSeed = Perlin.getPointHash(xg, yg);
			this._rand.seed(nSeed + this._seed);
			let aNoise = this.generateWhiteNoise(this.width(), this.height());
			if (noise) {
				aNoise = noise(xg, yg, aNoise);
			}
			return aNoise;
		};

		const merge33 = a33 => {
			let h = this.height();
			let a = [];
			for (let y, ya = 0; ya < 3; ++ya) {
				for (y = 0; y < h; ++y) {
					a.push(a33[ya][0][y].concat(a33[ya][1][y], a33[ya][2][y]));
				}
			}
			return a;
		};

		const extract33 = a => {
			let w = this.width();
			let h = this.height();
			return a.slice(h, h * 2).map(function(r) { return r.slice(w, w * 2); });
		};

		let a0 = [
			[gwn(x - 1, y - 1), gwn(x, y - 1), gwn(x + 1, y - 1)],
			[gwn(x - 1, y), gwn(x, y), gwn(x + 1, y)],
			[gwn(x - 1, y + 1), gwn(x, y + 1), gwn(x + 1, y + 1)]
		];

		let a1 = merge33(a0);
		let a2 = this.generatePerlinNoise(a1, this._octaves);
		let a3 = extract33(a2);
		if (perlin) {
			a3 = perlin(x, y, a3);
		}
		this._cache.push(x, y, a3);
		return a3;
	}

    /**
     * Applique une palette au bruit généré
     * @param aNoise {Array} an array produced by generate()
     * @param oContext {CanvasRenderingContext2D}
     */
    static colorize(aNoise, aPalette) {
        aPalette = aPalette || Rainbow.gradient({
            0: '#008',
            44: '#00F',
            49: '#44F',
            50: '#864',
            74: '#080',
            75: '#555',
            89: '#777',
            90: '#AAA',
            99: '#FFF'
        });
        let h = aNoise.length, w = aNoise[0].length, pl = aPalette.length;
        let data = [];
        aNoise.forEach(function(r, y) {
            r.forEach(function(p, x) {
                let nOfs = (y * w + x) << 2;
                let rgb = Rainbow.parse(aPalette[Math.min(aPalette.length - 1, p * pl | 0)]);
                if (rgb === undefined) {
                    throw new Error('entry "' + (p * pl | 0) + '" is not in palette');
                }
                data[nOfs] = rgb.r;
                data[nOfs + 1] = rgb.g;
                data[nOfs + 2] = rgb.b;
                data[nOfs + 3] = 255;
            });
        });
        return data;
    }
}

module.exports = Perlin;

/***/ }),

/***/ "./src/algorithms/SquareSpiral.js":
/*!****************************************!*\
  !*** ./src/algorithms/SquareSpiral.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @class SquareSpiral
 * This simple class builds a squared shape spiral
 * and reports all cells into an ordered list of Point
 * starting from the spiral center.
 */

module.exports = class SquareSpiral {
	/**
	 * Renvoie la largeur d'un carré de snail selon le niveau
	 * @param nLevel niveau
	 * @return int nombre d'élément sur le coté
	 */
	static _getLevelSquareWidth(nLevel) {
		return nLevel * 2 + 1;
	}
	
	/**
	 * Renvoie le nombre d'éléments qu'il y a dans un niveau
	 * @param nLevel niveau
	 * @return int nombre d'élément
	 */
	static _getLevelItemCount(nLevel) {
		let w = SquareSpiral._getLevelSquareWidth(nLevel);
		return 4 * w - 4;
	}
	
	/**
	 * Renvoie le niveau auquel appartient ce secteur
	 * le niveau 0 correspond au point 0, 0
	 */
	static _getLevel(x, y) {
		x = Math.abs(x);
		y = Math.abs(y);
		return Math.max(x, y);
	}
	
	/**
	 * Renvoie tous les secteurs de niveau spécifié
	 */
	static build(nLevelMin, nLevelMax) {
		if (nLevelMax === undefined) {
			nLevelMax = nLevelMin;
		}
		if (nLevelMin > nLevelMax) {
			throw new Error('levelMin must be lower or equal levelMax');
		}
		if (nLevelMin < 0) {
			return [];
		}
		let aSectors = [];
		let n, x, y;
		for (y = -nLevelMax; y <= nLevelMax; ++y) {
			for (x = -nLevelMax; x <= nLevelMax; ++x) {
				n = SquareSpiral._getLevel(x, y);
				if (n >= nLevelMin && n <= nLevelMax) {
					aSectors.push({x: x, y: y});
				}
			}
		}
		return aSectors;
	}
};


/***/ }),

/***/ "./src/algorithms/UnivGeneList.js":
/*!****************************************!*\
  !*** ./src/algorithms/UnivGeneList.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A partir d'une liste de mots, cette classe peut générer de nouveaux mots ressemblant à ceux de la liste
 */
const Random = __webpack_require__(/*! ../Random */ "./src/Random.js");

class UnivGeneList {

    constructor() {
        this._random = new Random();
        this._registries = {};
        this._exclusions = [];
    }

    /**
     * Ajoute une lettre à la liste des lettres du pattern du registre spécifié
     * @param oRegistry
     * @param pattern
     * @param letter
     */
    pushLetter(oRegistry, pattern, letter) {
        if (!(pattern in oRegistry)) {
            oRegistry[pattern] = letter;
        } else {
            oRegistry[pattern] += letter;
        }
    }

    /**
     * Chargement d'une liste et indexation
     * @param aList {string[]}
     * @param n {number}
     * @return {*}
     */
    indexListProb(aList, n) {
        const ALPHA = ('abcdefghijklmnopqrstuvwxyz').split('');
        let oRegistry = {};
        aList.forEach(word => {
            word = word.replace(/[^a-z]+/g, '');
            if (word.length > n) {
                for (let i = 0; i < word.length - n; ++i) {
                    let letter = word.charAt(i + n);
                    let pattern = word.substr(i, n);
                    this.pushLetter(oRegistry, pattern, letter);
                }
            }
        });
        return oRegistry;
    }

    indexListInitial(aList, n) {
        return aList.map(word => word.substr(0, n))
    }

    indexListFinal(aList, n) {
        let oRegistry = {};
        aList.forEach(word => {
            this.pushLetter(oRegistry, word.substr(-n - 1, n), word.substr(-1));
        });
        return oRegistry;
    }

    indexList(aList, nPatternLength) {
        if (aList.length === 0) {
            throw new Error('nothing to index, the list is empty');
        }
        aList = aList.filter(word => !!word);
        this._registries = {
            initial: this.indexListInitial(aList, nPatternLength),
            prob: this.indexListProb(aList, nPatternLength),
            final: this.indexListFinal(aList, nPatternLength)
        };
    }

    hasBeenIndexed() {
        let regInitial = this._registries.initial;
        let regProb = this._registries.prob;
        let regFinal = this._registries.final;
        return regInitial && regProb && regFinal;
    }

    exclude(aList) {
        this._exclusions = this._exclusions.concat(aList);
    }

    generate(nLength, nPatternLength) {
        let random = this._random;
        let regInitial = this._registries.initial;
        let regProb = this._registries.prob;
        let regFinal = this._registries.final;
        if (!this.hasBeenIndexed()) {
            throw new Error('you must initialize registries by indexing a list');
        }
        let sPattern = this._random.randPick(regInitial);
        let sResult = sPattern;
        while (sResult.length < (nLength - 1)) {
            let p = regProb[sPattern] ? random.randPick(regProb[sPattern]) : '';
            if (p) {
                sResult += p;
                sPattern = sResult.substr(-nPatternLength);
            } else {
                return '';
            }
        }
        if (regFinal[sPattern]) {
            sResult += random.randPick(regFinal[sPattern]);
        } else if (regProb[sPattern]) {
            sResult += random.randPick(regProb[sPattern]);
        }
        if (this._exclusions.includes(sResult)) {
            return '';
        }
        return sResult;
    }
}

module.exports = UnivGeneList;

/***/ }),

/***/ "./src/algorithms/index.js":
/*!*********************************!*\
  !*** ./src/algorithms/index.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Bresenham = __webpack_require__(/*! ./Bresenham */ "./src/algorithms/Bresenham.js");
const Easing = __webpack_require__(/*! ./Easing */ "./src/algorithms/Easing.js");
const Perlin = __webpack_require__(/*! ./Perlin */ "./src/algorithms/Perlin.js");
const SquareSpiral = __webpack_require__(/*! ./SquareSpiral */ "./src/algorithms/SquareSpiral.js");
const Astar = __webpack_require__(/*! ./Astar */ "./src/algorithms/Astar/index.js");
const UnivGeneList = __webpack_require__(/*! ./UnivGeneList */ "./src/algorithms/UnivGeneList.js");

module.exports = {
    Bresenham,
    Easing,
    Perlin,
    SquareSpiral,
    Astar,
    UnivGeneList
};


/***/ }),

/***/ "./src/collider/Collider.js":
/*!**********************************!*\
  !*** ./src/collider/Collider.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @class Collider
 * The collider computes collision between sprites.
 * Sprites are positionned inside the collider grid, according to their position
 * Each sprites is tested against all other sprite in the surroundiing cells.
 */

const Vector = __webpack_require__(/*! ../geometry/Vector */ "./src/geometry/Vector.js");
const Grid = __webpack_require__(/*! ../structures/Grid */ "./src/structures/Grid.js");
const Sector = __webpack_require__(/*! ./Sector */ "./src/collider/Sector.js");
const SB = __webpack_require__(/*! ../SpellBook */ "./src/SpellBook.js");

module.exports = class Collider {
	constructor() {
        this._origin = new Vector(); // vector origine du layer
        this._grid = new Grid();
        this._grid.on('rebuild', function(data) {
            let oSector = new Sector();
            oSector.x = data.x;
            oSector.y = data.y;
            data.cell = oSector;
        });
        this._cellWidth = 0;
        this._cellHeight = 0;
	}

    cellWidth(w) {
        return SB.prop(this, '_cellWidth', w);
    }

    cellHeight(h) {
        return SB.prop(this, '_cellHeight', h);
    }

    width(w) {
        if (w === undefined) {
            return this._grid.width();
        } else {
            this._grid.width(w);
            return this;
        }
    }

    height(h) {
        if (h === undefined) {
            return this._grid.height();
        } else {
            this._grid.height(h);
            return this;
        }
    }

	/**
	 * Return the sector corresponding to the given coordinates
     * if the parameters are number, the real sector indices are used (0, 1, 2...)
	 * if the parameter is a Vector, its components are int-divided by cell size before application
	 * @param x {number} position x
	 * @param y {number} position y
	 * @return {*}
	 */
	sector(x, y) {
		if (y === undefined) {
			return this._grid.cell(x.x / this._cellWidth | 0, x.y / this._cellHeight | 0);
		} else {
			return this._grid.cell(x, y);
		}
	}

	/**
	 * Registers an object in the sector it belongs
	 * Unregisters the objet in all other sector
	 * @param oDummy {Dummy}
	 */
	track(oDummy) {
		let oOldSector = oDummy.colliderSector;
		let v = oDummy.position().sub(this._origin);
		let s = oDummy.dead() ? null : this.sector(v);
		if (s && oOldSector && s === oOldSector) {
			return;
		}
		if (oOldSector) {
			oOldSector.remove(oDummy);
		}
		if (s) {
			s.add(oDummy);
		}
		oDummy.colliderSector = s;
		return this;
	}

	/**
	 * Effectue tous les test de collision entre un objet et tous les autres objets
	 * contenus dans les secteur adjacent a celui de l'objet
	 * @param oDummy {Dummy}
	 * @return {Dummy[]} liste d'objet collisionnant
	 */
	collides(oDummy) {
		let a = [];
		let oSector = this.sector(oDummy.position().sub(this._origin));
		if (!oSector) {
			return a;
		}
		let x = oSector.x;
		let y = oSector.y;
		let xMin = Math.max(0, x - 1);
		let yMin = Math.max(0, y - 1);
		let xMax = Math.min(this.width() - 1, x + 1);
		let yMax = Math.min(this.height() - 1, y + 1);
		let ix, iy;
		for (iy = yMin; iy <= yMax; ++iy) {
			for (ix = xMin; ix <= xMax; ++ix) {
				a = a.concat(this.sector(ix, iy).collides(oDummy));
			}
		}
		return a;
	}
};

/***/ }),

/***/ "./src/collider/Dummy.js":
/*!*******************************!*\
  !*** ./src/collider/Dummy.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @class Mobile
 * This class manages a mobile object.
 */
const sb = __webpack_require__(/*! ../SpellBook */ "./src/SpellBook.js");
const geometry = __webpack_require__(/*! ../geometry */ "./src/geometry/index.js");
const Helper = geometry.Helper;
const Vector = geometry.Vector;

module.exports = class Dummy {
	constructor() {
		this._position = new Vector();
		this._dead = false; // les mobile noté "dead" doivent être retiré du jeu
		this._radius = 0;
		this._tangibility = {
			self: 1,
			hitmask: 1
		};
	}

	/**
	 * Renvoie true si le masque-tangibilité de ce dummy correspond au type-tangibilité du dummy spécifié
	 * @param dummy
	 */
	tangibleWith(dummy) {
		return (dummy._tangibility.self & this._tangibility.hitmask) !== 0;
	}

    /**
	 * Setter/getter du rayon du mobile
     * @param r
     * @returns {*}
     */
	radius(r) {
        return sb.prop(this, '_radius', r);
	}

    /**
	 * Setter/Getter de la position du mobile
     * @param p
     * @returns {*}
     */
	position(p) {
        return sb.prop(this, '_position', p);
	}

    /**
     * Setter/Getter of dead flag...
     * dead Mobile must be removed from game
     * @param b {boolean}
     * @return {boolean|Mobile}
     */
    dead(b) {
        return sb.prop(this, '_dead', b);
    }

    /**
	 * Calcule la distance entre le mobile et un autre mobile
     * @param oOther {Mobile}
     * @returns {*|float|number}
     */
	distanceTo(oOther) {
		let p1 = this.position();
		let p2 = oOther.position();
        return Helper.distance(p1.x, p1.y, p2.x, p2.y);
	}

    /**
	 * Renvoi l'angle entre les deux mobile (this et oOther) et l'axe X
     * @param oOther
     * @returns {number}
     */
	angleTo(oOther) {
        let p1 = this.position();
        let p2 = oOther.position();
        return Helper.angle(p1.x, p1.y, p2.x, p2.y);
	}

    /**
	 * renvoie true si les deux mobile se collisionne.
     * @param oOther {Dummy}
     * @returns {boolean}
     */
	hits(oOther) {
		return this.tangibleWith(oOther) && this.distanceTo(oOther) < this._radius + oOther.radius();
	}
};

/***/ }),

/***/ "./src/collider/Sector.js":
/*!********************************!*\
  !*** ./src/collider/Sector.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Classe enregistrant les mobile qui s'aventure dans un secteur particulier
 * du monde. LEs Mobile d'un même secteurs sont testé entre eux pour savoir
 * Qui entre en collision avec qui. */
module.exports = class Sector {
    constructor() {
        this._objects = [];
        this.x = -1;
        this.y = -1;
    }

    objects() {
        return this._objects;
    }

    add(oObject) {
        this._objects.push(oObject);
    }

    remove(oObject) {
        let objects = this._objects;
        let n = objects.indexOf(oObject);
        if (n >= 0) {
            objects.splice(n, 1);
        }
    }

    /**
     * Renvoie le nombre d'objet enregistrer dans le secteur
     * @return int
     */
    count() {
        return this._objects.length;
    }

    /** Renvoie l'objet désigné par son rang */
    get(i) {
        return this._objects[i] || null;
    }

    /** Renvoie les objets qui collisione avec l'objet spécifié */
    collides(oObject) {
        return this._objects
            .filter(function(o) {
                return o !== oObject &&
                    oObject.hits(o)
            });
    }
};




/***/ }),

/***/ "./src/collider/index.js":
/*!*******************************!*\
  !*** ./src/collider/index.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Dummy = __webpack_require__(/*! ./Dummy */ "./src/collider/Dummy.js");
const Collider = __webpack_require__(/*! ./Collider */ "./src/collider/Collider.js");
const Sector = __webpack_require__(/*! ./Sector */ "./src/collider/Sector.js");

module.exports = {
    Dummy,
    Collider,
    Sector
};

/***/ }),

/***/ "./src/geometry/Helper.js":
/*!********************************!*\
  !*** ./src/geometry/Helper.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Created by ralphy on 07/09/17.
 */

/**
 * A simple helper class
 */
module.exports = class Helper {
	/**
	 * Distance between 2 points
	 * @param x1 {Number} point 1 coordinates
	 * @param y1 {Number}
	 * @param x2 {Number} point 2 coordinates
	 * @param y2 {Number}
	 * @return {number} distance
	 */
	static distance(x1, y1, x2, y2) {
		let dx = x1 - x2;
		let dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	}

    /**
	 * Renvoie l'ange que fait la doite x1, y1, x2, y2
	 * avec l'axe des X+
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
	 * @return {number}
     */
	static angle(x1, y1, x2, y2) {
		return Math.atan2(y2 - y1, x2 - x1);
	}

	/**
	 * A partir d'un angle et d'une norme, calcule deux composant d'un référentiel rectangulaire
	 * @param angle
	 * @param norm
	 */
	static polar2rect(angle, norm) {
		return {dx: norm * Math.cos(angle), dy: norm * Math.sin(angle)};
	}
};

/***/ }),

/***/ "./src/geometry/Point.js":
/*!*******************************!*\
  !*** ./src/geometry/Point.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by ralphy on 04/09/17.
 */

const Helper = __webpack_require__(/*! ./Helper */ "./src/geometry/Helper.js");

module.exports = class Point {
	constructor(x, y) {
		if (typeof x === 'object' && ('x' in x) && ('y' in x)) {
			this.x = x.x;
			this.y = x.y;
		} else {
            this.x = x;
            this.y = y;
		}
	}

	/**
	 * return the distance between this point and the given point
	 * @param p {Point}
	 * @return {number}
	 */
	distance(p) {
		return Helper.distance(p.x, p.y, this.x, this.y);
	}
};

/***/ }),

/***/ "./src/geometry/Vector.js":
/*!********************************!*\
  !*** ./src/geometry/Vector.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by ralphy on 04/09/17.
 *
 * @class Vector
 * @property {number} x
 * @property {number} y
 */

const Helper = __webpack_require__(/*! ./Helper.js */ "./src/geometry/Helper.js");

module.exports = class Vector {
	/**
	 * The constructor accepts one two parameters
	 * If one parameter is given, the constructor will consider it as
	 * Vector and will build this vector accordingly.
	 * If two parameters are given (both numbers), the constructor will initialize the x and y
	 * components with these numbers.
	 * if no parameters are given : the vector will be ZERO
	 * @param (x) {Vector|number}
	 * @param (y) {number}
	 */
	constructor(x, y) {
		if (x instanceof Vector) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x || 0;
			this.y = y || 0;
		}
	}

    /**
	 * Mutable !
	 * Modifie x et y
     * @param x
     * @param y
     */
	set(x, y) {
		if (x instanceof Vector) {
			return this.set(x.x, x.y);
		}
		this.x = x;
		this.y = y;
		return this;
	}

	/**
	 * Immutable !
	 * returns a new Vector which is the sum of this instance + the given argument
	 * @param v {Vector}
	 * @returns {Vector}
	 */
	add(v) {
		return new Vector(v.x + this.x, v.y + this.y);
	}

	/**
	 * Immutable !
	 * returns a new Vector which is the diffrence of this instance and the given argument
	 * @param v
	 */
	sub(v) {
		return new Vector(this.x - v.x, this.y - v.y);
	}

	/**
	 * Immutable !
	 * returns a scalar product
	 * multiplies the vector components by a given value -(vector or number)
	 * @param f {Vector|number}
	 * @returns {Vector|number}
	 */
	mul(f) {
		if (f instanceof Vector) {
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

    /**
	 * Mutable
	 * Addition mutable des composante du vecteur
     * @param v {Vector}
     */
	translate(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

    /**
     * Mutable
     * Multiplication mutable des composante du vecteur
     * @param f {number}
     */
	scale(f) {
		this.x *= f;
		this.y *= f;
		return this;
	}

    /**
	 * Renvoie l'angle entre le vecteur et l'axe X
	 * si le vecteur est dans la direction x+ alors l'angle = 0
     */
	angle() {
		return Helper.angle(0, 0, this.x, this.y);
	}

	toString() {
		return [this.x, this.y].map(n => n.toString()).join(':');
	}

	fromPolar(a, s) {
		let v = Helper.polar2rect(a, s);
		this.set(v.dx, v.dy);
		return this;
	}
};

/***/ }),

/***/ "./src/geometry/View.js":
/*!******************************!*\
  !*** ./src/geometry/View.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Vector = __webpack_require__(/*! ./Vector */ "./src/geometry/Vector.js");
const sb =  __webpack_require__(/*! ../SpellBook */ "./src/SpellBook.js");

class View {
	constructor() {
		this._offset = new Vector();
		this._position = new Vector();
		this._width = 0;
		this._height = 0;
	}

	offset(v) {
		return sb.prop(this, '_offset', v);
	}

	position(v) {
		return sb.prop(this, '_position', v);
	}

	width(n) {
		return sb.prop(this, '_width', n);
	}

	height(n) {
		return sb.prop(this, '_height', n);
	}

	center() {
		this.offset(new Vector(this.width() >> 1, this.height() >> 1));
	}

	points() {
		let p0 = this._position.sub(this._offset);
		let p1 = p0.add(new Vector(this._width, this._height));
		return [p0, p1];
	}
}

/***/ }),

/***/ "./src/geometry/index.js":
/*!*******************************!*\
  !*** ./src/geometry/index.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Helper = __webpack_require__(/*! ./Helper */ "./src/geometry/Helper.js");
const Point = __webpack_require__(/*! ./Point */ "./src/geometry/Point.js");
const Vector = __webpack_require__(/*! ./Vector */ "./src/geometry/Vector.js");
const View = __webpack_require__(/*! ../geometry/View */ "./src/geometry/View.js");

module.exports = {
	Helper,
	Point,
	Vector,
	View
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const geometry = __webpack_require__(/*! ./geometry */ "./src/geometry/index.js");
const algorithms = __webpack_require__(/*! ./algorithms */ "./src/algorithms/index.js");
const SpellBook = __webpack_require__(/*! ./SpellBook */ "./src/SpellBook.js");
const Random = __webpack_require__(/*! ./Random */ "./src/Random.js");
const Rainbow = __webpack_require__(/*! ./Rainbow */ "./src/Rainbow.js");
const Emitter = __webpack_require__(/*! ./Emitter */ "./src/Emitter.js");
const collider = __webpack_require__(/*! ./collider */ "./src/collider/index.js");
const structures = __webpack_require__(/*! ./structures */ "./src/structures/index.js");
const Cache2D = __webpack_require__(/*! ./structures/Cache2D */ "./src/structures/Cache2D.js");

module.exports = {

	// namespaces
	algorithms,
	collider,
	geometry,
	structures,

	// classes
	SpellBook,
	Random,
	Rainbow,
	Emitter
};

/***/ }),

/***/ "./src/indexWeb.js":
/*!*************************!*\
  !*** ./src/indexWeb.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const o876 = __webpack_require__(/*! ./index */ "./src/index.js");

window.O876 = o876;


/***/ }),

/***/ "./src/structures/Cache2D.js":
/*!***********************************!*\
  !*** ./src/structures/Cache2D.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Permet de mettre en cache des information indéxées par une coordonnées 2D
 */
class Cache2D {
	constructor() {
		this._cache = [];
		this._cacheSize = 64;
	}

	getMetaData(x, y) {
		return this._cache.find(o => o.x === x && o.y === y);
	}

	getPayload(x, y) {
		let o = this.getMetaData(x, y);
		if (o) {
			return o.payload;
		} else {
			return null;
		}
	}

	push(x, y, payload) {
		let c = this._cache;
		if (!this.getMetaData(x, y)) {
			c.push({
				x, y, payload
			});
		}
		while (c.length > this._cacheSize) {
			c.shift();
		}
	}
}

module.exports = Cache2D;

/***/ }),

/***/ "./src/structures/Grid.js":
/*!********************************!*\
  !*** ./src/structures/Grid.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @class Grid
 * This class is a generic grid containing anything
 * When new items are needed (when the grid changes size and gets larger)
 * an event is fired : "rebuild" which can be handled to construct cell content.
 */
const sb = __webpack_require__(/*! ../SpellBook */ "./src/SpellBook.js");
const Emitter = __webpack_require__(/*! ../Emitter */ "./src/Emitter.js");

module.exports = class Grid {
	constructor() {
        this._cells = null;
        this._width = 0;
        this._height = 0;
        this.emitter = new Emitter();
	}

    on() { this.emitter.on(...arguments); return this; }
    off() { this.emitter.off(...arguments); return this; }
    one() { this.emitter.one(...arguments); return this; }
    trigger() { this.emitter.trigger(...arguments); return this; }


    /**
	 * Setter/Getter for a dimensionnal array of cells, wich represents the grid content.
     * @param (x) {array}
     * @return {Grid|array}
     */
	cells(x) {
        if (x !== undefined) {
            this._height = x.length;
            if (this._height) {
            	this._width = x[0].length;
			} else {
                this._width = 0;
			}
        }
		return sb.prop(this, '_cells', x);
	}

    /**
     * Setter/Getter for the grid width.
	 * setting a new width will rebuild the grid
     * @param (w) {number}
     * @return {Grid|number}
     */
    width(w) {
		if (w !== undefined) {
			this._rebuild(w, this._height);
		}
        return sb.prop(this, '_width', w);
    }

    /**
     * Setter/Getter for the grid height.
     * setting a new height will rebuild the grid
     * @param (h) {number}
     * @return {Grid|number}
     */
    height(h) {
        if (h !== undefined) {
            this._rebuild(this._width, h);
        }
        return sb.prop(this, '_height', h);
    }

    /**
	 * Rebuilds the grid according to the given dimensions
	 * @param w {number}
	 * @param h {number}
	 * @private
	 * @return {array}
	 */
	_rebuild(w, h) {
		let g = [];
		let x, y, aRow, data;
		for (y = 0; y < h; y++) {
			aRow = [];
			for (x = 0; x < w; x++) {
				data = {x: x, y: y, width: w, height: h, cell: null};
				this.trigger('rebuild', data);
				aRow.push(data.cell);
			}
			g.push(aRow);
		}
		this._width = w;
		this._height = h;
		this.cells(g);
	}

    /**
	 * Sets/Gets a cell value given its coordinates
     * @param x {number}
     * @param y {number}
     * @param (v) {*}
     * @return {*}
     */
	cell(x, y, v) {
		if (v === undefined) {
			if (y >= 0 && y >= 0 && y < this._height && x < this._width) {
				return this._cells[y][x];
			} else {
				return null;
			}
		} else {
			if (y >= 0 && y >= 0 && y < this._height && x < this._width) {
				this._cells[y][x] = v;
			}
			return this;
		}
	}
};


/***/ }),

/***/ "./src/structures/TileLayer.js":
/*!*************************************!*\
  !*** ./src/structures/TileLayer.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @class TileLayer
 * TileLayer est capable de gérer une infinité de portion de terrain
 * Seules les portions a l'interieur de la zone de vue sont affichée.
 * lors de la phase de rendu, le WorldPlayer génère des évènements
 * indiquant les coordonnées des portions qu'il souhaite afficher
 * C'est à l'appli, en réponse à ces évènements, de fournir les portions
 * sous forme d'un canvas ou d'une image.
 *
 *
 *
 */
const View = __webpack_require__(/*! ../geometry/View */ "./src/geometry/View.js");
const sb = __webpack_require__(/*! ../SpellBook */ "./src/SpellBook.js");

class TileLayer {
	constructor() {
		this._view = new View();
		this._zones = {};
		this._zoneWidth = 0;
		this._zoneHeight = 0;
		this._zones = null;
		this._moreZones = false;  // a true ce flag permet de gérer également les zone
		// adjacentes aux zones qui sont partiellement visible dans la vue
		// utile pour permettre au système d'eventuellement précharger les zones
		// si la conception des zone dépend d'un résultat ajax ou d'un Worker.
	}

	/**
	 * Setter / getter d'un objet Fairy.View
	 * Cet objet permet de définir la fenetre de vue du world layer
	 * @param v {View}
	 * @return {View|TileLayer}
	 */
	view(v) {
		return sb.prop(this, '_view', v);
	}

	/**
	 * Setter / Getter de la largeur des zones.
	 * On considère le monde infini. Une zone est une portion de ce monde infini.
	 *
	 * @param z {int=} largeur d'une zone
	 * @return {object|Fairy.TileLayer}
	 */
	zoneWidth(z) {
		return sb.prop(this, '_zoneWidth', z);
	}

	/**
	 * Setter / Getter de la hauteur des zones.
	 * On considère le monde infini. Une zone est une portion de ce monde infini.
	 *
	 * @param z {int=} hauteur d'une zone
	 * @return {int|Fairy.TileLayer}
	 */
	zoneHeight(z) {
		return sb.prop(this, '_zoneHeight', z);
	}

	/**
	 * Setter / Getter de zones
	 * C'est une collection de Zones : celle qui sont actuellement chargée et qui peuvent etre affichées à tout moement
	 * Généralement cet accesseur n'est utilisé qu'en tant que getter.
	 * @param o {object=} liste des zone
	 * @return {object|Fairy.TileLayer}
	 */
	zones(o) {
		return sb.prop(this, '_zones', o);
	}

	/**
	 * Setter / Getter du flag moreZone
	 * Quand la fenetre de View penetre dans une zone, cela déclenche immédiatemennt un évènement
	 * réclamenet le chargement de la zone. avec ce Flag l'évènement est déclenché pour toutes les zones contigues.
	 * @param b {boolean=}
	 * @return {boolean|Fairy.TileLayer}
	 */
	moreZones(b) {
		return sb.prop(this, '_moreZone', b);
	}

	/**
	 * Calcule la liste des zones balayées par la vue
	 * Renvoi des évèbnements
	 * zone.(a|d|n) {
	 *	x, coordonnée x de la portion
	 *	y, coordonnée y de la portion
	 *	key, clé d'identification de la portion
	 * 	canvas: canvas/image qu'il faudra fournir en retour
	 * }
	 */
	update() {
		let p = this.view().points();
		let cw = this.zoneWidth();
		let ch = this.zoneHeight();
		let vx = p[0].x;
		let vy = p[0].y;
		let xs = Math.floor(vx / cw);
		let ys = Math.floor(vy / ch);
		let xe = Math.floor(p[1].x / cw);
		let ye = Math.floor(p[1].y / ch);
		if (this.moreZones()) {
			--xs;
			--ys;
			++xe;
			++ye;
		}
		let sKey, oNow = {};
		let oPrev = this.zones();
		let a = {
			d: [], // zone à décharger (ne sert plus car sort de la zone de vue)
			n: [], // nouvelle zone à charger, vien d'apparaitre dans la vue
			a: [] // zone toucjourr affichée
		};

		for (let x, y = ys; y <= ye; ++y) {
			for (x = xs; x <= xe; ++x) {
				sKey = x.toString() + ':' + y.toString();
				if (oPrev[sKey]) {
					a.a.push(sKey);
					oNow[sKey] = oPrev[sKey];
					delete oPrev[sKey];
				} else {
					// ajout
					oNow[sKey] = {
						x: x,
						y: y,
						key: sKey,
						canvas: null
					};
					a.n.push(sKey);
				}
			}
		}
		for (sKey in oPrev) {
			a.d.push(sKey);
		}
		this.zones(oNow);
		for (let s in a) {
			a[s].forEach((function(key) {
				this.trigger('zone.' + s, oNow[key]);
			}).bind(this));
		}
		return this;
	}

	trigger(sEvent, ...args) {
		console.log(sEvent, ...args);
	}

	/**
	 * Rendu du layer
	 * @param oContext {object}
	 */
	render(oContext) {
		let zc;
		let z = this.zones();
		let p = this.view().points();
		let cw = this.zoneWidth();
		let vx = p[0].x;
		let vy = p[0].y;
		for (let c in z) {
			zc = z[c];
			if (zc.canvas) {
				oContext.drawImage(zc.canvas, zc.x * cw - vx, zc.y * cw - vy);
			}
		}
	}
}



/***/ }),

/***/ "./src/structures/index.js":
/*!*********************************!*\
  !*** ./src/structures/index.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Grid = __webpack_require__(/*! ./Grid */ "./src/structures/Grid.js");
const TileLayer = __webpack_require__(/*! ./TileLayer */ "./src/structures/TileLayer.js");
const Cache2D = __webpack_require__(/*! ./Cache2D */ "./src/structures/Cache2D.js");

module.exports = {
    Grid, TileLayer, Cache2D
};

/***/ })

/******/ });
//# sourceMappingURL=libo876web.js.map