const PixelProcessor = O876.PixelProcessor;


function start() {
	PixelProcessor.process(document.querySelector('canvas'), pctx => {
		pctx.color.r = pctx.x % 255;
		pctx.color.b = pctx.y % 255;
		pctx.color.g = ((pctx.y + pctx.x) / 4 | 0) % 255;
		pctx.color.a = 255;
	});
}


function main() {
	let btn = document.querySelector('button');
	btn.addEventListener('click', start);
}

window.addEventListener('load', main);
