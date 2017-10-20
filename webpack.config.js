/**
 * Created by ralphy on 26/05/17.
 */
const path = require('path');

module.exports = {
    entry: {
        dist: path.resolve(__dirname, 'src/index.js'),
        test: path.resolve(__dirname, 'test/o876-test.js'),
	},
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'o876-[name].js',
        publicPath: "/dist/",
    },
    target: 'web'
};