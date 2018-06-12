const WorldGenerator = require('./WorldGenerator');
const o876 = require('../../src');

class PirateWorld {
	constructor(wgd) {
		let wg = new WorldGenerator(wgd);
		wg.gradient({
			0: '#dec673',
			40: '#efd69c',
			48: '#d6a563',
			50: '#572507',
			55: '#d2a638',
			75: '#b97735',
			99: '#efce8c'
		});
		wg.on('cell-rendered', ({x, y, tile, map}) => this.renderCell(x, y, tile, map));
		this._generator = wg;

		this._cliparts = {};
		this._buildCliparts();
	}

	_buildCliparts() {
		const MESH_SIZE = 16;
		const WAVE_SIZE = 3;
		const HERB_SIZE = 3;
		const MNT_LENGTH = 7;
		const MNT_HEIGHT = MNT_LENGTH | 0.75 | 0;
		const FOREST_SIZE = 4;
		let xMesh = MESH_SIZE >> 1;
		let yMesh = MESH_SIZE >> 1;
		let c, ctx;

		// vague
		c = WorldGenerator._canvas(MESH_SIZE, MESH_SIZE);
		ctx = c.getContext('2d');
		ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
		ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(xMesh - WAVE_SIZE, yMesh + WAVE_SIZE);
		ctx.lineTo(xMesh, yMesh);
		ctx.lineTo(xMesh + WAVE_SIZE, yMesh + WAVE_SIZE);
		ctx.stroke();
		this._cliparts.wave = c;

		// forest
		c = WorldGenerator._canvas(MESH_SIZE, MESH_SIZE);
		ctx = c.getContext('2d');
		ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
		ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.arc(xMesh, yMesh,FOREST_SIZE, 0, Math.PI * 2);
		ctx.rect(xMesh - 1, yMesh + FOREST_SIZE, 2, FOREST_SIZE);
		ctx.fill();
		ctx.stroke();
		this._cliparts.forest = c;

		// herbe
		c = WorldGenerator._canvas(MESH_SIZE, MESH_SIZE);
		ctx = c.getContext('2d');
		ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
		ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(xMesh - HERB_SIZE, yMesh - HERB_SIZE);
		ctx.lineTo(xMesh, yMesh);
		ctx.lineTo(xMesh + HERB_SIZE, yMesh - HERB_SIZE);
		ctx.stroke();
		this._cliparts.grass = c;

		// Montagne
		c = WorldGenerator._canvas(MESH_SIZE, MESH_SIZE);
		ctx = c.getContext('2d');
		ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
		ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
		ctx.lineWidth = 1.2;
		let g = ctx.createLinearGradient(xMesh, 0, MESH_SIZE, MESH_SIZE);
		g.addColorStop(0, 'rgba(154, 117, 61, 1)');
		g.addColorStop(1, 'rgba(154, 117, 61, 0.5)');
		ctx.fillStyle = g;
		ctx.moveTo(xMesh, yMesh);
		ctx.beginPath();
		ctx.lineTo(xMesh + MNT_LENGTH, yMesh + MNT_HEIGHT);
		ctx.lineTo(xMesh, yMesh + (MNT_HEIGHT * 0.75 | 0));
		ctx.lineTo(xMesh + (MNT_LENGTH * 0.25 | 0), yMesh + (MNT_HEIGHT * 0.4 | 0));
		ctx.lineTo(xMesh, yMesh);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(xMesh, yMesh);
		ctx.lineTo(xMesh + MNT_LENGTH, yMesh + MNT_HEIGHT);
		ctx.moveTo(xMesh, yMesh);
		ctx.lineTo(xMesh, yMesh + (MNT_HEIGHT >> 1));
		ctx.moveTo(xMesh, yMesh);
		ctx.lineTo(xMesh - MNT_LENGTH, yMesh + MNT_HEIGHT);
		ctx.stroke();
		this._cliparts.mount = c;
	}

	generator() {
		return this._generator;
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

	render(cvs, xCurs, yCurs, xScreen, yScreen, wScreen, hScreen) {
		this._generator.renderClusterCells(cvs, xCurs, yCurs, xScreen, yScreen, wScreen, hScreen);
	}

	renderTerrainType(xCurs, yCurs, tile, aHeightIndex) {
		let ctx = tile.getContext('2d');
		ctx.font = '12px italic serif';
		ctx.textBaseline = 'top';
		const MESH_SIZE = 16;
		aHeightIndex.forEach((row, y) => row.forEach((cell, x) => {
			if ((x & 1) ^ (y & 1)) {
				switch (cell.type) {
					case 11: // vague
						ctx.drawImage(this._cliparts.wave, x * MESH_SIZE, y * MESH_SIZE);
						break;

					case 23: // herbe
						ctx.drawImage(this._cliparts.grass, x * MESH_SIZE, y * MESH_SIZE);
						break;

					case 33: // foret
						ctx.drawImage(this._cliparts.forest, x * MESH_SIZE, y * MESH_SIZE);
						break;

					case 55: // montagne
						ctx.drawImage(this._cliparts.mount, x * MESH_SIZE, y * MESH_SIZE);
						break;
				}
			}
		}));
	}

	renderLinesCoordinates(xCurs, yCurs, tile, aHeightIndex) {
		let ctx = tile.getContext('2d');
		ctx.font = '12px italic serif';
		ctx.textBaseline = 'top';
		ctx.strokeStyle = 'rgba(57, 25, 7, 0.5)';
		ctx.beginPath();
		ctx.moveTo(0, tile.height - 1);
		ctx.lineTo(0, 0);
		ctx.lineTo(tile.width - 1, 0);
		ctx.stroke();
		ctx.strokeStyle = '#efce8c';
		ctx.fillStyle = 'rgba(57, 25, 7)';
		let sText = yCurs.toString() + '" ' + xCurs.toString();
		ctx.strokeText(sText, 10, 10);
		ctx.fillText(sText, 10, 10);
	}

	renderGoodSectorsForPort(xCurs, yCurs, tile, aHeightIndex) {
		// rechercher du [[11, 11, 11][12, 12, 12][22, 22, 22]];
	}


	renderCell(xCurs, yCurs, tile, map) {
		const MESH_SIZE = 16;
		let aHeightIndex = this.indexCell(map, MESH_SIZE);
		this.renderTerrainType(xCurs, yCurs, tile, aHeightIndex);
		this.renderLinesCoordinates(xCurs, yCurs, tile, aHeightIndex);
	}
}

module.exports = PirateWorld;