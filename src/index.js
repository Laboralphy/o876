const geometry = require('./geometry');
const algorithms = require('./algorithms');
const collider = require('./collider');
const structures = require('./structures');

const SpellBook = require('./SpellBook');
const Random = require('./Random');
const Rainbow = require('./Rainbow');
const Emitter = require('./Emitter');
const ArrayHelper = require('./ArrayHelper');
const PixelProcessor = require('./PixelProcessor');

module.exports = {

	// namespaces
	algorithms,
	collider,
	geometry,
	structures,

	// classes
	SpellBook,
	Random,
	Rainbow,
	Emitter,
	ArrayHelper,
	PixelProcessor
};