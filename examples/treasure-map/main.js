const o876 = require('../../src');
const PirateWorld = require('./PirateWorld');
const CanvasHelper = require('./CanvasHelper');
const Indicators = require('./Indicators');


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
	window.addEventListener('keydown', kbHandler);
	window.addEventListener('resize', windowResize);
	windowResize();
	pwrunner = this.world = new PirateWorld({
		cellSize: 256,
		hexSize: 16,
		scale: 2,
		seed: 0.111,
		preload: 1,
		drawGrid: true,
		drawCoords: true,
		service: '../../dist/examples-treasure-map-service.js',
		progress: Indicators.progress,
		verbose: true
	});

	window.pwrunner = pwrunner;
	X = 27 * 256;
	Y = 0;
	let cvs = document.querySelector('.world');
	pwrunner.preloadTiles(X, Y, cvs.width, cvs.height).then(() => {
		console.log('starting scrolling');
		setInterval(() => {
			if (!bFreeze) {
				//X += 2;
				//Y++;
			}
			pwrunner.view(cvs, X, Y);
		}, 32);
	});
}


function main3() {
	pwrunner = this.world = new PirateWorld({
		cellSize: 8,
        scale: 1,
		hexSize: 16,
		hexSpace: 4,
		seed: 0.111,
		preload: 2,
		drawGrid: false,
		drawCoords: false,
		service: '../../dist/examples-treasure-map-service.js'
	});

	X = 960;
	Y = -40;
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
	window.addEventListener('keydown', kbHandler);
}


function main2() {
    pwrunner = this.world = new PirateWorld({
        seed: 0.111,
        preload: 2,
        scale: 2,
        cellSize: 64,
        hexSize: 16,
        drawGrid: true,
        drawCoords: false,
        service: '../../dist/examples-treasure-map-service.js'
    });

    X = 960;
    Y = -40;
    async function fetchAndRenderTiles(oCanvas, xTile, yTile) {
        for (let y = 0; y < (oCanvas.height / pwrunner.cellSize()); ++y) {
            for (let x = 0; x < (oCanvas.width / pwrunner.cellSize()); ++x) {
                let wt = await pwrunner.fetchTile(X + x + xTile, Y + y + yTile);
                wt.paint();
                CanvasHelper.draw(oCanvas,
					wt.canvas,
					(x + xTile) * pwrunner.cellSize(),
					(y + yTile) * pwrunner.cellSize()
				);
            }
        }
    }

    let cvs = document.querySelector('.world');
    fetchAndRenderTiles(cvs, 0, 0).then(() => console.log('done.'));
}

function windowResize() {
	let oCanvas = document.querySelector('canvas.world');
	let hWin = window.innerHeight;
	let wWin = window.innerWidth;
	oCanvas.height = hWin - 64;
	oCanvas.width = wWin - 64;
}

window.addEventListener('load', main4);
