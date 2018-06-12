const o876 = require('../../src');
const EventManager = require('events');
const Perlin = o876.algorithms.Perlin;

class WorldGenerator {
	constructor({cellSize, clusterSize, seed}) {
		let pcell = new Perlin();
		pcell.size(cellSize);
		pcell.seed(seed);


		let pclust = new Perlin();
		pclust.size(clusterSize);
		pclust.seed(seed);

		// les cellule, détail jusqu'au pixel
		// défini l'élévaltion finale du terrain
		this._perlinCell = pcell;

		// les cluster, détail jusqu'au cellule
		// défini l'élévation de base de la cellule correspondante
		this._perlinCluster = pclust;

		this._canvasCell = WorldGenerator._canvas(cellSize, cellSize);
		this._canvasCluster = WorldGenerator._canvas(clusterSize, clusterSize);
		this._gradient = null;
		this._eventManager = new EventManager();
		this._cache = new o876.structures.Cache2D();
	}

	on(...args) {
		return this._eventManager.on(...args);
	}

	gradient(a) {
		this._gradient = o876.Rainbow.gradient(a);
	}

	static _mod(n, d) {
		if (n > 0) {
			return n % d;
		} else {
			return (d - (-n % d)) % d;
		}
	}

	static _canvas(w, h) {
		let c = document.createElement('canvas');
		c.width = w;
		c.height = h;
		c.imageSmoothingEnabled = false;
		return c;
	}

	/**
	 * Génération d'un cluster
	 * @param x {number} coordonnées
	 * @param y {number} du cluster
	 */
	generateCluster(x, y) {
		return this._perlinCluster.generate(x, y);
	}


	_cellFilter15(base, value) {
		if (base < 0.5) {
			return value * base;
		} else {
			return Math.min(0.99, value * base * 1.5) ;
		}
	}

	_cellFilterBinary(base, value) {
		if (base < 0.5) {
			return value * 0.5;
		} else {
			return value * 0.5 + 0.5;
		}
	}

	_cellFilterMed(base, value) {
		return (base + value) / 2;
	}

	_cellFilterMinMax(base, value) {
		if (base < 0.45) {
			return base * value;
		} else {
			return Math.max(0, Math.min(0.99, 1.333333333 * (base - value / 4)));
		}
	}

	_cellFilterMinMax2(base, value) {
		return Math.max(0, Math.min(0.99, 1.333333333 * (base - value / 4)));
	}

	renderCell(xCurs, yCurs) {
		let clusterSize = this._perlinCluster.size();

		let c = this._canvasCell;
		let ctx = c.getContext('2d');
		let oCached = this._cache.getPayload(xCurs, yCurs);
		if (oCached) {
			ctx.drawImage(oCached.tile, 0, 0);
			return;
		}

		let heightMap = this._perlinCell.generate(
			xCurs,
			yCurs, {
				noise: (xg, yg, cellData) => {
					let xCluster = Math.floor((xg) / clusterSize);
					let yCluster = Math.floor((yg) / clusterSize);
					let xClusterMod = WorldGenerator._mod(xg, clusterSize);
					let yClusterMod = WorldGenerator._mod(yg, clusterSize);
					let data = this.generateCluster(xCluster, yCluster);
					return cellData.map(row => {
						return row.map(cell => this._cellFilterMinMax(data[yClusterMod][xClusterMod], cell))
					});
				}
			}
		);
		let oImageData = ctx.createImageData(c.width, c.height);
		let data = this._perlinCell.render(heightMap, this._gradient);
		data.forEach((x, i) => oImageData.data[i] = x);
		ctx.putImageData(oImageData, 0, 0);

		this._eventManager.emit('cell-rendered', {
			x: xCurs,
			y: yCurs,
			tile: c,
			map: heightMap
		});
		if (!this._cache.getPayload(xCurs, yCurs)) {
			let oCachedCanvas = WorldGenerator._canvas(c.width, c.height);
			oCachedCanvas.getContext('2d').drawImage(c, 0, 0);
			this._cache.push(xCurs, yCurs, {tile: oCachedCanvas});
		}
	}

	renderClusterCells(oDestCanvas, xFrom, yFrom, xScreen, yScreen, wScreen, hScreen) {
		let cellSize = this._perlinCell.size();
		let c = this._canvasCell;
		let ctx = c.getContext('2d');
		ctx.font = '10px italic serif';
		wScreen = Math.ceil(wScreen / cellSize);
		hScreen = Math.ceil(hScreen / cellSize);

		for (let yCell = 0; yCell < hScreen; ++yCell) {
			for (let xCell = 0; xCell < wScreen; ++xCell) {
				let xCurs = xCell + xFrom;
				let yCurs = yCell + yFrom;
				let c = this._canvasCell;
				this.renderCell(xCurs, yCurs);
				oDestCanvas.getContext('2d').drawImage(c, xScreen + xCell * cellSize, yScreen + yCell * cellSize);
			}
		}
	}
}

module.exports = WorldGenerator;