const o876 = require('../../src/index');
const fs = require('fs');

const nameCrafter = new o876.algorithms.NameCrafter();
// chargement liste


function buildGenerator(sFileList) {
	let aList = fs
		.readFileSync('city-fr.txt', {encoding: 'utf-8'}) // chargement
		.split('\n'); // split en tableau
	nameCrafter.indexList(aList, 3);
	return nameCrafter;
}

function upperCaseFirst(word) {
    return word.slice(0, 1).toUpperCase() + word.slice(1);
}

function main() {
	const cityNameGenerator = buildGenerator('./city-fr.txt');
	const maleNameGenerator = buildGenerator('./name-mal-fr.txt');
	const femaleNameGenerator = buildGenerator('./name-fem-fr.txt');
    for (let i = 0; i < 20; ++i) {
		let boy = upperCaseFirst(maleNameGenerator.generate(Math.random() * 5 + 3 | 0, 3));
		let girl = upperCaseFirst(femaleNameGenerator.generate(Math.random() * 5 + 3 | 0, 3));
		let city = upperCaseFirst(cityNameGenerator.generate(Math.random() * 5 + 5 | 0, 3));
		if (boy && girl && city) {
		    console.log(boy, 'et', girl, 'vivent dans la ville de "' + city + '"');
        }
    }
}

main();
