O2.createClass('Fairy.Tileset', {
	_tiles: null,	// image
	_tileWidth: 0,
	_tileHeight: 0,
	_rects: null,
	
	__construct: function() {
		this._rects = [];
	},
	
	/**
	 * Renvoie le rect du tile dont l'indice est spécifié
	 * @param n numéro du tile demandé
	 * @return {x, y, width, height}
	 */
	rect: function(n) {
		var r = this._rects[n];
		if (!r) {
			var wImage = this._tiles.width;
			var hImage = this._tiles.height;
			var nx = n * this._tileWidth;
			var x = nx % wImage;
			var y = (nx / wImage | 0) * this._tileHeight;
			r = {
				x: x,
				y: y,
				width: this._tileWidth,
				height:this._tileHeight
			};
			this._rects[n] = r;
		}
		return r;
	}
});

O2.mixin(Fairy.Tileset, O876.Mixin.Prop);
