const o876 = require('../../src');
const PirateWorld = require('./PirateWorld');
const CanvasHelper = require('./CanvasHelper');


function kbHandler(event) {
	switch (event.key) {
		case 'ArrowUp':
			pwrunner.view(document.querySelector('.world'), X, Y -= 16);
			break;

		case 'ArrowDown':
			pwrunner.view(document.querySelector('.world'), X, Y += 16);
			break;

		case 'ArrowLeft':
			pwrunner.view(document.querySelector('.world'), X -= 16, Y);
			break;

		case 'ArrowRight':
			pwrunner.view(document.querySelector('.world'), X += 16, Y);
			break;

		case ' ':
			bFreeze = !bFreeze;
			break;

		default:
			console.log('key', event.key);
			break;
	}
}

let pwrunner, X, Y, bFreeze = false;

function main4() {
	pwrunner = this.world = new PirateWorld({
		cellSize: 256,
		seed: 0.111,
		preload: 2,
		octaves: 8,
		service: '../../dist/examples-treasure-map-service.js'
	});
	window.addEventListener('keydown', kbHandler);
	window.pwrunner = pwrunner;
	X = 1000 * 256;
	Y = 0;
	let cvs = document.querySelector('.world');
	pwrunner.preloadTiles(X, Y, cvs.width, cvs.height).then(() => {
		console.log('starting scrolling');
		setInterval(() => {
			if (!bFreeze) {
				X += 2;
				Y++;
			}
			pwrunner.view(cvs, X, Y);
		}, 32);
	});
}


function main3() {
	pwrunner = this.world = new PirateWorld({
		cellSize: 256,
		hexSize: 16,
		seed: 0.111,
		preload: 2,
		drawGrid: true,
		service: '../../dist/examples-treasure-map-service.js'
	});

	X = 3;
	Y = 5;
	async function fetchAndRenderTiles(oCanvas, xTile, yTile) {
		for (let y = 0; y < (oCanvas.height / pwrunner.cellSize()); ++y) {
			for (let x = 0; x < (oCanvas.width / pwrunner.cellSize()); ++x) {
				let wt = await pwrunner.fetchTile(X + x + xTile, Y + y + yTile);
				wt.paint();
				CanvasHelper.draw(oCanvas, wt.canvas, (x + xTile) * pwrunner.cellSize(), (y + yTile) * pwrunner.cellSize());
			}
		}
	}

	let cvs = document.querySelector('.world');
	fetchAndRenderTiles(cvs, 0, 0).then(() => console.log('done.'));
}



window.addEventListener('load', main3);
