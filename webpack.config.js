/**
 * Created by ralphy on 26/05/17.
 */
const path = require('path');

module.exports = {
    entry: {
        libo876: path.resolve(__dirname, 'src/index.js'),
        libo876web: path.resolve(__dirname, 'src/index-web.js')
	},
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: "/dist/",
    },
    mode: 'development',
	devtool: 'source-map',
	module: {
	},
    target: 'web'
};
