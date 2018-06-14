const o876 = require('../../../src');
const fs = require('fs');

const univList = new o876.algorithms.UnivGeneList();
// chargement liste

function loadList() {
    let aList = fs
        .readFileSync('cities-fr.txt', {encoding: 'utf-8'}) // chargement
        .split('\n') // split en tableau
        .filter(word => !word.startsWith('saint')); // trop de noms commencent par "saint"
    univList.indexList(aList, 3);
    let aGM = fs
       .readFileSync('exclusion-fr.txt', {encoding: 'utf-8'})
       .split('\n');
    univList.exclude(aGM);
    univList.exclude(aList);
}

function main() {
    loadList();
    for (let i = 0; i < 2000; ++i) {
        let w = univList.generate(univList._random.rand(5, 10), 3);
        if (w) {
            console.log(w);
        }
    }
}

main();
