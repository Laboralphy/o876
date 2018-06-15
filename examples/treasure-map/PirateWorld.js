const WorldGenerator = require('./WorldGenerator');
const o876 = require('../../src');
const Perlin = o876.algorithms.Perlin;

class PirateWorld {
	constructor(wgd) {
        this._cellSize = wgd.cellSize;
		this._gradient = o876.Rainbow.gradient({
			0: '#dec673',
			40: '#efd69c',
			48: '#d6a563',
			50: '#572507',
			55: '#d2a638',
			75: '#b97735',
			99: '#efce8c'
		});

		this._generator = new WorldGenerator(wgd);
		this._cache = new o876.structures.Cache2D({size: 256});
		this._cliparts = {};
		this._buildCliparts();
	}


    /**
	 * fabrique et renvoie un canvas
     * @param w {number} taille
     * @param h {number} taille
     * @return {HTMLCanvasElement}
     * @private
     */
    static _canvas(w, h) {
        let c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.imageSmoothingEnabled = false;
        return c;
    }

    /**
	 * Construction des clipart utilisé pour égayer la map
     * @private
     */
    _buildCliparts() {
		const MESH_SIZE = 16;
		const WAVE_SIZE = 3;
		const HERB_SIZE = 3;
		const MNT_LENGTH = 7;
		const MNT_HEIGHT = MNT_LENGTH | 0.75 | 0;
		const FOREST_SIZE = 4;
		let xMesh = MESH_SIZE >> 1;
		let yMesh = MESH_SIZE >> 1;
		let c, ctx;

		// vague
		c = PirateWorld._canvas(MESH_SIZE, MESH_SIZE);
		ctx = c.getContext('2d');
		ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
		ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(xMesh - WAVE_SIZE, yMesh + WAVE_SIZE);
		ctx.lineTo(xMesh, yMesh);
		ctx.lineTo(xMesh + WAVE_SIZE, yMesh + WAVE_SIZE);
		ctx.stroke();
		this._cliparts.wave = c;

		// forest
		c = PirateWorld._canvas(MESH_SIZE, MESH_SIZE);
		ctx = c.getContext('2d');
		ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
		ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.arc(xMesh, yMesh,FOREST_SIZE, 0, Math.PI * 2);
		ctx.rect(xMesh - 1, yMesh + FOREST_SIZE, 2, FOREST_SIZE);
		ctx.fill();
		ctx.stroke();
		this._cliparts.forest = c;

		// herbe
		c = PirateWorld._canvas(MESH_SIZE, MESH_SIZE);
		ctx = c.getContext('2d');
		ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
		ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(xMesh - HERB_SIZE, yMesh - HERB_SIZE);
		ctx.lineTo(xMesh, yMesh);
		ctx.lineTo(xMesh + HERB_SIZE, yMesh - HERB_SIZE);
		ctx.stroke();
		this._cliparts.grass = c;

		// Montagne
		c = PirateWorld._canvas(MESH_SIZE, MESH_SIZE);
		ctx = c.getContext('2d');
		ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
		ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
		ctx.lineWidth = 1.2;
		let g = ctx.createLinearGradient(xMesh, 0, MESH_SIZE, MESH_SIZE);
		g.addColorStop(0, 'rgba(154, 117, 61, 1)');
		g.addColorStop(1, 'rgba(154, 117, 61, 0.5)');
		ctx.fillStyle = g;
		ctx.moveTo(xMesh, yMesh);
		ctx.beginPath();
		ctx.lineTo(xMesh + MNT_LENGTH, yMesh + MNT_HEIGHT);
		ctx.lineTo(xMesh, yMesh + (MNT_HEIGHT * 0.75 | 0));
		ctx.lineTo(xMesh + (MNT_LENGTH * 0.25 | 0), yMesh + (MNT_HEIGHT * 0.4 | 0));
		ctx.lineTo(xMesh, yMesh);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(xMesh, yMesh);
		ctx.lineTo(xMesh + MNT_LENGTH, yMesh + MNT_HEIGHT);
		ctx.moveTo(xMesh, yMesh);
		ctx.lineTo(xMesh, yMesh + (MNT_HEIGHT >> 1));
		ctx.moveTo(xMesh, yMesh);
		ctx.lineTo(xMesh - MNT_LENGTH, yMesh + MNT_HEIGHT);
		ctx.stroke();
		this._cliparts.mount = c;
	}


    /**
	 * dessine des element de terrain (arbre, montagnes)
     * @param xCurs {number} coordonnées cellule concernée
     * @param yCurs {number} coordonnées cellule concernée
     * @param tile {HTMLCanvasElement} canvas de sortie
     * @param aHeightIndex {array} height map fourie par WorldGenerator
     */
	paintTerrainType(xCurs, yCurs, tile, aHeightIndex) {
		let ctx = tile.getContext('2d');
		ctx.font = '12px italic serif';
		ctx.textBaseline = 'top';
		const MESH_SIZE = 16;
		aHeightIndex.forEach((row, y) => row.forEach((cell, x) => {
			if ((x & 1) ^ (y & 1)) {
				switch (cell.type) {
					case 11: // vague
						ctx.drawImage(this._cliparts.wave, x * MESH_SIZE, y * MESH_SIZE);
						break;

					case 23: // herbe
						ctx.drawImage(this._cliparts.grass, x * MESH_SIZE, y * MESH_SIZE);
						break;

					case 33: // foret
						ctx.drawImage(this._cliparts.forest, x * MESH_SIZE, y * MESH_SIZE);
						break;

					case 55: // montagne
						ctx.drawImage(this._cliparts.mount, x * MESH_SIZE, y * MESH_SIZE);
						break;
				}
			}
		}));
	}

	paintLinesCoordinates(xCurs, yCurs, tile, aHeightIndex) {
		let ctx = tile.getContext('2d');
		ctx.font = '12px italic serif';
		ctx.textBaseline = 'top';
		ctx.strokeStyle = 'rgba(57, 25, 7, 0.5)';
		ctx.beginPath();
		ctx.moveTo(0, tile.height - 1);
		ctx.lineTo(0, 0);
		ctx.lineTo(tile.width - 1, 0);
		ctx.stroke();
		ctx.strokeStyle = '#efce8c';
		ctx.fillStyle = 'rgba(57, 25, 7)';
		let sText = yCurs.toString() + '" ' + xCurs.toString();
		ctx.strokeText(sText, 10, 10);
		ctx.fillText(sText, 10, 10);
	}


    /**
     * lorssque la cellule à été générée par le WorldGenerator
     * on peut la transformer en canvas par cette methode
     * @param xCurs {number} longitude de la cellule
     * @param yCurs {number} lattitude de la cellule
     * @param heightmap {array} hauteur de chaque point (pixel) de la map
     * @param physicmap {array} propriété physique de chaque secteur 16x16 de la map
     */
    paintCell(xCurs, yCurs, heightmap, physicmap) {
        let tile = PirateWorld._canvas(this._cellSize, this._cellSize);
        let ctx = tile.getContext('2d');
        let oImageData = ctx.createImageData(tile.width, tile.height);
        let data = Perlin.colorize(heightmap, this._gradient);
        data.forEach((x, i) => oImageData.data[i] = x);
        ctx.putImageData(oImageData, 0, 0);
		this.paintTerrainType(xCurs, yCurs, tile, physicmap);
		this.paintLinesCoordinates(xCurs, yCurs, tile, physicmap);
		return tile;
	}

	paint(oDestCanvas, cellData, xScreen, yScreen) {
        let cellSize = this._cellSize;
        cellData.forEach(cd => {
            let cvs;
            let td = this._cache.getPayload(cd.x, cd.y);
            if (!td) {
                cvs = this.paintCell(cd.x, cd.y, cd.heightmap, cd.physicmap);
                this._cache.push(cd.x, cd.y, {
                    tile: cvs,
                    physicmap: cd.physicmap
                });
            } else {
                cvs = td.tile;
            }
            oDestCanvas.getContext('2d').drawImage(cvs, xScreen + cd.xCell * cellSize, yScreen + cd.yCell * cellSize);
        });
	}

    /**
     * Lance le dessin de l'ensemble des cellules désignées
     * @param oDestCanvas {HTMLCanvasElement} canvas de destination
     * @param xFrom {number} longitude au centre
     * @param yFrom {number} latitude au centre
     * @param xScreen {number} position de dessin sur le canvas (généralement 0)
     * mais cela peut etre également un offset permettant de simuler un scrolling
     * @param yScreen {number} position de dessin sur le canvas (généralement 0)
     * @param wScreen {number} taille de la portion de dessin
     * @param hScreen {number} taille de la portion de dessin
     */
    render(oDestCanvas, xFrom, yFrom, xScreen, yScreen, wScreen, hScreen) {
        let cellSize = this._cellSize;
        wScreen = Math.ceil(wScreen / cellSize);
        hScreen = Math.ceil(hScreen / cellSize);

        let cellData = [];
        for (let yCell = 0; yCell < hScreen; ++yCell) {
            for (let xCell = 0; xCell < wScreen; ++xCell) {
                let xCurs = xCell + xFrom;
                let yCurs = yCell + yFrom;
                cellData.push({
					xCell, yCell,
					...this._generator.computeCellCache(xCurs, yCurs)
				});
            }
        }
        this.paint(oDestCanvas, cellData, xScreen, yScreen);
    }


}

module.exports = PirateWorld;