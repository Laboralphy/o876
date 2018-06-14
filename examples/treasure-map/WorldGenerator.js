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
		return o876.SpellBook.mod(n, d);
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

	/**
	 * fabrique des canaux
	 * @param xPix
	 * @param xg
	 * @param clusterSize
	 * @returns {number}
	 * @private
	 */
	_axisModulationFactor(xPix, xg, clusterSize) {
        let size = this._perlinCell.size();
        let xg32 = WorldGenerator._mod(xg, clusterSize);
        let xfactor = 1;
        switch (xg32) {
            case 0:
                xfactor = 0.25 * xPix / size;
                break;

            case 1:
                xfactor = 0.25 * xPix / size + 0.25;
                break;

            case 2:
                xfactor = 0.5 * xPix / size + 0.5;
                break;

            case clusterSize - 1:
                xfactor = 0.25 * (1 - xPix / size) + 0.25;
                break;

            case clusterSize - 2:
                xfactor = 0.5 * (1 - xPix / size) + 0.5;
                break;
        }
        return xfactor;
	}

	_cellDepthModulator(x, y, xg, yg, meshSize) {
		let c = 6;
		let bInHexagon = this.isOnHexaMesh(xg, yg, meshSize, c);
		if (!bInHexagon) {
			return 1;
		}
		if (this.isOnHexaMesh(xg, yg, meshSize, c >> 2)) {
			return 0.111;
		} else if (this.isOnHexaMesh(xg, yg, meshSize, c >> 1)) {
			return 0.333;
		} else {
			return 0.666;
		}
	}


	/**
	 * Renvoie true si le point spécifié se trouve sur les lignes d'un maillage hexagonal
	 * @param x {number} coordonnées du point à tester
	 * @param y {number}
	 * @param nSize {number} taille du maillage
	 * @param nThickness {number} épaisseur des ligne du maillage
	 * @returns {boolean}
	 */
	isOnHexaMesh(x, y, nSize, nThickness) {
		const lte = (n, a) => (n - nThickness) <= a * nSize;
		const gte = (n, a) => (n + nThickness) >= a * nSize;
		const bt = (n, a, b) => gte(n, a) && lte(n, b);
		const ar = (a, b) => Math.abs(a - b) < nThickness;
		const mod = o876.SpellBook.mod;

		let s2 = 2 * nSize;
		let s4 = 4 * nSize;
		let s6 = 6 * nSize;

		let ymod6 = mod(y, s6);
		let xmod4 = mod(x, s4);
		let xmod6 = mod(x, s6);

		if ((lte(xmod4, 0) || gte(xmod4, 4)) && bt(ymod6, 2, 4)) {
			return true;
		}
		if (bt(xmod4, 2, 2) && (bt(ymod6, 0, 1) || bt(ymod6, 5, 6))) {
			return true;
		}

		let p6 = mod(Math.floor(0.5 * x), s6);
		let p6i = mod(Math.floor(-0.5 * x), s6);

		let q60 = ymod6;
		let q62 = mod(y + s2, s6);
		let q64 = mod(y + s4, s6);


		if (bt(xmod6, 0, 2) && (ar(p6, q62) || ar(p6i, q64))) {
			return true;
		}

		if (bt(xmod6, 2, 4) && (ar(p6, q60) || ar(p6i, q60))) {
			return true;
		}

		if (bt(xmod6, 4, 6) && (ar(p6, q64) || ar(p6i, q62))) {
			return true;
		}

		return false;
	};

	_cellProcess(xPix, yPix, xg, yg, base, cell) {
		return this._cellFilterMinMax(base, cell) *
            this._cellDepthModulator(xPix, yPix, xg, yg, 16);

	}

	renderCell(xCurs, yCurs) {
		let c = this._canvasCell;
		let ctx = c.getContext('2d');
		let oCached = this._cache.getPayload(xCurs, yCurs);
		if (oCached) {
			ctx.drawImage(oCached.tile, 0, 0);
			return;
		}

        let clusterSize = this._perlinCluster.size();
		let heightMap = this._perlinCell.generate(
			xCurs,
			yCurs, {
				noise: (xg, yg, cellData) => {
					let xCluster = Math.floor((xg) / clusterSize);
					let yCluster = Math.floor((yg) / clusterSize);
					let xClusterMod = WorldGenerator._mod(xg, clusterSize);
					let yClusterMod = WorldGenerator._mod(yg, clusterSize);
					let data = this.generateCluster(xCluster, yCluster);
					///let bHexa = this.isOnHexaMesh(xg, yg, 32, 3)
					return cellData.map((row, y) =>
						row.map((cell, x) =>
							this._cellProcess(x, y, xg, yg, data[yClusterMod][xClusterMod], cell)
						)
					);
				}
			}
		);
		let oImageData = ctx.createImageData(c.width, c.height);
		let data = Perlin.colorize(heightMap, this._gradient);
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