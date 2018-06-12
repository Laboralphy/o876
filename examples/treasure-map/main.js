const PirateWorld = require('./PirateWorld');
const WorldGenerator = require('./WorldGenerator');

class PWRunner {
	constructor() {
		this.WORLD_DEF = {
			cellSize: 256,
			clusterSize: 16,
			seed: 0.111
		};
		this.world = new PirateWorld(this.WORLD_DEF);
		this.xView = 0;
		this.yView = 0;
		this.oRenderCanvas = null;
	}

	render(cvs, x, y) {
		this.oRenderCanvas = cvs;
		this.xView = x;
		this.yView = y;

		let w = cvs.width;
		let h = cvs.height;
		let x0 = x - (w >> 1);
		let y0 = y - (h >> 1);
		let xTile = Math.floor(x0 / this.WORLD_DEF.cellSize);
		let yTile = Math.floor(y0 / this.WORLD_DEF.cellSize);
		let xMod = WorldGenerator._mod(x0, this.WORLD_DEF.cellSize);
		let yMod = WorldGenerator._mod(y0, this.WORLD_DEF.cellSize);
		this.world.render(
			cvs,
			xTile, yTile,
			-xMod, -yMod,
			cvs.width + this.WORLD_DEF.cellSize, cvs.height + this.WORLD_DEF.cellSize
		);
	}

	move(dx, dy) {console.log('moving', this.xView + dx, this.yView + dy);
		this.render(this.oRenderCanvas, this.xView + dx, this.yView + dy);
	}
}

function kbHandler(event) {
	switch (event.key) {
		case 'ArrowUp':
			pwrunner.render(document.querySelector('.world'), X, Y -= 16);
			break;

		case 'ArrowDown':
			pwrunner.render(document.querySelector('.world'), X, Y += 16);
			break;

		case 'ArrowLeft':
			pwrunner.render(document.querySelector('.world'), X -= 16, Y);
			break;

		case 'ArrowRight':
			pwrunner.render(document.querySelector('.world'), X += 16, Y);
			break;
	}
}

let pwrunner, X = 15, Y = 0;
function main() {
	pwrunner = new PWRunner();
	pwrunner.render(document.querySelector('.world'), 14 * 256, 0);
}

window.addEventListener('load', main);
window.addEventListener('keydown', kbHandler);
