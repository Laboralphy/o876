

const Perlin = O876.algorithms.Perlin;





class WorldGenerator {
	constructor({cellSize, clusterSize, seed}) {
		let ps = new Perlin();
		ps.size(cellSize);
		ps.seed(seed);


		let cp = new Perlin();
		cp.size(clusterSize);
		cp.seed(seed);

		this._perlinCell = ps;
		this._perlinCluster = cp;


		this._tile = document.createElement('canvas');
		this._tile.width = this._tile.height = clusterSize;

		this._sectorData = null;
	}


	_mod(n, d) {
		if (n > 0) {
			return n % d;
		} else {
			return (d - (-n % d)) % 16;
		}
	}
	
	_canvas(w, h) {
		let c = document.createElement('canvas');
		c.width = w;
		c.height = h;
		c.imageSmoothingEnabled = false;
		return c;
	}

	generateCluster(xSector, ySector) {
		return this._perlinCluster.generate(xSector, ySector);
	}

	renderCluster(oDestCanvas, xCluster, yCluster, xScreen, yScreen) {
		let data = this.generateCluster(xCluster, yCluster);
		let p = this._perlinCluster;
		let oCanvas = this._canvas(p.size(), p.size());
		this._perlinCluster.render(data, oCanvas.getContext('2d'));
		oDestCanvas.getContext('2d').drawImage(oCanvas, xScreen, yScreen);
	}

	_cellFilterDirac(base, value) {
		if (base < 0.5) {
			return value * 0.5;
		} else {
			return value * 0.5 + 0.5;
		}
	}

	renderCell(oDestCanvas, xCell, yCell, xScreen, yScreen) {
		let data = this._perlinCell.generate(xCell, yCell);
		let p = this._perlinCell;
		let oCanvas = this._canvas(p.size(), p.size());
		this._perlinCell.render(data, oCanvas.getContext('2d'));
		oDestCanvas.getContext('2d').drawImage(oCanvas, xScreen, yScreen);
	}

	renderClusterCells(oDestCanvas, xCluster, yCluster) {
		let cellSize = this._perlinCell.size();
		let clusterSize = this._perlinCluster.size();
		let data = this.generateCell(xCluster, yCluster);
		/*
		for (let yCell = 0; yCell < clusterSize; ++yCell) {
			for (let xCell = 0; xCell < clusterSize; ++xCell) {
				this.renderCell(
					oDestCanvas,
					xCluster * clusterSize + xCell,
					yCluster * clusterSize + yCell
				);
			}
		}*/
	}

}



function main() {
	const world = new WorldGenerator({
		cellSize: 16,
		clusterSize: 16,
		seed: 0.111
	});
	world.renderCluster(document.querySelector('.map'), 0, 0, 0, 0);
	let xOfs = 0;
	let yOfs = 0;
	for (let y = 0; y < 16; ++y) {
		for (let x = 0; x < 16; ++x) {
			world.renderCluster(document.querySelector('.world'), x + xOfs, y + yOfs, x * 16, y * 16);
		}
	}
//	world.renderCell(document.querySelector('.world'), 0, 0, 0, 0);
}



window.addEventListener('load', main);