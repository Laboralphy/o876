O2.createClass('Fairy.Sprite', {
	_origin: null,
	_color: 'red',
	_tileset: null,
	_animations: null,
	_animation: null,
	_zoom: 1,
	
	__construct: function() {
		this._origin = new Fairy.Vector();
		this._animations = [];
	},

	process: function(nTime) {
		this._animation.animate(nTime);
	},
	
	animation: function(n) {
		if (n === undefined) {
			return this._animation;
		} else {
			this._animation = this.animations()[n];
			return this;
		}
	},

	render: function(oContext, oFlight, vOffset) {
		var vx = 0;
		var vy = 0;
		if (vOffset) {
			vx += vOffset.x;
			vy += vOffset.y;
		}
		var c = this._origin;
		var p = oFlight.position();
		var iFrame = this.animation().frame();
		var ts = this.tileset();
		var tw = ts.tileWidth();
		var th = ts.tileHeight();
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
