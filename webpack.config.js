/**
 * Created by ralphy on 26/05/17.
 */
const path = require('path');

const webConfig = {
	entry: {
		libo876: path.resolve(__dirname, 'src/index.js'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
	},
	mode: 'development',
	devtool: 'source-map',
	target: 'web'
};

module.exports = webConfig;
