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
		this.sendInit();

	}

	requestAbout(x) {
		this._service.emit('about', x, result => console.log(result));
	}

	requestStatus() {
		this._service.emit('status', {}, result => console.log(result));
	}

	sendInit() {
		let wd = this.WORLD_DEF;
		this._service.emit('init', {seed: wd.seed, cell: wd.cellSize, cluster: wd.clusterSize});
	}

	render(cvs, x, y) {
		let w = cvs.width;
		let h = cvs.height;
		// quelle tile se trouve sur le point super-gauche ?
		let xTile = Math.floor(x / this.WORLD_DEF.cellSize);
		let yTile = Math.floor(y / this.WORLD_DEF.cellSize);
		// quel est le décalage pixel ?
		let xMod = WorldGenerator._mod(x, this.WORLD_DEF.cellSize);
		let yMod = WorldGenerator._mod(y, this.WORLD_DEF.cellSize);

		console.log('upper left tile:', xTile, yTile);
		console.log('upper left offset:', xMod, yMod);

		// récupération des tiles déja chargée en cache
		let tiles = this.world.getPreloadedTiles(
			xTile,
			yTile,
			cvs.width + this.WORLD_DEF.cellSize,
			cvs.height + this.WORLD_DEF.cellSize
		);
		// certaines tiles sont préchargées, d'autres non
		// réclamer le chargement des tiles manquante
		let aNotComputed = tiles.filter(cd => !cd.tile);
		let aComputed = tiles.filter(cd => !!cd.tile);
		this._service.emit('tiles', {tiles: aNotComputed}, result => {
			// intégrer les celldata
			let cells = [...aComputed, ...result.tiles];
			console.log('painting at', -x, -y);
			cvs.getContext('2d').clearRect(0, 0, w, h);
			this.world.paint(cvs, cells, -x, -y);
		});

/*
		this.world.render(
			cvs,
			xTile, yTile,
			-xMod, -yMod,
			cvs.width + this.WORLD_DEF.cellSize, cvs.height + this.WORLD_DEF.cellSize
		);*/
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
