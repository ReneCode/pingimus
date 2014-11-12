var expect = require ('expect.js');
var World = require('../World.js'); // ({width:1000, height:1000, tileCount:100});
var Tile = require('../Tile.js');

describe('world init', function() {
	it ('parameter', function() {
		var world = World({width:100, height:100, tileCount:10});
		var para = world.getParameters();
		expect(para).to.eql({width:100, height:100, tileCount:10, 
					tileWidth:10, tileHeight:10});
	});

	it ('tileIdFromItem', function() {
		var world = World({width:1000, height:1000, tileCount:10});
		var tileId = world.tileIdFromItem({x:57, y:127});
		expect(tileId).to.eql("0:1");
	});


	it ('coordFromTileId', function() {
		var world = World({width:1000, height:1000, tileCount:10});
		var coord = world.coordFromTileId("4:3");
		expect(coord).to.eql({x:400, y:300});
	});


});


describe('Tile#setItem', function() {
	it ('add item', function() {
		var item = {x:0, y:10};
		var t = new Tile();
		t.addItem(item);
		t.addItem(64);
		expect(t.getItems()).to.eql([item,64]);
	});

	it ('no items, ', function() {
		var item = {x:0, y:10};
		var t = new Tile();
		expect(t.getItems()).to.eql([]);
	});

	it ('#addItem -> tile', function() {
		var item = {x:49, y:31};
		var world = new World({width:1000, height:1000});
		var tile = world.addItem(item);
		expect(tile.id).to.eql("4:3");
	});


	it ('#addItem -> item width tileId', function() {
		var item = {x:49, y:31, name:'abc'};
		var world = World({width:1000, height:1000});
		var tile = world.addItem(item);
		expect(item).to.eql({x:49, y:31, name:'abc', tileId:"4:3"});
	});

	it ('#addItem -> filled tile', function() {
		var item = {x:49, y:31, name:'abc'};
		var world = World({width:1000, height:1000});
		var tile = world.addItem(item);
		expect(tile.getItems()).to.eql([{x:49, y:31, name:'abc', tileId:"4:3"}]);
	});

	it ('#addItem -> same tile', function() {
		var world = World({width:1000, height:1000});
		var i1 = {x:49, y:31, name:'a'};
		var tile1 = world.addItem(i1);
		var i2 = {x:41, y:37, name:'b'};
		var tile2 = world.addItem(i2);
		expect(tile1).to.eql(tile2);
	});

	it ('#addItem -> same tile', function() {
		var world = World({width:1000, height:1000});
		var i1 = {x:49, y:31, name:'a'};
		var tile1 = world.addItem(i1);
		var i2 = {x:41, y:37, name:'b'};
		var tile2 = world.addItem(i2);
		expect(tile2.getItems()).to.eql([{x:49, y:31, name:'a', tileId:"4:3"}, 
									     {x:41, y:37, name:'b', tileId:"4:3"}]);
	});

});

