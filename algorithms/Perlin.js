const Random = require('../Random');
const Rainbow = require('../Rainbow');

module.exports = class Perlin {

	constructor() {
		this._width = 0;
		this._height = 0;
		this._octaves = 0;
		this._interpolate = null;
		this._rand = new Random();
		this.interpolation('cosine');
	}

	/**
	 * Generate white noise on a matrix
	 * @param w matrix width
	 * @param h matrix height
	 * @return {array}
	 */
	generateWhiteNoise(w, h) {
		let r, a = [];
		for (let x, y = 0; y < h; ++y) {
			r = []; 
			for (x = 0; x < w; ++x) {
				r.push(this._rand.rand());
			}
			a.push(r);
		}
		return a;
	}

	/**
	 * Linear interpolation
	 * @param x0 minimum
	 * @param x1 maximum
	 * @param alpha value between 0 and 1
	 * @return float, interpolation result
	 */
	linearInterpolate(x0, x1, alpha) {
		return x0 * (1 - alpha) + alpha * x1;
	}

	/**
	 * Cosine Interpolation
	 */
	cosineInterpolate(x0, x1, mu) {
		let mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
   		return x0 * (1 - mu2) + x1 * mu2;
	}

	/**
	 * selects or define an interpolation function
	 * @param f string | function the new interpolation function
	 * f can be either a string ('cosine', 'linear') or a custom function
	 */
	interpolation(f) {
		switch (typeof f) {
			case 'string':
				if ((f + 'Interpolate') in this) {
					this._interpolate = this[f + 'Interpolate'];
				} else {
					throw new Error('only "linear" or "cosine" interpolation');
				}
				return this;
				
			case 'function':
				this._interpolate = f;
				return this;
				
			case 'undefined':
				return this._interpolate;
		}
		return this;
	}

	generateSmoothNoise(aBaseNoise, nOctave) {
		let w = aBaseNoise.length;
		let h = aBaseNoise[0].length;
		let aSmoothNoise = [];
		let r;
		let nSamplePeriod = 1 << nOctave;
		let fSampleFreq = 1 / nSamplePeriod;
		let xs = [], ys = [];
		let hBlend, vBlend, fTop, fBottom;
		for (let x, y = 0; y < h; ++y) {
      		ys[0] = (y / nSamplePeriod | 0) * nSamplePeriod;
      		ys[1] = (ys[0] + nSamplePeriod) % h;
      		hBlend = (y - ys[0]) * fSampleFreq;
      		r = [];
      		for (x = 0; x < w; ++ x) {
       			xs[0] = (x / nSamplePeriod | 0) * nSamplePeriod;
      			xs[1] = (xs[0] + nSamplePeriod) % w;
      			vBlend = (x - xs[0]) * fSampleFreq;

      			fTop = this._interpolate(aBaseNoise[ys[0]][xs[0]], aBaseNoise[ys[1]][xs[0]], hBlend)
      			fBottom = this._interpolate(aBaseNoise[ys[0]][xs[1]], aBaseNoise[ys[1]][xs[1]], hBlend)
     			
     			r.push(this._interpolate(fTop, fBottom, vBlend));
      		}

      		aSmoothNoise.push(r);
		}
		return aSmoothNoise;
	}

	generatePerlinNoise(aBaseNoise, nOctaveCount) {
		let w = aBaseNoise.length;
		let h = aBaseNoise[0].length;
		let aSmoothNoise = [];
		let fPersist = 0.5;

		for (let i = 0; i < nOctaveCount; ++i) {
			aSmoothNoise.push(this.generateSmoothNoise(aBaseNoise, i));
		}

		let aPerlinNoise = [];
		let fAmplitude = 1;
		let fTotalAmp = 0;
		let x, y, r;

		for (y = 0; y < h; ++y) {
			r = [];
			for (x = 0; x < w; ++x) {
				r.push(0);
			}
			aPerlinNoise.push(r);
		}

		for (let iOctave = nOctaveCount - 1; iOctave >= 0; --iOctave) {
			fAmplitude *= fPersist;
			fTotalAmp += fAmplitude;

			for (y = 0; y < h; ++y) {
				r = [];
				for (x = 0; x < w; ++x) {
					aPerlinNoise[y][x] += aSmoothNoise[iOctave][y][x] * fAmplitude;
				}
			} 
		}
		for (y = 0; y < h; ++y) {
			r = [];
			for (x = 0; x < w; ++x) {
				aPerlinNoise[y][x] /= fTotalAmp;
			}
		}
		return aPerlinNoise;
	}


	hash (a) {
	    a = (a ^ 61) ^ (a >> 16);
	    a = a + (a << 3);
	    a = a ^ (a >> 4);
	    a = a * 0x27d4eb2d;
	    a = a ^ (a >> 15);
    	return a;
    }

	/** 
	 * Calcule le hash d'une région
	 * Permet de choisir une graine aléatoire
	 * et de raccorder seamlessly les région adjacente
	 */
	getPointHash(x, y) {
		let xh = this.hash(x).toString().split('');
		let yh = this.hash(y).toString().split('');
		let s = xh.shift() + yh.shift() + '.';
		while (xh.length || yh.length) {
			if (xh.length) {
				s += xh.shift();
			}
			if (yh.length) {
				s += yh.shift();
			}
		}
		return parseFloat(s);
	}

	generate(x, y) {
		let _self = this;

		function gwn(xg, yg) {
			let nSeed = _self.getPointHash(xg, yg);
			_self.rand().seed(nSeed);
			return _self.generateWhiteNoise(_self.width(), _self.height());
		}

		function merge33(a33) {
			let h = _self.height();
			let a = [];
			for (let y, ya = 0; ya < 3; ++ya) {
				for (y = 0; y < h; ++y) {
					a.push(a33[ya][0][y].concat(a33[ya][1][y], a33[ya][2][y]));
				}
			}
			return a;
		}

		function extract33(a) {
			let w = _self.width();
			let h = _self.height();
			return a.slice(h, h * 2).map(function(r) { return r.slice(w, w * 2); });
		}

		let a0 = [
			[gwn(x - 1, y - 1), gwn(x, y - 1), gwn(x + 1, y - 1)],
			[gwn(x - 1, y), gwn(x, y), gwn(x + 1, y)],
			[gwn(x - 1, y + 1), gwn(x, y + 1), gwn(x + 1, y + 1)]
		];

		let a1 = merge33(a0);
		let a2 = this.generatePerlinNoise(a1, this._octaves);
		let a3 = extract33(a2);
		return a3;
	}

	render(aNoise, oContext, aPalette) {
		aPalette = aPalette || Rainbow.gradient({
			0: '#008',
			49: '#00F',
			50: '#840',
			84: '#0A0',
			85: '#888',
			99: '#FFF'
		});
		let h = aNoise.length, w = aNoise[0].length, pl = aPalette.length;
		let oImageData = oContext.createImageData(w, h);
		let data = oImageData.data;
		aNoise.forEach(function(r, y) {
			r.forEach(function(p, x) {
				let nOfs = (y * w + x) << 2;
				let rgb = Rainbow.parse(aPalette[p * pl | 0]);
				data[nOfs] = rgb.r;
				data[nOfs + 1] = rgb.g;
				data[nOfs + 2] = rgb.b;
				data[nOfs + 3] = 255;
			});
		});
		oContext.putImageData(oImageData, 0, 0);
	}
};
