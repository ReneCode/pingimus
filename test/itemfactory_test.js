
var expect = require ('expect.js');
var ItemFactory = require('../ItemFactory.js'); 


describe('testing ItemFactory', function() {
	it ('create item', function() {
		var itemFactory = ItemFactory();
		obj = itemFactory.create();
		expect(obj).to.eql({itemId:1});
	});

	it ('create two items', function() {
		var itemFactory = ItemFactory();
		o1 = itemFactory.create();
		o2 = itemFactory.create();
		expect(o1).to.eql({itemId:1});
		expect(o2).to.eql({itemId:2});
	});

	it ('expand existing item', function() {
		var itemFactory = ItemFactory();
		var obj = { name:'a', x:145 };
		var o2 = itemFactory.create(obj);
		expect(obj).to.eql({itemId:1, name:'a', x:145 });
		expect(o2).to.eql(obj);
	});


});

