const SpellBook = require('./SpellBook');
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

    static draw(oDestCvs, ...args) {
        let ctx, aArgs = [...args];
        switch (SpellBook.typeMap(aArgs)) {
            case 'onn':
            case 'onnnnnn':
            case 'onnnnnnnn':
                oDestCvs.getContext('2d').drawImage(...args);
                break;

            case 'onnn':
            case 'onnnnnnn':
            case 'onnnnnnnnn':
                let ctx = oDestCvs.getContext('2d');
                let globAlpha = ctx.globalAlpha;
                ctx.globalAlpha = aArgs[1];
                ctx.drawImage(...args);
                ctx.globalAlpha = globAlpha;
                break;

            default:
                throw new Error('could not do anything with this parameters');
        }
    }
}

export default CanvasHelper;