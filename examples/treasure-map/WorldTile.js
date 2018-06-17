const o876 = require('../../src');
const CanvasHelper = require('./CanvasHelper');
const Perlin = o876.algorithms.Perlin;
const Rainbow = o876.Rainbow;

/**
 * Construction des clipart utilisé pour égayer la map
 * @private
 */
function _buildCliparts() {
    let cliparts = {};
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
    c = CanvasHelper.create(MESH_SIZE, MESH_SIZE);
    ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
    ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(xMesh - WAVE_SIZE, yMesh + WAVE_SIZE);
    ctx.lineTo(xMesh, yMesh);
    ctx.lineTo(xMesh + WAVE_SIZE, yMesh + WAVE_SIZE);
    ctx.stroke();
    cliparts.wave = c;

    // forest
    c = CanvasHelper.create(MESH_SIZE, MESH_SIZE);
    ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
    ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(xMesh, yMesh,FOREST_SIZE, 0, Math.PI * 2);
    ctx.rect(xMesh - 1, yMesh + FOREST_SIZE, 2, FOREST_SIZE);
    ctx.fill();
    ctx.stroke();
    cliparts.forest = c;

    // herbe
    c = CanvasHelper.create(MESH_SIZE, MESH_SIZE);
    ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(57, 25, 7, 0.2)';
    ctx.strokeStyle = 'rgba(154, 117, 61, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(xMesh - HERB_SIZE, yMesh - HERB_SIZE);
    ctx.lineTo(xMesh, yMesh);
    ctx.lineTo(xMesh + HERB_SIZE, yMesh - HERB_SIZE);
    ctx.stroke();
    cliparts.grass = c;

    // Montagne
    c = CanvasHelper.create(MESH_SIZE, MESH_SIZE);
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
    cliparts.mount = c;
    return cliparts;
}

const CLIPARTS = _buildCliparts();
const MESH_SIZE = 16;


/**
 * classe de gestion des tuiles, coté window
 * cette classe a une propriété canvas et doit resté coté window
 */

class WorldTile {
    constructor(x, y, size) {
        if (size === undefined || y === undefined || x === undefined) {
            throw new Error('world tile construction requires coords x y and size. !')
        }
        this.x = x;
        this.y = y;
        this.size = size;
        this.colormap = null;
        this.physicmap = null;
        this.canvas = null;
        this._lock = false;
    }

    lock() {
        this._lock = true;
    }

    unlock() {
        this._lock = false;
    }

    isLocked() {
        return this._lock;
    }

    isMapped() {
        return this.physicmap != null;
    }

    isPainted() {
        return this.canvas != null;
    }

    /**
     * décharge les données de hauteurs pour économiser la mémoire une fois
     * la tile dessinée.
     */
    discardHeightmap() {
        this.heightmap = null;
    }


    /**
     * dessine des element de terrain (arbre, montagnes)
     * @param xCurs {number} coordonnées cellule concernée
     * @param yCurs {number} coordonnées cellule concernée
     * @param tile {HTMLCanvasElement} canvas de sortie
     * @param aHeightIndex {array} height map fourie par WorldGenerator
     */
    paintTerrainType() {
        let tile = this.canvas;
        let physicmap = this.physicmap;
        let ctx = tile.getContext('2d');
        ctx.font = '12px italic serif';
        ctx.textBaseline = 'top';
        physicmap.forEach((row, y) => row.forEach((cell, x) => {
            if ((x & 1) ^ (y & 1)) {
                switch (cell.type) {
                    case 11: // vague
                        ctx.drawImage(CLIPARTS.wave, x * MESH_SIZE, y * MESH_SIZE);
                        break;

                    case 23: // herbe
                        ctx.drawImage(CLIPARTS.grass, x * MESH_SIZE, y * MESH_SIZE);
                        break;

                    case 33: // foret
                        ctx.drawImage(CLIPARTS.forest, x * MESH_SIZE, y * MESH_SIZE);
                        break;

                    case 55: // montagne
                        ctx.drawImage(CLIPARTS.mount, x * MESH_SIZE, y * MESH_SIZE);
                        break;
                }
            }
        }));
    }

    paintLinesCoordinates() {
        let xCurs = this.x;
        let yCurs = this.y;
        let tile = this.canvas;
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

    /**
     * lorsque la cellule à été générée par le WorldGenerator
     * on peut la transformer en canvas par cette methode
     */
    paint() {
        let xCurs = this.x;
        let yCurs = this.y;
        let colormap = this.colormap;
        let physicmap = this.physicmap;
        let cellSize = this.size;
        let tile = CanvasHelper.create(cellSize, cellSize);
        this.canvas = tile;
        let ctx = tile.getContext('2d');
        let oImageData = ctx.createImageData(tile.width, tile.height);
        let buffer32 = new Uint32Array(oImageData.data.buffer);
        //let data = WorldTile.colorize(heightmap, GRADIENT);
        colormap.forEach((x, i) => buffer32[i] = x);
        ctx.putImageData(oImageData, 0, 0);
        this.paintTerrainType(xCurs, yCurs, tile, physicmap);
        this.paintLinesCoordinates(xCurs, yCurs, tile, physicmap);
        this.discardHeightmap();
        return tile;
    }

    getCoords() {
        return {x: this.x, y: this.y};
    }
}

module.exports = WorldTile;