

#Astar

Astar is a path finder system dedicated to two-dimensional arrays of cells.
This is an implementation of the A-* alogrithm which is fast and non-recursive preventing games from stack overflowing.
This system is useful in games containing orthogonal maps with walkable and non-walkable cells. On such maps, the system will be able to find shortest paths between two cells by crossing only walkable cells.
Famous games using 2D path finding are usually strategy games : 
 - Dune 2 : The building of a dynasty 
 - M.A.X : Mechanize Assault and Exploration
 - Heroes of might and Magic serie.
These games typically use path finding to move units over great distances. In the case of Heroes of might and magic, the terrain nature influences the unit movement cost. This too can be managed by the Astar system. 

Example of How to find the shortest path between the cell (4, 3) and the cell (1, 3) in a 6x6 grid. 

var ast = new O876.Astar.Grid(); // instanciation
var aGrid = ([ // grid definition 
	'*******',  // " " (space) cells are walkable
	'*     *',  // "*" cells are not walkable
	'* *** *',
	'*    **',
	'*******'
]).map(function(w) {
	return w.split('');
});

ast.init({ // configuration
	grid: aGrid, // the grid
	diagonals: false, // will diaginal movement be allowed ?
	walkable: ' ', // what is the "walkable" code ?
});

var aMoves = ast.find(4, 3, 1, 3);

// aMoves will be : 
[
	{x: 3, y: 3},
	{x: 2, y: 3},
	{x: 1, y: 3}
]

##Events
The system fires events and usualy expect return values. This allow path finding customization.

Event : distance
This event is fired every time the system needs to get the distance between two cells. 
If no listener is defined, and standar linear distance is computed.
If a listener is defined, an pre-filled object is passed to it.
Here is the object format :
{
	from: {x: x1, y: y1}, // coordinates of the first cell
	to: {x: x2, y: y2}, // coordinates of the second cell
	distance : float // the computed distance between the two cell will go there. A standard linear distance is computed first. The listener is free to rewrite this distance.
}
The listener is expected to compute a distance between cell "from" (x1, y1) and cell "to" (x2, y2). It must write the value into the "distance" element of the given object. It can use the default value of "distance" adjust it, and overwrite it as it see fit.


Event : walkable
This event is fired every time the system needs to know if a cell is walkable. This is usefull when cells have a dynamic "walkable" state that can change over time. Or if the cell walkable state depends on a global or local state or any other complex condition.
If no listener are defined a simple value comparison will determine the walkable state. The "walkable" element of the plain object specified during "init()" method call will be used to determine if cells are walkable or not.
If a listener is defined, the walkable state will first be determined (as if no listener were defined) then the listener are invoked with a plain object as parameter. This objet will have this format :
{
	walkable: boolean,
	cell: {
		x: x, // coordinates of the cell 
		y: y
	}
}
The listener is expected to overwrite the "walkable" element of this plain object. If true is set, the cell will be considered as walkable, else, it will be considered as not walkable.




#Breseham

A simple class implementing the Bresenham algorithm with is historically used to draw lines of pixels on screen. This algorithm may have other uses 