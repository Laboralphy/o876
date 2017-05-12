/**
 * @class Fairy.Sprite
 */
O2.createClass('Fairy.Sprite', {
    /**
     * @method origin
	 * @param {Fairy.Vector} [x]
	 * @return {Fairy.Vector|Fairy.Sprite}
	 *
     * @property {Fairy.Vector}
     */
    _origin: null,
    /**
     * @method color
	 * @param {string} [x]
	 * @return {string|Fairy.Sprite}
	 *
     * @property {string}
     */
	_color: 'red',
    /**
	 * @method tileset
	 * @param {Fairy.Tileset} [x]
	 * @return {Fairy.Tileset|Fairy.Sprite}
     */
    /**
	 * @property {Fairy.Tileset}
     */
	_tileset: null,

    /**
	 * @method animations
	 * @param {Array.<Fairy.Animation>} [x]
	 * @return {Array.<Fairy.Animation>|Fairy.Sprite}
	 */
     /**
	 * @property {Array.<Fairy.Animation>} all animations
     */
	_animations: null,
    /**
     * @property {Fairy.Animation}
     */
	_animation: null,
    /**
	 * @method zoom
     * @param {number} [x]
     * @return {number|Fairy.Sprite}
     *
	 * @property {number}
     */
	_zoom: 1,
	
	__construct: function() {
		this._origin = new Fairy.Vector();
		this._animations = [];
	},

	process: function(nTime) {
		this._animation.animate(nTime);
	},
	
    /**
	 * sets or gets the current animation
     * @param [n] {number}
     * @return {Fairy.Animation|Fairy.Sprite}
     */
	animation: function(n) {
		if (n === undefined) {
			return this._animation;
		} else {
			this._animation = this.animations()[n];
			return this;
		}
	},

    /**
	 *
     * @param oContext
     * @param oFlight
     * @param vOffset
     */
	render: function(oContext, oFlight, vOffset) {
		var vx = 0;
		var vy = 0;
		if (vOffset) {
			vx += vOffset.x;
			vy += vOffset.y;
		}
		var c = this._origin;
		var p = oFlight.position();
		var iFrame = this._animation.frame();
		var ts = this.tileset();
		var r = ts.rect(iFrame);
		var z = this._zoom;
		oContext.drawImage(
			ts.tiles(),
			r.x,
			r.y,
			r.width, 
			r.height, 
			p.x - (c.x - vx) * z, 
			p.y - (c.y - vy) * z, 
			r.width * z, 
			r.height * z
		);
	}
});

O2.mixin(Fairy.Sprite, O876.Mixin.Prop);
