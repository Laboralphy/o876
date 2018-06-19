class CanvasHelper {
    /**
     * fabrique et renvoie un canvas
     * @param w {number} taille
     * @param h {number} taille
     * @return {HTMLCanvasElement}
     * @private
     */
    static create(w, h) {
        let c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        return c;
    }

    static clone(c, wZoom = 1, hZoom = 1) {
        let oCanvas = CanvasHelper.create(c.width * wZoom | 0, c.height * hZoom | 0);
        oCanvas.getContext('2d').drawImage(
            c,
            0,
            0,
            c.width,
            c.height,
            0,
            0,
            oCanvas.width,
            oCanvas.height
        );
        return oCanvas;
    }

    static draw(oDest, oSource, x, y) {
        if (oSource) {
			oDest.getContext('2d').drawImage(oSource, x, y);
        }
    }
}

module.exports = CanvasHelper;