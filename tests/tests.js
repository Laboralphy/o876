/*
#######  #####  #######  #####
#     # #     # #    #  #     #
#     # #     #     #   #
#     #  #####     #    ######
#     # #     #   #     #     #
#     # #     #   #     #     #
#######  #####    #      #####
*/


QUnit.module('O2');

QUnit.test('A simple class', function(assert) {
	assert.ok(O2, 'O2 is loaded');

	O2.createClass('TEST.Class1', {
		prop1: 100,
		prop2: 200,
		meth1: function() {
			return this.prop1 + this.prop2;
		}
	});

	assert.ok(TEST.Class1, 'Class1 has been created');
	assert.equal(TEST.Class1, O2._loadObject('TEST.Class1'), 'loadObjet is working');
	assert.equal(typeof TEST.Class1, 'function', 'Class1 is a function');
	assert.ok('prop1' in TEST.Class1.prototype, 'prop1 is defined in Class1 prototype');
	assert.ok('prop2' in TEST.Class1.prototype, 'prop2 is defined in Class1 prototype');
	assert.ok('meth1' in TEST.Class1.prototype, 'meth1 is defined in Class1 prototype');

	var m = new TEST.Class1();
	assert.ok(m, 'Class1 has been instanciated');
	assert.equal(typeof m, 'object', 'Instance of class is an object');
	assert.equal(m.meth1(), 300, 'meth1 returns 300');
	TEST = {};
});

QUnit.test('Inheritance', function(assert) {

	O2.createClass('TEST.Class1', {
		prop1: 100,
		prop2: 200,
		meth1: function() {
			return this.prop1 + this.prop2;
		}
	});

	O2.extendClass('TEST.Class1Ext', TEST.Class1, {
		prop3: 333,
		meth1: function() {
			return __inherited() + this.prop3;
		}
	});

	assert.ok(TEST.Class1Ext, 'Class1Ext has been created');
	assert.equal(typeof TEST.Class1Ext, 'function', 'Class1Ext is a function');
	assert.ok('prop1' in TEST.Class1Ext.prototype, 'prop1 is defined in Class1Ext prototype');
	assert.ok('prop2' in TEST.Class1Ext.prototype, 'prop2 is defined in Class1Ext prototype');
	assert.ok('prop3' in TEST.Class1Ext.prototype, 'prop3 is defined in Class1Ext prototype');
	assert.ok('meth1' in TEST.Class1Ext.prototype, 'meth1 is defined in Class1Ext prototype');

	var m = new TEST.Class1Ext();
	assert.ok(m, 'Class1Ext has been instanciated');
	assert.equal(typeof m, 'object', 'Instance of class is an object');
	assert.equal(m.meth1(), 633, 'meth1 returns 633');
	TEST = {};
});


/*
 #    #     #    #    #     #    #    #
 ##  ##     #     #  #      #    ##   #
 # ## #     #      ##       #    # #  #
 #    #     #      ##       #    #  # #
 #    #     #     #  #      #    #   ##
 #    #     #    #    #     #    #    #
*/

QUnit.test('Mixins', function(assert) {
	O2.createClass('TEST.Class1', {
		prop1: 100,
		prop2: 200,
		meth1: function() {
			return this.prop1 + this.prop2;
		}
	});

	O2.mixin('TEST.Class1', {
		mult: function(a, b) {
			return a * b;
		}
	});

	assert.ok(TEST.Class1, 'Class1 has been created');
	assert.equal(typeof TEST.Class1, 'function', 'Class1 is a function');
	assert.ok('prop1' in TEST.Class1.prototype, 'prop1 is defined in Class1 prototype');
	assert.ok('prop2' in TEST.Class1.prototype, 'prop2 is defined in Class1 prototype');
	assert.ok('meth1' in TEST.Class1.prototype, 'meth1 is defined in Class1 prototype');
	assert.ok('mult' in TEST.Class1.prototype, 'mult is defined in Class1 prototype');

	var m = new TEST.Class1();
	assert.ok(m, 'Class1 has been instanciated');
	assert.equal(typeof m, 'object', 'Instance of class is an object');
	assert.equal(m.meth1(), 300, 'meth1 returns 300');
	assert.equal(m.mult(4, 5), 20, 'mutl returns 20');
	TEST = {};
});


/*
 #####     ##     #####    ##
 #    #   #  #      #     #  #
 #    #  #    #     #    #    #
 #    #  ######     #    ######
 #    #  #    #     #    #    #
 #####   #    #     #    #    #
*/

QUnit.test('Data', function(assert) {
	O2.createClass('TEST.Class1', {
		prop1: 100,
		prop2: 200,
		meth1: function() {
			return this.prop1 + this.prop2;
		}
	});

	O2.mixin('TEST.Class1', O876.Mixin.Data);

	var m = new TEST.Class1();
	assert.ok(m, 'Class1 has been instanciated');
	assert.equal(typeof m, 'object', 'Instance of class is an object');
	assert.deepEqual(m.data(), {}, 'Data container in empty');
	m.data('xxx', 123);
	assert.deepEqual(m.data(), {xxx: 123}, 'getting all data with xxx 123');
	assert.equal(m.data('xxx'), 123, 'getting xxx 123');
	m.data('a', 'aaa').data('b', 'ttt');
	assert.equal(m.data('a'), "aaa", 'getting a key');
	assert.equal(m.data('b'), "ttt", 'getting b key');
	assert.strictEqual(m.data('c'), null, 'getting b key');

	TEST = {};
});




/*
 ######  #    #  ######  #    #   #####   ####
 #       #    #  #       ##   #     #    #
 #####   #    #  #####   # #  #     #     ####
 #       #    #  #       #  # #     #         #
 #        #  #   #       #   ##     #    #    #
 ######    ##    ######  #    #     #     ####
*/

QUnit.module('Mixin EventHandler');

QUnit.test('basic working', function(assert) {
	O2.createClass('TEST.Class1', {
		prop1: 100,
		prop2: 200,
		meth1: function() {
			var r = this.prop1 + this.prop2;
			this.trigger('returning', {r: r});
			return r;
		}
	});

	O2.mixin(TEST.Class1, O876.Mixin.Events);

	assert.ok('on' in TEST.Class1.prototype, 'new function on');
	assert.ok('off' in TEST.Class1.prototype, 'new function off');
	assert.ok('trigger' in TEST.Class1.prototype, 'new function trigger');

	var m = new TEST.Class1();
	var x = 0;
	m.on('returning', function(data) {
		x = data.r;
	});
	m.meth1();
	assert.equal(x, 300, 'event has been triggered');

	var Aaa = [];
	var Bbb = [];

	m.on('returning', function(data) {
		Aaa.push(data.r);
	});

	m.one('returning', function(data) {
		Bbb.push(data.r);
	});

	m.meth1();
	m.meth1();
	m.meth1();
	m.meth1();

	assert.deepEqual(Aaa, [300, 300, 300, 300], 'event has been triggered 4 time');
	assert.deepEqual(Bbb, [300], 'event has been triggered only once');


	TEST = {};
});










/*
 #####   #####   ######   ####   ######  #    #  #    #    ##    #    #
 #    #  #    #  #       #       #       ##   #  #    #   #  #   ##  ##
 #####   #    #  #####    ####   #####   # #  #  ######  #    #  # ## #
 #    #  #####   #            #  #       #  # #  #    #  ######  #    #
 #    #  #   #   #       #    #  #       #   ##  #    #  #    #  #    #
 #####   #    #  ######   ####   ######  #    #  #    #  #    #  #    #
*/



QUnit.module('Bresenham');

QUnit.test('basic lining', function(assert) {
	var b = new O876.Bresenham();
	var aList = [];
	b.line(10, 10, 15, 12, function(x, y) {
		aList.push(x + ';' + y);
	});
	assert.equal(aList.join('-'), '10;10-11;10-12;11-13;11-14;12-15;12', 'good job lining');
	assert.ok(b.line(10, 10, 15, 12));
});






/*
 #####     ##       #    #    #  #####    ####   #    #
 #    #   #  #      #    ##   #  #    #  #    #  #    #
 #    #  #    #     #    # #  #  #####   #    #  #    #
 #####   ######     #    #  # #  #    #  #    #  # ## #
 #   #   #    #     #    #   ##  #    #  #    #  ##  ##
 #    #  #    #     #    #    #  #####    ####   #    #
*/

QUnit.module('Rainbow');

QUnit.test('parse', function(assert) {
	var r = new O876.Rainbow();
	assert.deepEqual(r.parse('741'), {r: 0x77, g: 0x44, b: 0x11}, 'color testing');
	assert.deepEqual(r.parse('774411'), {r: 0x77, g: 0x44, b: 0x11}, 'color testing');
	assert.deepEqual(r.parse('#741'), {r: 0x77, g: 0x44, b: 0x11}, 'color testing');
	assert.deepEqual(r.parse('#774411'), {r: 0x77, g: 0x44, b: 0x11}, 'color testing');
	assert.deepEqual(r.parse('rgb(119,68, 17)'), {r: 0x77, g: 0x44, b: 0x11}, 'color testing');
	assert.deepEqual(r.parse('rgba(119,68, 17, 0.777)'), {r: 0x77, g: 0x44, b: 0x11, a:0.777}, 'color testing');
});

QUnit.test('rbga', function(assert) {
	var r = new O876.Rainbow();
	assert.equal(r.rgba('#FFF'), 'rgb(255, 255, 255)');
});

QUnit.test('spectrum', function(assert) {
	var r = new O876.Rainbow();
	var a = r.spectrum('#F41', '#8A5', 4);
	assert.equal(a.length, 4);
});


/*
 ######    ##     ####      #    #    #   ####
 #        #  #   #          #    ##   #  #    #
 #####   #    #   ####      #    # #  #  #
 #       ######       #     #    #  # #  #  ###
 #       #    #  #    #     #    #   ##  #    #
 ######  #    #   ####      #    #    #   ####
*/

QUnit.module('Easing');

QUnit.test('setMove', function(assert) {
	var e = new O876.Easing();
	e.from(4).to(17).during(10);
	assert.equal(e.x, 4, 'the starting value is 4');
	assert.equal(e.xStart, 4, 'the starting value is 4');
	assert.equal(e.xEnd, 17, 'the ending value is 17');
	assert.equal(e.nTime, 10, 'the max time value is 10');
	assert.equal(e.iTime, 0, 'the index time value is 0');
});

QUnit.test('setFunction', function(assert) {
	var e = new O876.Easing();
	e.from(4).to(17).during(10).use(function(v) {
		return v * 2; 
	});
	assert.equal(e.x, 4, 'the starting value is 4');
	assert.equal(e.xStart, 4, 'the starting value is 4');
	assert.equal(e.xEnd, 17, 'the ending value is 17');
	assert.equal(e.nTime, 10, 'the max time value is 10');
	assert.equal(e.iTime, 0, 'the index time value is 0');
	e.f();
	assert.equal(e.x * 10 | 0, 66, 'advancing t1');
	e.f();
	assert.equal(e.x * 10 | 0, 92, 'advancing t1');
	e.f();
	assert.equal(e.x * 10 | 0, 117, 'advancing t1');
	e.f();
	assert.equal(e.x * 10 | 0, 144, 'advancing t1');
	e.f();
	assert.equal(e.x * 10 | 0, 170, 'advancing t1');
});




/*
   ##     ####    #####    ##    #####
  #  #   #          #     #  #   #    #
 #    #   ####      #    #    #  #    #
 ######       #     #    ######  #####
 #    #  #    #     #    #    #  #   #
 #    #   ####      #    #    #  #    #
*/


QUnit.module('Astar');

QUnit.test('find', function(assert) {
	var ast = new O876.Astar.Grid();

	var aGrid = ([
		'*******',
		'*     *',
		'* *** *',
		'*    **',
		'*******'
	]).map(function(w) {
		return w.split('');
	});

	ast.init({
		grid: aGrid,
		diagonals: false,
		walkable: ' ',
	});
	var aMoves = ast.find(4, 3, 4, 3);
	assert.deepEqual(aMoves, [], 'no move');

	aMoves = ast.find(4, 3, 3, 3);
	assert.deepEqual(aMoves, [{x: 3, y: 3}], 'small move');

	aMoves = ast.find(4, 3, 1, 3);
	assert.deepEqual(aMoves, [
		{x: 3, y: 3},
		{x: 2, y: 3},
		{x: 1, y: 3},
	], '3 step move');

	aMoves = ast.find(4, 3, 1, 1);
	assert.deepEqual(aMoves, [
		{x: 3, y: 3},
		{x: 2, y: 3},
		{x: 1, y: 3},
		{x: 1, y: 2},
		{x: 1, y: 1},
	], '5 or 6 step move');

	aMoves = ast.find(4, 3, 5, 1);
	assert.deepEqual(aMoves, [
		{x: 3, y: 3},
		{x: 2, y: 3},
		{x: 1, y: 3},
		{x: 1, y: 2},
		{x: 1, y: 1},
		{x: 2, y: 1},
		{x: 3, y: 1},
		{x: 4, y: 1},
		{x: 5, y: 1},
	], 'lot of move');

	aMoves = ast.find(4, 3, 5, 2);
	assert.deepEqual(aMoves, [
		{x: 3, y: 3},
		{x: 2, y: 3},
		{x: 1, y: 3},
		{x: 1, y: 2},
		{x: 1, y: 1},
		{x: 2, y: 1},
		{x: 3, y: 1},
		{x: 4, y: 1},
		{x: 5, y: 1},
		{x: 5, y: 2},
	], 'complete move');

	aMoves = ast.find(4, 3, 5, 2);
	assert.deepEqual(aMoves, [
		{x: 3, y: 3},
		{x: 2, y: 3},
		{x: 1, y: 3},
		{x: 1, y: 2},
		{x: 1, y: 1},
		{x: 2, y: 1},
		{x: 3, y: 1},
		{x: 4, y: 1},
		{x: 5, y: 1},
		{x: 5, y: 2},
	], 'complete move second pass');

	ast.init({
		diagonals: true
	});
	ast.cell(4, 3, '*');
	aMoves = ast.find(3, 3, 5, 2);
	assert.deepEqual(aMoves, [
		{x: 2, y: 3},
		{x: 1, y: 2},
		{x: 2, y: 1},
		{x: 3, y: 1},
		{x: 4, y: 1},
		{x: 5, y: 2},
	], 'complete move with diagonals');


});



/*
   ##         #    ##    #    #
  #  #        #   #  #    #  #
 #    #       #  #    #    ##
 ######       #  ######    ##
 #    #  #    #  #    #   #  #
 #    #   ####   #    #  #    #
*/

QUnit.module('XHR');

QUnit.test('getInstance', function(assert) {
	var xhr = new O876.XHR();
	var a = xhr.getInstance();
	var b = xhr.getInstance();
	assert.equal(a, b, 'should be same instance');
});

QUnit.test('get', function(assert) {
	var xhr = new O876.XHR();
	var done = assert.async(3);
	xhr.get('tests.js', function(data, err) {
		assert.ok(data.length > 0, 'there should be data');
		done();
	});
	xhr.get('tests.js', function(data, err) {
		assert.ok(data.length > 0, 'there should be data');
		done();
	});
	xhr.get('index.html', function(data, err) {
		assert.ok(data.length > 0, 'there should be data');
		done();
	});
});







/****** PARSE SEARCH ****** PARSE SEARCH ****** PARSE SEARCH ******/
/****** PARSE SEARCH ****** PARSE SEARCH ****** PARSE SEARCH ******/
/****** PARSE SEARCH ****** PARSE SEARCH ****** PARSE SEARCH ******/
/****** PARSE SEARCH ****** PARSE SEARCH ****** PARSE SEARCH ******/
/****** PARSE SEARCH ****** PARSE SEARCH ****** PARSE SEARCH ******/
/****** PARSE SEARCH ****** PARSE SEARCH ****** PARSE SEARCH ******/


QUnit.module('Misc tools');
QUnit.test('parseSearch', function(assert) {
	var oSearch = O876.parseSearch('?var1=zer+rez&var8=888&iable=%2F333%2F');
	assert.equal(typeof oSearch, 'object', "oSearch is an object");
	assert.ok('var1' in oSearch, 'var1 is present');
	assert.ok('var8' in oSearch, 'var8 is present');
	assert.ok('iable' in oSearch, 'iable is present');
	assert.equal(oSearch.var1, 'zer rez', 'value of var1 has a space');
	assert.equal(oSearch.var8 | 0, 888, 'value of var8 is a number');
	assert.equal(oSearch.iable, '/333/', 'value of iable contains slashes');
});

/****** typeMap ****** typeMap ****** typeMap ****** typeMap ******/
/****** typeMap ****** typeMap ****** typeMap ****** typeMap ******/
/****** typeMap ****** typeMap ****** typeMap ****** typeMap ******/
/****** typeMap ****** typeMap ****** typeMap ****** typeMap ******/
/****** typeMap ****** typeMap ****** typeMap ****** typeMap ******/
/****** typeMap ****** typeMap ****** typeMap ****** typeMap ******/


QUnit.test('typeMap', function(assert) {
	function tmTest() {
		return O876.typeMap(arguments);
	}
	function tmTestShort() {
		return O876.typeMap(arguments, 'short');
	}
	assert.deepEqual(tmTest(2, 'ABC', null, undefined, false, [1,2,3], {}, function() {}), ['number', 'string', 'undefined', 'undefined', 'boolean', 'array', 'object', 'function']);
	assert.deepEqual(tmTestShort(2, 'ABC', null, undefined, false, [1,2,3], {}, function() {}), 'nsuubaof');
	assert.deepEqual(tmTest(), []);
	assert.deepEqual(tmTestShort(), '');
	assert.deepEqual(tmTest(null), ['undefined']);
	assert.deepEqual(tmTestShort(null), 'u');
});



/*
 #    #  ######  #####      #      ##     #####   ####   #####
 ##  ##  #       #    #     #     #  #      #    #    #  #    #
 # ## #  #####   #    #     #    #    #     #    #    #  #    #
 #    #  #       #    #     #    ######     #    #    #  #####
 #    #  #       #    #     #    #    #     #    #    #  #   #
 #    #  ######  #####      #    #    #     #     ####   #    #
*/

QUnit.module('Mediator');
QUnit.test('basic', function(assert) {
	O2.extendClass('CustomPlugin', O876.Mediator.Plugin, {
		_NAME: 'CustomPlugin1',
		sLog: '',
		
		init: function() {
			this.register('testSig1');
			this.register('testSig2');
		},
		
		testSig1: function(x) {
			this.sLog += '(sig1-' + x + ')';
		},

		testSig2: function(x) {
			this.sLog += '(sig2-' + x + ')';
		}
	});
	O2.extendClass('CustomPlugin2', O876.Mediator.Plugin, {
		_NAME: 'CustomPlugin2',
		sLog: '',
		
		init: function() {
			this.register('testSig1');
		},
		
		testSig1: function(x) {
			this.sLog += '(sig1-' + x + ')';
		}
	});
	
	var oMediator = new O876.Mediator.Mediator();
	var p = new CustomPlugin();
	var p2 = new CustomPlugin2();
	oMediator.addPlugin(p);
	oMediator.addPlugin(p2);
	assert.equal(p.sLog, '');
	oMediator.sendPluginSignal('testSig1', 'abc');
	oMediator.sendPluginSignal('testSig2', 'def');
	assert.equal(p.sLog, '(sig1-abc)(sig2-def)');
	assert.equal(p2.sLog, '(sig1-abc)');
	p2.sendSignal('testSig2', 'xxx');
	assert.equal(p.sLog, '(sig1-abc)(sig2-def)(sig2-xxx)');
	assert.equal(p2.sLog, '(sig1-abc)');
});



QUnit.module('Philter');

QUnit.test('config init', function(assert) {
	var oPhilter = new O876.Philter();
	assert.equal(oPhilter.config('command'), '', 'no command defined');
	assert.equal(oPhilter.config('radius'), 1, 'no command defined');
	assert.equal(oPhilter.config('red'), true, 'by default red channel is true');
	assert.equal(oPhilter.config('green'), true, 'by default green channel is true');
	assert.equal(oPhilter.config('blue'), true, 'by default blue channel is true');

	oPhilter.init('sharpen');
	assert.equal(oPhilter.config('command'), 'sharpen', 'command sharpen specified');

	oPhilter.init('blur', {
		radius: 3,
		channels: 'gba'
	});
	assert.equal(oPhilter.config('command'), 'blur', 'blur is the new sharpen');
	assert.equal(oPhilter.config('radius'), 3, 'radius is set to 3');
	assert.equal(oPhilter.config('red'), false, 'red shut down');
	assert.equal(oPhilter.config('green'), true, 'by default green channel is true');
	assert.equal(oPhilter.config('blue'), true, 'by default blue channel is true');

	oPhilter.init({
		radius: 6,
		channels: 'rba'
	});
	assert.equal(oPhilter.config('radius'), 6, 'radius has changed');
	assert.equal(oPhilter.config('red'), true, 'red is true again');
	assert.equal(oPhilter.config('green'), false, 'green is false');
	assert.equal(oPhilter.config('blue'), true, 'by default blue channel is true');
});

QUnit.test('buildShadowCanvas', function(assert) {
	var oCanvas = document.createElement('canvas');
	oCanvas.width = 64;
	oCanvas.width = 128;
	var oPhilter = new O876.Philter();
	var sc = oPhilter.buildShadowCanvas(oCanvas);
	assert.equal(sc.canvas, oCanvas);
	assert.equal(sc.context, oCanvas.getContext("2d"));
	assert.equal(sc.width, oCanvas.width);
	assert.equal(sc.height, oCanvas.height);
	assert.ok(sc.imageData);
	assert.ok(sc.pixelData);
	assert.ok(sc.pixels);
	assert.ok(!sc._p);

});
