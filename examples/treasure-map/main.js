const o876 = require('../../src');
const PirateWorld = require('./PirateWorld');
const WorldGenerator = require('./WorldGenerator');
const PixelProcessor = require('./PixelProcessor');

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

/**
 * Renvoie true si le point spécifié se trouve sur les lignes d'un maillage hexagonal
 * @param x {number} coordonnées du point à tester
 * @param y {number}
 * @param nSize {number} taille du maillage
 * @param nThickness {number} épaisseur des ligne du maillage
 * @returns {boolean}
 */
function isOnHexaMesh(x, y, nSize, nThickness) {
	const lte = (n, a) => (n - nThickness) <= a * nSize;
	const gte = (n, a) => (n + nThickness) >= a * nSize;
	const bt = (n, a, b) => gte(n, a) && lte(n, b);
	const ar = (a, b) => Math.abs(a - b) < nThickness;
	const inCircle = (xp, yp, xc, yc, r) =>
		o876.geometry.Helper.distance(xc, yc, xp, yp) <= r
		;
	const mod = o876.SpellBook.mod;

	let s2 = 2 * nSize;
	let s4 = 4 * nSize;
	let s6 = 6 * nSize;
	let s8 = 8 * nSize;
	let s10 = 10 * nSize;
	let s12 = 12 * nSize;

	let ymod6 = mod(y, s6);
	let ymod8 = mod(y, s8);
	let ymod10 = mod(y, s10);
	let ymod12 = mod(y, s12);

	let xmod4 = mod(x, s4);
	let xmod6 = mod(x, s6);
	let xmod8 = mod(x, s8);
	let xmod10 = mod(x, s10);
	let xmod12 = mod(x, s12);


	if ((lte(xmod4, 0) || gte(xmod4, 4)) && bt(ymod6, 2, 4)) {
		return true;
	}
	if (bt(xmod4, 2, 2) && (bt(ymod6, 0, 1) || bt(ymod6, 5, 6))) {
		return true;
	}

	let p6 = mod(Math.floor(0.5 * x), s6);
	let p6i = mod(Math.floor(-0.5 * x), s6);

	let p12 = mod(Math.floor(0.5 * x), s12);
	let p12i = mod(Math.floor(-0.5 * x), s12);

	let q60 = ymod6;
	let q62 = mod(y + s2, s6);
	let q64 = mod(y + s4, s6);


	if (bt(xmod6, 0, 2) && (ar(p6, q62) || ar(p6i, q64))) {
		return true;
	}

	if (bt(xmod6, 2, 4) && (ar(p6, q60) || ar(p6i, q60))) {
		return true;
	}

	if (bt(xmod6, 4, 6) && (ar(p6, q64) || ar(p6i, q62))) {
		return true;
	}



	if (inCircle(xmod8 - nSize * 4, ymod8 - nSize * 4, 0, 0, nSize * 2)) {
		return true;
	}




	return false;
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

function main2() {
	let pp = new PixelProcessor();
	pp.process(document.querySelector('.world'), ctx => {
		ctx.color = isOnHexaMesh(ctx.x, ctx.y, 32, 1) ? {r:255, g:255, b:255, a:255} : {r:0, g:0, b:0, a:255};
	});
}

function main() {
    pwrunner = new PWRunner();
	X = 34 * pwrunner.WORLD_DEF.cellSize;
	Y = 8 * pwrunner.WORLD_DEF.cellSize;
    pwrunner.render(document.querySelector('.world'), X, Y);
    window.addEventListener('keydown', kbHandler);
}

window.addEventListener('load', main);
