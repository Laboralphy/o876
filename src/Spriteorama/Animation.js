/**
 * @class Animation
 * This is an animation class
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */

import sb from '../SpellBook';

export default class Animation {
	constructor() {
        this._start = 0; // frame de début
		this._index = 0; // index de la frame en cours d'affichage
		this._count = 0; // nombre total de frames
		this._duration = 0; // durée de chaque frame, plus la valeur est grande plus l'animation est lente
		this._time = 0; // temps
		this._loop = 0; // type de boucle 1: boucle forward; 2: boucle yoyo 3: random
		this._frame = 0; // Frame (absolue) actuellement achifée
        this._nDirLoop = 1;  // direction de la boucle (pour yoyo)
	}

    /**
	 * Setter/Getter for the base index frame
     * @param (x) {number}
     * @return {Animation|number}
     */
    start(x) {
        return sb.prop(this, '_start', x);
    }

    /**
	 * Setter/Getter for the current index frame - value starts at zero and is
	 * always lesser than count()
     * @param (x) {number}
     * @return {Animation|number}
     */
    index(x) {
        return sb.prop(this, '_index', x);
    }

    /**
	 * Setter/Getter for the number of frames in this animation
     * @param (x) {number}
     * @return {Animation|number}
     */
    count(x) {
        return sb.prop(this, '_count', x);
    }

    /**
	 * Setter/Getter for the duration of each frame
	 * usually in millisecond, but time unit is arbitrary here
     * @param (x) {number}
     * @return {Animation|number}
     */
    duration(x) {
        return sb.prop(this, '_duration', x);
    }

    /**
	 * Setter/Getter for the current time.
	 * the basic idea of this class is :
	 * when time exceed duration, the index is incremented
     * @param (x) {number}
     * @return {Animation|number}
     */
    time(x) {
        return sb.prop(this, '_time', x);
    }

    /**
	 * Setter/Getter for the loop flag
	 * accepted values are :
	 * 0 : no loop, animation ends when reach last frame
	 * 1 : forward, animation restart at zero when reach last frame
	 * 2 : yoyo, animation loops forward until reach last frame, then loops backward
     * @param (x) {number}
     * @return {Animation|number}
     */
    loop(x) {
        return sb.prop(this, '_loop', x);
    }

    /**
	 * Setter/Getter for the absolute index frame
	 * Setting this value is irrevelant since it is totally ignored, and updated each frame
	 * The returned value is always = start + index
     * @param (x) {number}
     * @return {Animation|number}
     */
    frame(x) {
        return sb.prop(this, '_frame', x);
    }

    /**
	 * Runs the animation, by "nInc" unit of time.
	 * time unit is arbitrary, but "nInc", "time" and "duration" properties
	 * are of the same unit
     * @param nInc {number}
     * @return {Animation}
     */
	animate(nInc) {
		if (this._count <= 1 || this._duration === 0) {
			return this._index + this._start;
		}
		this._time += nInc;
		// Dépassement de duration (pour une seule fois)
		if (this._time >= this._duration) {
			this._time -= this._duration;
			if (this._loop === 3) {
				this._index = Math.random() * this._count | 0;
			} else {
				this._index += this._nDirLoop;
			}
		}
		// pour les éventuels très gros dépassement de duration (pas de boucle)
		if (this._time >= this._duration) {
			this._index += this._nDirLoop * (this._time / this._duration | 0);
			this._time %= this._duration;
		}
		
		switch (this._loop) {
			case 1:
				if (this._index >= this._count) {
					this._index = 0;
				}
			break;
				
			case 2:
				if (this._index >= this._count) {
					this._index = this._count - 2;
					this._nDirLoop = -1;
				}
				if (this._index <= 0) {
					this._nDirLoop = 1;
					this._index = 0;
				}
			break;

			default:
				if (this._index >= this._count) {
					this._index = this._count - 1;
				}
		}
		this._frame = this._index + this._start;
		return this;
	}

    /**
	 * Resets animation
     * @return {Animation}
     */
	reset() {
		this._index = 0;
		this._time = 0;
		this._nDirLoop = 1;
		return this;
	}
}
