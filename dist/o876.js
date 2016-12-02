"use strict"
/** O2: Fonctionalités Orientées Objets pour Javascript
 * 2010 Raphaël Marandet
 * ver 1.0 10.10.2010
 * ver 1.1 28.04.2013 : ajout d'un support namespace  
 * ver 1.2 01.07.2016 : mixin et test unitaire / O2.parent
 * good to GIT
 */

var O2 = {};

/** Creation d'une nouvelle classe
 * @example NouvelleClasse = Function.createClass(function(param1) { this.data = param1; });
 * @param fConstructor prototype du constructeur
 * @return Function
 */
Function.prototype.createClass = function(pPrototype) {
	var f;
	f = function() {
		if ('__construct' in this) {
			this.__construct.apply(this, arguments);
		}
	};
	if (pPrototype === undefined) {
		return f;
	} else if (typeof pPrototype === 'object') {
		return f.extendPrototype(pPrototype);
	} else {
		return null;
	}
};

O2._superizeFunction = function(f, fParent) {
	var fNew;
	var s = 'fNew = function() {\n' +
		'var __inherited = (function() {\n' +
		'	return fParent.apply(this, arguments);\n' +
		'}).bind(this);\n' +
		'var __function = ' +
		f.toString() + ';' +
		'\nreturn __function.apply(this, arguments);\n' +
	'}\n';
	return eval(s);
};

/** Mécanisme d'extention de classe.
 * Cette fonction accepte un ou deux paramètres
 * Appel avec 1 paramètre :
 * @param Définition de prototype à ajouter à la classe.
 * Appel avec 2 paramètres :
 * @param Classe parente
 * @param Définition de prototype à ajouter à la classe.
 * @return Instance de lui-même.
 */
Function.prototype.extendPrototype = function(aDefinition) {
	var iProp = '', f, fInherited, f2;
	if (aDefinition instanceof Function) {
		aDefinition = aDefinition.prototype;
	}
	for (iProp in aDefinition) {
		f = aDefinition[iProp];
		if (iProp in this.prototype && (this.prototype[iProp] instanceof Function)) {
			// Sauvegarde de la méthode en cours : elle pourrait être héritée
			fInherited = this.prototype[iProp];
			// La méthode en cour est déja présente dans la super classe
			if (f instanceof Function) {
				// completion des __inherited
				// Ancien code
				//eval('f = ' + __inheritedThisMacroString(f.toString()));
				//this.prototype[iProp] = f;
				//this.prototype[iProp].__inherited = fInherited;

				// Nouveau code
				this.prototype[iProp] = O2._superizeFunction(f, fInherited);

			} else {
				// On écrase probablement une methode par une propriété : Erreur
				throw new Error(
						'o2: method ' + iProp + ' overridden by property.');
			}
		} else {
			// Ecrasement de la propriété
			this.prototype[iProp] = aDefinition[iProp];
		}
	}
	return this;
};

/** Mécanisme d'extension de classe
 * @param Parent Nom de la classe Parente
 * @param X prototype du constructeur (optionnel)
 * @param Y prototype de la classe étendue
 */
Function.prototype.extendClass = function(Parent, X) {
	var f = this.createClass().extendPrototype(Parent).extendPrototype(X);
	return f;
};

/**
 * Creation d'un objet
 * Le nom de l'objet peut contenir des "." dans ce cas de multiple objets sont créés
 * ex: O2.createObject("MonNamespace.MaBibliotheque.MaClasse", {...});
 * var créer un objet global "MonNamespace" contenant un objet "MaBibliotheque" contenant lui même l'objet "MaClasse"
 * ce dernier objet recois la définition du second paramètre.
 *  
 * 
 * @param sName nom de l'objet
 * @param oObject objet
 * @param object
 */
O2.createObject = function(sName, oObject) {
	var aName = sName.split('.');
	var sClass = aName.pop();
	var pIndex = window;
	var sNamespace;
	while (aName.length) {
		sNamespace = aName.shift();
		if (!(sNamespace in pIndex)) {
			pIndex[sNamespace] = {};
		}
		pIndex = pIndex[sNamespace];
	}
	if (!(sClass in pIndex)) {
		pIndex[sClass] = oObject;
	} else {
		for ( var sProp in oObject) {
			pIndex[sClass][sProp] = oObject[sProp];
		}
	}
	return pIndex;
};

/** 
 * Charger une classe à partir de son nom - le nom suit la syntaxe de la fonction O2.createObject() concernant les namespaces. 
 * @param s string, nom de la classe
 * @return pointer vers la Classe
 */
O2.loadObject = function(s, oContext) {
	var aClass = s.split('.');
	var pBase = oContext || window;
	var sSub, sAlready = '';
	while (aClass.length > 1) {
		sSub = aClass.shift();
		if (sSub in pBase) {
			pBase = pBase[sSub];
		} else {
			throw new Error('could not find ' + sSub + ' in ' + sAlready.substr(1));
		}
		sAlready += '.' + sSub;
	}
	var sClass = aClass[0];
	if (sClass in pBase) {
		return pBase[sClass];
	} else {
		throw new Error('could not find ' + sClass + ' in ' + sAlready.substr(1));
	}
};

O2._loadObject = function(s, oContext) {
	console.warn('O2._loadObject is deprecated. Use the brand new O2.loadObject, which do the same thing, but without this "_" in front of the name.');
	console.trace();
	return O2.loadObject(s, oContext);
}

/** Creation d'une classe avec support namespace
 * le nom de la classe suit la syntaxe de la fonction O2.createObject() concernant les namespaces.
 * @param sName string, nom de la classe
 * @param pPrototype définition de la nouvelle classe
 */
O2.createClass = function(sName, pPrototype) {
	return O2.createObject(sName, Function.createClass(pPrototype));
};

/** Extend d'un classe
 * le nom de la nouvelle classe suit la syntaxe de la fonction O2.createObject() concernant les namespaces.
 * @param sName string, nom de la nouvelle classe
 * @param pParent string|object Classe parente
 * @param pPrototype Définition de la classe fille  
 */
O2.extendClass = function(sName, pParent, pPrototype) {
	if (typeof pParent === 'string') {
		pParent = O2.loadObject(pParent);
	}
	return O2.createObject(sName, Function.extendClass(pParent, pPrototype));
};


/**
 * Ajout d'un mixin dans un prototype
 * @param pPrototype classe dans laquelle ajouter le mixin
 * @param pMixin mixin lui même
 */
O2.mixin = function(pPrototype, pMixin) {
	var oMixin;
	if (typeof pPrototype == 'string') {
		pPrototype = O2.loadObject(pPrototype);
	}
	if (typeof pMixin === 'function') {
		oMixin = new pMixin();
		oMixin.mixin(pPrototype);
	} else {
		oMixin = pMixin;
		pPrototype.extendPrototype(oMixin);
	}
};

/**
 * good to GIT
 */
O2.createClass('O876.Mixin.Data', {
	
	mixin: function(p) {
		p.extendPrototype({
		
			_DataContainer: null,

			setData: function(s, v) {
				return this.data(s, v);
			},

			getData: function(s) {
				return this.data(s);
			},
			
			data: function(s, v) {
				if (this._DataContainer === null) {
					this._DataContainer = {};
				}
				var D = this._DataContainer;
				if (v === undefined) { // get data
					if (s === undefined) {
						return D; // getting all data
					} else if (typeof s === 'object') {
						for (var x in s) { // setting many pairs of key values
							D[x] = s[x];
						}
					} else if (s in D) { // getting one key
						return D[s]; // found !
					} else {
						return null; // not found
					}
				} else { // set data
					// setting one pair on key value
					D[s] = v;
				}
				return this;
			}
		});
	}
});
/**
 * good to GIT
 */
O2.createClass('O876.Mixin.Events', {
	mixin: function(p) {
		p.extendPrototype({
			
			_WeirdEventHandlers: null,
		
			on: function(sEvent, pCallback) {
				if (this._WeirdEventHandlers === null) {
					this._WeirdEventHandlers = {};
				}
				var weh = this._WeirdEventHandlers;
				if (!(sEvent in weh)) {
					weh[sEvent] = [];
				}
				weh[sEvent].push(pCallback);
				return this;
			},

			one: function(sEvent, pCallback) {
				var pCallbackOnce;
				pCallbackOnce = (function() {
					pCallback.apply(this, Array.prototype.slice.call(arguments, 0));
					this.off(sEvent, pCallbackOnce);
					pCallbackOnce = null;
				}).bind(this);
				return this.on(sEvent, pCallbackOnce);
			},

			off: function(sEvent, pCallback) {
				if (this._WeirdEventHandlers === null) {
					throw new Error('no event "' + sEvent + '" defined');
				}
				if (sEvent === undefined) {
					this._WeirdEventHandlers = {};
				} else if (!(sEvent in this._WeirdEventHandlers)) {
					throw new Error('no event "' + sEvent + '" defined');
				}
				var weh = this._WeirdEventHandlers;
				var wehe, n;
				if (pCallback !== undefined) {
					wehe = weh[sEvent];
					n = wehe.indexOf(pCallback);
					if (n < 0) {
						throw new Error('this handler is not defined for event "' + sEvent + '"');
					} else {
						wehe.splice(n, 1);
					}
				} else {
					weh[sEvent] = [];
				}
				return this;
			},

			trigger: function(sEvent) {
				if (this._WeirdEventHandlers === null) {
					return this;
				}
				var weh = this._WeirdEventHandlers;
				if (!(sEvent in weh)) {
					return this;
				}
				var aArgs = Array.prototype.slice.call(arguments, 1);
				weh[sEvent].forEach(function(pCallback) {
					pCallback.apply(this, aArgs);
				}, this);
				return this;
			}
		});
	}
});
/**
 * good to GIT
 * Provide jquery like function to access private properties
 */
O2.createClass('O876.Mixin.Prop', {

	buildPropFunction: function(sProp) {
		return function(value) {
			if (value === undefined) {
				return this[sProp];
			} else {
				this[sProp] = value;
				return this;
			}
		}
	},

	mixin: function(p) {
		var pProto = {
		};
		for (var i in p.prototype) {
			if (i.match(/^_/)) {
				if (typeof p.prototype[i] !== 'function') {
					pProto[i.substr(1)] = this.buildPropFunction(i);
				}
			}
		}

		p.extendPrototype(pProto);
	}
});
O2.createClass('O876.Astar.Point', {
	x : 0,
	y : 0,
	__construct : function(x, y) {
		this.x = x;
		this.y = y;
	}
});

O2.createClass('O876.Astar.Nood', {
	fGCost : 0.0,
	fHCost : 0.0,
	fFCost : 0.0,
	oParent : null,
	oPos : null,

	__construct : function() {
		this.oParent = new O876.Astar.Point(0, 0);
		this.oPos = new O876.Astar.Point(0, 0);
	},

	isRoot : function() {
		return this.oParent.x == this.oPos.x && this.oParent.y == this.oPos.y;
	}
});

O2.createClass('O876.Astar.NoodList', {
	aList : null,

	__construct : function() {
		this.aList = {};
	},

	add : function(oNood) {
		this.set(oNood.oPos.x, oNood.oPos.y, oNood);
	},

	set : function(x, y, oNood) {
		this.aList[this.getKey(x, y)] = oNood;
	},

	count : function() {
		var n = 0, i = '';
		for (i in this.aList) {
			n++;
		}
		return n;
	},

	exists : function(x, y) {
		if (this.getKey(x, y) in this.aList) {
			return true;
		} else {
			return false;
		}
	},

	getKey : function(x, y) {
		return x.toString() + '__' + y.toString();
	},

	get : function(x, y) {
		if (this.exists(x, y)) {
			return this.aList[this.getKey(x, y)];
		} else {
			return null;
		}
	},

	del : function(x, y) {
		delete this.aList[this.getKey(x, y)];
	},

	empty : function() {
		var i = '';
		for (i in this.aList) {
			return false;
		}
		return true;
	}
});


O2.createClass('O876.Astar.Grid', {
	bUseDiagonals : false,
	MAX_ITERATIONS : 2048,
	nIterations : 0,
	aTab : null,
	nWidth : 0,
	nHeight : 0,
	oOpList : null,
	oClList : null,
	aPath : null,
	xLast : 0,
	yLast : 0,
	nLastDir : 0,

	GRID_BLOCK_WALKABLE: 0,

	init : function(c) {
		if ('grid' in c) {
			this.aTab = c.grid;
			this.nHeight = c.grid.length;
			this.nWidth = c.grid[0].length;
		}
		if ('diagonals' in c) {
			this.bUseDiagonals = c.diagonals;
		}
		if ('max' in c) {
			this.MAX_ITERATIONS = c.max;
		}
		if ('walkable' in c) {
			this.GRID_BLOCK_WALKABLE = c.walkable;
		}
	},

	reset : function() {
		this.oOpList = new O876.Astar.NoodList();
		this.oClList = new O876.Astar.NoodList();
		this.aPath = [];
		this.nIterations = 0;
	},

	distance : function(x1, y1, x2, y2) {
		var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
		var r = {
			distance: d,
			from: {x: x1, y: y1},
			to: {x: x2, y: y2}
		};
		this.trigger('distance', r);
		return r.distance;
	},

	setCell : function(x, y, n) {
		if (this.aTab[y] !== undefined && this.aTab[y][x] !== undefined) {
			this.aTab[y][x] = n;
		} else {
			throw new Error(
					'O876.Astar: writing tile out of Grid: ' + x + ', ' + y);
		}
	},

	getCell : function(x, y) {
		if (this.aTab[y]) {
			if (x < this.aTab[y].length) {
				return this.aTab[y][x];
			}
		}
		throw new Error('O876.Astar: read tile out of Grid: ' + x + ', ' + y);
	},

	cell: function(x, y, v) {
		if (v === undefined) {
			return this.getCell(x, y);
		} else {
			this.setCell(x, y, v);
			return this;
		}
	},

	isCellWalkable : function(x, y) {
		try {
			var r = {
				walkable: this.getCell(x, y) == this.GRID_BLOCK_WALKABLE,
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
	},

	// Transferer un node de la liste ouverte vers la liste fermee
	closeNood : function(x, y) {
		var n = this.oOpList.get(x, y);
		if (n) {
			this.oClList.set(x, y, n);
			this.oOpList.del(x, y);
		}
	},

	addAdjacent : function(x, y, xArrivee, yArrivee) {
		var i, j;
		var i0, j0;
		var oTmp;
		for (i0 = -1; i0 <= 1; i0++) {
			i = x + i0;
			if ((i < 0) || (i >= this.nWidth)) {
				continue;
			}
			for (j0 = -1; j0 <= 1; j0++) {
				if (!this.bUseDiagonals && (j0 * i0) !== 0) {
					continue;
				}
				j = y + j0;
				if ((j < 0) || (j >= this.nHeight)) {
					continue;
				}
				if ((i == x) && (j == y)) {
					continue;
				}
				if (!this.isCellWalkable(i, j)) {
					continue;
				}

				if (!this.oClList.exists(i, j)) {
					oTmp = new O876.Astar.Nood();
					oTmp.fGCost = this.oClList.get(x, y).fGCost	+ this.distance(i, j, x, y);
					oTmp.fHCost = this.distance(i, j, xArrivee,	yArrivee);
					oTmp.fFCost = oTmp.fGCost + oTmp.fHCost;
					oTmp.oPos = new O876.Astar.Point(i, j);
					oTmp.oParent = new O876.Astar.Point(x, y);

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
	},

	// Recherche le meilleur noeud de la liste et le renvoi
	bestNood : function(oList) {
		var oBest = null;
		var oNood;
		var iNood = '';

		for (iNood in oList.aList) {
			oNood = oList.aList[iNood];
			if (oBest === null) {
				oBest = oNood;
			} else if (oNood.fFCost < oBest.fFCost) {
				oBest = oNood;
			}
		}
		return oBest;
	},

	find : function(xFrom, yFrom, xTo, yTo) {
		this.reset();
		var oBest;
		var oDepart = new O876.Astar.Nood();
		oDepart.oPos = new O876.Astar.Point(xFrom, yFrom);
		oDepart.oParent = new O876.Astar.Point(xFrom, yFrom);
		var xCurrent = xFrom;
		var yCurrent = yFrom;
		this.oOpList.add(oDepart);
		this.closeNood(xCurrent, yCurrent);
		this.addAdjacent(xCurrent, yCurrent, xTo, yTo);

		var iIter = 0, MAX = this.MAX_ITERATIONS;

		while (!((xCurrent == xTo) && (yCurrent == yTo)) && (!this.oOpList.empty())) {
			oBest = this.bestNood(this.oOpList);
			xCurrent = oBest.oPos.x;
			yCurrent = oBest.oPos.y;
			this.closeNood(xCurrent, yCurrent);
			this.addAdjacent(oBest.oPos.x, oBest.oPos.y, xTo, yTo);
			if (++iIter > MAX) {
				throw new Error('O876.Astar: too much iterations');
			}
		}
		if (this.oOpList.empty() && !((xCurrent == xTo) && (yCurrent == yTo))) {
			 throw new Error('O876.Astar: no path to destination');
		}
		this.nIterations = iIter;
		this.buildPath(xTo, yTo);
		return this.aPath;
	},

	buildPath : function(xTo, yTo) {
		var oCursor = this.oClList.get(xTo, yTo);
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
});


O2.mixin(O876.Astar.Grid, O876.Mixin.Events);/**
 * This class implements the bresenham algorithm
 * and extend its use for other purpose than drawing pixel lines
 * good to GIT
 */
O2.createClass('O876.Bresenham', {
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
	line: function(x0, y0, x1, y1, pCallback) {
		x0 |= 0;
		y0 |= 0;
		x1 |= 0;
		y1 |= 0;
		var dx = Math.abs(x1 - x0);
		var dy = Math.abs(y1 - y0);
		var sx = (x0 < x1) ? 1 : -1;
		var sy = (y0 < y1) ? 1 : -1;
		var err = dx - dy;
		var e2;
		var n = 0;
		while (true) {
			if (pCallback) {
				if (pCallback(x0, y0, n) === false) {
					return false;
				}
			}
			if (x0 == x1 && y0 == y1) {
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
});
/**
 * good to GIT
 */

O2.createObject('O876.Browser', {
	
	STRINGS: {
		en: {
			wontrun: 'The game won\'t run because some HTML 5 features are not supported by this browser',
			install: 'You should install the latest version of one of these browsers : <b>Firefox</b>, <b>Chrome</b> or <b>Chromium</b>.',
			legend: '(the red colored features are not supported by your browser)'
		},
		
		fr: {
			wontrun: 'Le jeu ne peut pas se lancer, car certaines fonctionnalités HTML 5 ne sont pas supportées par votre navigateur',
			install: 'Vous devriez installer la dernière version de l\'un de ces navigateurs : <b>Firefox</b>, <b>Chrome</b> ou <b>Chromium</b>.',
			legend: '(les fonctionnalités marquées en rouge ne sont pas supportées par votre navigateur)'
		}
	},
	
	LANGUAGE: 'en',
	
	isOpera: function() {
		return !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
			// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
	},
	
	isFirefox: function() {
		return typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
	},
	
	isSafari: function() {
		return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
			// At least Safari 3+: "[object HTMLElementConstructor]"
	},
	
	isChrome: function() {
		return !!window.chrome && !O876.Browser.isOpera();              // Chrome 1+
	},
	
	isIE: function() {
		return /*@cc_on!@*/false || !!document.documentMode; // At least IE6
	},
	
	/**
	 * Return the lists of detected browsers
	 */
	getDetectedBrowserList: function() {
		return (['Opera', 'Firefox', 'Safari', 'Chrome', 'IE']).filter(function(f) {
			return O876.Browser['is' + f]();
		});
	},

	/**
	 * Tests if all specified HTML5 feature are supported by the browser
	 * if no parameter is set, tests all the HTML 5 feature
	 * the returned objet has a 'html' field to be displayed
	 * @param aRequire array of string
	 * @return object
	 */
	getHTML5Status: function(aRequired) {
		var oReport = {
			canvas: 'HTMLCanvasElement' in window,
			audio: 'HTMLAudioElement' in window,
			fullscreen: ('webkitIsFullScreen' in document) || ('mozFullScreen' in document),
			animation: 'requestAnimationFrame' in window,
			performance: ('performance' in window) && ('now' in performance),
			pointerlock: ('pointerLockElement' in document) || ('mozPointerLockElement' in document),
			uint32array: 'Uint32Array' in window
		};
		var i, b = true;
		var aFeats = ['<table><tbody>'];
		
		function testFeature(iFeat) {
			b = b && oReport[iFeat];
			aFeats.push('<tr><td style="color: ' + (oReport[iFeat] ? '#080' : '#800') + '">' + (oReport[iFeat] ? '✔' : '✖') + '</td><td' + (oReport[iFeat] ? '' : ' style="color: #F88"') + '>' + iFeat + '</td></tr>');
		}
		
		if (aRequired) {
			aRequired.forEach(testFeature);
		} else {
			for (i in oReport) {
				testFeature(i);
			}
		}
		aFeats.push('</tbody></table>');
		oReport.all = b;
		oReport.html = '<div>' + aFeats.join('') + '</div>';
		oReport.browser = O876.Browser.getDetectedBrowserList();
		return oReport;
	},
	
	checkHTML5: function(sTitle) {
		if (!sTitle) {
			sTitle = 'HTML 5 Application';
		}
		var oHTML5 = O876.Browser.getHTML5Status();
		if (!oHTML5.all) {
			var m = O876.Browser.STRINGS[O876.Browser.LANGUAGE];
			document.body.innerHTML = '<div style="color: #AAA; font-family: monospace; background-color: black; border: solid 4px #666; padding: 8px">' +
				'<h1>' + sTitle + '</h1>' +
				'<p>' + m.wontrun + ' (' + oHTML5.browser.join(', ') + ').<br/>' +
				m.install + '</p>' + oHTML5.html + 
				'<p style="color: #888; font-style: italic">' + m.legend + '</p></div>'; 
			return false;
		}
		return oHTML5.all;
	},
});
/**
 * Canvas factory
 * good to GIT
 */
O2.createObject('O876.CanvasFactory', {
	
	/**
	 * Create a new canvas
	 */
	getCanvas: function(w, h, bImageSmoothing) {
		var oCanvas = document.createElement('canvas');
		var oContext = oCanvas.getContext('2d');
		if (w && h) {
			oCanvas.width = w;
			oCanvas.height = h;
		}
		if (bImageSmoothing === undefined) {
			bImageSmoothing = false;
		}
		O876.CanvasFactory.setImageSmoothing(oContext, false);
		return oCanvas;
	},
	
	/**
	 * Set canvas image smoothing flag on or off
	 * @param Context2D oContext
	 * @param bool b on = smoothing on // false = smoothing off
	 */
	setImageSmoothing: function(oContext, b) {
		oContext.webkitImageSmoothingEnabled = b;
		oContext.mozImageSmoothingEnabled = b;
		oContext.msImageSmoothingEnabled = b;
		oContext.imageSmoothingEnabled = b;
	},
	
	getImageSmoothing: function(oContext) {
		return oContext.imageSmoothingEnabled;
	},

	/**
	 * Clones a canvas into a new one
	 * @param oCanvas to be cloned
	 * @return  Canvas
	 */
	cloneCanvas: function(oCanvas) {
		var c = O876.CanvasFactory.getCanvas(
			oCanvas.width, 
			oCanvas.height, 
			O876.CanvasFactory.getImageSmoothing(oCanvas.getContext('2d'))
		);
		c.getContext('2d').drawImage(oCanvas, 0, 0);
		return c;
	}
});
/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger un mobile de manière non-lineaire
 * Avec des coordonnée de dépat, d'arriver, et un temps donné
 * L'option lineaire est tout de même proposée.
 * good to GIT
 */
O2.createClass('O876.Easing', {	
	xStart: 0,
	xEnd: 0,
	x: 0,
	nTime: 0,
	iTime: 0,
	fWeight: 1,
	pFunction: null,
	
	from: function(x) {
		this.xStart = this.x = x;
		return this;
	},

	to: function(x) {
		this.xEnd = x;
		return this;
	},

	during: function(t) {
		this.nTime = t;
		this.iTime = 0;
		return this;
	},

	/**
	 * Définition de la fonction d'Easing
	 * @param string sFunction fonction à choisir parmi :
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
	use: function(xFunction) {
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
	},
	
	/**
	 * Calcule les coordonnée pour le temps t
	 * mets à jour les coordonnée x et y de l'objets
	 * @param int t temps
	 * si "t" est indéfini, utilise le timer interne 
	 */
	f: function(t) {
		if (t === undefined) {
			t = ++this.iTime;
		} else {
			this.iTime = t;
		}
		var p = this.pFunction;
		if (typeof p != 'function') {
			throw new Error('easing function is invalid : ' + p);
		}
		var v = p(t / this.nTime);
		this.x = this.xEnd * v + (this.xStart * (1 - v));
		return t >= this.nTime;
	},

	_linear: function(v) {
		return v;
	},
	
	_smoothstep: function(v) {
		return v * v * (3 - 2 * v);
	},
	
	_smoothstepX2: function(v) {
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	_smoothstepX3: function(v) {
		v = v * v * (3 - 2 * v);
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	_squareAccel: function(v) {
		return v * v;
	},
	
	_squareDeccel: function(v) {
		return 1 - (1 - v) * (1 - v);
	},
	
	_cubeAccel: function(v) {
		return v * v * v;
	},
	
	_cubeDeccel: function(v) {
		return 1 - (1 - v) * (1 - v) * (1 - v);
	},
	
	_cubeInOut: function(v) {
		if (v < 0.5) {
			v = 2 * v;
			return v * v * v;
		} else {
			v = (1 - v) * 2;
			return v * v * v;
		}
	},
	
	_sine: function(v) {
		return Math.sin(v * Math.PI / 2);
	},
	
	_cosine: function(v) {
		return 0.5 - Math.cos(-v * Math.PI) * 0.5;
	},
	
	_weightAverage: function(v) {
		return ((v * (this.nTime - 1)) + this.fWeight) / this.nTime;
	},
	
	_quinticBezier: function(v) {
		var ts = v * this.nTime;
		var tc = ts * this.nTime;
		return 4 * tc - 9 * ts + 6 * v;
	}
});
/**
 * An implementation of the Mediator Design Pattern
 * This pattern allows application to communicate with plugins
 * The Client Application instanciate Mediator
 * The plugins are extends of the Plugin Class
 *
 * good to GIT
 */
 
 

O2.createClass('O876.Mediator.Plugin', {
	_oMediator: null,
	_NAME: '',
	
	getName: function() {
		return this._NAME;
	},
	
	register: function(sType) {
		this._oMediator.registerPluginSignal(sType, this);
	},
	
	unregister: function(sType) {
		this._oMediator.unregisterPluginSignal(sType, this);
	},

	setMediator: function(m) {
		this._oMediator = m;
	},
	
	getPlugin: function(s) {
		return this._oMediator.getPlugin(s);
	},
	
	sendSignal: function() {
		var aArgs = Array.prototype.slice.call(arguments, 0);
		return this._oMediator.sendPluginSignal.apply(this._oMediator, aArgs);
	}
});

O2.createClass('O876.Mediator.Mediator', {

	_oPlugins: null,
	_oRegister: null,
	_oApplication: null,
	
	/**
	 * Constructeur
	 */
	__construct: function() {
		this._oPlugins = {};
		this._oRegister = {};
	},
	
	
	setApplication: function(a) {
		return this._oApplication = a;		
	},
	
	getApplication: function() {
		return this._oApplication;		
	},
	
	
	
	/**
	 * Ajoute un plugin
	 * @param oPlugin instance du plugin ajouté
	 * @return instance du plugin ajouté
	 */
	addPlugin: function(oPlugin) {
		if (!('getName' in oPlugin)) {
			throw new Error('O876.Mediator : anonymous plugin');
		}
		var sName = oPlugin.getName();
		if (sName === '') {
			throw new Error('O876.Mediator : undefined plugin name');
		}
		if (!('setMediator' in oPlugin)) {
			throw new Error('O876.Mediator : no Mediator setter in plugin ' + sName);
		}
		if (sName in this._oPlugins) {
			throw new Error('O876.Mediator : duplicate plugin entry ' + sName);
		}
		this._oPlugins[sName] = oPlugin;
		oPlugin.setMediator(this);
		if ('init' in oPlugin) {
			oPlugin.init();
		}
		return oPlugin;
	},
	
	removePlugin: function(x) {
		if (typeof x != 'string') {
			x = x.getName();
		}
		this._oPlugins[x] = null;
	},
	
	/**
	 * Renvoie le plugin dont le nom est spécifié
	 * Renvoie undefined si pas trouvé
	 * @param sName string
	 * @return instance de plugin
	 */
	getPlugin: function(sName) {
		return this._oPlugins[sName];
	},
	
	/**
	 * Enregistrer un plugin pour qu'il réagisse aux signaux de type spécifié
	 * @param sSignal type de signal
	 * @param oPlugin plugin concerné
	 */
	registerPluginSignal: function(sSignal, oPlugin) {
		if (this._oRegister === null) {
			this._oRegister = {};
		}
		if (sSignal in oPlugin) {
			if (!(sSignal in this._oRegister)) {
				this._oRegister[sSignal] = [];
			}
			if (this._oRegister[sSignal].indexOf(oPlugin) < 0) {
				this._oRegister[sSignal].push(oPlugin);
			}
		} else {
			throw new Error('O876.Mediator : no ' + sSignal + ' function in plugin ' + oPlugin.getName());
		}
	},
	
	/** 
	 * Retire le plugin de la liste des plugin signalisés
	 * @param sSignal type de signal
	 * @param oPlugin plugin concerné
	 */
	unregisterPluginSignal: function(sSignal, oPlugin) {
		if (this._oRegister === null) {
			return;
		}
		if (!(sSignal in this._oRegister)) {
			return;
		}
		var n = this._oRegister[sSignal].indexOf(oPlugin);
		if (n >= 0) {
			ArrayTools.removeItem(this._oRegister[sSignal], n);
		}
	},
	
	
	
	/**
	 * Envoie un signal à tous les plugins enregistré pour ce signal
	 * signaux supportés
	 * 
	 * damage(oAggressor, oVictim, nAmount) : lorsqu'une créature en blesse une autre
	 * key(nKey) : lorsqu'une touche est enfoncée ou relachée
	 * time : lorsqu'une unité de temps s'est écoulée
	 * block(nBlockCode, oMobile, x, y) : lorsqu'un block a été activé
	 */
	sendPluginSignal: function(s) {
		var i, p, pi, n;
		if (this._oRegister && (s in this._oRegister)) {
			p = this._oRegister[s];
			n = p.length;
			if (n) {
				var aArgs;
				if (arguments.length > 1) {
					aArgs = Array.prototype.slice.call(arguments, 1);
				} else {
					aArgs = [];
				}
				for (i = 0; i < n; i++) {
					pi = p[i];
					pi[s].apply(pi, aArgs);
				}
			}
		}
	}
});
/**
 * A class for manipulating canvas
 * Provides gimp like filter and effect like blur, emboss, sharpen
 */

O2.createClass('O876.Philter', {

	_oFilters: null,
	
	perf: null,

	__construct: function() {
		if ('performance' in window) {
			this.perf = performance;
		} else {
			this.perf = Date;
		}
		this.config({
			kernel: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
			bias: 0,
			factor: 1,
			more: false,
			radius: 1,
			level: 50,
			left: 0,
			top: 0,
			width: null,
			height: null,
			right: 0,
			bottom: 0,
			red: true,
			green: true,
			blue: true,
			alpha: true,
			channels: 'rgba',
			command: '',
			sync: true,
			delay: 256
		});
	},

	/**
	 * Configures the instance
	 * @param c string|object if this is a string, the function returns the 
	 * value of the config key. If c is an object, the function modify configuration
	 * according to the key/values pairs contained in the object
	 * @return value | this
	 */
	config: function(c, v) {
		return this.data(c, v);
	},

	init: function(p1, p2) {
		// analyzing parameters
		var sArgs = O876.typeMap(arguments, 'short');
		switch (sArgs) {
			case 's': // one string
			case 'su': // one string
				this.config('command', p1);
			break;
			
			case 'so': // one string, one object
				this.config(p2);
				this.config('command', p1);
			break;
			
			case 'o':
			case 'ou': // one object
				this.config(p1);
			break;
			
			case 'sf': // define new filter
				this._oFilters[p1] = p2;
				return;
			break;
			
			default:
				throw new Error('bad parameter format');
		}
		var sChannels = this.config('channels').toLowerCase();
		this.config('red', sChannels.indexOf('r') >= 0);
		this.config('green', sChannels.indexOf('g') >= 0);
		this.config('blue', sChannels.indexOf('b') >= 0);
		this.config('alpha', sChannels.indexOf('a') >= 0);
	},

	/**
	 * builds a canvas and copy the given image content inside this canvas
	 * builds a pixel buffer
	 * builds a structure containing references to the image, the canvas
	 * and the pixel buffer
	 * @param oImage DOM Image
	 * @return a structure
	 */
	buildShadowCanvas: function(oCanvas) {
		var ctx = oCanvas.getContext('2d');
		var w = oCanvas.width;
		var h = oCanvas.height;
		var imgdata = ctx.getImageData(0, 0, w, h);
		var data = new Uint32Array(imgdata.data.buffer);
		
		return {
			canvas: oCanvas,
			context: ctx,
			imageData: imgdata,
			pixelData: imgdata.data,
			pixels: data,
			width: w,
			height: h,
			_p: false
		};
	},

	/**
	 * Copies the pixel data buffer to the original canvas ;
	 * This operation visually modify the image
	 * @param sc Structure built by buildShadowCanvas()
	 */
	commitShadowCanvas: function(sc) {
		if (sc._p) {
			sc.context.putImageData(sc.imageData, 0, 0);
		}
	},


	/**
	 * Get the working region
	 */
	getRegion: function(sc) {
		var xs = this.config('left');
		var ys = this.config('top');
		var xe = this.config('width') !== null ? xs + this.config('width') - 1 : null;
		var ye = this.config('height') !== null ? ys + this.config('height') - 1 : null;
		xe = xe !== null ? xe : sc.width - this.config('left') - 1;
		ye = ye !== null ? ye : sc.height - this.config('right') - 1;
		return {
			xs: xs,
			ys: ys,
			xe: xe,
			ye: ye
		};
	},

	/**
	 * Get a color structure of the given pixel
	 * if a color structure is specified, the function will fill this
	 * structure with pixel color values. this will prevent from
	 * building a new object each time a pixel is read,
	 * and will potentially increase overall performances
	 * in all cases, the color structure is also returned
	 * @param sc Shadow Canvas structure
	 * @param x pixel x
	 * @param y pixel y
	 * @param oResult optional Color structure {r: int, g: int, b: int, a: int}
	 * @return Color structure
	 */
	getPixel: function(sc, x, y, oResult) {
		if (oResult === undefined) {
			oResult = {};
		}
		if (x >= 0 && y >= 0 && x < sc.width && y < sc.height) {
			var n = y * sc.width + x;
			var p = sc.pixels[n];
			oResult.r = p & 255;
			oResult.g = (p >> 8) & 255;
			oResult.b = (p >> 16) & 255;
			oResult.a = (p >> 24) & 255;
			return oResult;
		} else {
			return null;
		}
	},


	/**
	 * Change pixel value
	 * @param sc Shadow Canvas structure
	 * @param x pixel x
	 * @param y pixel y
	 * @param c Color structure {r: int, g: int, b: int, a: int}
	 */
	setPixel: function(sc, x, y, c) {
		if (x >= 0 && y >= 0 && x < sc.width && y < sc.height) {
			var n = y * sc.width + x;
			var nAlpha = ('a' in c) ? c.a << 24 : (sc.pixels[n] & 0xFF000000);
			sc.pixels[n] = c.r | (c.g << 8) | (c.b << 16) | nAlpha;
			sc._p = true;
		}
	},
	
	
	/**
	 * applies a function to each pixel
	 * @param sc shadow canvas
	 * @param pFunc function to call
	 */
	pixelProcess: function(sc, pFunc, oContext) {
		var x, y, p = {}, r = {}, k;
		var w = sc.width;
		var h = sc.height;
		var bChr = this.config('red');
		var bChg = this.config('green');
		var bChb = this.config('blue');
		var bCha = this.config('alpha');
		var factor = this.config('factor');
		var bias = this.config('bias');
		var r = this.getRegion(sc);
		var nStartTime = this.perf.now();
		var perf = this.perf;
		var nDelay = this.config('delay');
		var bASync = !this.config('sync');
		var rxs = r.xs;
		var rys = r.ys;
		var xFrom = rxs;
		var yFrom = rys;
		var rxe = r.xe;
		var rye = r.ye;
		if (oContext) {
			xFrom = oContext.x;
			yFrom = oContext.y;
		} else {
			this.trigger('progress', {value: 0});
		}
		var getPixel = this.getPixel;
		var setPixel = this.setPixel;
		for (y = yFrom; y <= rye; ++y) {
			for (x = xFrom; x <= rxe; ++x) {
				this.getPixel(sc, x, y, p);
				for (k in p) {
					r[k] = p[k];
				}
				pFunc(x, y, p);
				if (bChr) {
					r.r = Math.min(255, Math.max(0, factor * p.r + bias)) | 0;
				}	
				if (bChg) {
					r.g = Math.min(255, Math.max(0, factor * p.g + bias)) | 0;
				}
				if (bChb) {
					r.b = Math.min(255, Math.max(0, factor * p.b + bias)) | 0;
				}
				if (bCha) {
					r.a = Math.min(255, Math.max(0, factor * p.a + bias)) | 0;
				}
				this.setPixel(sc, x, y, r);
			}
			xFrom = rxs;
			var pn = perf.now();
			var nElapsedTime = pn - nStartTime;
			if (bASync && nElapsedTime > nDelay) {
				nStartTime = pn;
				requestAnimationFrame((function() {
					this.trigger('progress', { elapsed: nElapsedTime, value: (y - rys) / (rye - rys)});
					this.pixelProcess(sc, pFunc, {
						x: x,
						y: y
					});
				}).bind(this));
				return;
			}
		}
		if (bASync) {
			this.trigger('progress', {value: 1});
			this.trigger('pixelprocess.end', {sc: sc});
		}
	},

	/**
	 * filter: convolution
	 * applies a convolution kernel on the image
	 * used options:
	 * 	- kernel
	 *  - factor
	 * 	- bias
	 */
	convolutionProcess: function(scs) {
		var x, y, p = {}, nc = {}, xyf;
		var scd = this.buildShadowCanvas(scs.canvas);
		var w = scs.width;
		var h = scs.height;
		var aMatrix = this.config('kernel');
		var yfCount = aMatrix.length;
		var xfCount = yfCount > 0 ? aMatrix[0].length : 0;
		this.pixelProcess(scs, (function(x, y, p) {
			var xm, ym, xf, yf, p2 = {}, k;
			for (k in p) {
				p[k] = 0;
			}
			for (yf = 0; yf < yfCount; ++yf) {
				for (xf = 0; xf < xfCount; ++xf) {
					xm = (x - (xfCount >> 1) + xf + w) % w;
					ym = (y - (yfCount >> 1) + yf + h) % h;
					if (this.getPixel(scd, xm, ym, p2)) {
						xyf = aMatrix[yf][xf];
						for (k in p2) {
							p[k] += p2[k] * xyf;
						}
					}
				}
			}
		}).bind(this));
	},

	/**
	 * applies a contrast filter
	 * @param level 
	 */
	filterContrast: function(sc) {
		var c = this.config('level');
		var f = (259 * (c + 255)) / (255 * (259 - c));
		this.pixelProcess(sc, function(x, y, p) {
			p.r = f * (p.r - 128) + 128;
			p.g = f * (p.g - 128) + 128;
			p.b = f * (p.b - 128) + 128;
		});
	},

	/**
	 * Applies a negate color filter
	 */
	filterNegate: function(sc) {
		this.pixelProcess(sc, function(x, y, p) {
			p.r = 255 - p.r;
			p.g = 255 - p.g;
			p.b = 255 - p.b;
		});
	},

	/**
	 * Applies a color filter
	 * @param kernel a 3x3 kernel, corresponding to a transformation matrix
	 */
	filterColor: function(sc) {
		var m = this.config('kernel');
		if (m.length < 3) {
			throw new Error('color kernel must be 3x3 sized');
		}
		if (m[0].length < 3 || m[1].length < 3 || m[2].length < 3) {
			throw new Error('color kernel must be 3x3 sized');
		}
		this.pixelProcess(sc, function(x, y, p) {
			var r = (p.r * m[0][0] + p.g * m[0][1] + p.b * m[0][2]);
			var g = (p.r * m[1][0] + p.g * m[1][1] + p.b * m[1][2]);
			var b = (p.r * m[2][0] + p.g * m[2][1] + p.b * m[2][2]);
			p.r = r;
			p.g = g;
			p.b = b;
		});
	},

	/**
	 * Applies a noise filter
	 * @param level amount of noise
	 */
	filterNoise: function(sc) {
		var nAmount = this.config('level');
		this.pixelProcess(sc, function(x, y, p) {
			var nb = nAmount * (Math.random() - 0.5);
			p.r = Math.min(255, Math.max(0, p.r + nb)) | 0;
			p.g = Math.min(255, Math.max(0, p.g + nb)) | 0;
			p.b = Math.min(255, Math.max(0, p.b + nb)) | 0;
		});
	},

	/**
	 * Build a gaussian blur matrix
	 * @param phi
	 */
	buildGaussianBlurMatrix: function(phi) {
		var nSize = Math.max(1, Math.ceil(phi * 3));
		var a = [], row;
		var y, x;
		for (y = -nSize; y <= nSize; ++y) {
			row = [];
			for (x = -nSize; x <= nSize; ++x) {
				row.push((1 / (2 * Math.PI * phi * phi)) * Math.exp(-(x * x + y * y) / (2 * phi * phi)));
			}
			a.push(row);
		}
		return a;
	},

	/** 
	 * Applies a hsl filter to change hue, brightness and saturation
	 */
	filterHSL: function(sc) {
		/**
		 * Converts an RGB color value to HSL. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
		 * Assumes r, g, and b are contained in the set [0, 255] and
		 * returns h, s, and l in the set [0, 1].
		 *
		 * @param   Number  r       The red color value
		 * @param   Number  g       The green color value
		 * @param   Number  b       The blue color value
		 * @return  Array           The HSL representation
		 */
		function rgbToHsl(r, g, b){
			r /= 255, g /= 255, b /= 255;
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h, s, l = (max + min) / 2;

			if (max == min){
				h = s = 0; // achromatic
			} else {
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}

			return [h, s, l];
		}

		// utility function used by hslToRgb
		function hue2rgb(p, q, t){
			if (t < 0) {
				++t;
			}
			if (t > 1) {
				--t;
			}
			if (t < 1 / 6) {
				return p + (q - p) * 6 * t;
			}
			if (t < 1 / 2) {
				return q;
			}
			if (t < 2 / 3) {
				return p + (q - p) * (2/3 - t) * 6;
			}
			return p;
		}
		
		/**
		 * Converts an HSL color value to RGB. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
		 * Assumes h, s, and l are contained in the set [0, 1] and
		 * returns r, g, and b in the set [0, 255].
		 *
		 * @param   Number  h       The hue
		 * @param   Number  s       The saturation
		 * @param   Number  l       The lightness
		 * @return  Array           The RGB representation
		 */
		function hslToRgb(h, s, l) {
			var r, g, b;

			if (s === 0){
				r = g = b = l; // achromatic
			} else {
				var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				var p = 2 * l - q;
				r = hue2rgb(p, q, h + 1/3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1/3);
			}
			return [r * 255, g * 255, b * 255];
		}
		var hue = this.config('hue') || 0;
		var saturation = this.config('saturation') || 0;
		var lightness = this.config('lightness') || 0;

		this.pixelProcess(sc, function(x, y, pixel) {
			var hsl = rgbToHsl(pixel.r, pixel.g, pixel.b);
			var h = (hsl[0] + hue + 1) % 1;
			var s = Math.min(1, Math.max(0, hsl[1] + saturation));
			var l = Math.min(1, Math.max(0, hsl[2] + lightness));
			h += hue;
			var rgb = hslToRgb(h, s, l);
			pixel.r = rgb[0];
			pixel.g = rgb[1];
			pixel.b = rgb[2];
		});
	},
	
	/**
	 * description copied from http://www.incx.nec.co.jp/imap-vision/library/wouter/kuwahara.html
	 * implemented by Øyvind Kolås <oeyvindk@hig.no> 2004
	 * Performs the Kuwahara Filter
	 */
	filterKuwahara: function(sc) {
		var oSelf = this;
		var edge_duplicate = 1;
		var height = sc.height;
		var width = sc.width;
		
		function get_rgb(x, y) {
			var p = oSelf.getPixel(sc, Math.min(width - 1, Math.max(0, x)), Math.min(height - 1, Math.max(0, y)));
			p.r /= 255;
			p.g /= 255;
			p.b /= 255;
			return p;
		}

		function get_value(x, y) {
			var p = get_rgb(x, y);
			var max = Math.max(p.r, p.g, p.b), min = Math.min(p.r, p.g, p.b);
			return (max + min) / 2;
		}
		
		function set_rgb(x, y, r, g, b) {
			if (x >= 0 && x < width && y >= 0 && y < height) {
				oSelf.setPixel(sc, x, y, {r: r * 255 | 0, g: g * 255 | 0, b: b * 255 | 0});
			}
		}
		
		// local function to get the mean value, and
		// variance from the rectangular area specified
		
		function rgb_mean_and_variance (x0, y0, x1, y1) {
			var variance, mean, r_mean, g_mean, b_mean;
			var min = 1;
			var max = 0;
			var accumulated_r = 0;
			var accumulated_g = 0;
			var accumulated_b = 0;
			var count = 0;
			var x, y, v, rgb;
	 
			for (y = y0; y <= y1; ++y) {
				for (x = x0; x <= x1; ++x) {
					v = get_value(x, y);
					rgb = get_rgb(x, y);
					accumulated_r += rgb.r;
					accumulated_g += rgb.g;
					accumulated_b += rgb.b;
					++count;
					if (v < min) {
						min = v;
					}
					if (v > max) {
						max = v;
					}
				}
			}
			variance = max - min,
			mean_r = accumulated_r / count;
			mean_g = accumulated_g / count;
			mean_b = accumulated_b / count;
			return {mean: {r: mean_r, g: mean_g, b: mean_b}, variance: variance};
		}

		// return the kuwahara computed value
		function rgb_kuwahara(x, y, radius) {
			var best_r, best_g, best_b;
			var best_variance = 1.0;
			
			function updateVariance(x0, y0, x1, y1) {
				var m = rgb_mean_and_variance (x0, y0, x1, y1);
				if (m.variance < best_variance) {
					best_r = m.mean.r;
					best_g = m.mean.g;
					best_b = m.mean.b;
					best_variance = m.variance;
				}
			}
			
			updateVariance(x - radius, y - radius, x, y);
			updateVariance(x, y - radius, x + radius, y);
			updateVariance(x, y, x + radius, y + radius);
			updateVariance(x - radius, y, x, y + radius);
			return {r: best_r * 255 | 0, g: best_g * 255 | 0, b: best_b * 255 | 0};
		}

		var radius = this.config('radius');
		
		this.pixelProcess(sc, function(x, y, p) {
			var rgb = rgb_kuwahara(x, y, radius);
			p.r = rgb.r;
			p.g = rgb.g;
			p.b = rgb.b;
		});
	},


	run: function(oCanvas, p1, p2) {
		this.init(p1, p2);
		var fStartTime = this.perf.now();
		var sc = this.buildShadowCanvas(oCanvas);
		this.one('pixelprocess.end', (function(oEvent) {
			this.commitShadowCanvas(oEvent.sc);
			this.trigger('complete', this.config());
		}).bind(this));
		switch (this.config('command')) {

			case 'contrast': 
				this.filterContrast(sc);
			break;

			case 'negate': 
				this.filterNegate(sc);
			break;

			case 'grayscale':
				this.config('kernel', [
					[0.30, 0.59, 0.11], 
					[0.30, 0.59, 0.11], 
					[0.30, 0.59, 0.11]
				]);
				this.filterColor(sc);
			break;
			
			case 'sepia':
				this.config('kernel', [
					[0.393, 0.769, 0.189],
					[0.349, 0.686, 0.168],
					[0.272, 0.534, 0.131]
				]);
				this.filterColor(sc);
			break;

			case 'color':
				this.filterColor(sc);
			break;

			case 'noise':
				this.filterNoise(sc);
			break;

			case 'hsl':
				this.filterHSL(sc);
			break;

			case 'blur':
				if (this.config('radius') < 2) {
					this.config('kernel', [
						[0.0, 0.2, 0.0],
						[0.2, 0.2, 0.2],
						[0.0, 0.2, 0.0]
					]);
				} else {
					this.config('kernel', this.buildGaussianBlurMatrix(Math.max(2, this.config('radius')) / 3));
				}
				this.convolutionProcess(sc);
			break;

			case 'convolution':
				this.convolutionProcess(sc);
			break;
			
			case 'pixelmap':
				this.pixelProcess(sc, this.config('func'));
			break;

			case 'sharpen':
				if (this.config('more')) {
					this.config('kernel', [
						[1,  1,  1], 
						[1, -7,  1], 
						[1,  1,  1] 
					]);
				} else {
					this.config('kernel', [
						[-1, -1, -1, -1, -1], 
						[-1,  2,  2,  2, -1], 
						[-1,  2,  8,  2, -1], 
						[-1,  2,  2,  2, -1], 
						[-1, -1, -1, -1, -1]
					]);
					this.config('factor', 1 / 8);
				}
				this.convolutionProcess(sc);
			break;
			
			case 'edges':
				this.config('alpha', false); // alpha channel will mess up everything
				this.config('kernel', [
					[-1, -1, -1], 
					[-1,  8, -1], 
					[-1, -1, -1] 
				]);
				this.convolutionProcess(sc);
			break;
			
			case 'emboss':
				if (this.config('sobel')) {
					this.config('kernel', [
						[-1, -2, -1], 
						[ 0,  0,  0], 
						[ 1,  2,  1]
					]);
				} else if (this.config('more')) {
					this.config('kernel', [
						[-2, -1,  0], 
						[-1,  1,  1], 
						[ 0,  1,  2]
					]);
				} else {
					this.config('kernel', [
						[-1, -1,  0], 
						[-1,  1,  1], 
						[ 0,  1,  1]
					]);
				}
				this.convolutionProcess(sc);
			break;
			
			case 'kuwahara':
				this.filterKuwahara(sc);
			break;
			
		}
		if (this.config('sync')) {
			this.commitShadowCanvas(sc);
			var fEndTime = this.perf.now();
			this.data('duration', fEndTime - fStartTime);
		}
	}


});

O2.mixin(O876.Philter, O876.Mixin.Data);
O2.mixin(O876.Philter, O876.Mixin.Events);
/** Rainbow - Color Code Convertor Boîte à outil graphique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 * good to GIT
 */

O2.createClass('O876.Rainbow', {
	/** 
	 * Fabrique une chaine de caractère représentant une couleur au format CSS
	 * @param xData une structure {r: int, g: int, b: int, a: float}
	 * @return code couleur CSS au format rgb(r, g, b) ou rgba(r, g, b, a)
	 */
	rgba: function(xData) {
		return this._buildRGBAFromStructure(this.parse(xData));
	},
	
	/**
	 * Analyse une valeur d'entrée pour construire une structure avec les 
	 * composantes "r", "g", "b", et eventuellement "a".
	 */ 
	parse: function(xData) {
		if (typeof xData === "object") {
			return xData;
		} else if (typeof xData === "number") {
			return this._buildStructureFromInt(xData);
		} else if (typeof xData === "string") {
			switch (xData.length) {
				case 3:
					return this._buildStructureFromString3(xData);
					
				case 4:
					if (xData[0] === '#') {
						return this._buildStructureFromString3(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				case 6:
					return this._buildStructureFromString6(xData);
					
				case 7:
					if (xData[0] === '#') {
						return this._buildStructureFromString6(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				default:
					var rx = xData.match(/^rgb\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)$/);
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
	},
	
	/**
	 * Génère un spectre entre deux valeurs de couleurs
	 * La fonction renvoi 
	 */
	spectrum: function(sColor1, sColor2, nSteps) {
		var c1 = this.parse(sColor1);
		var c2 = this.parse(sColor2);
		
		var nSecur = 100;
		
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
			var m = getMedian(x1, x2);
			var n = (n1 + n2) >> 1;
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
	},

	_buildStructureFromInt: function(n) {
		var r = (n >> 16) & 0xFF;
		var g = (n >> 8) & 0xFF;
		var b = n & 0xFF;
		return {r: r, g: g, b: b};
	},
	
	_buildStructureFromString3: function(s) {
		var r = parseInt('0x' + s[0] + s[0]);
		var g = parseInt('0x' + s[1] + s[1]);
		var b = parseInt('0x' + s[2] + s[2]);
		return {r: r, g: g, b: b};
	},

	_buildStructureFromString6: function(s) {
		var r = parseInt('0x' + s[0] + s[1]);
		var g = parseInt('0x' + s[2] + s[3]);
		var b = parseInt('0x' + s[4] + s[5]);
		return {r: r, g: g, b: b};
	},

	_buildRGBAFromStructure: function(oData) {
		var s1 = 'rgb';
		var s2 = oData.r.toString() + ', ' + oData.g.toString() + ', ' + oData.b.toString();
		if ('a' in oData) {
			s1 += 'a';
			s2 += ', ' + oData.a.toString();
		}
		return s1 + '(' + s2 + ')';
	},
	
	_buildString3FromStructure: function(oData) {
		var sr = ((oData.r >> 4) & 0xF).toString(16);
		var sg = ((oData.g >> 4) & 0xF).toString(16);
		var sb = ((oData.b >> 4) & 0xF).toString(16);
		return sr + sg + sb;
	}
});
/**
 * Class of multiple channels audio management
 * deals with sound effects and background music
 * deals with crossfading background musics
 */
 
/* globals O2 */

O2.createClass('O876.SoundSystem', {
	CHAN_MUSIC : 99,

	HAVE_NOTHING: 0,		// on n'a aucune information sur l'état du fichier audio ; mieux vaut ne pas lancer la lecture.
	HAVE_METADATA: 1,		// on a les méta données.
	HAVE_CURRENT_DATA: 2,	// on a assez de données pour jouer cette frames seulement.
	HAVE_FUTURE_DATA: 3,	// on a assez de données pour jouer les deux prochaines frames. 
	HAVE_ENOUGH_DATA: 4,	// on a assez de données.
	
	oBase : null,
	aChans : null,
	oMusicChan : null,
	nChanIndex : -1,

	bMute: false,
	bAllUsed: false,
	
	sCrossFadeTo: '',
	bCrossFading: false,

	sSndPlayedFile: '',
	fSndPlayedVolume: 0,
	nSndPlayedTime: 0,
	
	sFormat: '',
	sPath: '', 
	
	oInterval: null,

	__construct : function() {
		this.oBase = document.body;
		this.aChans = [];
		this.aAmbient = [];
		this.aChans = [];
		this._createMusicChannel();
	},
	
	
	/****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ******/
	/****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ******/
	/****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ****** PUBLIC FUNCTIONS ******/
	/**
	 * Returns true if the specified audio file is worth playing.
	 * and false if it's not.
	 *
	 * A file is worth playing if it has not already started to play a few milliseconds ago.
	 * his is why a "time" value is being passed among parameters
	 * This prevents two similar sounds from being played at very small interval (which produce ugly sound experience)
	 * 
	 * The typical example :
	 * When the player fires five missiles, each missile producing the same sound,
	 * It's not a good idea to play five sounds !
	 * @param nTime current timestamp (given by Date.now() for example)
	 * @param sFile audio file name
	 * @param fVolume
	 */
	worthPlaying: function(nTime, sFile, fVolume) {
		if (this.nSndPlayedTime != nTime || this.sSndPlayedFile != sFile || this.fSndPlayedVolume != fVolume) {
			this.sSndPlayedFile = sFile;
			this.fSndPlayedVolume = fVolume;
			this.nSndPlayedTime = nTime;
			return true;
		} else {
			return false;
		}
	},
	
	/**
	 * Stops sounds from being played
	 * call unmute to restore normal audio function
	 */
	mute: function() {
		if (!this.bMute) {
			this.oMusicChan.pause();
			this.bMute = true;
		}
	},

	/**
	 * Restores normal audio function
	 * useful to restore sound after a mute() call
	 */
	unmute: function() {
		if (this.bMute) {
			this.oMusicChan.play();
			this.bMute = false;
		}
	},

	/**
	 * Destroys all audio channels
	 */
	free: function() {
		this.setChannelCount(0);
		this._freeMusicChannel();
	},

	/**
	 * Sets the number of maximum channels
	 * If called more than one time, it will 
	 * delete any previous created channel,
	 * and will rebuild new fresh ones.
	 * @param int n number if channels
	 */
	setChannelCount: function(n) {
		var c = this.aChans;
		while (c.length > n) {
			c.pop().remove();
		}
		while (c.length < n) {
			this._addChan();
		}
	},

	/**
	 * returns the maximum number of useable channels
	 * @return int
	 */
	getChannelCount: function() {
		return this.aChans.length;
	},

	/**
	 * Play another music track, replacing, if needed, the previous music track.
	 * Music tracks are play in a separated channel
	 * @param sFile new file
	 */
	playMusic : function(sFile, bOverride) {
		var oChan = this.oMusicChan;
		oChan.loop = true;
		this._setChanSource(oChan, sFile);
		oChan.load();
		oChan.play();
	},

	/**
	 * Define the directory where sound files are stored
	 * @param s string, path where sound files are stored
	 */
	setPath: function(s) {
		this.sPath = s;
	},

	/**
	 * Diminue graduellement le volume sonore du canal musical
	 * puis change le fichier sonore
	 * puis remonte graduellement le volume
	 * le programme d'ambience est reseté par cette manip
	 */
	crossFadeMusic: function(sFile) {
		if (sFile === undefined) {
			throw new Error('sound file is not specified');
		}
		if (this.bCrossFading) {
			this.sCrossFadeTo = sFile;
			return;
		}
		var iVolume = 100;
		var nVolumeDelta = -10;
		this.bCrossFading = true;
		if (this.oInterval) {
			window.clearInterval(this.oInterval);
		}
		this.oInterval = window.setInterval((function() {
			iVolume += nVolumeDelta;
			this.oMusicChan.volume = Math.min(1, Math.max(0, iVolume / 100));
			if (iVolume <= 0) {
				this.playMusic(sFile);
				this.oMusicChan.volume = 1;
				window.clearInterval(this.oInterval);
				this.oInterval = null;
				this.bCrossFading = false;
				if (this.sCrossFadeTo) {
					this.crossFadeMusic(this.sCrossFadeTo);
					this.sCrossFadeTo = '';
				}
			}
		}).bind(this), 100);
	},

	/**
	 * Starts a sound file playback
	 */
	play : function(sFile, fVolume) {
		var nChan = null;
		var oChan = null;
		// check if we should cancel the play call
		if (this.bMute || sFile === undefined) {
			return -1;
		}
		// case : music channel -> redirect to playMusic
		if (nChan == this.CHAN_MUSIC) {
			this.playMusic(sFile);
			return nChan;
		} else if (this._hasChan()) { 
			// checks channel availability
			if (nChan === null) {
				// get a free channel, if none specified
				nChan = this._getFreeChan(sFile);
			}
			oChan = this.aChans[nChan];
		} else {
			// no free channel available
			oChan = null;
			return -1;
		}
		if (oChan !== null) {
			// we got a channel
			if (oChan.__file != sFile) {
				// new file
				this._setChanSource(oChan, sFile);
				oChan.__file = sFile;
				oChan.load();
			} else if (oChan.readyState > this.HAVE_NOTHING) {
				// same file, play again from start
				oChan.currentTime = 0;
				oChan.play();
			}
		} else {
			// could not get a channel:
			// exit in shame
			return -1;
		}
		// set volume, if specified
		if (fVolume !== undefined) {
			oChan.volume = fVolume;
		}
	},








	/****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ******/
	/****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ******/
	/****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ****** PROTECTED FUNCTIONS ******/




	/**
	 * Sets a channel source
	 * Uses default path and extension
	 * This function is used internaly : use play()
	 * @param oChan HTMLAudio Element
	 * @param sSrc what file to play (neither path nor extension)
	 */
	_setChanSource: function(oChan, sSrc) {
		if (sSrc == undefined) {
			throw new Error('undefined sound');
		}
		oChan.src = this.sPath + '/' + this.sFormat + '/' + sSrc + '.' + this.sFormat;
	},
	
	
	/**
	 * creates a new audio channel element
	 * and appends it to the DOM
	 * @return HTMLAudioElement
	 */
	_createChan: function() {
		var oChan = document.createElement('audio');
		this.oBase.appendChild(oChan);
		return oChan;
	},

	/**
	 * Adds and initializes a new Audio channel
	 * @return HTMLAudioElement
	 */
	_addChan : function() {
		var oChan = this._createChan();
		oChan.setAttribute('preload', 'auto');
		oChan.setAttribute('autoplay', 'autoplay');
		oChan.__file = '';
		this.aChans.push(oChan);
		this.bAllUsed = false;
		return oChan;
	},

	/**
	 * returns true if the specified channel iis currently playing
	 * the specified sound file
	 * @param nChan int channel number
	 * @param sFile string sound file name
	 * @return boolean
	 */
	_isChanFree : function(nChan, sFile) {
		// case : music channel
		if (nChan == this.CHAN_MUSIC) {
			return this.oMusicChan.ended;
		}
		// check specified channel number validity
		nChan = Math.max(0, Math.min(this.aChans.length - 1, nChan));
		var oChan = this.aChans[nChan];
		if (sFile === undefined) {
			return oChan.ended;
		} else {
			var bEmpty = oChan.__file === '';
			var bNotPlaying = oChan.ended;
			var bAlreadyLoaded = sFile == oChan.__file;
			return bEmpty || (bNotPlaying && bAlreadyLoaded);
		}
	},

	_getFreeChan : function(sFile) {
		if (!this._hasChan()) {
			return -1;
		}
		var iChan, nChanCount;
		for (iChan = 0, nChanCount = this.aChans.length; iChan < nChanCount; ++iChan) {
			if (this._isChanFree(iChan, sFile)) {
				return iChan;
			}
		}
		for (iChan = 0, nChanCount = this.aChans.length; iChan < nChanCount; ++iChan) {
			if (this._isChanFree(iChan)) {
				return iChan;
			}
		}
		this.nChanIndex = (this.nChanIndex + 1) % this.aChans.length;
		return this.nChanIndex;
	},

	_hasChan : function() {
		return this.aChans.length > 0;
	},

	_freeMusicChannel: function() {
		if (this.oMusicChan) {
			this.oMusicChan.remove();
			this.oMusicChan = null;
		}		
	},

	_createMusicChannel: function() {
		this._freeMusicChannel();
		this.oMusicChan = this._createChan();
		if (this.oMusicChan.canPlayType('audio/ogg')) {
			this.sFormat = 'ogg';
		} else if (this.oMusicChan.canPlayType('audio/mp3')) {
			this.sFormat = 'mp3';
		} else {
			throw new Error('neither ogg nor mp3 can be played back by this browser');
		}
	}

});

/**
 * Outil d'exploitation de requete Ajax
 * Permet de chainer les requete ajax avec un système de file d'attente.
 * good to GIT
 */

O2.createClass('O876.XHR', {
	_oInstance : null,
	aQueue: null,
	_bAjaxing : false,
	pCurrentCallback : null,
	
	__construct: function() {
		this.aQueue = [];
	},

	// Renvoie une instance XHR
	getInstance : function() {
		if (this._oInstance === null) {
			this._oInstance = new XMLHttpRequest();
			this._oInstance.addEventListener('readystatechange', this._dataReceived.bind(this));
		}
		return this._oInstance;
	},

	_dataReceived : function(oEvent) {
		var xhr = oEvent.target;
		if (xhr.readyState == XMLHttpRequest.DONE) {
			var n = this.aQueue.shift();
			if (n) {
				if (xhr.status == 200) {
					n.callback(xhr.responseText);
				} else {
					n.callback(null, xhr.status.toString());
				}
			}
			if (this.aQueue.length) {
				this.runAjax();
			} else {
				this._bAjaxing = false;
			}
		}
	},

	runAjax: function() {
		this._bAjaxing = true;
		var q = this.aQueue;
		if (q.length) {
			var n = q[0];
			var xhr = this.getInstance();
			xhr.open(n.method, n.url, true);
			xhr.send(n.data);
		}
	},

	autoRunAjax: function() {
		if (!this._bAjaxing) {
			this.runAjax();
		}
	},


	/**
	 * Get data from server asynchronously and feed the spécified DOM Element
	 * 
	 * @param string sURL url
	 * @param object/string/function oTarget
	 * @return string
	 */
	get : function(sURL, pCallback) {
		if (sURL === null) {
			throw new Error('url is invalid');
		}
		this.aQueue.push({method: 'GET', data: null, url: sURL, callback: pCallback});
		this.autoRunAjax();
	},
	
	post: function(sURL, sData, pCallback) {
		if (typeof sData === 'object') {
			sData = JSON.stringify(sData);
		}
		this.aQueue.push({method: 'POST', data: sData, url: sURL, callback: pCallback});
		this.autoRunAjax();
	},
	
	/**
	 * Get data from server synchronously.
	 * It is known that querying synchronously is bad for health and makes animals suffer. 
	 * So don't use synchronous ajax calls.
	 */
	getSync: function(sURL) {
		console.warn('Synchronous Ajax Query (url : ' + sURL + ') ! It is known that querying synchronously is bad for health and makes animals suffer.');
		var xhr = this.getInstance();
		xhr.open('GET', sURL, false);
	    xhr.send(null);
	    if (xhr.status == 200) {
	    	return xhr.responseText;
	    } else {
	    	throw new Error('XHR failed to load: ' + sURL + ' (' + xhr.status.toString() + ')');
	    }
	},

	postSync: function(sURL, sData) {
		console.warn('Synchronous Ajax Query (url : ' + sURL + ') ! It is known that querying synchronously is bad for health and makes animals suffer.');
		var xhr = this.getInstance();
		xhr.open('POST', sURL, false);
	    xhr.send(sData);
	    if (xhr.status == 200) {
	    	return xhr.responseText;
	    } else {
	    	throw new Error('XHR failed to post to: ' + sURL + ' (' + xhr.status.toString() + ')');
	    }
	}
});
/**
 * Parse a string of format "?param1=value1&param2=value2"
 * useful when it comes to get parameters from an url
 * good to GIT
 */
O2.createObject('O876.parseSearch' , function(sSearch) {
	if (sSearch) {
		var nQuest = sSearch.indexOf('?');
		if (nQuest >= 0) {
			sSearch = sSearch.substr(nQuest + 1);
		} else {
			return {};
		}
	} else {
		sSearch = window.location.search.substr(1);
	}
	var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		query  = sSearch,
		_decode = function(s) {
			return decodeURIComponent(s.replace(pl, ' '));
		};
	var oURLParams = {};
	while (match = search.exec(query)) {
	   oURLParams[_decode(match[1])] = _decode(match[2]);
	}
	return oURLParams;
});
/**
 * Transforms an HTML element (and its content) into a bitmap image 
 * inside a canvas.
 * @param xElement the DOM element to be rasterize
 * @param oCanvas the canvas on which will render the element
 * @param pDone a callback function called when it's done 
 * good to GIT
 */ 
O2.createObject('O876.rasterize', function(xElement, oCanvas, pDone) {
	var w = oCanvas.width;
	var h = oCanvas.height;
	var ctx = oCanvas.getContext('2d');
	var sHTML = typeof oElement == 'string' ? xElement : xElement.outerHTML;
	var sSVG = ([
'	<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">',
'		<foreignObject width="100%" height="100%">',
'			<style scoped="scoped">',
'div.rasterized-body {',
'	width: 100%; ',
'	height: 100%; ',
'	overflow: hidden;',
'	background-color: transparent;',
'	color: black;',
'	font-family: monospace;',
'	font-size: 8px;',
'}',
'',
'			</style>',
'			<div class="rasterized-body" xmlns="http://www.w3.org/1999/xhtml">',
             sHTML,
           '</div>',
         '</foreignObject>',
       '</svg>'
    ]).join('\n');
	var img = new Image();
	var svg = new Blob([sSVG], {type: 'image/svg+xml;charset=utf-8'});
	var url = URL.createObjectURL(svg);
	img.addEventListener('load', function() {
	    ctx.drawImage(img, 0, 0);
	    URL.revokeObjectURL(url);
	    pDone();
	});
	img.setAttribute('src', url);
});
/**
 * O876 Toolkit
 * This tool is used to determine the type of all parameters passed
 * to a function, durinng a call.
 * usually you type : O876.typeMap(arguments, format)
 * the format controls the output format (either array or string)
 * the function returns an array or a string.
 * each item stands for the type of the matching argument
 * the 'short' version returns
 *
 * undefined : undefined / null
 * number : number
 * object : object, not an array, not null
 * function : function
 * boolean : boolean
 * array : array
 *
 * goot to GIT
 */ 
O2.createObject('O876.typeMap', function(aArgs, sFormat) {
	var aOutput = Array.prototype.slice.call(aArgs, 0).map(function(x) {
		var tx = (typeof x);
		switch (tx) {
			case 'object':
				if (x === null) {
					return 'undefined';
				} else if (Array.isArray(x)) {
					return 'array';
				} else {
					return 'object';
				}
				break;
				
			default:
				return tx;
		}
	});
	switch (sFormat) {
		case 'short':
			return aOutput.map(function(x) {
				return x.charAt(0);
			}).join('');
		break;

		default:
			return aOutput;
	}
});
