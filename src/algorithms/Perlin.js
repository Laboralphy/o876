const SpellBook = require('../SpellBook');
const Random = require('../Random');
const Rainbow = require('../Rainbow');
const Cache2D = require('../structures/Cache2D');


class Perlin {

	constructor() {
		this._size = 64;
		this._width = 64;
		this._height = 64;
		this._octaves = 8;
		this._interpolate = null;
		this._rand = new Random();
		this.interpolation('cosine');
		this._cache = new Cache2D();
		this._wnCache = new Cache2D();
		this._wnCache.size(9);
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
		let r, a = [], rand = this._rand;
		for (let x, y = 0; y < h; ++y) {
			r = []; 
			for (x = 0; x < w; ++x) {
				r.push(rand.rand());
			}
			a.push(r);
		}
		return a;
	}

	/**
	 * Linear interpolation
	 * @param x0 {number} minimum
	 * @param x1 {number} maximum
	 * @param alpha {number} value between 0 and 1
	 * @return {number} float, interpolation result
	 */
	static linearInterpolate(x0, x1, alpha) {
		return x0 * (1 - alpha) + alpha * x1;
	}

	/**
	 * Cosine Interpolation
	 * @param x0 {number} minimum
	 * @param x1 {number} maximum
	 * @param mu {number} value between 0 and 1
	 * @return {number} float, interpolation result
	 */
	static cosineInterpolate(x0, x1, mu) {
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
				if ((f + 'Interpolate') in Perlin) {
					this._interpolate = Perlin[f + 'Interpolate'];
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

	static generateSmoothNoise(aBaseNoise, nOctave) {
		let w = aBaseNoise.length;
		let h = aBaseNoise[0].length;
		let aSmoothNoise = [];
		let r;
		let nSamplePeriod = 1 << nOctave;
		let fSampleFreq = 1 / nSamplePeriod;
		let xs0, xs1, ys0, ys1;
		let hBlend, vBlend, fTop, fBottom;
		let interpolate = Perlin.cosineInterpolate;
		for (let x, y = 0; y < h; ++y) {
      		ys0 = y - (y % nSamplePeriod);
      		ys1 = (ys0 + nSamplePeriod) % h;
      		hBlend = (y - ys0) * fSampleFreq;
      		r = [];
			let bny0 = aBaseNoise[ys0];
			let bny1 = aBaseNoise[ys1];
      		for (x = 0; x < w; ++ x) {
       			xs0 = x - (x % nSamplePeriod);
      			xs1 = (xs0 + nSamplePeriod) % w;
      			vBlend = (x - xs0) * fSampleFreq;
      			fTop = interpolate(bny0[xs0], bny1[xs0], hBlend);
      			fBottom = interpolate(bny0[xs1], bny1[xs1], hBlend);
     			r.push(interpolate(fTop, fBottom, vBlend));
      		}
      		aSmoothNoise.push(r);
		}
		return aSmoothNoise;
	}

	static generatePerlinNoise(aBaseNoise, nOctaveCount) {
		let w = aBaseNoise.length;
		let h = aBaseNoise[0].length;
		let aSmoothNoise = [];
		let fPersist = 0.5;

		for (let i = 0; i < nOctaveCount; ++i) {
			aSmoothNoise.push(Perlin.generateSmoothNoise(aBaseNoise, i));
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
			let sno = aSmoothNoise[iOctave];
			for (y = 0; y < h; ++y) {
				let snoy = sno[y];
				let pny = aPerlinNoise[y];
				for (x = 0; x < w; ++x) {
					pny[x] += snoy[x] * fAmplitude;
				}
			} 
		}
		for (y = 0; y < h; ++y) {
			let pny = aPerlinNoise[y];
			for (x = 0; x < w; ++x) {
				pny[x] /= fTotalAmp;
			}
		}
		return aPerlinNoise;
	}


	static hash (a) {
		if (a < 0) {
			let b = 0, h = Perlin.hash(-a);
			while (h) {
				b = (b << 4) | h & 15;
				h >>= 4;
			}
			return Math.abs(b);
		}
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
	static getPointHash(x, y) {
		let xh = Perlin.hash(x).toString().split('');
		let yh = Perlin.hash(y).toString().split('');
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


	generate(x, y, callbacks) {
		if (x >= Number.MAX_SAFE_INTEGER || x <= -Number.MAX_SAFE_INTEGER || y >= Number.MAX_SAFE_INTEGER || y <= -Number.MAX_SAFE_INTEGER) {
			throw new Error('trying to generate x:' + x + ' - y:' + y + ' - maximum safe integer is ' + Number.MAX_SAFE_INTEGER + ' !');
		}
		callbacks = callbacks || {};
		let perlin = 'perlin' in callbacks ? callbacks.perlin : null;
		let noise = 'noise' in callbacks ? callbacks.noise : null;
		let cached = this._cache.getPayload(x, y);
		if (cached) {
			return cached;
		}
		let wnCache = this._wnCache;
		const RAND = this._rand;
		
		const gwn = (xg, yg) => {
            let cachedNoise = wnCache.getPayload(xg, yg)
			if (cachedNoise) {
				return cachedNoise;
			}
			let nSeed = Perlin.getPointHash(xg, yg);
			RAND.seed(nSeed + this._seed);
			let aNoise = this.generateWhiteNoise(this.width(), this.height());
			if (noise) {
				aNoise = noise(xg, yg, aNoise);
			}
			wnCache.push(xg, yg, aNoise);
			return aNoise;
		};

		const merge33 = a33 => {
			let h = this.height();
			let a = [];
			for (let y, ya = 0; ya < 3; ++ya) {
				let a33ya = a33[ya];
				let a33ya0 = a33ya[0];
				let a33ya1 = a33ya[1];
				let a33ya2 = a33ya[2];
				for (y = 0; y < h; ++y) {
					a.push(a33ya0[y].concat(a33ya1[y], a33ya2[y]));
				}
			}
			return a;
		};

		const extract33 = a => {
			let w = this.width();
			let h = this.height();
			return a.slice(h, h << 1).map(r => r.slice(w, w << 1));
		};

		let a0 = [
			[gwn(x - 1, y - 1), gwn(x, y - 1), gwn(x + 1, y - 1)],
			[gwn(x - 1, y), gwn(x, y), gwn(x + 1, y)],
			[gwn(x - 1, y + 1), gwn(x, y + 1), gwn(x + 1, y + 1)]
		];

		let a1 = merge33(a0);
		let a2 = Perlin.generatePerlinNoise(a1, this._octaves);
		let a3 = extract33(a2);
		if (perlin) {
			a3 = perlin(x, y, a3);
		}
		this._cache.push(x, y, a3);
		return a3;
	}

	/**
	 * Applique une palette au bruit généré
	 * @param aNoise {Array} an array produced by generate()
	 * @param aPalette {array}
	 */
	static colorize(aNoise, aPalette) {
		let pl = aPalette.length;
		let data = [];
		aNoise.forEach(r => r.forEach(x => {
			let nColor = Math.min(pl - 1, x * pl | 0);
			data.push(aPalette[nColor])
		}));
		return data;
	}


}

module.exports = Perlin;