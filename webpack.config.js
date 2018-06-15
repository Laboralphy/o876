/**
 * Created by ralphy on 26/05/17.
 */
const path = require('path');

module.exports = {
    entry: {
        libo876: path.resolve(__dirname, 'src/index.js'),
        libo876web: path.resolve(__dirname, 'src/indexWeb.js'),
        'examples-treasure-map': path.resolve(__dirname, 'examples/treasure-map/main.js'),
        'examples-treasure-map-service': path.resolve(__dirname, 'examples/treasure-map/service.js'),
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
