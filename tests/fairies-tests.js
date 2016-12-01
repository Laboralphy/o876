/*
 #    #  ######   ####    #####   ####   #####
 #    #  #       #    #     #    #    #  #    #
 #    #  #####   #          #    #    #  #    #
 #    #  #       #          #    #    #  #####
  #  #   #       #    #     #    #    #  #   #
   ##    ######   ####      #     ####   #    #
 */

QUnit.module('Vector');

QUnit.test('Basic', function(assert) {
	var v = new Fairy.Vector();
	assert.ok('x' in Fairy.Vector.prototype, 'mixin property worked');
	assert.ok('x' in v, 'mixin property are in instances');
	assert.equal(v.x, 0);
	assert.equal(v.y, 0);
	v.set(10, 20);
	assert.equal(v.x, 10);
	assert.equal(v.y, 20);
	var v2 = new Fairy.Vector(v);
	assert.equal(v.x, 10);
	assert.equal(v.y, 20);
	assert.notEqual(v, v2);
});


QUnit.test('Operations', function(assert) {
	var v1 = new Fairy.Vector(10, 20);
	var v2 = new Fairy.Vector(100, 200);
	
	var v0 = v1.clone();
	
	v1.trans(v2);
	assert.equal(v1.x, 110);
	assert.equal(v1.y, 220);
	
	v1.set(v0);
	v1.scale(2);
	assert.equal(v1.x, 20);
	assert.equal(v1.y, 40);
	
	v1.set(v0);
	v1.scale(1/2);
	assert.equal(v1.x, 5);
	assert.equal(v1.y, 10);
	
	v1.set(v0);
	v1.trans(v2.clone().scale(-1));
	assert.equal(v1.x, -90);
	assert.equal(v1.y, -180);
	
	
	assert.equal(v1.set(1, 0).norm(), 1);
	assert.equal(v1.set(0, 1).norm(), 1);

	assert.equal(v1.set(1000, 1000).norm() | 0, Math.sqrt(2) * 1000 | 0);
	
});

/*
                                           #
  ####   #    #    ##    #####   ######   # #    #####   ######   ####    #####
 #       #    #   #  #   #    #  #         #     #    #  #       #    #     #
  ####   ######  #    #  #    #  #####           #    #  #####   #          #
      #  #    #  ######  #####   #         #     #####   #       #          #
 #    #  #    #  #    #  #       #        # #    #   #   #       #    #     #
  ####   #    #  #    #  #       ######    #     #    #  ######   ####      #
*/

QUnit.module('Rect');

QUnit.test('Collisions', function(assert) {
	var s1 = new Fairy.Rect();
	var s2 = new Fairy.Rect();

	assert.equal(s1.p1().x, 0);
	assert.equal(s1.p2().y, 0);
	assert.equal(s2.p2().x, 0);
	assert.equal(s2.p2().y, 0);

	s1
		.flight(new Fairy.Flight())
		.p1(new Fairy.Vector(10, 100))
		.p2(new Fairy.Vector(20, 150));
	s2
		.flight(new Fairy.Flight())
		.p1(new Fairy.Vector(10, 110))
		.p2(new Fairy.Vector(20, 120));

	assert.equal(s1._p1.x, 10, 'initial x pos'); 
	assert.ok(s1.hits(s2));

	var vMove = new Fairy.Vector(-5, -5);

	s1.flight().move(vMove);
	assert.equal(s1.points()[0].x, 5, 'after 1 move'); 
	assert.ok(s1.hits(s2), 'still colliding after 1 move');

	s1.flight().move(vMove);
	assert.equal(s1.points()[0].x, 0, 'after 2 moves'); 
	assert.ok(!s1.hits(s2), 'not colliding after 2 moves');

	s1.flight().move(vMove);
	assert.equal(s1.points()[0].x, -5, 'after 3 moves'); 
	assert.ok(!s1.hits(s2), 'not colliding after 3 moves');

	s1.flight().move(vMove);
	assert.equal(s1.points()[0].x, -10, 'after 4 moves'); 
	assert.ok(!s1.hits(s2), 'not colliding after 4 moves');

	s1.flight().move(vMove);
	assert.equal(s1.points()[0].x, -15, 'after 5 moves'); 
	assert.ok(!s1.hits(s2), 'no more colliding after 5 moves');

});




/*

 #    #   ####   #####      #    #       ######
 ##  ##  #    #  #    #     #    #       #
 # ## #  #    #  #####      #    #       #####
 #    #  #    #  #    #     #    #       #
 #    #  #    #  #    #     #    #       #
 #    #   ####   #####      #    ######  ######
*/

QUnit.module('Mobile');

QUnit.test('sub object assign', function(assert) {
	var m = new Fairy.Mobile();
	assert.equal(m.flight(), null);
	assert.equal(m.shape(), null);
	assert.equal(m.sprite(), null);

	var s = new Fairy.Rect();
	var f = new Fairy.Flight();

	m.flight(f);
	m.shape(s);
	assert.equal(m.flight(), f, 'flight is properly initiated');
	assert.equal(m.shape(), s, 'shape is properly initiated');
	assert.equal(m.shape().flight(), f, 'flight is accessible through shape');
});








/*
  ####   ######   ####    #####   ####   #####
 #       #       #    #     #    #    #  #    #
  ####   #####   #          #    #    #  #    #
      #  #       #          #    #    #  #####
 #    #  #       #    #     #    #    #  #   #
  ####   ######   ####      #     ####   #    #
*/


QUnit.module('Sector');

QUnit.test('Count get add remove', function(assert) {
	var c = new Fairy.Sector();
	var s1 = new Fairy.Mobile();

	assert.equal(c.count(), 0, 'no object');

	s1
		.shape(new Fairy.Rect())
		.flight(new Fairy.Flight())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10))
		.flight().move(new Fairy.Vector(0, 0));
	c.add(s1);

	assert.equal(c.count(), 1);
	assert.equal(c.get(0), s1);

	var s2 = new Fairy.Mobile();
	s2
		.shape(new Fairy.Rect())
		.flight(new Fairy.Flight())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10))
		.flight().move(new Fairy.Vector(5, 9));
	c.add(s2);

	assert.equal(c.count(), 2);
	assert.equal(c.get(1), s2);

	var s3 = new Fairy.Mobile();
	s3
		.shape(new Fairy.Rect())
		.flight(new Fairy.Flight())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10))
		.flight().move(new Fairy.Vector(100, 100));
	c.add(s3);

	assert.equal(c.count(), 3);
	assert.equal(c.get(2), s3);

	var s4 = new Fairy.Mobile();
	s4
		.shape(new Fairy.Rect())
		.flight(new Fairy.Flight())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10))
		.flight().move(new Fairy.Vector(105, 109));
	c.add(s4);

	assert.equal(c.count(), 4);
	assert.equal(c.get(3), s4);

	var s5 = new Fairy.Mobile();
	s5
		.shape(new Fairy.Rect())
		.flight(new Fairy.Flight())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10))
		.flight().move(new Fairy.Vector(55, 59));
	c.add(s5);

	assert.equal(c.count(), 5);
	assert.equal(c.get(0), s1);
	assert.equal(c.get(1), s2);
	assert.equal(c.get(2), s3);
	assert.equal(c.get(3), s4);
	assert.equal(c.get(4), s5);

	c.remove(s3);

	assert.equal(c.count(), 4);
	assert.equal(c.get(0), s1);
	assert.equal(c.get(1), s2);
	assert.equal(c.get(2), s4);
	assert.equal(c.get(3), s5);

	c.remove(s4);
	c.remove(s1);

	assert.equal(c.count(), 2);
	assert.equal(c.get(0), s2);
	assert.equal(c.get(1), s5);

	c.remove(s2);
	c.remove(s5);
	assert.equal(c.count(), 0);
});


QUnit.test('Collisions', function(assert) {
	var c = new Fairy.Sector();
	var s1 = new Fairy.Mobile();

	assert.equal(c.count(), 0, 'no object');

	s1
		.shape(new Fairy.Rect())
		.flight(new Fairy.Flight())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10))
		.flight().move(new Fairy.Vector(0, 0));
	c.add(s1);

	assert.equal(c.count(), 1);
	assert.equal(c.get(0), s1);

	var s2 = new Fairy.Mobile();
	s2
		.shape(new Fairy.Rect())
		.flight(new Fairy.Flight())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10))
		.flight().move(new Fairy.Vector(5, 9));
	c.add(s2);

	assert.equal(c.count(), 2);
	assert.equal(c.get(1), s2);

	var s3 = new Fairy.Mobile();
	s3
		.shape(new Fairy.Rect())
		.flight(new Fairy.Flight())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10))
		.flight().move(new Fairy.Vector(100, 100));
	c.add(s3);

	assert.equal(c.count(), 3);
	assert.equal(c.get(2), s3);

	var s4 = new Fairy.Mobile();
	s4
		.shape(new Fairy.Rect())
		.flight(new Fairy.Flight())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10))
		.flight().move(new Fairy.Vector(105, 109));
	c.add(s4);

	assert.equal(c.count(), 4);
	assert.equal(c.get(3), s4);

	var s5 = new Fairy.Mobile();
	s5
		.shape(new Fairy.Rect())
		.flight(new Fairy.Flight())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10))
		.flight().move(new Fairy.Vector(55, 59));
	c.add(s5);

	assert.ok(s1.shape().hits(s2.shape()));
	assert.equal(s1.shape().points()[0].x, 0);
	assert.equal(s1.shape().points()[0].y, 0);
	assert.equal(s1.shape().points()[1].x, 9);
	assert.equal(s1.shape().points()[1].y, 9);
	assert.equal(s3.shape().points()[0].x, 100);
	assert.equal(s3.shape().points()[0].y, 100);
	assert.equal(s3.shape().points()[1].x, 109);
	assert.equal(s3.shape().points()[1].y, 109);

	assert.equal(s1.shape()._getCollisionSector(new Fairy.Vector(5, -1)), 2);
	assert.equal(s1.shape()._getCollisionSector(new Fairy.Vector(5, 5)), 5);
	assert.equal(s1.shape()._getCollisionSector(new Fairy.Vector(5, 11)), 8);

	assert.equal(s1.shape()._getCollisionSector(new Fairy.Vector(-5, -1)), 1);
	assert.equal(s1.shape()._getCollisionSector(new Fairy.Vector(-5, 5)), 4);
	assert.equal(s1.shape()._getCollisionSector(new Fairy.Vector(-5, 11)), 7);

	assert.equal(s1.shape()._getCollisionSector(new Fairy.Vector(15, -1)), 3);
	assert.equal(s1.shape()._getCollisionSector(new Fairy.Vector(15, 5)), 6);
	assert.equal(s1.shape()._getCollisionSector(new Fairy.Vector(15, 11)), 9);

	assert.ok(s1.shape().hits(s2.shape()));
	assert.ok(!s1.shape().hits(s3.shape()));
	assert.ok(!s1.shape().hits(s4.shape()));
	assert.ok(!s1.shape().hits(s5.shape()));


	assert.equal(s2.shape()._getCollisionSector(s1.shape().points()[0]), 1);
	assert.equal(s2.shape()._getCollisionSector(s1.shape().points()[1]), 5);

	assert.ok(s2.shape().hits(s1.shape()));
	assert.equal(s2.shape().points()[0].x, 5);
	assert.equal(s2.shape().points()[0].y, 9);
	assert.equal(s2.shape().points()[1].x, 14);
	assert.equal(s2.shape().points()[1].y, 18);

	assert.equal(s2.shape()._getCollisionSector(new Fairy.Vector(7, 8)), 2);
	assert.equal(s2.shape()._getCollisionSector(new Fairy.Vector(7, 15)), 5);
	assert.equal(s2.shape()._getCollisionSector(new Fairy.Vector(7, 20)), 8);

	var a = c.collides(s1);
	assert.equal(a.length, 1);
	assert.equal(a[0], s2);

	a = c.collides(s2);
	assert.equal(a.length, 1);
	assert.equal(a[0], s1);

	a = c.collides(s3);
	assert.equal(a.length, 1);
	assert.equal(a[0], s4);

	a = c.collides(s4);
	assert.equal(a.length, 1);
	assert.equal(a[0], s3);

	a = c.collides(s5);
	assert.equal(a.length, 0);
});



/*
  ####    ####   #       #          #    #####   ######  #####
 #    #  #    #  #       #          #    #    #  #       #    #
 #       #    #  #       #          #    #    #  #####   #    #
 #       #    #  #       #          #    #    #  #       #####
 #    #  #    #  #       #          #    #    #  #       #   #
  ####    ####   ######  ######     #    #####   ######  #    #
*/


QUnit.module('Collider');

QUnit.test('grid', function(assert) {
	var c = new Fairy.Collider();
	c.width(20).height(10).cellWidth(32).cellHeight(32);
	var g = c.grid();
	assert.equal(g.length, 10);
	assert.equal(g[0].length, 20);

	var s;

	s = c.sector(0, 0);
	assert.equal(s.x, 0);
	assert.equal(s.y, 0);

	s = c.sector(4, 2);
	assert.equal(s.x, 4);
	assert.equal(s.y, 2);

	s = c.sector(2, 4);
	assert.equal(s.x, 2);
	assert.equal(s.y, 4);

	assert.strictEqual(c.sector(1000, 1000), null);
});

QUnit.test('collisions', function(assert) {
	var c = new Fairy.Collider();
	c.width(20).height(10).cellWidth(32).cellHeight(32);

	var m = new Fairy.Mobile();
	m
		.flight(new Fairy.Flight())
		.shape(new Fairy.Rect())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10));

	var m2 = new Fairy.Mobile();
	m2
		.flight(new Fairy.Flight())
		.shape(new Fairy.Rect())
		.shape()
		.p1(new Fairy.Vector(0, 0))
		.p2(new Fairy.Vector(10, 10));


	m.flight().position().set(0, 20);
	m2.flight().position().set(50, 25);
	c.track(m2);

	var a;
	var vMove = new Fairy.Vector(4, 0);
	m.flight().move(vMove);
	c.track(m);
	assert.equal(m.flight().position().x, 4);


	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 0);
	assert.equal(m.flight().position().x, 8);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 0);
	assert.equal(m.flight().position().x, 12);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 0);
	assert.equal(m.flight().position().x, 16);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 0);
	assert.equal(m.flight().position().x, 20);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 0);
	assert.equal(m.flight().position().x, 24);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 0);
	assert.equal(m.flight().position().x, 28);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 0);
	assert.equal(m.flight().position().x, 32);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 0);
	assert.equal(m.flight().position().x, 36);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 0);
	assert.equal(m.flight().position().x, 40);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(c.sector(m.flight().position()).x, 1);
	assert.equal(c.sector(m.flight().position()).y, 0);
	assert.equal(c.sector(m.flight().position()).objects().length, 2);
	assert.equal(c.sector(m.flight().position()).objects()[0], m2);
	assert.equal(c.sector(m.flight().position()).objects()[1], m);
	assert.equal(c.sector(m2.flight().position()).x, 1);
	assert.equal(c.sector(m2.flight().position()).y, 0);

	assert.equal(a.length, 1);
	assert.equal(m.flight().position().x, 44);

	var oSector = c.sector(m.flight().position());
	assert.equal(oSector.x, 1);
	assert.equal(oSector.y, 0);
	assert.equal(oSector.objects().length, 2);
	assert.equal(m.shape().points()[0].x, 44);
	assert.equal(m2.shape().points()[0].x, 50);
	assert.ok(m2.shape().hits(m.shape()));
	a = oSector.collides(m);
	assert.equal(a.length, 1);



	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 1);
	assert.equal(m.flight().position().x, 48);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 1);
	assert.equal(m.flight().position().x, 52);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 1);
	assert.equal(m.flight().position().x, 56);

	m.flight().move(vMove);
	c.track(m);
	a = c.collides(m);
	assert.equal(a.length, 0);
	assert.equal(m.flight().position().x, 60);
});
