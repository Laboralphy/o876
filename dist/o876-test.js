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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Created by ralphy on 04/09/17.
 */

/* harmony default export */ __webpack_exports__["a"] = (class {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * This class implements the bresenham algorithm
 * and extend its use for other purpose than drawing pixel lines
 * good to GIT
 */
class Bresenham {
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
	 * avec x, y les coordonnée du point et n le numéro duj point
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
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bresenham;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
class Easing {

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
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Easing;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Point_js__ = __webpack_require__(0);
/**
 * Created by ralphy on 04/09/17.
 */



class Vector {
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
		if ((x instanceof Vector) || (x instanceof __WEBPACK_IMPORTED_MODULE_0__Point_js__["a" /* default */])) {
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
		if ((x instanceof Vector) || (x instanceof __WEBPACK_IMPORTED_MODULE_0__Point_js__["a" /* default */])) {
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
		if ((f instanceof Vector) || (f instanceof __WEBPACK_IMPORTED_MODULE_0__Point_js__["a" /* default */])) {
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
		return Math.sqrt(this.x * this.x + this.y * this.y);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Vector;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

class Rainbow {

	/** 
	 * Fabrique une chaine de caractère représentant une couleur au format CSS
	 * @param xData une structure {r: int, g: int, b: int, a: float}
	 * @return code couleur CSS au format rgb(r, g, b) ou rgba(r, g, b, a)
	 */
	rgba(xData) {
		return Rainbow._buildRGBAFromStructure(this.parse(xData));
	}
	
	/**
	 * Analyse une valeur d'entrée pour construire une structure avec les 
	 * composantes "r", "g", "b", et eventuellement "a".
	 */ 
	parse(xData) {
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
	spectrum(sColor1, sColor2, nSteps) {
		let c1 = this.parse(sColor1);
		let c2 = this.parse(sColor2);
		
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
			return this.rgba(c);
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
	gradient(oPalette) {
		let aPalette = [];
		let sColor;
		let sLastColor = null;
		let nPal;
		let nLastPal = 0;
		for (let iPal in oPalette) {
			nPal = iPal | 0;
			sColor = oPalette[iPal];
			if (sLastColor !== null) {
				aPalette = aPalette.concat(this.spectrum(sLastColor, sColor, nPal - nLastPal + 1).slice(1));
			} else {
				aPalette[nPal] = this.rgba(sColor);
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
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Rainbow;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Geometry_Point_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Geometry_Vector_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Bresenham_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Easing_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Rainbow_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__SpellBook_js__ = __webpack_require__(7);
/**
 * includes all modules
 */








/* harmony default export */ __webpack_exports__["default"] = ({
	Point: __WEBPACK_IMPORTED_MODULE_0__Geometry_Point_js__["a" /* default */],
	Vector: __WEBPACK_IMPORTED_MODULE_1__Geometry_Vector_js__["a" /* default */],
	Bresenham: __WEBPACK_IMPORTED_MODULE_2__Bresenham_js__["a" /* default */],
	Easing: __WEBPACK_IMPORTED_MODULE_3__Easing_js__["a" /* default */],
	Rainbow: __WEBPACK_IMPORTED_MODULE_4__Rainbow_js__["a" /* default */],
	SpellBook: __WEBPACK_IMPORTED_MODULE_5__SpellBook_js__["a" /* default */]
});

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_o876_js__ = __webpack_require__(5);
/**
 * Created by ralphy on 04/09/17.
 */



describe('Vector', function() {
	describe('initialisation 0', function () {
		it('creates a zero vector', function () {
			let v = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Vector();
			expect(v.x).toEqual(0);
			expect(v.y).toEqual(0);
		});
	});

	describe('initialisation not 0', function () {
		it('creates an initialized vector', function () {
			let v = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Vector(7, 89);
			expect(v.x).toEqual(7);
			expect(v.y).toEqual(89);
		});
	});

	describe('cloning', function () {
		it('properly clones a vector', function () {
			let v = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Vector(-7, 66);
			let w = v.clone();
			expect(v.x).toEqual(w.x);
			expect(v.y).toEqual(w.y);
			expect(v === w).toBeFalsy();
		});
	});

	describe('zero vector', function() {
		it('should build a 0, 0 vector', function() {
			let v = __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Vector.zero();
			expect(v.x).toEqual(0);
			expect(v.y).toEqual(0);
		});
	});

	describe('adding two vectors', function() {
		it('should add 2 vectors', function() {
			let v1 = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Vector(10, 15);
			let v2 = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Vector(2, -2);
			let v3 = v1.add(v2);
			// immutability
			expect(v1.x).toEqual(10);
			expect(v1.y).toEqual(15);
			expect(v2.x).toEqual(2);
			expect(v2.y).toEqual(-2);
			expect(v3.x).toEqual(12);
			expect(v3.y).toEqual(13);
		});
	});

	describe('scaling a vector', function() {
		it('should scale a vector', function() {
			let v1 = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Vector(30, 4);
			let v2 = v1.mul(6);
			expect(v1.x).toEqual(30);
			expect(v1.y).toEqual(4);
			expect(v2.x).toEqual(30 * 6);
			expect(v2.y).toEqual(4 * 6);
		});
	});

	describe('get vector distance', function() {
		it('should compute vector distance', function() {
			let v = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Vector(5, 5);
			expect(v.distance()).toBeCloseTo(5 * Math.sqrt(2), 4);
		});
		it('should compute vector distance 2', function() {
			let v = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Vector(-3, 2);
			expect(v.distance()).toBeCloseTo(Math.sqrt(9 + 4), 4);
		});
	});

	describe('normalize vector', function() {
		it('should build a normalized vector', function() {
			let v = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Vector(64, 4123);
			expect(v.normalize().distance()).toBeCloseTo(1, 5);
		});
	});
});

describe('Bresenham', function() {
	it('should build a line', function() {
		let aList = [];
		let bOk = __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Bresenham.line(10, 10, 15, 12, function (x, y) {
			aList.push(x + ';' + y);
		});
		expect(aList.join('-')).toEqual('10;10-11;10-12;11-13;11-14;12-15;12');
		expect(bOk).toBeTruthy();
	});
});

describe('Rainbow', function() {
	it ('should parse colors without error', function() {
		const r = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Rainbow();
		expect(r.parse('741')).toEqual({r: 0x77, g: 0x44, b: 0x11});
		expect(r.parse('774411')).toEqual({r: 0x77, g: 0x44, b: 0x11});
		expect(r.parse('#741')).toEqual({r: 0x77, g: 0x44, b: 0x11});
		expect(r.parse('#774411')).toEqual({r: 0x77, g: 0x44, b: 0x11});
		expect(r.parse('rgb(119,68, 17)')).toEqual({r: 0x77, g: 0x44, b: 0x11});
		expect(r.parse('rgba(119,68, 17, 0.777)')).toEqual({r: 0x77, g: 0x44, b: 0x11, a:0.777});
	});

	it('should convert rgba', function() {
		const r = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Rainbow();
		expect(r.rgba('#FFF')).toEqual('rgb(255, 255, 255)');
	});

	it('should make an array of 4 items', function() {
		const r = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Rainbow();
		let a = r.spectrum('#F41', '#8A5', 4);
		expect(a.length).toEqual(4);
	});

	it('should build a big gradient array', function() {
		const r = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Rainbow();
		let a;

		a = r.gradient({
			0: 'red',
			2: 'navy',
			4: 'yellow'
		});
		expect(a).toEqual([
			"rgb(255, 0, 0)",
			"rgb(127, 0, 64)",
			"rgb(0, 0, 128)",
			"rgb(127, 127, 64)",
			"rgb(255, 255, 0)"
		]);
		expect(a.length).toEqual(5);

		a = r.gradient({
			0: 'red',
			1: 'navy',
			2: 'yellow'
		});
		expect(a).toEqual([
			"rgb(255, 0, 0)",
			"rgb(0, 0, 128)",
			"rgb(255, 255, 0)"
		]);
		expect(a.length).toEqual(3);

		a = r.gradient({
			0: 'red',
			15: 'navy',
			30: 'yellow'
		});
		expect(a).toEqual([
			"rgb(255, 0, 0)",
			"rgb(223, 0, 16)",
			"rgb(207, 0, 24)",
			"rgb(191, 0, 32)",
			"rgb(175, 0, 40)",
			"rgb(159, 0, 48)",
			"rgb(143, 0, 56)",
			"rgb(127, 0, 64)",
			"rgb(111, 0, 72)",
			"rgb(95, 0, 80)",
			"rgb(79, 0, 88)",
			"rgb(63, 0, 96)",
			"rgb(47, 0, 104)",
			"rgb(31, 0, 112)",
			"rgb(15, 0, 120)",
			"rgb(0, 0, 128)",
			"rgb(31, 31, 112)",
			"rgb(47, 47, 104)",
			"rgb(63, 63, 96)",
			"rgb(79, 79, 88)",
			"rgb(95, 95, 80)",
			"rgb(111, 111, 72)",
			"rgb(127, 127, 64)",
			"rgb(143, 143, 56)",
			"rgb(159, 159, 48)",
			"rgb(175, 175, 40)",
			"rgb(191, 191, 32)",
			"rgb(207, 207, 24)",
			"rgb(223, 223, 16)",
			"rgb(239, 239, 8)",
			"rgb(255, 255, 0)"
		]);
		expect(a.length).toEqual(31);
	});

});

describe('Easing', function() {
	describe('setting move', function() {
		it('should initialize correctly', function() {
			const e = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Easing();
			e.from(4).to(17).during(10);
			expect(e.x).toEqual(4);
			expect(e.xStart).toEqual(4);
			expect(e.xEnd).toEqual(17);
			expect(e.nTime).toEqual(10);
			expect(e.iTime).toEqual(0);
		});
	});
	describe('setting move', function() {
		it('should correctly use a simple linear function', function() {
			const e = new __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].Easing();
			e.from(4).to(17).during(10).use(function(v) {
				return v * 2;
			});
			expect(e.x).toEqual(4);
			expect(e.xStart).toEqual(4);
			expect(e.xEnd).toEqual(17);
			expect(e.nTime).toEqual(10);
			expect(e.iTime).toEqual(0);
			e.next();
			expect(e.val() * 10 | 0).toEqual(66);
			e.next();
			expect(e.val() * 10 | 0).toEqual(92);
			e.next();
			expect(e.val() * 10 | 0).toEqual(117);
			e.next();
			expect(e.val() * 10 | 0).toEqual(144);
			e.next();
			expect(e.val() * 10 | 0).toEqual(170);
		});
	});

});




describe('SpellBook', function() {
	describe('#array', function() {
		it('should return the same array', function() {
			let a = ['a', 'b', 'c'];
			let b = __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].SpellBook.array(a);
            expect(a).toEqual(b);
            expect(a === b).toBeTruthy();
		});
        it('should convert a simple object', function() {
            let aSource = {3:'t', 2:'o', 1: 'i', 0:'y'};
            expect(__WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].SpellBook.array(aSource))
                .toEqual(['y', 'i', 'o', 't']);
        });
        it('should convert a simple object with quoted keys', function() {
            let aSource = {'3':'t', '2':'o', '1':'i', '0':'y'};
            expect(__WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].SpellBook.array(aSource))
                .toEqual(['y', 'i', 'o', 't']);
        });
        it('should convert an array like object', function() {
            let aSource = {0:111, 1:222, 2:333, 3:444, 'length': 4};
            expect(__WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].SpellBook.array(aSource)).toEqual([111, 222, 333, 444]);
        });
        it('should fail to convert an array like object (bad length)', function() {
            let aSource = {0:111, 1:222, 2:333, 3:444, 'length': 5};
            expect(__WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].SpellBook.array(aSource)).toBeFalsy();
        });
        it('should fail to convert an array like object (missing key)', function() {
            let aSource = {0:111, 1:222, 2:333, 4:444};
            expect(__WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].SpellBook.array(aSource)).toBeFalsy();
        });
        it('should convert argument', function() {
        	let a;
			(function() {
        		a = __WEBPACK_IMPORTED_MODULE_0__src_o876_js__["default"].SpellBook.array(arguments);
			})(4, 5, 6);
			expect(a).toEqual([4, 5, 6]);
		})
	});
})

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Created by ralphy on 07/09/17.
 */

class SpellBook {
    /**
     * Turns an array-like-structure into an array (a real one)
     */
    static array(subject, bFast) {
        if (bFast) {
            return Array.prototype.slice.call(subject, 0);
        }
        const LENGTH_PROPERTY = 'length';
        if (Array.isArray(subject)) {
            return subject;
        }
        if (typeof subject === 'object') {
            let aKeys = Object
                .keys(subject)
                .filter(k => k !== LENGTH_PROPERTY);
            if (aKeys.some(k => isNaN(k))) {
                return false;
            }
            if ((LENGTH_PROPERTY in subject) && (subject[LENGTH_PROPERTY] !== aKeys.length)) {
                return false;
            }
            if (aKeys
                .map(k => parseInt(k))
                .sort((k1, k2) => k1 - k2)
                .every((k, i) => k === i)) {
                return aKeys.map(k => subject[k]);
            }
        }
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SpellBook;


/***/ })
/******/ ]);