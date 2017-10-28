/**
 * @class Mobile
 * This class manages a mobile object.
 */
import sb from '../SpellBook';

export default class Mobile {
	constructor() {
        this._shape = null;
		this._sprite = null;
		this._flight = null;
		this._dead = false; // les mobile noté "dead" doivent être retiré du jeu
		this._collider = null;
	}

    /**
	 * Setter/Getter of a sprite instance, which holds the animation, the image etc...
     * @param s {Sprite}
     * @return {Sprite|Mobile}
     */
    sprite(s) {
        return sb.prop(this, '_sprite', s);
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
	 * Setter/Getter of an instance of Collider
     * @param c {Collider}
     * @return {Collider|Mobile}
     */
    collider(c) {
        return sb.prop(this, '_collider', c);
	}

    /**
     * Setter/Getter of a flight instance
     * @param f {Flight}
     * @return {Flight|Mobile}
     */
    flight(f) {
		if (this._shape && f !== undefined) {
			this._shape.flight(f);
		}
		return sb.prop(this, '_flight', f);
	}

    /**
     * Setter/Getter of a Shape instance
     * @param s {Shape}
     * @return {Shape|Mobile}
     */
    shape(s) {
        if (this._shape) {
            this._shape.flight(this._flight);
        }
        return sb.prop(this, '_shape', s);
    }

    /**
	 * Proxy to Sprite::render method
     * @param oContext {*} a canvas 2D context
     * @param vOffset {Vector} a vector
     */
	render(oContext, vOffset) {
		this._sprite.render(oContext, this._flight, vOffset);
	}

    /**
	 * Processes time; animation, flight, and collisions will be processed.
     * @param nTime {number} the time advances
     */
	process(nTime) {
		this._sprite.process(nTime);
		this._flight.flap(this, nTime);
		if (this._collider) {
			this._collider.track(this);
		}
	}
}