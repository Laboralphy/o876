

const Perlin = O876.algorithms.Perlin;

class WorldGenerator {
	init(w, seed) {
		this._perlin = new Perlin();
		this._perlin.size(w);
		this._perlin.seed(seed);

		this._metaPerlin = new Perlin();
		this._metaPerlin.size(16);
		this._metaPerlin.seed(seed);

		this._tileCanvas = document.createElement('canvas');
		this._tileCanvas.width = w;
		this._tileCanvas.height = w;
	}

	getBaseElevation(x, y) {
		let p = this._metaPerlin;
		let w = p.size();
		let aData = p.generate(Math.floor(x / w), Math.floor(y / w));
		let xMod = x % w;
		if (xMod < 0) {
			xMod += w;
		}
		let yMod = y % w;
		if (yMod < 0) {
			yMod += w;
		}
		return aData[yMod][xMod];
	}

	generate(x, y) {
		return this._perlin.generate(x, y, {
			noise: (xg, yg, data) => {
				let nBase = this.getBaseElevation(xg, yg);
				return data.map(row => row.map(cell => cell * Math.sin(0.5 * Math.PI * nBase)))
			}
		});
	}

	async renderTile(sector) {
		let x = sector.xTile, y = sector.y;
		return new Promise(resolve => {
			this._perlin.render(this.generate(x, y), this._tileCanvas.getContext('2d'));
			resolve();
		});
	}

	async renderAllTiles(oDestCanvas, xOfs, yOfs, w, h) {
		let sectors = [];
		for (let y = 0; y < h; ++y) {
			for (let x = 0; x < w; ++x) {
				sectors.push({x, y, xTile: x + xOfs, yTile: y + yOfs});
			}
		}

		let sector;
		while (sector = sectors.shift()) {
			await this.renderTile(sector);
			await this.draw(oDestCanvas, sector);
		}
	}

	async draw(oDestCanvas, sector) {
		let x = sector.x * this._perlin.width(), y = sector.y * this._perlin.height();
		return new Promise(resolve => {
			requestAnimationFrame(() => {
				let ctx = oDestCanvas.getContext('2d');
				ctx.drawImage(this._tileCanvas, x, y);
				ctx.fillStyle = 'white';
				ctx.strokeStyle = 'black';
				ctx.font = '10px monospace';
				ctx.strokeText(sector.xTile + ' : ' + sector.yTile, x + 20, y + 20);
				ctx.fillText(sector.xTile + ' : ' + sector.yTile, x + 20, y + 20);
				resolve();
			});
		});
	}
}


function main() {
	let oCanvas = document.querySelector('canvas.world');

	let world = new WorldGenerator();
	const SIZE = 128;
	world.init(SIZE, 0.111);

	let wWorld = 14;
	let hWorld = 7;

	oCanvas.width = SIZE * wWorld;
	oCanvas.height = SIZE * hWorld;

	world.renderAllTiles(
		oCanvas,
		Math.pow(2, 40) + 4,
		100000,
		wWorld,
		hWorld
	);
}

window.addEventListener('load', main);
