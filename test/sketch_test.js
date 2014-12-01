
var expect = require ('expect.js');
var Sketch = require('../routes/Sketch.js'); 
var Database = require('../routes/db/database.js');

describe('sketch dot', function() {

 	var database = new Database();

	beforeEach( function(done) {
		database.connect( function(err){
			expect(database).to.be.a('object');
			database.clearDb();
			done();
		});
	});


	it ('add', function(done) {

		Sketch.addDot(database, 'abc', {x:55, y:44}, function(err, data) {
			expect(err).to.be(null);
			expect(data.x).to.eql(55);
			expect(data.y).to.eql(44);
			expect(data.expire).to.exist;
			done();
		});
	});


	it ('getAll', function(done) {
		Sketch.addDot(database, 'abc', {x:55, y:44}, function(err, d) {
			Sketch.getAll(database, 'abc', function(err, data) {
				expect(err).to.be(null);
				expect(data[0].x).to.eql(55);
				expect(data[0].y).to.eql(44);
				expect(data[0].cmd).to.eql('dot');
				expect(data[0].expire).to.exist;
				done();
			});
		});
	});

	it ('getAll multiple', function(done) {
		Sketch.addDot(database, 'abc', {x:22, y:44}, function(err, d) {
			Sketch.addDot(database, 'abc', {x:11, y:33}, function(err, d) {
				Sketch.addDot(database, 'abc', {x:77, y:99}, function(err, d) {
					Sketch.getAll(database, 'abc', function(err, data) {
						expect(err).to.be(null);
						expect(data.length).to.be(3);
						expect(data[0].x).to.be(22);
						expect(data[1].y).to.be(33);
						expect(data[2].cmd).to.be('dot');
						expect(data[1].expire).to.exist;
						done();
					});
				});
			});
		});
	});



});



