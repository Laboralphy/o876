const WorldGenerator = require('./WorldGenerator');
const ServiceWorkerIO = require('./ServiceWorkerIO');





class Service {
    constructor() {
        this._generator = null;
        let io = new ServiceWorkerIO();
		io.service();

		io.on('about', (data, cb) => {
			cb({version: 2, name: 'world generator', ...data});
		});

		io.on('init', ({seed, cell, cluster}) => {
		    this._generator = new WorldGenerator({
                seed,
                clusterSize: cluster,
                cellSize: cell
            });
        });

		io.on('tiles', ({tiles}, cb) => {
            cb({tiles: tiles.map(tile => this._generator.computeCellCache(tile.x, tile.y))});
		});

		io.on('status', (data, cb) => {
		    let g = this._generator;
		    let oInfo = {
		        'cache-size': g._cache._cacheSize,
                seed: g._perlinCell.seed(),
				'cell-size': g._perlinCell.size(),
				'cluster-size': g._perlinCluster.size(),
            };
            cb(oInfo);
        });

		this._io = io;
	}



    /**
     * Lance la génération des tuiles située dans une zone rectangulaire de width * height
     * Dont le centre est x y
     * @param x {number} coordoonée centre
     * @param y {number} coordoonée centre
     * @param width {number} largeur
     * @param height {number} hauteur
     */
    compute(x, y, width, height) {
        let g = this._generator;
        let cellSize = g._cellSize;
        let wScreen = Math.ceil(width / cellSize);
        let hScreen = Math.ceil(height / cellSize);

        let cellData = [];
        for (let yCell = 0; yCell < hScreen; ++yCell) {
            for (let xCell = 0; xCell < wScreen; ++xCell) {
                let xCurs = xCell + x;
                let yCurs = yCell + y;
                cellData.push({
                    xCell, yCell,
                    ...this._generator.computeCellCache(xCurs, yCurs)
                });
            }
        }
        return cellData;
    }


}


const service = new Service();










//addEventListener('message', e => service.processMessage(e));