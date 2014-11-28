var expect = require ('expect.js');
var Database = require('../routes/db/Database.js');

describe('Database init', function() {
	it ('init', function() {
		var db = new Database();
		expect( db.connect ).to.be.a('function');
	});

	it ('connect', function(done) {
		var db = new Database();
		db.connect( function(err) {
			expect( err ).to.be(null);
			done();
		});
	});

});


describe('Database connect', function() {
 	var db = new Database();

	beforeEach( function(done) {
		db.connect( function(err){
			db.clearDb();
			done();
		});
	});

	it ('setUserSession + getUserIdFromSessionId', function(done) {
		db.setUserSession(42, {user:'abc', id:'4711'}, function(err,data) {
			expect(err).to.be(null);
			expect(data).to.be(1);

			db.getUserIdFromSessionId(42, function(err, user){
				expect(user).to.exist;
				expect(user.id).to.be('4711');
				done();
			});

		});
	});


	it ('setUserSession + other getUserIdFromSessionId', function(done) {
		db.setUserSession(42, {user:'abc', id:'4711'}, function(err,data) {
			expect(err).to.be(null);
			expect(data).to.be(1);

			db.getUserIdFromSessionId(43, function(err, user){
				expect(user).to.be(null);
				done();
			});

		});
	});

	it ('getUserIdFromSessionId of empty', function(done) {
		db.getUserIdFromSessionId(42, function(err, user){
			expect(err).to.be('session not found');
			expect(user).to.be(null);
			done();
		});
	});


	it ('createNewUser', function(done) {
		db.createNewUser({name:"abc", age:47}, function(err, user){
			expect(err).to.be(null);
			expect(user.name).to.be("abc");
			expect(user.age).to.be(47);
			expect(user.id).to.be(1);

			db.createNewUser({name:"xyz", age:66}, function(err, user){
				expect(err).to.be(null);
				expect(user.name).to.be("xyz");
				expect(user.age).to.be(66);
				expect(user.id).to.be(2);

				done();
			});
		});
	});

	it ('createNewUser + getUserFromId', function(done) {
		db.createNewUser({name:"abc", age:47}, function(err, user){
			expect(err).to.be(null);
			expect(user.name).to.be("abc");
			expect(user.age).to.be(47);
			expect(user.id).to.be(1);

			db.createNewUser({name:"xyz", age:66}, function(err, user){
				expect(err).to.be(null);
				expect(user.name).to.be("xyz");
				expect(user.age).to.be(66);
				expect(user.id).to.be(2);

				db.getUserFromId(1, function(err, user) {
					expect(err).to.be(null);
					expect(user.name).to.be("abc");
					expect(user.age).to.be(47);
					expect(user.id).to.be(1);
	
					db.getUserFromId(2, function(err, user) {
						expect(err).to.be(null);
						expect(user.name).to.be("xyz");
						expect(user.age).to.be(66);
						expect(user.id).to.be(2);
			
						done();
					});
				});
			});
		});
	});


});

