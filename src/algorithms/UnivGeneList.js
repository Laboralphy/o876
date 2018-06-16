/**
 * A partir d'une liste de mots, cette classe peut générer de nouveaux mots ressemblant à ceux de la liste
 */
const Random = require('../Random');

class UnivGeneList {

    constructor() {
        this._random = new Random();
        this._registries = {};
        this._exclusions = [];
    }

    /**
     * Ajoute une lettre à la liste des lettres du pattern du registre spécifié
     * @param oRegistry
     * @param pattern
     * @param letter
     */
    pushLetter(oRegistry, pattern, letter) {
        if (!(pattern in oRegistry)) {
            oRegistry[pattern] = letter;
        } else {
            oRegistry[pattern] += letter;
        }
    }

    /**
     * Chargement d'une liste et indexation
     * @param aList {string[]}
     * @param n {number}
     * @return {*}
     */
    indexListProb(aList, n) {
        const ALPHA = ('abcdefghijklmnopqrstuvwxyz').split('');
        let oRegistry = {};
        aList.forEach(word => {
            word = word.replace(/[^a-z]+/g, '');
            if (word.length > n) {
                for (let i = 0; i < word.length - n; ++i) {
                    let letter = word.charAt(i + n);
                    let pattern = word.substr(i, n);
                    this.pushLetter(oRegistry, pattern, letter);
                }
            }
        });
        return oRegistry;
    }

    indexListInitial(aList, n) {
        return aList.map(word => word.substr(0, n))
    }

    indexListFinal(aList, n) {
        let oRegistry = {};
        aList.forEach(word => {
            this.pushLetter(oRegistry, word.substr(-n - 1, n), word.substr(-1));
        });
        return oRegistry;
    }

    indexList(aList, nPatternLength) {
        if (aList.length === 0) {
            throw new Error('nothing to index, the list is empty');
        }
        aList = aList.filter(word => !!word);
        this._registries = {
            initial: this.indexListInitial(aList, nPatternLength),
            prob: this.indexListProb(aList, nPatternLength),
            final: this.indexListFinal(aList, nPatternLength)
        };
    }

    hasBeenIndexed() {
        let regInitial = this._registries.initial;
        let regProb = this._registries.prob;
        let regFinal = this._registries.final;
        return regInitial && regProb && regFinal;
    }

    exclude(aList) {
        this._exclusions = this._exclusions.concat(aList);
    }

    generate(nLength, nPatternLength) {
        let random = this._random;
        let regInitial = this._registries.initial;
        let regProb = this._registries.prob;
        let regFinal = this._registries.final;
        if (!this.hasBeenIndexed()) {
            throw new Error('you must initialize registries by indexing a list');
        }
        let sPattern = this._random.randPick(regInitial);
        let sResult = sPattern;
        while (sResult.length < (nLength - 1)) {
            let p = regProb[sPattern] ? random.randPick(regProb[sPattern]) : '';
            if (p) {
                sResult += p;
                sPattern = sResult.substr(-nPatternLength);
            } else {
                return '';
            }
        }
        if (regFinal[sPattern]) {
            sResult += random.randPick(regFinal[sPattern]);
        } else if (regProb[sPattern]) {
            sResult += random.randPick(regProb[sPattern]);
        }
        if (this._exclusions.includes(sResult)) {
            return '';
        }
        return sResult;
    }
}

module.exports = UnivGeneList;