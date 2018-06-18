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

    static clone(c) {
        let oCanvas = CanvasHelper.create(c.width, c.height);
        oCanvas.getContext('2d').drawImage(c, 0, 0);
    }

    static draw(oDest, oSource, x, y) {
        if (oSource) {
			oDest.getContext('2d').drawImage(oSource, x, y);
        }
    }
}

module.exports = CanvasHelper;