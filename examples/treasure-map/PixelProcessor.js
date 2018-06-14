class PixelProcessor {
    process(oCanvas, cb) {
        let ctx = oCanvas.getContext('2d');
        let oImageData = ctx.createImageData(oCanvas.width, oCanvas.height);
        let pixels = oImageData.data;
        let h = oCanvas.height;
        let w = oCanvas.width;
        let oPixelCtx = {
            pixel: (x, y) => {
                let nOffset = (y * w + x) << 2;
                return {
                    r: pixels[nOffset],
                    g: pixels[nOffset + 1],
                    b: pixels[nOffset + 2],
                    a: pixels[nOffset + 3]
                }
            },
            width: w,
            height: h,
            x: 0,
            y: 0,
            color: {
                r: 0,
                g: 0,
                b: 0,
                a: 255
            }
        };
        let aColors = [];
        for (let y = 0; y < h; ++y) {
            for (let x = 0; x < w; ++x) {
                let nOffset = (y * w + x) << 2;
                oPixelCtx.x = x;
                oPixelCtx.y = y;
                oPixelCtx.color.r = pixels[nOffset];
                oPixelCtx.color.g = pixels[nOffset + 1];
                oPixelCtx.color.b = pixels[nOffset + 2];
                oPixelCtx.color.a = pixels[nOffset + 3];
                cb(oPixelCtx);
				aColors.push({...oPixelCtx.color});
            }
        }
        aColors.forEach((c, i) => {
            let nOffset = i << 2;
			pixels[nOffset] = c.r;
			pixels[nOffset + 1] = c.g;
			pixels[nOffset + 2] = c.b;
			pixels[nOffset + 3] = c.a;
		});
        ctx.putImageData(oImageData, 0, 0);
    }
}

module.exports = PixelProcessor;