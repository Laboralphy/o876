const o876 = require('../../src');
const PirateWorld = require('./PirateWorld');
const WorldGenerator = require('./WorldGenerator');
const PixelProcessor = require('./PixelProcessor');


class ServiceClient {
	constructor() {
		this._idCallback = 0;
		this._oCallbacks = {};
		this._service = null;
        this._service.addEventListener('message', event => this.received(event));
	}

	emit(sAction, data, cb) {
		data.__action = sAction;
		if (cb) {
			data.__callback = ++this._idCallback;
			this._oCallbacks[this._idCallback] = cb;
		}
		this.service.postMessage(sData);
	}

	received(event) {
		let data = JSON.parse(event.data);
		if (data.__callback && (data.__callback in this._oCallbacks)) {
			idCallback = data.__callback;
			let cb = this._oCallbacks[idCallback];
            delete this._oCallbacks[idCallback]
			cb(data);
		}
	}
}

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

        this.service = new Worker('../../dist/examples-treasure-map-service.js');
        this.service.addEventListener('message', event => this.serviceMessageReceived(event));
	}

	servicePostMessage(sAction, data, cb) {
		data.action = sAction;
		if (cb) {
			data.callback =
		}
		let sData = JSON.stringify(data);
        this.service.postMessage(sData);
	}

	serviceMessageReceived(event) {
		let data = JSON.parse(event.data);
		switch (data.action) {
			case 'about':
				console.log(data);
				break;

		}
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
    pwrunner = new PWRunner();
//    X = 34 * pwrunner.WORLD_DEF.cellSize;
//    Y = 8 * pwrunner.WORLD_DEF.cellSize;
//    pwrunner.render(document.querySelector('.world'), X, Y);
//    window.addEventListener('keydown', kbHandler);
	window.pwrunner = pwrunner;
}

window.addEventListener('load', main3);
