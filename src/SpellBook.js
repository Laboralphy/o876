/**
 * Created by ralphy on 07/09/17.
 */

export default class SpellBook {
    /**
     * Turns an array-like-structure into an array (a real one)
     */
    static array(subject, bFast) {
        if (bFast) {
            return Array.prototype.slice.call(subject, 0);
        }
        const LENGTH_PROPERTY = 'length';
        if (Array.isArray(subject)) {
            return subject;
        }
        if (typeof subject === 'object') {
            let aKeys = Object
                .keys(subject)
                .filter(k => k !== LENGTH_PROPERTY);
            if (aKeys.some(k => isNaN(k))) {
                return false;
            }
            if ((LENGTH_PROPERTY in subject) && (subject[LENGTH_PROPERTY] !== aKeys.length)) {
                return false;
            }
            if (aKeys
                .map(k => parseInt(k))
                .sort((k1, k2) => k1 - k2)
                .every((k, i) => k === i)) {
                return aKeys.map(k => subject[k]);
            }
        }
        return false;
    }
}