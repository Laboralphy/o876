/** 
 * Animation : Classe chargée de calculer les frames d'animation
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 * @class Fairy.Animation
 */
O2.createClass('Fairy.Animation',  {
    /**
     * @method start
     * @param {number} [x]
     * @return {number|Fairy.Animation}
	 *
	 * @property {number}
     */
	_start : 0, // frame de début
    /**
     * @method index
     * @param {number} [x]
     * @return {number|Fairy.Animation}
	 *
	 * @property {number}
     */
	_index : 0, // index de la frame en cours d'affichage
    /**
     * @method count
     * @param {number} [x]
     * @return {number|Fairy.Animation}
	 *
	 * @property {number}
     */
	_count : 0, // nombre total de frames
    /**
     * @method duration
     * @param {number} [x]
     * @return {number|Fairy.Animation}
     */
	_duration : 0, // durée de chaque frame, plus la valeur est grande plus l'animation est lente
    /**
     * @method time
     * @param {number} [x]
     * @return {number|Fairy.Animation}
	 *
	 * @property {number}
     */
	_time : 0, // temps
    /**
     * @method loop
     * @param {number} [x]
     * @return {number|Fairy.Animation}
	 *
	 * @property {number}
     */
	_loop : 0, // type de boucle 1: boucle forward; 2: boucle yoyo 3: random
    /**
     * @method frame
	 * @memberof Fairy.Animation
     * @param {number} [x]
     * @return {number}
	 *
	 * @property {number}
     */
	_frame: 0, // Frame (absolue) actuellement achifée
	
	nDirLoop: 1,  // direction de la boucle (pour yoyo)

    /**
	 * @param nInc {number} time increment (same unit as duration}
     * @return {Fairy.Animation|number}
     */
	animate : function(nInc) {
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
	},

    /**
	 * Reset animation
     * @return {Fairy.Animation}
     */
	reset : function() {
		this._index = 0;
		this._time = 0;
		this.nDirLoop = 1;
		return this;
	}
});

O2.mixin(Fairy.Animation, O876.Mixin.Prop);