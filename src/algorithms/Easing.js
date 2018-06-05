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