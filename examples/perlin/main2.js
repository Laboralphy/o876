

const Perlin = O876.algorithms.Perlin;





class WorldGenerator {
	constructor({size, seed, zoom, coords}) {
		if (!size || isNaN(size)) {
			throw new Error('invalid size : ' + size);
		}
		this._perlin = new Perlin();
		this._perlin.size(size);
		this._perlin.seed(seed);

		this._metaPerlin = new Perlin();
		this._metaPerlin.size(16);
		this._metaPerlin.seed(seed);

		this._tile = document.createElement('canvas');
		this._tile.width = this._tile.height = size;

		this._fZoom = zoom;
		this._bWriteCoords = coords;
	}


	_mod(n, d) {
		if (n > 0) {
			return n % d;
		} else {
			return (d - (-n % d)) % 16;
		}
	}

	getBaseElevation(x, y) {
		let p = this._metaPerlin;
		let w = p.size();
		let aData = p.generate(Math.floor(x / w), Math.floor(y / w));
		let xMod = this._mod(x, w);
		let yMod = this._mod(y, w);
		return aData[yMod][xMod];
	}

	// relief maritime trop accidenté
	refineLinear(base, value) {
		return 0.5 * (value + base);
	}

	// très peu de terrain
	refineSquare(base, value) {
		let vb = 0.5 * (value + base);
		return vb * vb;
	}

	// très peu de mer
	refineSquareInverse(base, value) {
		let vb = 0.5 * (value + base);
		let vb1 = vb - 1;
		let vb2 = vb1 * vb1;
		return -vb2 + 1;
	}

	// aucune variation
	refineThreshold75(base, value) {
		if (base < 0.75) {
			return value * 0.75;
		} else {
			return value * 0.75 + (base - 0.75);
		}
	}

	refineThreshold50(base, value) {
		if (base < 0.5) {
			return (base + value) * 0.25;
		} else {
			return (base + value - 0.5) / 1.5;
		}
	}

	refineFullMap(base, value) {
		if (base < 0.5) {
			return value * 0.5;
		} else {
			return value * 0.5 + 0.5;
		}
	}



	generate(x, y) {
		return this._perlin.generate(x, y, {
			noise: (xg, yg, data) => {
				let nBase = this.getBaseElevation(xg, yg);
				return data.map(row => row.map(cell => this.refineFullMap(nBase, cell)));
			}
		});
	}

	async renderSector(x, y) {
		return new Promise(resolve => {
			this._perlin.render(
				this.generate(x, y),
				this._tile.getContext('2d'),
				O876.Rainbow.gradient({
					0: '#dec673',
					40: '#efd69c',
					48: '#d6a563',
					50: '#572507',
					53: '#d2a638',
					75: '#b97735',
					99: '#efce8c'
				})
			);
			resolve();
		});
	}

	async renderMapSector(oDestCanvas, xMap, yMap, x, y) {
		return new Promise(resolve => {
			let data = this._metaPerlin.generate(xMap, yMap);
			let oCanvas = document.createElement('canvas');
			oCanvas.width = this._metaPerlin.size();
			oCanvas.height = this._metaPerlin.size();
			requestAnimationFrame(() => {
				this._metaPerlin.render(data, oCanvas.getContext('2d'));
				oDestCanvas.getContext('2d').drawImage(oCanvas, x, y);
				resolve();
			});
		});
	}

	async renderMap(oDestCanvas, xPos, yPos) {
		let mps = this._metaPerlin.size();
		let ps = this._perlin.size();
		let width = Math.ceil(oDestCanvas.width / mps);
		let height = Math.ceil(oDestCanvas.height / mps);
		let xMap = Math.floor(xPos / ps);
		let yMap = Math.floor(yPos / ps);
		for (let y = 0; y <= height; ++y) {
			for (let x = 0; x <= width; ++x) {
				await this.renderMapSector(oDestCanvas, xMap + x, yMap + y, x * mps, y * mps);
			}
		}
	}


	/**
	 *
	 * @param oDestCanvas {HTMLCanvasElement}
	 * @param xPos {number} position pixel du point qui sera affiché en haut à gauche du canvas
	 * @param yPos {number} position pixel du point qui sera affiché en haut à gauche du canvas
	 * @returns {Promise<void>}
	 */
	async render(oDestCanvas, xPos, yPos) {
		let ps = this._perlin.size();
		let width = Math.ceil(oDestCanvas.width / ps);
		let height = Math.ceil(oDestCanvas.height / ps);
		let xMap = Math.floor(xPos / ps);
		let yMap = Math.floor(yPos / ps);
		let xOfs = xPos - xMap * ps;
		let yOfs = yPos - yMap * ps;
		for (let y = 0; y <= height / this._fZoom; ++y) {
			for (let x = 0; x <= width / this._fZoom; ++x) {
				await this.renderSector(xMap + x, yMap + y);
				await this.drawSector(
					oDestCanvas,
					(x * ps - xOfs) * this._fZoom,
					(y * ps - yOfs) * this._fZoom,
					xMap + x,
					yMap + y
				);
			}
		}
	}


	async drawSector(oDestCanvas, x, y, xMap, yMap) {
		return new Promise(resolve =>
			requestAnimationFrame(() => {
				let ctx = oDestCanvas.getContext('2d');
				ctx.drawImage(this._tile, 0, 0, this._tile.width, this._tile.height, x, y, this._tile.width * this._fZoom, this._tile.height * this._fZoom);
				if (this._bWriteCoords) {
					ctx.fillStyle = 'white';
					ctx.strokeStyle = 'black';
					ctx.font = '10px monospace';
					ctx.strokeText(xMap + ':' + yMap, x + 10, y + 10);
					ctx.fillText(xMap + ':' + yMap, x + 10, y + 10);
				}
				resolve();
			})
		);
	}
}

const WORLD = {
	instance: null,
	x: 0, y: 0,
	width: 8, height: 4,
	screen: document.querySelector('canvas.world')
};

function initWorld(config) {
	WORLD.instance = new WorldGenerator(config);
	WORLD.x = 0;
	WORLD.y = 0;
	WORLD.screen = document.querySelector('canvas.world');
	WORLD.mapScreen = document.querySelector('canvas.map');
}


function main() {
	initWorld({
		size: 32,
		seed: 0.111,
		zoom: 1,
		coords: false
	});
	renderWorld();
	renderWorldMap();
}

function renderWorld() {
	WORLD.instance.render(
		WORLD.screen,
		WORLD.x,
		WORLD.y
	).then(() => console.log('world done.'));
}

function renderWorldMap() {
	WORLD.instance.renderMap(
		WORLD.mapScreen,
		WORLD.x,
		WORLD.y
	).then(() => console.log('map done.'));
}

function kbHandler(event) {
	switch (event.key) {
		case 'ArrowUp':
			WORLD.y -= 64;
			renderWorld();
			renderWorldMap();
			break;

		case 'ArrowDown':
			WORLD.y += 64;
			renderWorld();
			renderWorldMap();
			break;

		case 'ArrowLeft':
			WORLD.x -= 64;
			renderWorld();
			renderWorldMap();
			break;

		case 'ArrowRight':
			WORLD.x += 64;
			renderWorld();
			renderWorldMap();
			break;


	}
}

window.addEventListener('load', main);
document.addEventListener('keydown', kbHandler);
