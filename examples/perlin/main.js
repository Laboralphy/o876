const Perlin = O876.algorithms.Perlin;


const GRADIENT = O876.Rainbow.gradient({
	0: '#008',
	45: '#00f',
	49: '#08f',
	50: '#000',
	52: '#840',
	65: '#080',
	75: '#888',
	99: '#fff'
})
	.map(x => O876.Rainbow.parse(x))
	.map(x => x.r | x.g << 8 | x.b << 16 | 0xFF000000);

function noiseToCanvas(noise, canvas) {
	let colormap = Perlin.colorize(noise, GRADIENT);
	let ctx = canvas.getContext('2d');
	let oImageData = ctx.createImageData(canvas.width, canvas.height);
	let buffer32 = new Uint32Array(oImageData.data.buffer);
	colormap.forEach((x, i) => buffer32[i] = x);
	ctx.putImageData(oImageData, 0, 0);
}

function start() {
	let tStart = performance.now();
	let perlin = new Perlin();
	perlin.size(128);
	let c = document.createElement('canvas');
	c.width = perlin.size();
	c.height = perlin.size();
	for (let y = 0; y < 4; ++y) {
		for (let x = 0; x < 4; ++x) {
			let n = perlin.generate(x, y);
			noiseToCanvas(n, c);
			document.querySelector('canvas').getContext('2d').drawImage(c, x * perlin.size(), y * perlin.size());
		}
	}
	console.log(performance.now() - tStart | 0);
}

function main() {
	let btn = document.querySelector('button');
	btn.addEventListener('click', start);
}

window.addEventListener('load', main);
