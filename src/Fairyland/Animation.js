/** 
 * Animation : Classe chargée de calculer les frames d'animation
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
		this._loop = 0; // type de boucle 0: pas de boucle; 1: boucle forward; 2: boucle yoyo 3: random
		this._frame = 0; // Frame (absolue) actuellement achifée
		this.nDirLoop = 1;  // direction de la boucle (pour yoyo)
	}

	start(n) {
		sb.prop(this, '_start', n);
	}

	index(n) {
		sb.prop(this, '_index', n);
	}

	count(n) {
		sb.prop(this, '_count', n);
	}

	duration(n) {
		sb.prop(this, '_duration', n);
	}

	time(n) {
		sb.prop(this, '_index', n);
	}



	/**
	 * Lance une animation en incrémentant le compteur de temps d'une valeur spécifiée en paramètre
	 * @param nInc {number} incrément de temps
	 * @returns {Animation}
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
				this._index += this.nDirLoop;
			}
		}
		// pour les éventuels très gros dépassement de duration (pas de boucle)
		if (this._time >= this._duration) {
			this._index += this.nDirLoop * (this._time / this._duration | 0);
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
					this.nDirLoop = -1;
				}
				if (this._index <= 0) {
					this.nDirLoop = 1;
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
	 * Réinitialise les paramètre des informations
	 */
	reset() {
		this._index = 0;
		this._time = 0;
		this.nDirLoop = 1;
		return this;
	}
}

O2.mixin(Fairy.Animation, O876.Mixin.Prop);