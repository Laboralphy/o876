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

		io.on('init', ({seed, cell, cluster, hexCluster}) => {
		    this._generator = new WorldGenerator({
                seed,
                clusterSize: cluster,
                cellSize: cell,
				hexSize: hexCluster
            });
        });

        io.on('tiles', ({tiles}, cb) => {
            cb({tiles: tiles.map(tile => this._generator.computeCellCache(tile.x, tile.y))});
        });

        io.on('tile', ({x, y}, cb) => {
            cb({tile: this._generator.computeCellCache(x, y)});
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
}

const service = new Service();
