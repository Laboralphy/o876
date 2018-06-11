

const Perlin = O876.algorithms.Perlin;



class IslandDistributor {
	constructor() {
		let pchan = new Perlin();
		pchan.size(64);
		this._perlin = pchan;
	}

	f(x, y) {
		let data = this._perlin.generate(Math.floor(x / this._perlin.size()),Math.floor(y / this._perlin.size()));
		return data
				[WorldGenerator._mod(y, this._perlin.size())]
				[WorldGenerator._mod(x, this._perlin.size())] > 0.7 ? 1 : 0;
	}

	render(oCanvas) {
		let ctx = oCanvas.getContext('2d');
        for (let y = 0, h = oCanvas.height; y < h; ++y) {
			for (let x = 0, w = oCanvas.width; x < w; ++x) {
				let v = this.f(x, y);
				let c = v * 255 | 0;
				let sStyle = O876.Rainbow.rgba({
                    r: c,
                    g: c,
                    b: c,
				});
				ctx.fillStyle = sStyle;
				ctx.fillRect(x, y, 1, 1);
			}
        }
	}
}


class WorldGenerator {
	constructor({cellSize, clusterSize, seed}) {
		let pcell = new Perlin();
        pcell.size(cellSize);
        pcell.seed(seed);


		let pclust = new Perlin();
        pclust.size(clusterSize);
        pclust.seed(seed);

        // les cellule, détail jusqu'au pixel
		// défini l'élévaltion finale du terrain
		this._perlinCell = pcell;

		// les cluster, détail jusqu'au cellule
		// défini l'élévation de base de la cellule correspondante
		this._perlinCluster = pclust;

        this._canvasCell = WorldGenerator._canvas(cellSize, cellSize);
        this._canvasCluster = WorldGenerator._canvas(clusterSize, clusterSize);
	}


	static _mod(n, d) {
		if (n > 0) {
			return n % d;
		} else {
			return (d - (-n % d)) % 16;
		}
	}
	
	static _canvas(w, h) {
		let c = document.createElement('canvas');
		c.width = w;
		c.height = h;
		c.imageSmoothingEnabled = false;
		return c;
	}

    /**
	 * Génération d'un cluster
     * @param x {number} coordonnées
     * @param y {number} du cluster
     */
	generateCluster(x, y) {
		return this._perlinCluster.generate(x, y);
	}


    _cellFilter15(base, value) {
        if (base < 0.5) {
            return value * base;
        } else {
            return Math.min(0.99, value * base * 1.5) ;
        }
    }

    _cellFilterBinary(base, value) {
        if (base < 0.5) {
            return value * 0.5;
        } else {
            return value * 0.5 + 0.5;
        }
    }

    _cellFilterMed(base, value) {
		return (base + value) / 2;
    }

    _cellFilterMinMax(base, value) {
        if (base < 0.45) {
            return base * value;
        } else {
        	return Math.max(0, Math.min(0.99, 1.333333333 * (base - value / 4)));
		}
    }

    renderCluster(oDestCanvas, xFrom, yFrom, xScreen, yScreen, wScreen, hScreen) {
        let cellSize = this._perlinCell.size();
        let clusterSize = this._perlinCluster.size();
        let c = this._canvasCluster;
        wScreen = Math.ceil(wScreen / cellSize);
        hScreen = Math.ceil(hScreen / cellSize);
        for (let yCell = 0; yCell < hScreen; ++yCell) {
            for (let xCell = 0; xCell < wScreen; ++xCell) {
                let xCurs = xCell + xFrom;
                let yCurs = yCell + yFrom;
                let heightMap = this._perlinCluster.generate(
                    xCurs,
                    yCurs
                );
                this._perlinCluster.render(heightMap, c.getContext('2d'));
                oDestCanvas.getContext('2d').drawImage(c, xScreen + xCell * cellSize, yScreen + yCell * cellSize);
            }
        }
	}

    renderClusterCells(oDestCanvas, xFrom, yFrom, xScreen, yScreen, wScreen, hScreen) {
		let cellSize = this._perlinCell.size();
		let clusterSize = this._perlinCluster.size();

		let c = this._canvasCell;
        wScreen = Math.ceil(wScreen / cellSize);
        hScreen = Math.ceil(hScreen / cellSize);

		for (let yCell = 0; yCell < hScreen; ++yCell) {
			for (let xCell = 0; xCell < wScreen; ++xCell) {
				let xCurs = xCell + xFrom;
				let yCurs = yCell + yFrom;
                let heightMap = this._perlinCell.generate(
                	xCurs,
					yCurs, {
                		noise: (xg, yg, cellData) => {
                            let xCluster = Math.floor((xg) / clusterSize);
                            let yCluster = Math.floor((yg) / clusterSize);
                            let xClusterMod = WorldGenerator._mod(xg, clusterSize);
                            let yClusterMod = WorldGenerator._mod(yg, clusterSize);
                            let data = this.generateCluster(xCluster, yCluster);
							return cellData.map(row => {
								return row.map(cell => this._cellFilterMinMax(data[yClusterMod][xClusterMod], cell))
							})
                		}
					}
				);
                this._perlinCell.render(heightMap, c.getContext('2d'));
                oDestCanvas.getContext('2d').drawImage(c, xScreen + xCell * cellSize, yScreen + yCell * cellSize);
			}
		}
	}
}


class View {
	constructor() {
		this.xView = 0;
		this.yView = 0;
		this.wView = 32;
		this.hView = 32;
        this.WORLD_DEF = {
            cellSize: 8,
            clusterSize: 16,
            seed: 0.111
        };
        this.world = new WorldGenerator(this.WORLD_DEF);
        this.screen = WorldGenerator._canvas(512, 512);
        this.screenMap = WorldGenerator._canvas(32, 32);
	}

    render(oCanvas, xView, yView, x, y, w, h) {
        this.world.renderClusterCells(
            oCanvas,
            xView, yView,
            x, y,
            w, h
        );
    }

    view(x, y) {
        this.xView = x;
        this.yView = y;
        this.render(this.screen, this.xView, this.yView, 0, 0, this.screen.width, this.screen.height);
        this.commitScreen();
    }

	commitScreen() {
        document.querySelector('.world').getContext('2d').drawImage(this.screen, 0, 0);
	}

    scrollLeft(n) {
        let nCell = n * this.WORLD_DEF.cellSize;
        let s = WorldGenerator._canvas(this.screen.width, this.screen.height);
        s.getContext('2d').drawImage(
            this.screen,
            0, 0, this.screen.width - nCell, this.screen.height,
            nCell, 0, this.screen.width - nCell, this.screen.height
        );
        this.render(s, this.xView -= n, this.yView, 0, 0, nCell, this.screen.height);
        this.screen = s;
        this.commitScreen();
    }

    scrollUp(n) {
        let nCell = n * this.WORLD_DEF.cellSize;
        let s = WorldGenerator._canvas(this.screen.width, this.screen.height);
        s.getContext('2d').drawImage(
            this.screen,
            0, 0, this.screen.width, this.screen.height - nCell,
            0, nCell, this.screen.width, this.screen.height - nCell
        );
        this.render(s, this.xView, this.yView -= n, 0, 0, this.screen.width, nCell);
        this.screen = s;
        this.commitScreen();
    }

    scrollRight(n) {
        let nCell = n * this.WORLD_DEF.cellSize;
        let s = WorldGenerator._canvas(this.screen.width, this.screen.height);
        s.getContext('2d').drawImage(
            this.screen,
            nCell, 0, this.screen.width - nCell, this.screen.height,
            0, 0, this.screen.width - nCell, this.screen.height
        );
        this.xView += n;
        this.render(s, this.xView + (this.screen.width / this.WORLD_DEF.cellSize) - n, this.yView, this.screen.width - nCell, 0, nCell, this.screen.height);
        this.screen = s;
        this.commitScreen();
    }

    scrollDown(n) {
        let nCell = n * this.WORLD_DEF.cellSize;
        let s = WorldGenerator._canvas(this.screen.width, this.screen.height);
        s.getContext('2d').drawImage(
            this.screen,
            0, nCell, this.screen.width, this.screen.height - nCell,
            0, 0, this.screen.width, this.screen.height - nCell
        );
        this.yView += n;
        this.render(s, this.xView, this.yView + (this.screen.height / this.WORLD_DEF.cellSize) - n, 0, this.screen.height - nCell, this.screen.width, nCell);
        this.screen = s;
        this.commitScreen();
    }
}



function kbHandler(event) {
    switch (event.key) {
        case 'ArrowUp':
            VIEW.scrollUp(1);
            break;

        case 'ArrowDown':
            VIEW.scrollDown(1);
            break;

        case 'ArrowLeft':
			VIEW.scrollLeft(1);
            break;

        case 'ArrowRight':
            VIEW.scrollRight(1);
            break;
    }
}

const VIEW = new View();
function main() {
    VIEW.view(0, 0);
    //let island = new IslandDistributor();
    //island.render(document.querySelector('.world'));
	console.log('done.');
}



window.addEventListener('load', main);
document.addEventListener('keydown', kbHandler);
