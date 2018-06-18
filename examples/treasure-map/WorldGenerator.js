const o876 = require('../../src');
const Perlin = o876.algorithms.Perlin;
const GRADIENT = require('./palette');

class WorldGenerator {
	constructor({cellSize, clusterSize, seed, hexSize}) {
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
		this._cache = new o876.structures.Cache2D({size: 64});
		this._hexSize = hexSize;
	}

	static _mod(n, d) {
		return o876.SpellBook.mod(n, d);
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

	_cellDepthModulator(x, y, xg, yg, meshSize) {
		let c = 6;
		let bInHexagon = this._isOnHexaMesh(xg, yg, meshSize, c);
		if (!bInHexagon) {
			return 1;
		}
		if (this._isOnHexaMesh(xg, yg, meshSize, c >> 2)) {
			return 0.333;
		} else if (this._isOnHexaMesh(xg, yg, meshSize, c >> 1)) {
			return 0.555;
		} else {
			return 0.777;
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
    _isOnHexaMesh(x, y, nSize, nThickness) {
        const lte = (n, a) => (n - nThickness) <= a * nSize;
        const gte = (n, a) => (n + nThickness) >= a * nSize;
        const lt = (n, a) => (n + nThickness) < a * nSize;
        const gt = (n, a) => (n - nThickness) > a * nSize;
        const bte = (n, a, b) => gte(n, a) && lte(n, b);
        const bt = (n, a, b) => gt(n, a) && lt(n, b);
        const ar = (a, b) => Math.abs(a - b) < nThickness;
        const mod = o876.SpellBook.mod;

        let s2 = 2 * nSize;
        let s4 = 4 * nSize;
        let s6 = 6 * nSize;
        let s8 = 8 * nSize;

        let ymod6 = mod(y, s6);

        let xmod4 = mod(x, s4);
        let xmod6 = mod(x, s6);
        let xmod8 = mod(x, s8);

		const TRIPLE_HEXA = true;

        // permet de créer des zone triple-hexa pour faire varier la continentalité
        if (TRIPLE_HEXA && bt(xmod8, 2, 5) && bte(ymod6 - nThickness, 2, 5)) {
            return false;
        }
        // permet de créer des zone triple-hexa pour faire varier la continentalité
        if (TRIPLE_HEXA && bt(xmod8, 4, 6) && bte(ymod6 - nThickness, 2, 5)) {
            return false;
        }

        if ((lte(xmod4, 0) || gte(xmod4, 4)) && bte(ymod6, 2, 4)) {
            return true;
        }
        if (bte(xmod4, 2, 2) && (bte(ymod6, 0, 1) || bte(ymod6, 5, 6))) {
            return true;
        }

        let p6 = mod(Math.floor(0.5 * x), s6);
        let p6i = mod(Math.floor(-0.5 * x), s6);

        let q60 = ymod6;
        let q62 = mod(y + s2, s6);
        let q64 = mod(y + s4, s6);


        if (bte(xmod6, 0, 2) && (ar(p6, q62) || ar(p6i, q64))) {
            return true;
        }

        if (bte(xmod6, 2, 4) && (ar(p6, q60) || ar(p6i, q60))) {
            return true;
        }

        if (bte(xmod6, 4, 6) && (ar(p6, q64) || ar(p6i, q62))) {
            return true;
        }

        return false;
    }

    _cellProcess(xPix, yPix, xg, yg, base, cell) {
        return this._cellFilterMinMax(base, cell) *
            this._cellDepthModulator(xPix, yPix, xg, yg, this._hexSize);
    }

    /**
     * Permet d'indexer des zone physique de terrain (déduite à partir de l'altitude min et l'altitude max
     * @param data
     * @param meshSize
     * @returns {Array}
     */
    buildCellPhysicMap(data, meshSize) {
        let aMap = [];
        function disc(n) {
            if (n < 0.5) {
                return 1;
            }
            if (n < 0.65) {
                return 2;
            }
            if (n < 0.75) {
                return 3;
            }
            if (n < 0.85) {
                return 4;
            }
            return 5;
        }
        data.forEach((row, y) => {
            let yMesh = Math.floor(y / meshSize);
            if (!aMap[yMesh]) {
                aMap[yMesh] = [];
            }
            row.forEach((cell, x) => {
                let xMesh = Math.floor(x / meshSize);
                if (!aMap[yMesh][xMesh]) {
                    aMap[yMesh][xMesh] = {
                        min: 5,
                        max: 0,
                        type: 0
                    };
                }
                let m = aMap[yMesh][xMesh];
                m.min = Math.min(m.min, cell);
                m.max = Math.max(m.max, cell);
                m.type = disc(m.min) * 10 + disc(m.max);
            });
        });
        return aMap;
    }

    computeCell(xCurs, yCurs) {
        const MESH_SIZE = 16;
        let clusterSize = this._perlinCluster.size();
        let heightMap = this._perlinCell.generate(
            xCurs,
            yCurs, {
                noise: (xg, yg, cellData) => {
                    let xCluster = Math.floor(xg / clusterSize);
                    let yCluster = Math.floor(yg / clusterSize);
                    let xClusterMod = WorldGenerator._mod(xg, clusterSize);
                    let yClusterMod = WorldGenerator._mod(yg, clusterSize);
                    let data = this.generateCluster(xCluster, yCluster);
                    return cellData.map((row, y) =>
                        row.map((cell, x) =>
                            this._cellProcess(x, y, xg, yg, data[yClusterMod][xClusterMod], cell)
                        )
                    );
                }
            }
        );
        let colorMap = Perlin.colorize(heightMap, GRADIENT);
        let physicMap = this.buildCellPhysicMap(heightMap, MESH_SIZE);
        return {
            x: xCurs,
            y: yCurs,
            colormap: colorMap,
            physicmap: physicMap
        };
	}

	computeCellCache(xCurs, yCurs) {
		let payload = this._cache.getPayload(xCurs, yCurs);
		if (!payload) {
			payload = this.computeCell(xCurs, yCurs);
            this._cache.push(xCurs, yCurs, payload).forEach(wt => !!wt && (typeof wt.free === 'function') && wt.free());
		}
		return payload;
	}
}

module.exports = WorldGenerator;