const o876 = require('../../src');
const PirateWorld = require('./PirateWorld');
const WorldGenerator = require('./WorldGenerator');
const PixelProcessor = require('./PixelProcessor');
const ServiceWorkerIO = require('./ServiceWorkerIO');


class PWRunner {
	constructor() {
		this.WORLD_DEF = {
			cellSize: 64,
			clusterSize: 16,
			seed: 0.111
		};
		this.world = new PirateWorld(this.WORLD_DEF);
		this.xView = 0;
		this.yView = 0;
		this.oRenderCanvas = null;

		this._service = new ServiceWorkerIO();
		this._service.service('../../dist/examples-treasure-map-service.js');

	}

	testService() {
		this._service.emit('about', {}, result => console.log('XXXXXXX result = ', result));
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

let pwrunner, X, Y;

function main() {
    pwrunner = new PWRunner();
    X = 34 * pwrunner.WORLD_DEF.cellSize;
    Y = 8 * pwrunner.WORLD_DEF.cellSize;
    pwrunner.render(document.querySelector('.world'), X, Y);
    window.addEventListener('keydown', kbHandler);
}

function main3() {
    let pwrunner = new PWRunner();
//    X = 34 * pwrunner.WORLD_DEF.cellSize;
//    Y = 8 * pwrunner.WORLD_DEF.cellSize;
//    pwrunner.render(document.querySelector('.world'), X, Y);
//    window.addEventListener('keydown', kbHandler);
	window.pwrunner = pwrunner;
}

window.addEventListener('load', main3);
