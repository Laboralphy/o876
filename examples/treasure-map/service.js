const WorldGenerator = require('./WorldGenerator');
const Webworkio = require('./Webworkio');


class Service {
    constructor() {
        this._generator = null;
        let io = new Webworkio();
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
