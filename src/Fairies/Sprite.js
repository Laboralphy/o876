O2.createClass('Fairy.Sprite', {
	_origin: null,
	_color: 'red',
	_tileset: null,
	_animation: null,
	_children: null,

	
	__construct: function() {
		this._origin = new Fairy.Vector();
		this._children = [];
	},

	process: function(nTime) {
		this._children.forEach(c => c.process(nTime));
		this._animation.animate(nTime);
	},

	render: function(oContext, oFlight, vOffset) {
		this._children.forEach(c => c.render(oContext, oFlight, vOffset));
		var vx = 0;
		var vy = 0;
		if (vOffset) {
			vx += vOffset.x;
			vy += vOffset.y;
		}
		var c = this._origin;
		var p = oFlight.position();
		oContext.fillStyle = this.color();
		oContext.fillRect(p.x - c.x + vx, p.y - c.y + vy, 32, 32);
	}
});


O2.mixin(Fairy.Sprite, O876.Mixin.Prop);
