/**
 * Le layer doit etre rendu dans une surface, à une position données
 * */
 
 
O2.extendClass('Fairy.LandLayer', Fairy.Layer, {
	
	_grid: null,
	_tileset: null,
	_view: null, // vector de vue Rect
	
	__construct: function() {
		__inherited();
		this._tileset = new Fairy.Tileset();
		this._grid = new Fairy.Grid();
		this._view = new Fairy.View();
	},

	render: function(oContext) {
		var ts = this.tileset();
		var p = this.view().points();
		var tw = ts.tileWidth();
		var th = ts.tileHeight();
		var xStart = p[0].x;
		var yStart = p[0].y;
		var xEnd = p[1].x;
		var yEnd = p[1].y;
		var xStartTile = xStart / tw | 0;
		var yStartTile = yStart / th | 0;
		var xEndTile = xEnd / tw | 0;
		var yEndTile = yEnd / th | 0;
		var wView = xEnd - xStart;
		var hView = yEnd - yStart;
		var wTiles = wView / tw | 0;
		var hTiles = hView / th | 0;
		var xOfs = (tw - xStart) % tw;
		var yOfs = (th - yStart) % th;
		var x, y, r, yth, xth;
		var oTiles = ts.tiles();
		for (y = 0; y <= hTiles + 1; ++y) {
			yth = y * th;
			for (x = 0; x <= wTiles + 1; ++x) {
				r = ts.rect(this._grid.cell(x - xStartTile, y - yStartTile));
				oContext.drawImage(oTiles, r.x, r.y, r.width, r.height, x * tw - xOfs, yth - yOfs, tw, th);
			}
		}		
		return this;
	}

});

O2.mixin(Fairy.LandLayer, O876.Mixin.Prop);
O2.mixin(Fairy.LandLayer, Fairy.Mixin.GridProxy);
