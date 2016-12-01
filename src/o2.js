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

