const o876 = require('../../src');
const PirateWorld = require('./PirateWorld');
const WorldGenerator = require('./WorldGenerator');
const PixelProcessor = require('./PixelProcessor');


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
	}
}

let pwrunner, X, Y;

function main() {
    pwrunner = new PWRunner();
    X = 34 * pwrunner.oWorldDef.cellSize;
    Y = 8 * pwrunner.oWorldDef.cellSize;
    pwrunner.render(document.querySelector('.world'), X, Y);
    window.addEventListener('keydown', kbHandler);
}

function main3() {
    pwrunner = this.world = new PirateWorld({
		cellSize: 256,
        seed: 0.111,
        preload: 0,
        service: '../../dist/examples-treasure-map-service.js'
    });
    window.addEventListener('keydown', kbHandler);
	window.pwrunner = pwrunner;
    X = 0;
    Y = 0;
    let cvs = document.querySelector('.world');
    pwrunner.view(cvs, X, Y);
}

window.addEventListener('load', main3);
