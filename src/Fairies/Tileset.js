/**
 * @class Fairy.Tileset
 */
O2.createClass('Fairy.Tileset', {
    /**
     * @method tileWidth
     * @return {number}
     */
    /**
     * @property {number}
     */
	_tileWidth: 0,
    /**
     * @method tileHeight
     * @return {number}
     */
    /**
     * @property {number}
     */
	_tileHeight: 0,
    /**
     * @method tileWidth
     * @return {Array.<Fairy.Rect>}
     */
    /**
     * @property {Array.<Fairy.Rect>}
     */
	_rects: null,
    /**
     * @property {HTMLImageElement}
     */
    _tiles: null,	// image

	__construct: function() {
		this._rects = [];
	},

    /**
     * @param [t] {Image}
     * @return {Image|Fairy.Tileset}
     */
	tiles: function(t) {
    	return this.prop('_tiles', t);
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
