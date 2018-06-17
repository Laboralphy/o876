const WorldGenerator = require('./WorldGenerator');
const o876 = require('../../src');
const ServiceWorkerIO = require('./ServiceWorkerIO');
const CanvasHelper = require('./CanvasHelper');
const WorldTile = require('./WorldTile');

const CLUSTER_SIZE = 16;

class PirateWorld {
	constructor(wgd) {
		this.oWorldDef = wgd;
		this._cache = new o876.structures.Cache2D({size: 1024});
        this._service = new ServiceWorkerIO();
        this._service.service(wgd.service);
        this._service.emit('init', {
        	seed: wgd.seed,
			cell: wgd.cellSize,
			cluster: CLUSTER_SIZE
        });
        this._xView = null;
        this._yView = null;
        this._invalid = false;
        this._rendering = false;
        this._remainingTileCount = 0;
	}

	async view(oCanvas, x, y) {
		if (x !== this._xView || y !== this._yView) {
            this._xView = x;
            this._yView = y;
            if (!this._rendering) {
                await this._renderTiles(oCanvas, x, y);
			}
		}
	}

	cellSize() {
		return this.oWorldDef.cellSize;
	}

	async fetchTile(x, y) {
        return new Promise(resolve => {
        	// verification en cache
			let oWorldTile = new WorldTile(x, y, this.cellSize());
            oWorldTile.lock();
            this._service.emit('tile', {...oWorldTile.getCoords()}, result => {
                oWorldTile.colormap = result.tile.colormap;
                oWorldTile.physicmap = result.tile.physicmap;
                oWorldTile.unlock();
                resolve(oWorldTile);
            });
        });
	}



	async _renderTiles(oCanvas, x, y) {
        this._rendering = true;
		let w = oCanvas.width;
		let h = oCanvas.height;
		let cellSize = this.cellSize();
		let m = PirateWorld.getViewPointMetrics(x, y, w, h, cellSize, this.oWorldDef.preload);
		let yTilePix = 0;
		this._remainingTileCount = (m.yTo - m.yFrom + 1) * (m.xTo - m.yFrom + 1);
		for (let yTile = m.yFrom; yTile <= m.yTo; ++yTile) {
			let xTilePix = 0;
			for (let xTile = m.xFrom; xTile <= m.xTo; ++xTile) {
				let wt = this._cache.getPayload(xTile, yTile);
				if (!wt) {
					// pas encore créée
					wt = await this.fetchTile(xTile, yTile);
					this._cache.push(wt.x, wt.y, wt);
				}
				// si la tile est partiellement visible il faut la dessiner
				if (wt.isPainted() || wt.isLocked()) {
					CanvasHelper.draw(oCanvas, wt.canvas, m.xOfs + xTilePix, m.yOfs + yTilePix);
				}
				xTilePix += cellSize;
				if (this._invalid) {
					break;
				}
                --this._remainingTileCount;
			}
            if (this._invalid) {
                break;
            }
			yTilePix += cellSize;
		}
        this._rendering = false;
    }

    /**
	 * A partire d'une coordonée centrée sur un rectangle de longueur et largeur spécifiées
	 * determiner les différente coordonnée de tuiles à calculer
     * @param x {number} coordonnée du centre du view point
     * @param y {number}
     * @param width {number} taille du viewpoint
     * @param height {number}
     * @param nBorder {number} taille de la bordure de securité
     * @return {{xFrom: number, yFrom: number, xTo: *, yTo: *, xOfs: number, yOfs: number}}
     */
	static getViewPointMetrics(x, y, width, height, cellSize, nBorder) {
        let x0 = x - (width >> 1);
        let y0 = y - (height >> 1);
        let xFrom = Math.floor(x0 / cellSize) - nBorder;
        let yFrom = Math.floor(y0 / cellSize) - nBorder;
        let xTo = Math.floor((x0 + width - 1) / cellSize) + (nBorder);
        let yTo = Math.floor((y0 + height - 1) / cellSize) + (nBorder);
        let xOfs = WorldGenerator._mod(x0, cellSize);
        let yOfs = WorldGenerator._mod(y0, cellSize);
		return {
			xFrom,
			yFrom,
			xTo,
			yTo,
			xOfs: -xOfs - nBorder * cellSize,
			yOfs: -yOfs - nBorder * cellSize
		};
	}
}

module.exports = PirateWorld;