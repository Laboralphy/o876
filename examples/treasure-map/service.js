const WorldGenerator = require('./WorldGenerator');

class Service {
    constructor() {
        this._generator = null;
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

    sendMessage(sAction, data) {
        data.action = sAction;
        postMessage(JSON.stringify(data));
    }

    processMessage(e) {
        let data = JSON.parse(e.data);
        switch (data.action) {

            case 'about':
                this.sendMessage('about', {version: 1, name: 'world generator'});
                break;

            // initialisation du world generator
            case 'init':
                service.setGenerator(new WorldGenerator(data));
                break;

            // lance la génération des tuiles
            // centrée sur x, y
            // toutes les tuiles située dans la zone sont dessinées
            case 'compute':
                service.compute(data.x, data.y, data.width, data.height);
                break;
        }
    }
}


const service = new Service();










addEventListener('message', e => service.processMessage(e));