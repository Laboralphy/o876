O2.createClass('Fairy.Mobile', {
	_shape: null,
	_sprite: null,
	_flight: null,
	_dead: false, // les mobile noté "dead" doivent être retiré du jeu
	_collider: null,

	flight: function(f) {
		if (this._shape && f !== undefined) {
			this._shape.flight(f);
		}
		return this.prop('_flight', f);
	},

	shape: function(s) {
		if (this._shape) {
			this._shape.flight(this._flight);
		}
		return this.prop('_shape', s);
	},
	
	render: function(oContext, vOffset) {
		this._sprite.render(oContext, this._flight, vOffset);
	},
	
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
