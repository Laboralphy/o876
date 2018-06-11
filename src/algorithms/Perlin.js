const SpellBook = require('../SpellBook');
const Random = require('../Random');
const Rainbow = require('../Rainbow');


module.exports = class Perlin {

	constructor() {
		this._size = 64;
		this._width = 64;
		this._height = 64;
		this._octaves = 8;
		this._interpolate = null;
		this._rand = new Random();
		this.interpolation('cosine');
		this._cache = [];
		this._seed = 1;
	}

	seed(n) {
		return SpellBook.prop(this, '_seed', n);
	}
	
	size(n) {
		if (n === undefined) {
			return this._size;
		} else {
			let i = 10;
			while (i > 0) {
				let i2 = 1 << i;
				if (i2 === n) {
					this._width = i2;
					this._height = i2;
					this._octaves = i;
					this._size = n;
					return this;
				}
				--i;
			}
			throw new Error('size must be a power of 2 between 2 and 1024');
		}
	}
	
	width() {
		return this._width;
	}

	height(h) {
		return this._height;
	}
	
	octaves(n) {
		return this._octaves;
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

      			fTop = this._interpolate(aBaseNoise[ys[0]][xs[0]], aBaseNoise[ys[1]][xs[0]], hBlend);
      			fBottom = this._interpolate(aBaseNoise[ys[0]][xs[1]], aBaseNoise[ys[1]][xs[1]], hBlend);
     			
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
		if (s === '--.') {
		//	s = '0.';
		}
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
	
	getCache(x, y) {
		if (this._cache.length) {
			let k = this.getPointHash(x, y);
			let c = this._cache.find(cc => cc.key === k);
			if (c) {
				return c.data;
			}
		}
		return null;	
	}
	
	pushCache(x, y, data) {
		this._cache.push({
			key: this.getPointHash(x, y),
			data: data
		});
		while (this._cache.length > 16) {
			this._cache.shift();
		}
	}
	
	generate(x, y, callbacks) {
		if (x >= Number.MAX_SAFE_INTEGER || x <= -Number.MAX_SAFE_INTEGER || y >= Number.MAX_SAFE_INTEGER || y <= -Number.MAX_SAFE_INTEGER) {
			throw new Error('trying to generate x:' + x + ' - y:' + y + ' - maximum safe integer is ' + Number.MAX_SAFE_INTEGER + ' !');
		}
		callbacks = callbacks || {};
		let perlin = 'perlin' in callbacks ? callbacks.perlin : null;
		let noise = 'noise' in callbacks ? callbacks.noise : null;
		let cached = this.getCache(x, y);
		if (cached) {
			return cached;
		}
		
		const gwn = (xg, yg) => {
			let nSeed = this.getPointHash(xg, yg);
			console.log(xg, yg, '->', nSeed);
			this._rand.seed(nSeed + this._seed);
			let aNoise = this.generateWhiteNoise(this.width(), this.height());
			if (noise) {
				aNoise = noise(xg, yg, aNoise);
			}
			return aNoise;
		};

		const merge33 = a33 => {
			let h = this.height();
			let a = [];
			for (let y, ya = 0; ya < 3; ++ya) {
				for (y = 0; y < h; ++y) {
					a.push(a33[ya][0][y].concat(a33[ya][1][y], a33[ya][2][y]));
				}
			}
			return a;
		};

		const extract33 = a => {
			let w = this.width();
			let h = this.height();
			return a.slice(h, h * 2).map(function(r) { return r.slice(w, w * 2); });
		};

		let a0 = [
			[gwn(x - 1, y - 1), gwn(x, y - 1), gwn(x + 1, y - 1)],
			[gwn(x - 1, y), gwn(x, y), gwn(x + 1, y)],
			[gwn(x - 1, y + 1), gwn(x, y + 1), gwn(x + 1, y + 1)]
		];

		let a1 = merge33(a0);
		let a2 = this.generatePerlinNoise(a1, this._octaves);
		let a3 = extract33(a2);
		if (perlin) {
			a3 = perlin(x, y, a3);
		}
		this.pushCache(x, y, a3);
		return a3;
	}

	/**
	 * @param aNoise {Array} an array produced by generate()
	 * @param oContext {CanvasRenderingContext2D}
	 */
	render(aNoise, oContext, aPalette) {
		aPalette = aPalette || Rainbow.gradient({
			0: '#008',
			44: '#00F',
			49: '#44F',
			50: '#864',
			74: '#080',
			75: '#555',
			89: '#777',
			90: '#AAA',
			99: '#FFF'
		});
		let h = aNoise.length, w = aNoise[0].length, pl = aPalette.length;
		let oImageData = oContext.createImageData(w, h);
		let data = oImageData.data;
		aNoise.forEach(function(r, y) {
			r.forEach(function(p, x) {
				let nOfs = (y * w + x) << 2;
				let rgb = Rainbow.parse(aPalette[Math.min(aPalette.length - 1, p * pl | 0)]);
				if (rgb === undefined) {
					throw new Error('entry "' + (p * pl | 0) + '" is not in palette');
				}
				data[nOfs] = rgb.r;
				data[nOfs + 1] = rgb.g;
				data[nOfs + 2] = rgb.b;
				data[nOfs + 3] = 255;
			});
		});
		oContext.putImageData(oImageData, 0, 0);
	}
};
