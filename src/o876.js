/**
 * includes all modules
 */

import Point from './Geometry/Point';
import Vector from './Geometry/Vector';

import Astar from './Algorithms/Astar/Astar';
import Bresenham from './Algorithms/Bresenham';
import Easing from './Algorithms/Easing';
import SquareSpiral from './Algorithms/SquareSpiral';
import Perlin from './Algorithms/Perlin';

import Rainbow from './Rainbow';
import SpellBook from './SpellBook';
import Emitter from './Emitter';
import Random from './Random';

export default {

	// Geometry
	Point,
	Vector,

	// Algorithms
    Astar,
    Bresenham,
    Easing,
	Perlin,
	SquareSpiral,

	// Tools
    Emitter,
    Rainbow,
    Random,
    SpellBook,
}