/**
 * Created by ralphy on 12/09/17.
 */
const fs = require('fs');
const path = require('path');

async function fstat(sPath) {
    return new Promise(function(resolve) {
        fs.stat(sPath, function(err, stats) {
            if (err) {
                throw err;
            } else {
                resolve(stats);
            }
        });
    });
}

async function readdir(sPath) {
    return new Promise(function(resolve) {
        fs.readdir(sPath, function(err, res) {
            if (err) {
                throw err;
            } else {
                resolve(res);
            }
        });
    });
}

async function readfile(sInputFile, xOptions) {
    return new Promise(function(resolve) {
        fs.readFile(sInputFile, xOptions, function(err, res) {
            if (err) {
                throw err;
            } else {
                resolve(res);
            }
        });
    });
}

async function writefile(sOutputFile, sContent, xOptions) {
    return new Promise(function(resolve) {
        fs.writeFile(sOutputFile, sContent, xOptions, function(err, res) {
            if (err) {
                throw err;
            } else {
                resolve(res);
            }
        });
    });
}

/**
 * Recherche tous les fichiers du répertoire spécifié, organise
 * créé une liste d'entrée avec les champs : {
 * 		file:
 * 		path:
 * }
 */
async function cursedSearch(sPath, sSubPath) {
    if (sSubPath === undefined) {
        sSubPath = '';
    }
    let sTotalPath = path.join(sPath, sSubPath);
    return new Promise(async function(resolve) {
        let a = [];
        let aDir = await readdir(sTotalPath);
        for (let i = 0, l = aDir.length; i < l; ++i) {
            let sFile = aDir[i];
            let sCompFile = path.join(sTotalPath, sFile);
            let oStat = await fstat(sCompFile);
            if (oStat.isDirectory()) {
                let aSub = await cursedSearch(sPath, path.join(sSubPath, sFile));
                a = a.concat(aSub);
            } else if (oStat.isFile()) {
                a.push(path.join(sSubPath, sFile));
            }
        }
        resolve(a);
    });
}

function convertLine(sLine) {
    return sLine
        .replace(
            /import ([_0-9A-Za-z]+) from ([^;]+);?/,
            'const $1 = require($2);'
        )
        .replace(
            /^\s*export default /,
            'module.exports = '
        )
}

function convertSource(aSource) {
    return aSource.map(this.convertLine);
}

async function convertFile(sInputFile, sOutputFile) {
    return new Promise(async function(resolve) {
        let sContent = await readfile(sInputFile, 'utf8');
        let sNewContent = convertSource(sContent.split('\n')).join('\n');
        writefile(sOutputFile, sNewContent, 'utf8', resolve);
    });
}

function convertDirectory(sDirectory, sOutput) {
    cursedSearch(sDirectory).then(x => console.log(x));
}

//cursedSearch('./src').then(x => console.log(x));