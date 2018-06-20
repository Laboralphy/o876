const WorldGenerator = require('./WorldGenerator');
const ServiceWorkerIO = require('./ServiceWorkerIO');


class Service {
    constructor() {
        this._generator = null;
        let io = new ServiceWorkerIO();
		io.service();

		io.on('init', (options) => {
		    this._generator = new WorldGenerator(options);
        });

		io.on('options', (options) => {
			this._generator.options(options);
		});

        io.on('tile', ({x, y}, cb) => {
            cb({tile: this._generator.computeCellCache(x, y)});
        });

		this._io = io;
	}
}

const service = new Service();
