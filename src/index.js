const geometry = require('./geometry');
const algorithms = require('./algorithms');
const SpellBook = require('./SpellBook');
const Random = require('./Random');
const Rainbow = require('./Rainbow');
const Emitter = require('./Emitter');
const collider = require('./collider');
const structures = require('./structures');
const Cache2D = require('./structures/Cache2D');

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
	Emitter
};