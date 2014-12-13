
var expect = require ('expect.js');
var Sketch = require('../routes/Sketch.js'); 
var Database = require('../routes/db/database.js');
var User = require('../routes/user.js');

describe('Sketch', function() {

 	var database = new Database();

	beforeEach( function(done) {
		database.connect( function(err){
			expect(database).to.be.a('object');
			database.clearDb();

			database.addUser({key:"aa", age:44}, function(err, uA){
				database.addUser({key:"bb", age:22}, function(err, uB){
					database.addUser({key:"cc", age:33}, function(err, uC){
						User.follow(database, uA.key, uB.key, function(err, user) {
							User.follow(database, uA.key, uC.key, function(err, user) {
								User.whoIsFollowingMe(database, "bb", function(err, userList) {
									expect(userList).to.eql(['aa']);
									done();
								});
							});
						});
					});
				});
			});
		});
	});


	it ('add', function(done) {

		Sketch.addDot(database, 'abc', {x:55, y:44}, function(err, data) {
			expect(err).to.be(null);
			expect(data.point.x).to.eql(55);
			expect(data.point.y).to.eql(44);
			expect(data.expire).to.exist;
			done();
		});
	});


	it ('getAll', function(done) {
		Sketch.addDot(database, 'abc', {x:55, y:44}, function(err, d) {
			Sketch.getFromMe(database, 'abc', function(err, data) {
				expect(err).to.be(null);
				expect(data[0].point.x).to.eql(55);
				expect(data[0].point.y).to.eql(44);
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
					Sketch.getFromMe(database, 'abc', function(err, data) {
						expect(err).to.be(null);
						expect(data.length).to.be(3);
						expect(data[0].point.x).to.be(22);
						expect(data[1].point.y).to.be(33);
						expect(data[2].cmd).to.be('dot');
						expect(data[1].expire).to.exist;
						done();
					});
				});
			});
		});
	});


	it ('Sketch#getFromMyFollower', function(done) {
		// aa is following: bb,cc
		Sketch.addDot(database, 'bb', {x:22, y:44}, function(err, d) {
			Sketch.addDot(database, 'bb', {x:11, y:33}, function(err, d) {
				Sketch.addDot(database, 'cc', {x:77, y:99}, function(err, d) {
					Sketch.getFromMyFollower(database, 'aa', function(err, data) {
						expect(err).to.be(null);
						expect(data.length).to.be(3);
						expect(data[0].point.x).to.be(22);
						expect(data[1].point.y).to.be(33);
						expect(data[2].cmd).to.be('dot');
						expect(data[1].expire).to.exist;
						done();
					});
				});
			});
		});
	});




});



