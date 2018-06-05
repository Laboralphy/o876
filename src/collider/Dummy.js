/**
 * @class Mobile
 * This class manages a mobile object.
 */
const sb = require('../SpellBook');
const geometry = require('../geometry');
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