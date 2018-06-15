const WorldGenerator = require('./WorldGenerator');
const ServiceWorkerIO = require('./ServiceWorkerIO');





class Service {
    constructor() {
        this._generator = null;
        let io = new ServiceWorkerIO();
        io.on('about', (data, cb) => {
            setTimeout(() => cb({version: 2, name: 'world generator'}), 2000);
		});
        io.service();
		this._io = io;
	}

    getGenerator() {
        return this._generator;
    }

    setGenerator(g) {
        this._generator = g;
    }



    /**
     * Lance la génération des tuiles située dans une zone rectangulaire de width * height
     * Dont le centre est x y
     * @param x {number} coordoonée centre
     * @param y {number} coordoonée centre
     * @param width {number} largeur
     * @param height {number} hauteur
     */
    // compute(x, y, width, height) {
    //     let g = this._generator;
    //     let cellSize = g._cellSize;
    //     let wScreen = Math.ceil(width / cellSize);
    //     let hScreen = Math.ceil(height / cellSize);
	//
    //     let cellData = [];
    //     for (let yCell = 0; yCell < hScreen; ++yCell) {
    //         for (let xCell = 0; xCell < wScreen; ++xCell) {
    //             let xCurs = xCell + x;
    //             let yCurs = yCell + y;
    //             cellData.push({
    //                 xCell, yCell,
    //                 ...this._generator.computeCellCache(xCurs, yCurs)
    //             });
    //         }
    //     }
    //     return cellData;
    // }

}


const service = new Service();










//addEventListener('message', e => service.processMessage(e));