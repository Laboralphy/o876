O2.createClass('Fairy.Sprite', {
	_center: null,
	_color: 'red',
	
	__construct: function() {
		this._center = new Fairy.Vector();
	},

	render: function(oContext, oFlight) {
		var c = this._center;
		var p = oFlight.position();
		oContext.fillStyle = this.color();
		oContext.fillRect(p.x - c.x, p.y - c.y, 32, 32);
	}
});


O2.mixin(Fairy.Sprite, O876.Mixin.Prop);
