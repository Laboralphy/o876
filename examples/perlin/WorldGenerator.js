

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
	}


	static _mod(n, d) {
		if (n > 0) {
			return n % d;
		} else {
			return (d - (-n % d)) % 16;
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

	renderCluster(oDestCanvas, xFrom, yFrom, xScreen, yScreen, wScreen, hScreen) {
		let cellSize = this._perlinCell.size();
		let clusterSize = this._perlinCluster.size();
		let c = this._canvasCluster;
		wScreen = Math.ceil(wScreen / cellSize);
		hScreen = Math.ceil(hScreen / cellSize);
		for (let yCell = 0; yCell < hScreen; ++yCell) {
			for (let xCell = 0; xCell < wScreen; ++xCell) {
				let xCurs = xCell + xFrom;
				let yCurs = yCell + yFrom;
				let heightMap = this._perlinCluster.generate(
					xCurs,
					yCurs
				);
				this._perlinCluster.render(heightMap, c.getContext('2d'));
				oDestCanvas.getContext('2d').drawImage(c, xScreen + xCell * cellSize, yScreen + yCell * cellSize);
			}
		}
	}

	/**
	 * Permet d'indexer des zone physique de terrain (déduite à partir de l'altitude min et l'altitude max
	 * @param data
	 * @param meshSize
	 * @returns {Array}
	 */
	indexCell(data, meshSize) {
		let aInd = [];
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
			if (!aInd[yMesh]) {
				aInd[yMesh] = [];
			}
			row.forEach((cell, x) => {
				let xMesh = Math.floor(x / meshSize);
				if (!aInd[yMesh][xMesh]) {
					aInd[yMesh][xMesh] = {
						min: 5,
						max: 0,
						type: 0
					};
				}
				let m = aInd[yMesh][xMesh];
				m.min = Math.min(m.min, cell);
				m.max = Math.max(m.max, cell);
				m.type = disc(m.min) * 10 + disc(m.max);
			});
		});
		return aInd;
	}

	renderCell(xCurs, yCurs) {
		let clusterSize = this._perlinCluster.size();

		let c = this._canvasCell;
		let ctx = c.getContext('2d');
		ctx.font = '10px italic serif';

		const MESH_SIZE = 16;
		const WAVE_LENGTH = 3;
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
					})
				}
			}
		);
		this._perlinCell.render(heightMap, ctx, O876.Rainbow.gradient({
			0: '#dec673',
			40: '#efd69c',
			48: '#d6a563',
			50: '#572507',
			55: '#d2a638',
			75: '#b97735',
			99: '#efce8c'
		}));

		// creer une sectorisation pour déterminer les case uniquement eau, uniquement terre, et mixte

		ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
		ctx.lineWidth = 1.2;
		let aInd = this.indexCell(heightMap, MESH_SIZE);
		ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
		aInd.forEach((row, y) => row.forEach((cell, x) => {
			let xMesh = x * MESH_SIZE + (MESH_SIZE >> 1);
			let yMesh = y * MESH_SIZE + (MESH_SIZE >> 1);
			if ((x & 1) ^ (y & 1)) {
				switch (cell.type) {
					case 11: // vague
						ctx.beginPath();
						ctx.moveTo(xMesh - WAVE_LENGTH, yMesh + WAVE_LENGTH);
						ctx.lineTo(xMesh, yMesh);
						ctx.lineTo(xMesh + WAVE_LENGTH, yMesh + WAVE_LENGTH);
						ctx.stroke();
						break;

					case 23: // herbe
						ctx.beginPath();
						ctx.moveTo(xMesh - WAVE_LENGTH, yMesh - WAVE_LENGTH);
						ctx.lineTo(xMesh, yMesh);
						ctx.lineTo(xMesh + WAVE_LENGTH, yMesh - WAVE_LENGTH);
						ctx.stroke();
						break;

					case 33: // foret
						ctx.beginPath();
						ctx.arc(xMesh, yMesh, MESH_SIZE >> 2, 0, Math.PI * 2);
						ctx.rect(xMesh - 1, yMesh + (MESH_SIZE >> 2), 2, MESH_SIZE >> 2);
						ctx.fill();
						ctx.stroke();
						break;

					case 55: // motagne
						ctx.beginPath();
						ctx.moveTo(xMesh - (MESH_SIZE >> 1), yMesh + MESH_SIZE);
						ctx.lineTo(xMesh, yMesh - (MESH_SIZE >> 1));
						ctx.lineTo(xMesh + (MESH_SIZE >> 1), yMesh + MESH_SIZE);
						ctx.stroke();
						break;
				}
			}
		}));

		ctx.strokeStyle = 'rgba(57, 25, 7, 0.5)';
		ctx.fillStyle = 'rgba(57, 25, 7, 0.5)';
		ctx.beginPath();
		ctx.moveTo(0, c.height - 1);
		ctx.lineTo(0, 0);
		ctx.lineTo(c.width - 1, 0);
		ctx.stroke();
		ctx.fillText((xFrom + xCell) + ', ' + (yFrom + yCell), 10, 10);
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
