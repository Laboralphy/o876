async function draw(oDestCanvas, oRenderCanvas, x, y) {
	return new Promise(resolve => {
		requestAnimationFrame(() => {
			let oContext = oDestCanvas.getContext('2d');
			oContext.drawImage(oRenderCanvas, x, y);
			resolve();
		});
	});
}

async function render(perlin, x, y, oRenderCanvas) {
	return new Promise(resolve => {
		let aData = perlin.generate(x, y);
		perlin.render(aData, oRenderCanvas.getContext('2d'));
		resolve();
	});
}

async function renderAll(perlin, oDestCanvas, xOfs, yOfs, sectors, cbProgress) {
	let sector;
	let oRenderCanvas = document.createElement('canvas');
	oRenderCanvas.width = perlin.width();
	oRenderCanvas.height = perlin.height();
	let oRenderContext = oRenderCanvas.getContext('2d');
	let nLen = sectors.length;
	let i = 0;
	while (sector = sectors.shift()) {
		await render(perlin, sector.x, sector.y, oRenderCanvas);
		await draw(oDestCanvas, oRenderCanvas, xOfs + sector.x * perlin.width(), yOfs + sector.y * perlin.height());
		++i;
		if (cbProgress) {
			cbProgress(i / nLen);
		}
	}
}


function main() {
	let oCanvas = document.querySelector('canvas');
	let oContext = oCanvas.getContext('2d');
	let perlin = new O876.algorithms.Perlin();
	let wPerlin = 256;
	perlin.size(wPerlin);
	let wWorld = 7;
	let hWorld = 3;
	oCanvas.width = wPerlin * wWorld;
	oCanvas.height = wPerlin * hWorld;
	let aData;
	let sectors = [];
	for (let y = 0; y < hWorld; ++y) {
		for (let x = 0; x < wWorld; ++x) {
			sectors.push({x, y});
		}
	}
	renderAll(perlin, oCanvas, 0, 0, sectors);
}

window.addEventListener('load', main);
