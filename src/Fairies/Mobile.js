/**
 * @class Fairy.Mobile
 */
O2.createClass('Fairy.Mobile', {
    /**
	 * @property {Fairy.Shape}
     */
	_shape: null,
    /**
     * @property {Fairy.Sprite}
     */
	_sprite: null,
    /**
     * @property {Fairy.Flight}
     */
	_flight: null,
    /**
     * @property {boolean}
     */
	_dead: false, // les mobile noté "dead" doivent être retiré du jeu
    /**
     * @property {Fairy.Collider}
     */
	_collider: null,

    /**
	 * setter/getter for the flight property
     * @param f {Fairy.Flight}
     * @return {Fairy.Flight|Fairy.Mobile}
     */
	flight: function(f) {
		if (this._shape && f !== undefined) {
			this._shape.flight(f);
		}
		return this.prop('_flight', f);
	},

    /**
     * setter/getter for the shape property
     * @param s {Fairy.Shape}
     * @return {Fairy.Shape|Fairy.Mobile}
     */
	shape: function(s) {
		if (this._shape) {
			this._shape.flight(this._flight);
		}
		return this.prop('_shape', s);
	},

    /**
	 * renders the mobile on the given context at a certain position
     * @param oContext {*}
     * @param vOffset {Fairy.Vector}
     */
	render: function(oContext, vOffset) {
		this._sprite.render(oContext, this._flight, vOffset);
	},

    /**
	 * invoke the following operations :
	 * - sprite process
	 * - flight computations
	 * - position tracking in the collider
     * @param nTime {number} current time
     */
	process: function(nTime) {
		this._sprite.process(nTime);
		this._flight.flap(this, nTime);
		if (this._collider) {
			this._collider.track(this);
		}
	}
});

O2.mixin(Fairy.Mobile, O876.Mixin.Data);
O2.mixin(Fairy.Mobile, O876.Mixin.Prop);
